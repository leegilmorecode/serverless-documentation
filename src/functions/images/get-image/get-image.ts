import AWS from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import config from '../../../config';

type HeadObjectRequest = AWS.S3.HeadObjectRequest;
type HeadObjectOutput = AWS.S3.HeadObjectOutput;

const METHOD = 'get-image.handler';

const s3 = new AWS.S3();

/**
 * ## get-image handler
 *
 * This AWS Lambda handler generates an AWS S3 pre-signed download
 * url for the specific image ID
 *
 * The below image shows the architecture for this solution
 *
 * ![architecture](media://architecture.png)
 */
export const handler: APIGatewayProxyHandler = async ({
  pathParameters,
}: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const correlationId = uuid();

    console.log(`${correlationId} - ${METHOD} - started`);

    // basic validation to check id exists - in reality the path parameter check would
    // happen using an approach like json schema validation
    if (!pathParameters?.id) throw new Error('path parameter id does not exist');

    const { id } = pathParameters;

    const imageName = `${id}.png`;

    console.log(`${correlationId} - ${METHOD} - bucket: ${config.bucket}, file: ${imageName}`);

    const headRequest: HeadObjectRequest = {
      Bucket: config.bucket,
      Key: `${imageName}`,
    };

    // check if the image exists in the s3 bucket
    const exists: HeadObjectOutput = await s3.headObject(headRequest).promise();

    console.log(`${correlationId} - ${METHOD} - file exists with last modified date: ${exists.LastModified}`);

    // create an s3 pre-signed download url for the image if it exists
    const url = s3.getSignedUrl('getObject', {
      Bucket: config.bucket,
      Key: `${imageName}`,
      Expires: 60,
    });

    // you would NEVER log this but we are doing it for clarity of logs for the demo
    console.log(`${correlationId} - ${METHOD} - generated url: ${url}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          url,
        },
        null,
        2,
      ),
    };
  } catch (error: any) {
    console.error(`${METHOD} - error: ${JSON.stringify(error)}`);

    let statusCode = 500;
    let errorMessage = 'An error has occurred';

    // check if the error is for an image which does not exist
    // and return an appropriate message and status code
    if (error.code === 'Forbidden') {
      statusCode = 404;
      errorMessage = 'Image does not exist';
    }

    // return a generic error otherwise
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorMessage, null, 2),
    };
  }
};

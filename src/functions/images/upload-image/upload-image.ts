import AWS from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import config from '../../../config';

const METHOD = 'upload-file.handler';

const s3 = new AWS.S3();

/**
 * ## upload-image handler
 *
 * This AWS Lambda handler generates an AWS S3 pre-signed upload
 * url for the specific image ID so we can upload the image
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

    // basic validation to check id exists, but in reality you would
    // validate the inputs using an approach like json schema
    if (!pathParameters?.id) throw new Error('path parameter id does not exist');

    const { id } = pathParameters;

    const imageName = `${id}.png`;

    console.log(`${correlationId} - ${METHOD} - bucket: ${config.bucket}, file: ${imageName}`);

    // create an s3 upload url for the image
    const url = s3.getSignedUrl('putObject', {
      Bucket: config.bucket,
      Key: `${imageName}`,
      Expires: 60,
    });

    // you would NEVER log this but we are doing it for clarity of the logs for the demo
    console.log(`${correlationId} - ${METHOD} - generated url: ${url}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
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

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('An error has occurred', null, 2),
    };
  }
};

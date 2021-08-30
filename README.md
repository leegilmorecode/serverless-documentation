# Serverless Documentation

![header](./docs/images/header-docs.png)

## Introduction

Examples of auto generating **Swagger/OpenAPI**, **Code Documentation** and **ADRs** as part of your Serverless solutions! This repo supports the following blog post: [Serverless Documentation 🚀](https://leejamesgilmore.medium.com/documenting-your-serverless-solutions-509f1928564b)

### What are we building?

We are going to walk through building a solution which allows a user to upload png images and also retrieve them from a private bucket which they don't have IAM permissions or access crdentials for 😜

This is based on the following article, **which has served as a base repo to show how you would add serverless documentation to it** [Serverless AWS S3 pre-signed URLs 🚀](https://leejamesgilmore.medium.com/serverless-s3-pre-signed-urls-e52eebad8d2d)

## Getting started

To get started, you can run the following commands from the root directory:

**Note: This will incur costs in your AWS account which you should account for.**

`npm i`

`npm run deploy:develop`

This will install the dependencies for the project and deploy the project to AWS.

> To remove the project you can run: npm run remove:develop

## Project Documentation

generate code documentation: `npm run docs`

**Note** - _this automatically runs on commit using husky_

## ADRs

create new adr: `npm run adr:new -- "example"`

update adr: `npm run adr:update -- "example"`

create/update toc: `npm run adr:toc`

list the current status in the terminal: `npm run adr:list`

export as html: `npm run adr:export`

## Swagger/OpenAPI

Generate document: `npm run openapi`

**Note** - _this automatically runs on commit using husky_

## Invoking the endpoints

Once deployed, you can invoke the two different endpoints using the postman file found here `./postman/`

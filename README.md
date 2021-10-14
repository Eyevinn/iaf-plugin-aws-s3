# IAF Plugin AWS-S3

The Eyevinn Ingest Application Framework (Eyevinn IAF) is a framework to simplify building VOD ingest applications. A framework of open source plugins to integrate with various transcoding and streaming providers. This is the plugin for uploading content to an S3 bucket.

## Installation

To install the plugin in your project, run the following command.

```
npm install --save @eyevinn/iaf-plugin-aws-s3
```
Ensure that your [AWS environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) are set, including `AWS_REGION`. The plugin needs these environment variables in order to be able to access AWS.

## Using the module in your application based on Eyevinn IAF

To use the AWS upload module in your Eyevinn IAF setup, your `index.ts` should look like this:

```TypeScript
// other imports
import {AWSUploadModule} from "@eyevinn/iaf-plugin-aws-s3";

const awsUploader = new AWSUploadModule(/** args **/);
const fileWatcher = /** initialize your file watcher of choice**/

fileWatcher.onAdd(awsUploader.onFileAdd);
```

# Plugin Documentation

## `AWSUploadModule`
Default plugin export. This class is plug-and-play with the Ingest Application Framework, as described in the previous section.

### Methods
`constructor(s3Bucket: string, logger: winston.Logger)`

Creates a new `AWSUploadModule` object. You need to provide the name of the destination s3 bucket. Region is based on the environment variable. A winston logger is also needed. These parameters are used to initialize the sub-modules.

`onFileAdd = (filePath: string, readStream: Readable)`.

Method that is executed when a file is added to the directory being watched. `filePath` is the full path to the added file, and `readStream` is a `Readable` stream of the file data. Any file watcher plugins are *required* to provide these. The method uploads the file to the `s3Bucket` specified in the constructor.

## `S3Uploader`
Sub-module that handles uploading files to ingest S3 bucket. It's built on top of `@aws-sdk/lib-storage` in order to upload large files, which is essential for video.

### Methods
`constructor(destination: string, logger: winston.Logger)`

Instantiates a new `S3Uploader`. `destination` is the name of the S3 bucket (the same as `s3Bucket` in the `AWSUploadModule` constructor). `logger` is injected into the object, in order to avoid multiple logger objects.

`async upload(fileStream: Readable, fileName: string)`

Uploads a file to S3. The file data should be provided in the form of a `Readable` stream for performance reasons. `fileName` will also be the key used in the S3 bucket.

# [Contributing](CONTRIBUTING.md)

In addition to contributing code, you can help to triage issues. This can include reproducing bug reports, or asking for vital information such as version numbers or reproduction instructions.

# About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This give us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!


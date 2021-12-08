import winston from "winston";
import * as path from 'path'
import { S3Uploader } from "./s3Uploader";
import { Readable } from "stream";
import { IafUploadModule } from "eyevinn-iaf";

export class AwsUploadModule implements IafUploadModule {
  logger: winston.Logger;
  fileName: string;
  playlistName: string;
  uploader: S3Uploader;
  fileUploadedDelegate: (result: any) => any;
  progressDelegate: (progress: number) => any;

  constructor(s3Bucket: string, logger: winston.Logger) {
    this.logger = logger;
    this.uploader = new S3Uploader(s3Bucket, this.logger);
  }

  /**
   * Method that runs when a FileWatcher detects a new file.
   * Uploads the file to an S3 bucket.
   * @param filePath the path to the file being added.
   * @param readStream Readable stream of the file.
   */
  onFileAdd = (filePath: string, readStream: Readable, contentType: string) => {
    this.fileName  = path.basename(filePath);
    try {
      this.uploader.upload(readStream, this.fileName, process.env.AWS_FOLDER, contentType).then((res) => {
        this.fileUploadedDelegate(res);
      });
    }
    catch (err) {
      this.logger.log({
        level: "error",
        message: `Error when attempting to process file: ${this.fileName}. Full error: ${err}`,
      });
    }
  }
}
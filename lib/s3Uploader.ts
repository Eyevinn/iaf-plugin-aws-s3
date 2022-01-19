import { Uploader } from "./types/interfaces";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { Logger } from "eyevinn-iaf";


/**
 * S3 Uploader class
 * Holds the S3 client that data will be piped through for upload to ingest bucket 
 */
export class S3Uploader implements Uploader {
  destination: string;
  logger: Logger;

  constructor(destination: string, logger: Logger) {
    this.destination = destination;
    this.logger = logger;
  }

  /**
   * Uploads a file to the destination bucket
   * @param fileStream a Readable stream of the file to upload
   * @param fileName the name of the uploaded file (this will be the S3 key)
   * @param [folder] the folder to upload the file to
   * @param [contentType] the content type of the file
   * @returns status report from the AWS upload or null if there was an error
   */
  async upload(fileStream: Readable, fileName: string, folder?: string, contentType?: string) {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;
      const target = {
        Bucket: this.destination,
        Key: key,
        Body: fileStream
      };
      if (contentType) {
        target["ContentType"] = contentType;
      }
      const parallelUploadsToS3 = new Upload({
        client: new S3({}) || new S3Client({}),
        params: target
      })

      parallelUploadsToS3.on("httpUploadProgress", (progress) => {
        this.logger.info(`Upload progress for ${fileName}: ${(progress.loaded / progress.total) * 100}%`)
      })

      const data = await parallelUploadsToS3.done();
      return {data : data, file: fileName};
    }
    catch (err) {
      this.logger.error(`Failed to upload ${fileName} Error: '${err}'`);
      return {data : null, file: fileName};
    }
  }
}

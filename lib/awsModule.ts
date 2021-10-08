import winston from "winston";
import * as path from 'path'
import { IafUploadModule } from './types/interfaces'
import { S3Uploader } from "./s3Uploader";
import { Readable } from "stream";
import { nanoid } from "nanoid";

export class AwsUploadModule implements IafUploadModule {
    logger: winston.Logger;
    fileName: string;
    uploader: S3Uploader;
    fileUploadedDelegate: Function;


    constructor(ingestBucket: string, outputBucket: string, outputFiles: {}, logger: winston.Logger) {
        this.logger = logger;
        this.uploader = new S3Uploader(ingestBucket, outputBucket, outputFiles, this.logger);
    }

    /**
     * Method that runs when a FileWatcher detects a new file.
     * Uploads the file to an S3 ingress bucket, and dispatches a transcoding job when
     * the upload is completed.
     * @param filePath the path to the file being added.
     * @param readStream Readable stream of the file.
     */
    onFileAdd = (filePath: string, readStream: Readable) => {
        let file = path.basename(filePath);
        this.fileName = `${path.parse(file).name}-${nanoid(10)}${path.parse(file).ext}`;
        try {
            this.uploader.upload(readStream, this.fileName).then((res) => {
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
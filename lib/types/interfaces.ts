import { Readable } from "stream";
import winston from "winston";

export interface Uploader {
    destination: string;
    logger: winston.Logger;
    upload(fileStream: Readable, fileName: string, folder?: string, contentType?: string): any;
}

export interface TranscodeDispatcher {
    encodeParams: any;
    inputLocation: string;
    outputDestination: string;
    logger: winston.Logger;
    playlistName: string;
    dispatch(fileName: string): Promise<any>;
}

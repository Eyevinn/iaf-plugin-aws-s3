import { Readable } from "stream";
import winston from "winston";

export interface IafUploadModule {
    logger: winston.Logger;
    onFileAdd(filePath: string, readStream: Readable, contentType: string): any;
    fileUploadedDelegate: Function;
}

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

export interface FileWatcher {
    dirName: String;
    logger: winston.Logger;
    onAdd(callback: (filePath: string, readStream: Readable, contentType: string) => any);
}
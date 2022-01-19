import { Readable } from "stream";

export interface ILogger {
  verbose: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}
export interface IafUploadModule {
    logger: ILogger;
    onFileAdd(filePath: string, readStream: Readable): any;
    fileUploadedDelegate: Function;
}

export interface Uploader {
    destination: string;
    logger: ILogger;
    upload(fileStream: Readable, fileName: string)
}

export interface TranscodeDispatcher {
    encodeParams: any;
    inputLocation: string;
    outputDestination: string;
    logger: ILogger;
    playlistName: string;
    dispatch(fileName: string): Promise<any>;
}

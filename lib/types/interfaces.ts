import { Readable } from "stream";
import { Logger } from "eyevinn-iaf";

export interface Uploader {
    destination: string;
    logger: Logger;
    upload(fileStream: Readable, fileName: string)
}

export interface TranscodeDispatcher {
    encodeParams: any;
    inputLocation: string;
    outputDestination: string;
    logger: Logger;
    playlistName: string;
    dispatch(fileName: string): Promise<any>;
}

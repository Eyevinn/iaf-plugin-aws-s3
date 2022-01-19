import { S3Uploader } from "./s3Uploader";
import { Readable } from "stream";

import { Logger } from "eyevinn-iaf";

class Log implements Logger {
  info(message: string) {
    console.log("info:", message);
  }
  verbose(message: string) {
    console.log("verbose:", message);
  }
  warn(message: string) {
    console.log("warn", message);
  }
  error(message: string) {
    console.error(message);
  }
}

const uploader = new S3Uploader("bucket1", new Log());

const mockUploadInstance = {
  done: jest.fn(),
  promise: jest.fn(),
  on: jest.fn(),
};

jest.mock("@aws-sdk/lib-storage", () => {
  return {
    Upload: jest.fn(() => mockUploadInstance),
  };
});
const mockReadStream = jest.fn().mockImplementation(() => {
  const readable = new Readable();
  readable.push("hello world!");
  readable.push(null);
  return readable;
});

const mockFile = jest.fn().mockImplementation(() => {
  return { createReadStream: mockReadStream };
});

test("Should return null when upload fails", async () => {
  const mockErr = "Failed to upload file!"
  mockUploadInstance.done.mockRejectedValueOnce(new Error(mockErr))
  const resp = await uploader.upload(mockFile().createReadStream, "filename", "folder", "filetype");

  console.log(JSON.stringify(resp));

  expect(resp.file).toEqual("filename");
  expect(resp.data).toBeNull();
});

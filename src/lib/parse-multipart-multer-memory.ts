import multer from "multer";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";

const upload = multer({ storage: multer.memoryStorage() }).single("file");

type ParsedFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

export function parseMultipartFileWithMulterMemory(
  request: Request,
  rawBody: Buffer,
): Promise<ParsedFile> {
  const contentType = request.headers.get("content-type");
  if (!contentType?.toLowerCase().includes("multipart/form-data")) {
    return Promise.reject(
      new Error('Expected Content-Type multipart/form-data with field "file"'),
    );
  }

  return new Promise((resolve, reject) => {
    const socket = new Socket();
    const req = new IncomingMessage(socket);
    req.headers = {
      "content-type": contentType,
      "content-length": String(rawBody.length),
    };
    const res = new ServerResponse(req);

    upload(req as never, res as never, (err: unknown) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }
      const file = (
        req as unknown as {
          file?: { buffer: Buffer; originalname: string; mimetype: string };
        }
      ).file;
      if (!file?.buffer) {
        reject(new Error('Missing file in form field "file"'));
        return;
      }
      resolve({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      });
    });

    req.push(rawBody);
    req.push(null);
  });
}

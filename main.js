import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import writeToFile from './writeToFile.js';
import mergeFractionFiles from './mergeFractionFiles.js';
import { CHUNK, MEMORY_LIMIT, FILE_NAME } from './const.js';


async function bootstrap(fileName) {
  const file = createReadStream(fileName, { highWaterMark: CHUNK });
  const lines = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const tempChunk = [];
  let size = 0;
  const fractionFiles = [];
  for await (const line of lines) {
    size += line.length;
    tempChunk.push(line);
    if (size > MEMORY_LIMIT) {
      await writeToFile(tempChunk, fractionFiles);
      size = 0;
    }
  }
  if (tempChunk.length > 0) {
    await writeToFile(tempChunk, fractionFiles);
  }
  await mergeFractionFiles(fractionFiles, fileName);
}

bootstrap(FILE_NAME);

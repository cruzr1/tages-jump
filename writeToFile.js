import crypto from 'crypto';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'fs';
import { CHUNK } from './const.js';

export default async function writeToFile(tempChunk, fractionFiles) {
  tempChunk.sort((a, b) => a.localeCompare(b));
  const fractionFileName = `tmp_sort_${crypto.randomUUID()}`;
  fractionFiles.push(fractionFileName);
  const writeStream = createWriteStream(fractionFileName, { highWaterMark: CHUNK });
  const line = tempChunk.map((data) => `${data}\n`);
  await pipeline(line, writeStream);
  writeStream.destroy();
  tempChunk.length = 0;
}

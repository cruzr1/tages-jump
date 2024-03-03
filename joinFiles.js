import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import readline from 'node:readline';
import { CHUNK } from './const.js';

export default async function joinFiles(joiningFiles, fileName) {
  const sortedFileName = `${fileName.split('.txt')[0]}-sorted.txt`;
  const inpuFile = createWriteStream(sortedFileName, {
    highWaterMark: CHUNK,
  });
  const readingSources = joiningFiles.map((name) => readline
    .createInterface({
      input: createReadStream(name, {
        highWaterMark: CHUNK,
      }),
      crlfDelay: Infinity,
    })[Symbol.asyncIterator]());
  const values = await Promise.all(
    readingSources.map((result) => result.next().then((evt) => evt.value)),
  );
  return pipeline(async function* () {
    while (readingSources.length > 0) {
      const sortedValues = [...values].sort((a, b) => a.localeCompare(b));
      const sortedItem = sortedValues[0];
      const sortedItemIndex = values.indexOf(sortedItem);
      yield `${sortedItem}\n`;
      const result = await readingSources[sortedItemIndex].next();
      if (!result.done) {
        values[sortedItemIndex] = result.value;
      } else {
        values.splice(sortedItemIndex, 1);
        readingSources.splice(sortedItemIndex, 1);
      }
    }
  }, inpuFile);
}

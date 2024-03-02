import { rm, rename} from 'node:fs/promises';
import joinFiles from './joinFiles';

export default async function mergeFractionFiles(fractionFiles, fileName) {
  while (fractionFiles.length > 1) {
    const mergedFileName = `tmp_sort_${crypto.randomUUID()}`;
    await joinFiles(
      [fractionFiles[0], fractionFiles[1]],
      mergedFileName,
    );
    rm(fractionFiles[0]);
    rm(fractionFiles[1]);
    fractionFiles.splice(fractionFiles.indexOf(fractionFiles[0]), 2);
    fractionFiles.push(mergedFileName);
  }
  rename(
    fractionFiles[0],
    `${fileName.split('.')[0]}-sorted.${fileName.split('.')[1]}`,
  );
}

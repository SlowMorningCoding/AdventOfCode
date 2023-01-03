#!/usr/bin/env node
import { readFile } from './readFile.js';

type File = { type: string, path: string, size: number };

const fileSystem: File = [];

const scanFiles = async (input: string) => {
  const commands: string[] = input.split(/\$/).map(s => s.trim());
  // TODO

  console.table(commands)
}

const partOne = async (): Promise<string> => {
  return ``;
};

const partTwo = async (): Promise<string> => {
  return ``;
};


export const main = async () => {
  try {
    const input: string = await readFile('./public/day7_input.txt');
    await scanFiles(input);
    /* Part one */
    const message1 = await partOne();
    console.log(`Part One message ${message1}`);
    /* Part two */
    const message2 = await partTwo();
    console.log(`Part Two message ${message2}`);

  } catch (e) {
    console.log(e);
  }
};

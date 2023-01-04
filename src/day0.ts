#!/usr/bin/env node
import { readFile } from './readFile.js';

const parseInput = async (input: string) => {
  const data: number[][] = input.split(/[\r]?\n/)
    .map(line => line.split('')
      .map(s => Number(s))
    )
  return data;
};

const partOne = async (): Promise<string> => {
  return `Todo`;
};

const partTwo = async (): Promise<string> => {
  return `Todo`;
};

export const main = async () => {
  try {
    /* Get input data */
    const input: string = await readFile('./public/day0_input.txt');
    await parseInput(input);
    
    /* Part one */
    const result1 = await partOne();
    console.log(`Part One: ${result1}`);
    
    /* Part two */
    const result2 = await partTwo();
    console.log(`Part Two: ${result2}`);

  } catch (e) {
    console.log(e);
  }
};

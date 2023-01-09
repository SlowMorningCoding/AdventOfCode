import figlet from 'figlet';
import { readFile } from './readFile.js';

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day0'));
    console.time('total time');
    /* Parse input */
    const input: string = await readFile('./public/day0_input.txt');
    await parseInput(input);

    /* Part one */
    const p1Result = await partOne();
    console.log(`Part One: ${p1Result}`);

    /* Part two */
    const p2Result = await partTwo();
    console.log(`Part Two: ${p2Result}`);

  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

async function parseInput(input: string) {
  const data: string[] = input.split(/\r?\n/);
  return data;
};

async function partOne(): Promise<number> {
  return 0;
};

async function partTwo(): Promise<number> {
  return 0;
};

await main();

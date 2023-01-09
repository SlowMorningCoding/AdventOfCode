import figlet from 'figlet';
import { readFile } from './readFile.js';

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day12'));
    console.time('total time');
    /* Parse input */
    const input: string = await readFile('./public/input_day12.txt');
    const data = await parseInput(input);
    console.table(data);

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

async function parseInput(input: string): Promise<string[][]> {
  const data: string[][] = input.split(/\r?\n/).map((s) => s.split(''));
  return data;
};

async function partOne(): Promise<number> {
  return 0;
};

async function partTwo(): Promise<number> {
  return 0;
};

async function sleep(ms:number = 100): Promise<any> {
  return new Promise((r) => setTimeout(r, ms));
}

await main();

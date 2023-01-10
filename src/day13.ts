import figlet from 'figlet';
import { json } from 'stream/consumers';
import { readFile } from './readFile.js';

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day13'));
    console.time('total time');
    /* Parse input */
    const data: string[][] | [][][] = await parseInput();
    console.table(data);

    /* Part one */
    await partOne(data);

    /* Part two */
    await partTwo();

  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

async function parseInput(): Promise<string[][]> {
  const input: string = await readFile('./public/input_day13_test.txt');
  const blocks: string[] = input.split(/(?:\r?\n){2}/);

  const data: string[][] | [][][] = blocks.map(b => {
    let [left, right] = b.split(/(?:\r?\n)/);

    left = JSON.parse(left);
    right = JSON.parse(right);

    return [left, right];
  });
  return data;
};

async function partOne(data: string[][] | [][][]) {
  for (const pair of data) {
    if (typeof pair[0] === 'number' && typeof pair[1] === 'number') {
      

    }
  }

  /*
  If both are integers, the lower integer should come first. 
  If the left integer is lower than the right integer, the inputs are in the right order. 
  If the left integer is higher than the right integer, the inputs are not in the right order. 
  If the inputs are the same integer; continue checking the next part of the input.

  If both values are lists, compare the first value of each list, then the second value, and so on. 
  If the left list runs out of items first, the inputs are in the right order. 
  If the right list runs out of items first, the inputs are not in the right order. 
  If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.

  If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, 
  then retry the comparison. 
  */

};

function comparePair(a:number, b:number) {
  if (a - b < 0) return -1;
  if (a - b > 0) return 1;
  return 0
}

async function partTwo() {

};

await main();

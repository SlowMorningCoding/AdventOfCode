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
    await partTwo(data);

  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

async function parseInput(): Promise<string[][]> {
  const input: string = await readFile('./public/input_day13.txt');
  const blocks: string[] = input.split(/(?:\r?\n){2}/);

  const data: string[][] | [][][] = blocks.map(b => {
    let [left, right] = b.split(/(?:\r?\n)/);

    left = JSON.parse(left);
    right = JSON.parse(right);

    return [left, right];
  });
  return data;
};

async function partOne(data: []) {
  let rightOrder = 0;
  data.forEach((pair, index) => {
    //console.log(`Pair ${index+1}`);
    
    let result = comparePair(pair[0], pair[1]);
    if (result < 0) {
      rightOrder += index + 1;
    }
    //console.log(`result ${result}\n`);
  });

  console.log(rightOrder);
};

function comparePair(a: any, b: any): number {
  //console.log(`${typeof a}, ${typeof b}`, a, b);
  /*
  If both are integers, the lower integer should come first. 
  If the left integer is lower than the right integer, the inputs are in the right order. 
  If the left integer is higher than the right integer, the inputs are not in the right order. 
  If the inputs are the same integer; continue checking the next part of the input.
  */
  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b);
  }
  /*
  If both values are lists, compare the first value of each list, then the second value, and so on. 
  If the left list runs out of items first, the inputs are in the right order. 
  If the right list runs out of items first, the inputs are not in the right order. 
  If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
  */
  else if (typeof a === 'object' && typeof b === 'object') {
    let maxLength = a.length - b.length < 0 ? b.length : a.length;
    for (let i = 0; i < maxLength; i++) {
      const result: number = comparePair(a[i], b[i]);
      if (result !== 0) return result;
    }
    return 0;
  }
  else if (typeof a === 'undefined') return -1;
  else if (typeof b === 'undefined') return 1;
  /*
  If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, 
  then retry the comparison. 
  */
  else if (typeof a === 'object' && typeof b === 'number') {
    return comparePair(a,[b]);
  }
  else if (typeof a === 'number' && typeof b === 'object') {
    return comparePair([a],b);
  }
  throw new Error("unknown case!");
}

async function partTwo(data) {
  const items = [];
  data.forEach(pair => {
    items.push(...pair);
  });
  items.sort(comparePair);

  let sItems = items.map(a => JSON.stringify(a))
  console.log(sItems);
  console.log(sItems.indexOf('[[[2]]]'));
  console.log(sItems.indexOf('[[[6]]]'));
  
  
};

await main();

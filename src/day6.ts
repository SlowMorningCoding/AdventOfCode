import figlet from 'figlet';
import { readFile } from './readFile.js';

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day6'));
    console.time('total time');
    /* Parse input */
    const input: string = await readFile('./public/input_day6.txt');
    
    /* Part one */
    const message1 = await partOne(input);
    console.log(`Part One message ${message1}`);
    
    /* Part two */
    const message2 = await partTwo(input);
    console.log(`Part Two message ${message2}`);
    
  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

async function partOne(input: string): Promise<string> {
  const markerLength = 4;
  let marker = '';
  let index = markerLength; 
  while (index <= input.length) {
    marker = input.slice(index-markerLength, index);
    if (testMarker(marker)) break;
    index++;
  }
  return `${marker} at index ${index}`;
};

async function partTwo(input: string): Promise<string> {
  const markerLength = 14;
  let marker = '';
  let index = markerLength; 
  while (index <= input.length) {
    marker = input.slice(index-markerLength, index);
    if (testMarker(marker)) break;
    index++;
  }
  return `${marker} at index ${index}`;
};

function testMarker(marker: string): boolean {
  let chars = marker.split('');
  while (chars.length > 1) {
    let char: any = chars.pop();
    if( chars.indexOf(char) >= 0) return false;
  }
  return true;
}

await main();

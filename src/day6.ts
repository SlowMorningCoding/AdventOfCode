import { readFile } from './readFile.js';

const testMarker = (marker: string): boolean => {
  let chars = marker.split('');
  while (chars.length > 1) {
    let char: any = chars.pop();
    if( chars.indexOf(char) >= 0) return false;
  }
  return true;
}

const partOne = async (input: string): Promise<string> => {
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

const partTwo = async (input: string): Promise<string> => {
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

export const main = async () => {
  try {
    /* Parse input */
    const input: string = await readFile('./public/day6_input.txt');
    
    /* Part one */
    const message1 = await partOne(input);
    console.log(`Part One message ${message1}`);
    
    /* Part two */
    const message2 = await partTwo(input);
    console.log(`Part Two message ${message2}`);

  } catch (e) {
    console.log(e);
  }
};

import { readFile } from './readFile.js';

type AssignmentPair = { elfA_start: number, elfA_end: number, elfB_start: number, elfB_end: number };

const parseInput = async (input: string): Promise<AssignmentPair[]> => {
  const lines: string[] = input.split(/\r?\n/);
  const assignmentPairs = lines.map(line => {
    const [elfA_start, elfA_end, elfB_start, elfB_end]: number[] = line.split(/[,-]/).map(s => Number(s));
    return { elfA_start, elfA_end, elfB_start, elfB_end };
  });
  return assignmentPairs;
};

const partOne = async (assignmentPairs: AssignmentPair[]) => {
  const fullyContainOthers = assignmentPairs.filter(({ elfA_start, elfA_end, elfB_start, elfB_end })=> {
    // A in B or B in A
    if((elfA_start >= elfB_start && elfA_end <= elfB_end ) || (elfB_start >= elfA_start && elfB_end <= elfA_end )) return true;
  });
  return fullyContainOthers;
}

const partTwo = async (assignmentPairs: AssignmentPair[]) => {
  const overlaps = assignmentPairs.filter(({ elfA_start, elfA_end, elfB_start, elfB_end })=> {
    // A start in B or A end in B or B start in A or B end in A
    if(
      (elfA_start >= elfB_start && elfA_start <= elfB_end ) 
      || (elfA_end >= elfB_start && elfA_end <= elfB_end ) 
    || (elfB_start >= elfA_start && elfB_start <= elfA_end ) 
    || (elfB_end >= elfA_start && elfB_end <= elfA_end ) ) return true;
  });
  return overlaps;
}

export const main = async () => {
  try {
    /* Parse input */
    const input: string = await readFile('./public/day4_input.txt');
    const assignmentPairs = await parseInput(input);

    /* Part one */
    const fullyContainOthers: AssignmentPair[] = await partOne(assignmentPairs);
    console.table(fullyContainOthers);
    console.log('Fully Contain Others count:', fullyContainOthers.length)

    /* Part two */
    const overlaps: AssignmentPair[] = await partTwo(assignmentPairs);
    console.table(overlaps);
    console.log('Overlaps count:', overlaps.length)

  } catch (e) {
    console.log(e);
  }
};

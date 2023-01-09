import figlet from 'figlet';
import { readFile } from './readFile.js';

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day1'));
    console.time('total time');
    /* Parse input */
    const input: string = await readFile('./public/day1_input.txt');
    const elves = await parseInput(input);

    /* Part one */
    const elfWithMostCalories = await partOne(elves);
    console.log('Elf With Most Calories');
    console.table(elfWithMostCalories);
    
    /* Part two */
    const topThreeElves = await partTwo(elves);
    console.log('Top three Elves');
    console.table(topThreeElves);
    
  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

type Elf = { name: string, calories: number[], total: number };

async function parseInput(input: string): Promise<Elf[]> {
  const blocks: string[] = input.split(/(?:\r?\n){2}/);

  const elves: Elf[] = blocks.map((block, index) => {
    const calories: number[] = block.split(/\r?\n/)
      .map(s => Number(s))
      .filter(n => n > 0);
    const total: number = calories.reduce((accumulator, current) => accumulator + current, 0)
    return { name: `Elf-${index + 1}`, calories, total };
  });
  return elves;
};

async function partOne(elves: Elf[]): Promise<Elf> {
  return elves.reduce((accumulator, current) => current.total > accumulator.total ? current : accumulator,
    { name: 'none', calories: [], total: 0 }
  );
};

async function partTwo(elves: Elf[]): Promise<Elf[]> {
  const topElves = elves.reduce((accumulator: Elf[], current: Elf) => {
    if(accumulator.length < 3) {
      accumulator.push(current);
    } else if (current.total > accumulator[2].total) {
      accumulator.pop();
      accumulator.push(current);
      accumulator.sort((a, b) => b.total - a.total);
    }
    return accumulator;
  }, []);

  topElves.push({
    name: 'sum',
    calories: topElves.map(elf => elf.total),
    total: topElves.reduce((accumulator, current) => accumulator + current.total, 0)
  });
  return topElves;
};

await main();

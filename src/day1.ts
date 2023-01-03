#!/usr/bin/env node
import { readFile } from './readFile.js';

type Elf = { name: string, calories: number[], total: number };

const parseInput = async (input: string): Promise<Elf[]> => {
  const blocks: string[] = input.split(/(?:[\r]?\n){2}/);

  const elves: Elf[] = blocks.map((block, index) => {
    const calories: number[] = block.split(/[\r]?\n/)
      .map(s => Number(s))
      .filter(n => n > 0);
    const total: number = calories.reduce((accumulator, current) => accumulator + current, 0)
    return { name: `Elf-${index + 1}`, calories, total };
  });
  return elves;
};

const partOne = async (elves: Elf[]): Promise<Elf> => {
  return elves.reduce((accumulator, current) => current.total > accumulator.total ? current : accumulator,
    { name: 'none', calories: [], total: 0 }
  );
};

const partTwo = async (elves: Elf[]): Promise<Elf[]> => {
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

export const main = async () => {
  try {
    const input: string = await readFile('./public/day1_input.txt');
    const elves = await parseInput(input);

    const elfWithMostCalories = await partOne(elves);
    console.log('Elf With Most Calories');
    console.table(elfWithMostCalories);

    const topThreeElves = await partTwo(elves);
    console.log('Top three Elves');
    console.table(topThreeElves);

  } catch (e) {
    console.log(e);
  }
};

#!/usr/bin/env node
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

const getTopElf = async (elves: Elf[]): Promise<Elf> => {
  return elves.reduce((accumulator, current) => current.total > accumulator.total ? current : accumulator,
    { name: 'none', calories: [], total: 0 }
  );
};

const getTopThreeElf = async (elves: Elf[]): Promise<Elf[]> => {
  const topElves = elves.reduce((accumulator: Elf[], current: Elf) => {
    if (current.total > accumulator[2].total) {
      accumulator.pop();
      accumulator.push(current);
      accumulator.sort((a, b) => b.total - a.total);
    }
    return accumulator;
  }, [{ name: 'none', calories: [], total: 0 }, { name: 'none', calories: [], total: 0 }, { name: 'none', calories: [], total: 0 }]);

  topElves.push({
    name: 'sum',
    calories: topElves.map(elf => elf.total),
    total: topElves.reduce((accumulator, current) => accumulator + current.total, 0)
  });
  return topElves;
};

export const day01 = async (input: string) => {
  try {
    const elves = await parseInput(input);

    const elfWithMostCalories = await getTopElf(elves);
    console.log('Elf With Most Calories');
    console.table(elfWithMostCalories);

    const topThreeElves = await getTopThreeElf(elves);
    console.log('Top three Elves');
    console.table(topThreeElves);

  } catch (e) {
    console.log(e);
  }
};

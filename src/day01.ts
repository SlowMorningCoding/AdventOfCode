#!/usr/bin/env node
type elf = { name: string, calories: number[] };

const parseInput = async (input: string): Promise<elf[]> => {
  const blocks = input.split(/([\r]?\n){2}/);

  console.table(blocks);

  const elves = blocks.map(foods => {
    return foods.split(/[\r\n]{2}/)
      .map(s => Number(s))
      .filter(n => n > 0);
  });
  
  return [{ name: 'name', calories: [1] }];
};

const getMostCalories = async (elves: any[]) => {
  const elvesTotal = elves.map(calories => calories.reduce((accumulator, current) => accumulator + current, 0));
  const elf = elvesTotal.reduce((accumulator, current, index) => current > accumulator.value ? { elf: index + 1, value: current } : accumulator, { elf: -1, value: -1 });
  return elf;
};

const getTopThreeCalories = async (elves) => {
  const elvesTotal = elves.map(calories => calories.reduce((accumulator, current) => accumulator + current, 0));
  const topElves = elvesTotal.reduce((accumulator, current, index) => {
    if (current > accumulator[2].value) {
      accumulator.pop();
      accumulator.push({ elf: index + 1, value: current });
      accumulator.sort((a, b) => b.value - a.value);
    }
    return accumulator;
  }, [{ elf: -1, value: -1 }, { elf: -1, value: -1 }, { elf: -1, value: -1 }]);

  topElves.push({ elf: 'total', value: topElves.reduce((accumulator, current) => accumulator + current.value, 0) });
  return topElves;
};

export const day01 = async (input: string) => {
  try {
    const elves = await parseInput(input);
    console.table(elves);
    //const elfWithMostCalories = await getMostCalories(elves);
    //console.log('Elf With Most Calories');
    //console.table(elfWithMostCalories);

    //const topThreeElves = await getTopThreeCalories(elves);
    //console.log('Top three Elves');
    //console.table(topThreeElves);

  } catch (e) {
    console.log(e);
  }
};



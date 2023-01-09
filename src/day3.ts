import figlet from 'figlet';
import { readFile } from './readFile.js';

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day3'));
    console.time('total time');
    /* Parse input */
    const input: string = await readFile('./public/day3_input.txt');
    
    /* Part one */
    let rucksacks: Rucksack[] = await partOne(input);
    rucksacks.push({ compartmentA: '', compartmentB: '', sharedItem: '', priority: rucksacks.reduce((accumulator, current: Rucksack) => accumulator + current.priority, 0) });
    console.table(rucksacks);
    
    /* Part two */
    let badgeGroups: BadgeGroup[] = await partTwo(input);
    badgeGroups.push({
      rucksackA: '', rucksackB: '', rucksackC: '',
      sharedItem: '',
      priority: badgeGroups.reduce((accumulator, current: BadgeGroup) => accumulator + current.priority, 0)
    });
    console.table(badgeGroups);
    
  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

type Rucksack = { compartmentA: string, compartmentB: string, sharedItem: string, priority: number };

const priorityTable: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

async function partOne (input: string): Promise<Rucksack[]> {
  const lines: string[] = input.split(/\r?\n/);
  const rucksacks: Rucksack[] = lines.map((line) => {
    const compartmentA: string = line.slice(0, line.length / 2);
    const compartmentB: string = line.slice(line.length / 2)
    const [sharedItem]: string[] = compartmentA.split('').filter(char => compartmentB.indexOf(char) >= 0);
    const priority: number = priorityTable.indexOf(sharedItem) + 1;
    return { compartmentA, compartmentB, sharedItem, priority };
  });
  return rucksacks;
};

type BadgeGroup = { rucksackA: string, rucksackB: string, rucksackC: string, sharedItem: string, priority: number };

async function partTwo(input: string): Promise<BadgeGroup[]> {
  const lines: string[] = input.split(/\r?\n/);
  const badgeGroups: BadgeGroup[] = [];
  while (lines.length) {
    const rucksackA: string = lines.shift() ?? '';
    const rucksackB: string = lines.shift() ?? '';
    const rucksackC: string = lines.shift() ?? '';
    const [sharedItem]: string[] = rucksackA.split('').filter(char => rucksackB.indexOf(char) >= 0 && rucksackC.indexOf(char) >= 0);
    const priority: number = priorityTable.indexOf(sharedItem) + 1;
    badgeGroups.push({ rucksackA, rucksackB, rucksackC, sharedItem, priority });
  }
  return badgeGroups;
};

await main();

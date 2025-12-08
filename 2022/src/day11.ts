import figlet from 'figlet';
import { readFile } from './readFile.js';

async function main() {
  console.clear();
  console.log(figlet.textSync('Advent of Code - Day11'));
  console.time('total time');
  try {
    /* Part one */
    const p1Monkeys: Monkey[] = await getMonkeys(true);
    const p1Result = await calcMonkeyBusiness(p1Monkeys, 20);
    console.log(`Part One monkey busines: ${p1Result} vs 61503`);
    
    /* Part two */
    const p2Monkeys: Monkey[] = await getMonkeys(false);
    const p2Result = await calcMonkeyBusiness(p2Monkeys, 10_000);
    console.log(`Part Two: ${p2Result} vs 14081365540`);

  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
}

type Operation = { a: string, operator: string, b: string };
type Test = { divider: number, trueTarget: Monkey, falseTarget: Monkey }

class Monkey {
  public name: string;
  public inspections: number = 0;
  public items: number[];
  public operation: Operation;
  public getsBored: boolean = true;
  public test: Test | undefined;
  public factorial: number = 1;

  constructor(name: string, items: number[], operation: Operation, getsBored: boolean) {
    this.name = name;
    this.items = items;
    this.operation = operation;
    this.getsBored = getsBored;
  }

  public setTest(test: Test) {
    this.test = test;
  }

  public async doMonkeyBusiness() {
    for (let item of this.items) {
      let worryLevel = item;
      // Inspection
      this.inspections += 1;
      // Operation
      let b = this.operation.b === 'old' ? worryLevel : Number(this.operation.b);
      if (this.operation.operator === '*') {
        worryLevel *= b;
      } else if (this.operation.operator === '+') {
        worryLevel += b;
      }
      // Bored
      if (this.getsBored) worryLevel = Math.floor(worryLevel / 3);
      // Worry test
      if (this.test !== undefined) {
        if (worryLevel % this.test.divider === 0) {
          this.test.trueTarget.items.push(worryLevel % this.factorial);
        } else {
          this.test.falseTarget.items.push(worryLevel % this.factorial);
        }
      }
    }
    this.items = [];
  }
}

async function getMonkeys(getBored: boolean): Promise<Monkey[]> {
  const monkeys: Monkey[] = [];
  const input: string = await readFile('./public/input_day11.txt');
  const monkeyData: string[][] = input.split(/(?:\r?\n){2}/)
    .map((block) => block.split(/(?:\r?\n)/));
  let factorial: number = 1;

  // Initialize monkeys
  for (const block of monkeyData) {
    const name: string = block[0].slice(0, -1);
    const items: number[] = (block[1].match(/(\d+)/g) ?? []).map(s => Number(s));
    let match = block[2].match(/= (\S+) (\S+) (\S+)/);
    if (!match) break;
    const [, a, operator, b]: string[] = match;
    const operation: Operation = { a, operator, b };
    monkeys.push(new Monkey(name, items, operation, getBored));
  }
  // set monkeys test
  monkeyData.forEach((block, index) => {
    let [divider, trueIndex, falseIndex] = block.filter((line, index) => index > 2)
      .map(s => Number((s.match(/\d+/g))));
    factorial *= divider;
    monkeys[index].setTest({ divider, trueTarget: monkeys[trueIndex], falseTarget: monkeys[falseIndex] });
  });
  monkeys.forEach(m => m.factorial = factorial);
  return monkeys;
};

async function calcMonkeyBusiness(monkeys: Monkey[], rounds: number): Promise<number> {
  let round: number = 0
  console.table(monkeys);
  while (round < rounds) {
    round += 1;
    for (const monkey of monkeys) {
      await monkey.doMonkeyBusiness();
    }
  }
  console.table(monkeys);
  const [a, b] = monkeys.map((element) => element.inspections).sort((a, b) => b - a);;
  return a * b;
};

let progressDone: number = -1;

function progressPar(done: number, total: number) {
  const donePercent = Math.floor(done / total * 100);
  if (donePercent !== progressDone) {
    progressDone = donePercent;
    console.log(`${donePercent} %`);
  }
};

await main();

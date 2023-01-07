import { readFile } from './readFile.js';

class Monkey {
  public name: string;
  public items: bigint[];
  public operation: string;
  public boredDivider: bigint = 3n;
  public test: bigint = 1n;
  public trueTarget: Monkey | undefined;
  public falseTarget: Monkey | undefined;
  public inspections: number = 0;

  constructor(name: string, items: bigint[], operation: string) {
    this.name = name;
    this.items = items;
    this.operation = operation;
  }

  public setTest(test: bigint, trueTarget: Monkey, falseTarget: Monkey) {
    this.test = test;
    this.trueTarget = trueTarget;
    this.falseTarget = falseTarget;
  }

  public async doMonkeyBusiness(bored: boolean) {
    while (this.items.length) {
      let item: bigint = this.items.shift() ?? 0n;
      // Inspection
      this.inspections += 1;
      const op: string = this.operation.replace(/old/g, item.toString() + 'n');
      item = eval(op);
      // Bored
      if (bored) item = item / this.boredDivider;
      // Worry test
      if (item % this.test === 0n) {
        this.trueTarget?.items.push(item);
      } else {
        this.falseTarget?.items.push(item);
      }
    }
  }
}

const parseInput = async (input: string): Promise<Monkey[]> => {
  const data: string[][] = input.split(/(?:\r?\n){2}/)
    .map((block) => block.split(/(?:\r?\n)/));
  const monkeys: Monkey[] = [];
  // Initialize monkeys
  for (const block of data) {
    const name: string = block[0].slice(0, -1);
    const items: bigint[] = (block[1].match(/(\d+)/g) ?? []).map(s => BigInt(s));
    const operation: string = (block[2].match(/= (.*)$/) ?? ['', ''])[1].replace(/(\d+)/, '$1n');
    monkeys.push(new Monkey(name, items, operation));
  }
  // set monkeys test
  const tests = data.map(block => block
    .filter((line, index) => index > 2)
    .map(s => Number((s.match(/\d+/) ?? [0])[0]))
  );
  tests.forEach(([test, trueIndex, falseIndex], index) => {
    monkeys[index].setTest(BigInt(test), monkeys[trueIndex], monkeys[falseIndex]);
  });
  return monkeys;
};

let progressDone: number = -1;
const progressPar = (done: number, total: number) => {
  const donePercent = Math.floor(done / total * 100);
  if (donePercent !== progressDone) {
    progressDone = donePercent;
    console.log(`${donePercent} %`);
  }
};

const monkeyBusiness = async (monkeys: Monkey[], rounds: number, bored: boolean = true): Promise<string> => {
  console.table(monkeys);
  let round: number = 0

  while (round < rounds) {
    round += 1;
    progressPar(round, rounds);
    for (const monkey of monkeys) {
      await monkey.doMonkeyBusiness(bored);
    }
  }
  console.table(monkeys);
  const [a, b] = monkeys.map((element) => element.inspections).sort((a, b) => b - a);;
  return `MonkeyBusiness ${a * b}`;
};

export const main = async () => {
  try {
    /* Parse input */
    const input: string = await readFile('./public/input_day11.txt');
    const monkeys: Monkey[] = await parseInput(input);

    /* Part one */
    //const result1 = await monkeyBusiness(monkeys, 20);
    //console.log(`Part One: ${result1}`);

    /* Part two */
    const result2 = await monkeyBusiness(monkeys, 20, false);
    console.log(`Part Two: ${result2} vs 61256`);

  } catch (e) {
    console.log(e);
  }
};

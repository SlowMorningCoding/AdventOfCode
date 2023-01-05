import { readFile } from './readFile.js';

type Instruction = { command: string, value: number };

class Computer {
  public cycle: number = 0;
  public registerX: number = 1;
  public readCycles: number[] = [20, 60, 100, 140, 180, 220];
  public signalStrengthReads: number[] = [];
  public CrtIndex: number = 0;
  public CRTs: string[] = [''];
  public sprite: string = '';

  public tick() {
    this.cycle += 1;

    // Read signal
    if (this.readCycles.includes(this.cycle)) {
      this.signalStrengthReads.push(this.getsignalStrength());
    }
    // Draw CRT
    this.CRTs[this.CRTs.length - 1] += this.inSprite() ? '#' : ' ';

    // CRT new row
    if (this.CrtIndex > 0 && this.CrtIndex % 39 === 0) {
      this.CRTs.push('');
      this.CrtIndex = 0;
    } else {
      this.CrtIndex += 1;
    }
  }

  public getsignalStrength(): number {
    return this.cycle * this.registerX;
  }

  public addx(value: number) {
    this.registerX += value;
  }

  public inSprite(): boolean {
    const value = this.CrtIndex >= this.registerX - 1 && this.CrtIndex <= this.registerX + 1;
    return value;
  }
}

const parseInput = async (filePath: string): Promise<Instruction[]> => {
  const input: string = await readFile(filePath);
  const data = input.split(/\r?\n/)
    .map(line => {
      const [command, value] = line.split(' ');
      return { command, value: Number(value) };
    });
  return data;
};

const partOne = async (instructions: Instruction[]) => {
  const tupe = new Computer();

  for (const instruction of instructions) {
    switch (instruction.command) {
      case 'noop':
        tupe.tick();
        break;
      case 'addx':
        tupe.tick();
        tupe.tick();
        tupe.addx(instruction.value);
        break;
      default: throw new Error(`unknown command ${instruction.command}`);
    }
  }

  console.log(`Part One: ${tupe.signalStrengthReads} sum ${tupe.signalStrengthReads.reduce((sum, signal) => sum + signal, 0)}`);
  console.log(`Part two: `);
  console.table(tupe.CRTs);
};

export const main = async () => {
  try {
    /* Parse input */
    const instructions = await parseInput('./public/input_day10.txt');

    /* Part one and two*/
    await partOne(instructions);

  } catch (e) {
    console.log(e);
  }
};

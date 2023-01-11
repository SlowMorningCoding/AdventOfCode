import figlet from 'figlet';
import { readFile } from './readFile.js';

class Analyzer {
  public layer0: { [key: number]: { [key: number]: string } } = {
    8: { 5: '?' },
    0: { 1: '?', 8: '?' },
    1: { 1: '?', 8: '?' },
    11: { 1: '?', 8: '?' }
  };
  public screenXmin: number = 0;
  public screenXmax: number = 10;
  public screenYmin: number = 0;
  public screenYmax: number = 10;

  private boxChr = ' ░▒▓─│┌┬┐├┼┤└┴┘╭╮╰╯╲╳╱';
  
  constructor() {
  }

  /**
   * render the screen 
   */
  public render() {
    const empty = ' '
    const layer = this.layer0;
    console.log(layer);

    this.topBorder();
    for (let y = this.screenYmin; y <= this.screenYmax; y++) {
      let line = '';

      if (layer[y] === undefined) {
        line += '.'.repeat(this.screenXmax - this.screenXmin + 1);
      } else {
        for (let x = this.screenXmin; x <= this.screenXmax; x++) {
          let chr = layer[y][x];
          line += chr === undefined ? empty : chr;
        }
      }
      this.dataBorder(line);
    }
    this.bottomBorder();
    process.stdout.write("\n");
  }

  private topBorder() {
    let line = this.boxChr[6];
    for (let x = this.screenXmin; x <= this.screenXmax; x++) {
      line += this.boxChr[4];
    }
    line += this.boxChr[8] + '\n';
    process.stdout.write(line);
  }

  private dataBorder(data: string) {
    process.stdout.write(`${this.boxChr[5]}${data}${this.boxChr[5]}\n`);
  }

  private bottomBorder() {
    let line = this.boxChr[12];
    for (let x = this.screenXmin; x <= this.screenXmax; x++) {
      line += this.boxChr[4];
    }
    line += this.boxChr[14] + '\n';
    process.stdout.write(line);
  }
}


async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day14'));
    console.time('total time');

    /* Parse input */
    const data = await parseInput();
    // console.table(data);

    /* Part one */
    const p1Result = await partOne(data);
    console.log(`Part One: ${p1Result}`);

    /* Part two */
    const p2Result = await partTwo();
    console.log(`Part Two: ${p2Result}`);

  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

async function parseInput(): Promise<string[]> {
  const input: string = await readFile('./public/input_day14_test.txt');
  const data: string[] = input.split(/\r?\n/);
  return data;
};

async function partOne(): Promise<number> {
  const p1Analyzer: Analyzer = new Analyzer();

  p1Analyzer.render();



  return 0;
};

async function partTwo(): Promise<number> {
  return 0;
};

await main();

import figlet from 'figlet';
import { readFile } from './readFile.js';

type Position = { x: number, y: number };

class Screen {
  public baseLayer: Layer = new Layer();
  public screenMin: Position = { x: 0, y: 0 };
  public screenMax: Position = { x: 0, y: 0 };
  //public borders: number[] = [0, 1, 0, 1];
  // sand
  public sandStart: Position = { x: 500, y: 0 };
  public sandFlow: Position[] = [{ x: 500, y: 0 }];
  public sandUnits: number = 0;

  public chrs = {
    box: ' ░▒▓─│┌┬┐├┼┤└┴┘╭╮╰╯╲╳╱',
    empty: ' ',
    wall: '#',
    sandStart: '+',
    sandUnit: 'o',
    sandFlow: '~'
  };

  /** calc screen size */
  public fitScreen() {
    const grid = this.baseLayer.grid
    let xmin: number | undefined, xmax: number | undefined, ymin: number | undefined, ymax: number | undefined;
    const yKeys = Object.keys(grid);
    yKeys.forEach(yKey => {
      // y
      if (ymin === undefined || ymin > Number(yKey)) ymin = Number(yKey);
      if (ymax === undefined || ymax < Number(yKey)) ymax = Number(yKey);
      // x
      const xKeys = Object.keys(grid[Number(yKey)]);
      if (xmin === undefined || xmin > Number(xKeys[0])) xmin = Number(xKeys[0]);
      if (xmax === undefined || xmax < Number(xKeys[xKeys.length - 1])) xmax = Number(xKeys[xKeys.length - 1]);
    });
    this.screenMin = { x: (xmin === undefined ? 0 : xmin - 10), y: (ymin === undefined ? 0 : ymin) };
    this.screenMax = { x: (xmax === undefined ? 0 : xmax + 10), y: (ymax === undefined ? 0 : ymax + 2) };
  }

  /** get chr at position */
  public getGridChr(pos: Position): string {
    if (this.baseLayer.grid[pos.y] === undefined) return this.chrs.empty;
    if (this.baseLayer.grid[pos.y][pos.x] === undefined) return this.chrs.empty;
    return this.baseLayer.grid[pos.y][pos.x];
  }

  /** Draw grid screen */
  public render() {
    const grid = this.baseLayer.grid;
    this.topBorder();
    for (let y = this.screenMin.y; y <= this.screenMax.y; y++) {
      let line = '';
      if (grid[y] === undefined) {
        line += this.chrs.empty.repeat(this.screenMax.x - this.screenMin.x + 1);
      } else {
        for (let x = this.screenMin.x; x <= this.screenMax.x; x++) {
          let chr = grid[y][x];
          line += chr === undefined ? this.chrs.empty : chr;
        }
      }
      this.lineBorder(line);
    }
    this.bottomBorder();
  }

  /** Draw top border */
  private topBorder(line = '') {
    for (let x = this.screenMin.x; x <= this.screenMax.x; x++) line += this.chrs.box[4];
    process.stdout.write(`${this.chrs.box[6]}${line}${this.chrs.box[8]}\n`);
  }

  /** Draw border start and end of line*/
  private lineBorder(data: string) {
    process.stdout.write(`${this.chrs.box[5]}${data}${this.chrs.box[5]}\n`);
  }

  /** Draw bottom border */
  private bottomBorder(line = '') {
    for (let x = this.screenMin.x; x <= this.screenMax.x; x++) line += this.chrs.box[4];
    process.stdout.write(`${this.chrs.box[12]}${line}${this.chrs.box[14]}\n`);
  }

  /** pourSand: return false if can't pour more sand or it drops over screen */
  public pourSand(): boolean { // TODO pourSand
    let blockingItems = this.chrs.wall + this.chrs.sandUnit;
    let point: Position = this.sandFlow[this.sandFlow.length - 1];

    if (point.y > this.screenMax.y+2) return false;

    // can go down 
    let pointDown: Position = { x: point.x, y: point.y + 1 };
    if (blockingItems.indexOf(this.getGridChr(pointDown)) < 0 && pointDown.y < this.screenMax.y) {
      this.baseLayer.addDot(pointDown, this.chrs.sandFlow);
      this.sandFlow.push(pointDown);
      return true;
    }
    // can go down left
    let pointDownLeft: Position = { x: point.x - 1, y: point.y + 1 };
    if (blockingItems.indexOf(this.getGridChr(pointDownLeft)) < 0 && pointDown.y < this.screenMax.y) {
      this.baseLayer.addDot(pointDownLeft, this.chrs.sandFlow);
      this.sandFlow.push(pointDownLeft);
      return true;
    }
    // can go down right 
    let pointDownRight: Position = { x: point.x + 1, y: point.y + 1 };
    if (blockingItems.indexOf(this.getGridChr(pointDownRight)) < 0 && pointDown.y < this.screenMax.y) {
      this.baseLayer.addDot(pointDownRight, this.chrs.sandFlow);
      this.sandFlow.push(pointDownRight);
      return true;
    }
    // can't go down add sand unit
    this.sandUnits += 1;
    this.baseLayer.addDot(point, this.chrs.sandUnit);
    this.sandFlow.pop();

    
    if (this.sandFlow.length === 0) return false;
    return true;

  }

}

class Layer {
  public grid: { [key: number]: { [key: number]: string } } = {};

  addDot(pos: Position, chr: string) {
    if (this.grid[pos.y] === undefined) this.grid[pos.y] = {};
    this.grid[pos.y][pos.x] = chr;
  }

  addLine(pos1: Position, pos2: Position, chr: string) {
    const k = (pos2.y - pos1.y) / (pos2.x - pos1.x);
    if (k === Infinity) { // Down
      for (let i = pos1.y; i <= pos2.y; i++) this.addDot({ x: pos1.x, y: i }, chr);
    } else if (k === -Infinity) { // Up
      for (let i = pos1.y; i >= pos2.y; i--) this.addDot({ x: pos1.x, y: i }, chr);
    } else if (k === 0 && pos1.x < pos2.x) { // Right
      for (let i = pos1.x; i <= pos2.x; i++) this.addDot({ x: i, y: pos1.y }, chr);
    } else if (k === 0 && pos1.x > pos2.x) { // Left
      for (let i = pos1.x; i >= pos2.x; i--) this.addDot({ x: i, y: pos1.y }, chr);
    } else throw new Error("unknown direction");
  }
}

async function main() {
  try {
    console.time('total time');
    header();

    /* Parse input */
    const data = await parseInput();

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

function header() {
  console.clear();
  console.log(figlet.textSync('Advent of Code - Day14'));
}

async function sleep(ms: number = 100): Promise<any> {
  return new Promise((r) => setTimeout(r, ms));
}

async function parseInput(): Promise<string[]> {
  const input: string = await readFile('./public/input_day14.txt');
  const data: string[] = input.split(/\r?\n/);
  return data;
};

async function partOne(data: string[]): Promise<number> {
  const p1Screen: Screen = new Screen();
  // Sand start  
  p1Screen.baseLayer.addDot(p1Screen.sandStart, p1Screen.chrs.sandStart);
  // Walls
  for (const line of data) {
    let prevx: number | undefined, prevy: number | undefined;
    let prevPos: Position | undefined;
    const matches = line.matchAll(/((\d+),(\d+))/g);
    for (const match of matches) {
      let [, , x, y] = match;
      let pos: Position = { x: Number(x), y: Number(y) }
      if (prevPos !== undefined) p1Screen.baseLayer.addLine(prevPos, pos, p1Screen.chrs.wall);
      prevPos = pos;
    }
  }
  p1Screen.fitScreen();

  // Pour sand
  printScreen(p1Screen);
  //await sleep(50)

  while (p1Screen.pourSand()) {
    //header();
    //printScreen(p1Screen);
    //await sleep(50)
  }
  header();
  printScreen(p1Screen);

  // TODO loop sand time
  return p1Screen.sandUnits;
};

function printScreen(screen: Screen) {
  screen.render();
}

async function partTwo(): Promise<number> {
  return 0;
};

await main();

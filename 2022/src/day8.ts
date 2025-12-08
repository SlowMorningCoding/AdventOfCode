import figlet from 'figlet';
import { readFile } from './readFile.js';

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day8'));
    console.time('total time');
    /* Parse input */
    const input: string = await readFile('./public/input_day8.txt');
    await parseForest(input);
    colMax = forest[0].length - 1;
    lineMax = forest.length - 1;
    
    /* Part one */
    const message1 = await partOne();
    console.log(`Part One message ${message1}`);
    
    /* Part two */
    const message2 = await partTwo();
    console.log(`Part Two message ${message2}`);
    
  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

const forest: number[][] = [];
let colMax = -1;
let lineMax = -1;
const visMap: string[][] = [];

const parseForest = async (input: string) => {
  const data: number[][] = input.split(/\r?\n/)
    .map(line => line.split('')
      .map(s => Number(s))
    )
  forest.push(...data);
};

function isVisibleToNorth (line: number, col: number): boolean {
  const tree: number = forest[line][col];
  for (let pLine = line - 1; pLine >= 0; pLine--) {
    let pTree = forest[pLine][col];
    if (pTree >= tree) {
      return false;
    }
  }
  return true;
}

function isVisibleToSouth(line: number, col: number): boolean {
  const tree: number = forest[line][col];
  for (let pLine = line + 1; pLine <= lineMax; pLine++) {
    let pTree = forest[pLine][col];
    if (pTree >= tree) {
      return false;
    }
  }
  return true;
}

function isVisibleToEast(line: number, col: number): boolean {
  const tree: number = forest[line][col];
  for (let pCol = col + 1; pCol <= colMax; pCol++) {
    let pTree = forest[line][pCol];
    if (pTree >= tree) {
      return false;
    }
  }
  return true;
}

function isVisibleToWest(line: number, col: number): boolean {
  const tree: number = forest[line][col];
  for (let pCol = col - 1; pCol >= 0; pCol--) {
    let pTree: number = forest[line][pCol];
    if (pTree >= tree) {
      return false;
    }
  }
  return true;
}

async function isVisible(line: number, col: number): Promise<boolean> {
  if (isVisibleToNorth(line, col)
    || isVisibleToSouth(line, col)
    || isVisibleToEast(line, col)
    || isVisibleToWest(line, col)) return true;
  return false;
};

async function partOne(): Promise<string> {
  let visibleCount: number = 0;
  for (let line = 0; line <= lineMax; line++) { // lines
    visMap.push([]);
    for (let col = 0; col <= colMax; col++) { // colums
      let tree = forest[line][col];
      if (col === 0 || col === colMax || line === 0 || line === lineMax || await isVisible(line, col)) {
        visibleCount += 1;
        visMap[line].push(` @${tree}`);
      } else {
        visMap[line].push(`  ${tree}`);
      }
    }
  }
  visMap.forEach(line => console.log(line.join('')));
  return `visible from outside the grid ${visibleCount}`;
};

async function calcScenicScore(line: number, col: number): Promise<number> {
  let score: number[] = [];
  const treeHeight: number = forest[line][col];
  let pTreeCount: number = 0;
  // North
  for (let pLine = line - 1; pLine >= 0; pLine--) {
    pTreeCount += 1;
    if (forest[pLine][col] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // South
  pTreeCount = 0;
  for (let pLine = line + 1; pLine <= lineMax; pLine++) {
    pTreeCount += 1;
    if (forest[pLine][col] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // East
  pTreeCount = 0;
  for (let pCol = col + 1; pCol <= colMax; pCol++) {
    pTreeCount += 1;
    if (forest[line][pCol] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // West
  pTreeCount = 0;
  for (let pCol = col - 1; pCol >= 0; pCol--) {
    pTreeCount += 1;
    if (forest[line][pCol] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // Calc score
  return score.reduce((prev, current) => {
    if (prev === 0 || current === 0) return prev + current;
    return prev * current;
  }, 0);
};

async function partTwo(): Promise<string> {
  let topScenicScore = 0;
  for (let line = 0; line <= lineMax; line++) { // lines
    for (let col = 0; col <= colMax; col++) { // colums
      let treeScenicScore: number = await calcScenicScore(line, col);
      if (topScenicScore <= treeScenicScore) topScenicScore = treeScenicScore;
    }
  }
  return `scenic score ${topScenicScore}`;
};

await main();

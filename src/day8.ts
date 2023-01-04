#!/usr/bin/env node
import { readFile } from './readFile.js';

const forest: number[][] = [];
let colMax = -1;
let lineMax = -1;
const visMap: string[][] = [];

const parseForest = async (input: string) => {
  const data: number[][] = input.split(/[\r]?\n/)
    .map(line => line.split('')
      .map(s => Number(s))
    )
  forest.push(...data);
};

const isVisible = async (line: number, col: number): Promise<boolean> => {
  const tree: number = forest[line][col];
  let visible: boolean = true;
  // North
  for (let pLine = line - 1; pLine >= 0; pLine--) {
    let pTree = forest[pLine][col];
    if (pTree >= tree) {
      visible = false;
      break;
    }
  }
  if (visible) return true;
  // South
  visible = true;
  for (let pLine = line + 1; pLine <= lineMax; pLine++) {
    let pTree = forest[pLine][col];
    if (pTree >= tree) {
      visible = false;
      break;
    }
  }
  if (visible) return true;
  // East
  visible = true;
  for (let pCol = col + 1; pCol <= colMax; pCol++) {
    let pTree = forest[line][pCol];
    if (pTree >= tree) {
      visible = false;
      break;
    }
  }
  if (visible) return true;
  // West
  visible = true;
  for (let pCol = col - 1; pCol >= 0; pCol--) {
    let pTree: number = forest[line][pCol];
    if (pTree >= tree) {
      visible = false;
      break;
    }
  }
  if (visible) return true;
  return false;
};

const partOne = async (): Promise<string> => {
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

const calcScenicScore = async (line: number, col: number): Promise<number> => {
  let score: number[] = [];
  const treeHeight: number = forest[line][col];
  let pTreeCount: number = 0;
  // North
  for (let pLine = line - 1; pLine >= 0; pLine--) {
    pTreeCount +=1;
    if (forest[pLine][col] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // South
  pTreeCount = 0;
  for (let pLine = line + 1; pLine <= lineMax; pLine++) {
    pTreeCount +=1;
    if (forest[pLine][col] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // East
  pTreeCount = 0;
  for (let pCol = col + 1; pCol <= colMax; pCol++) {
    pTreeCount +=1;
    if (forest[line][pCol] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // West
  pTreeCount = 0;
  for (let pCol = col - 1; pCol >= 0; pCol--) {
    pTreeCount +=1;
    if (forest[line][pCol] >= treeHeight) break;
  }
  score.push(pTreeCount);
  // Calc score
  return score.reduce((prev, current) => {
    if( prev === 0 || current === 0) return prev + current;
    return prev * current;
  }, 0);
};

const partTwo = async (): Promise<string> => {
  let topScenicScore = 0;
  for (let line = 0; line <= lineMax; line++) { // lines
    for (let col = 0; col <= colMax; col++) { // colums
      let treeScenicScore: number = await calcScenicScore(line, col);
      if (topScenicScore <= treeScenicScore) topScenicScore = treeScenicScore;
    }
  }
  return `scenic score ${topScenicScore}`;
};

export const main = async () => {
  try {
    const input: string = await readFile('./public/day8_input.txt');
    await parseForest(input);
    colMax = forest[0].length - 1;
    lineMax = forest.length - 1;

    // forest.forEach(line => console.log(line.join('')));

    /* Part one */
    const message1 = await partOne();
    console.log(`Part One message ${message1}`);
    /* Part two */
    const message2 = await partTwo();
    console.log(`Part Two message ${message2}`);

  } catch (e) {
    console.log(e);
  }
};

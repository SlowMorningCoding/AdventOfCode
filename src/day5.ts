#!/usr/bin/env node
import { readFile } from './readFile.js';

type Stacks = { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [], '8': [], '9': [] };
type Move = { count: number, from: number, to: number };

const parseInput = async (input: string): Promise<{ stackTable: string[][], moves: Move[] }> => {
  let [stackBlock, movesBlock]: string[] = input.split(/(?:[\r]?\n){2}/);

  // Stacks
  let stackTable = stackBlock.split(/[\r]?\n/).map(s => s.split(''));
  // Pivot stackTable
  stackTable = stackTable.reduce((accumulator: string[][], current: string[]) => {
    for (let index = 0; index < current.length; index++) {
      if (accumulator[index] === undefined) {
        accumulator[index] = [];
      }
      accumulator[index].unshift(current[index]);
    }
    return accumulator;
  }, [[]]);
  // clean table
  stackTable = stackTable.filter(tLine => tLine[0] !== ' ').map(tLine => tLine.filter(str => str !== ' '));

  // Moves
  let moves = movesBlock.split(/[\r]?\n/)
    .map(str => {
      const regexp = /move (\d+) from (\d+) to (\d+)/g;
      let [full, count, from, to]: any = regexp.exec(str);
      return { count, from, to };
    });
  return { stackTable, moves }
};

const partOne = async (stackTable: string[][], moves: Move[]): Promise<string> => {
  let stackTable1 = stackTable.map(item => ([...item])); // clone stackTable
  moves.forEach(({ count, from, to }) => {
    for (let index = 0; index < Number(count); index++) {
      const crate: any = stackTable1[Number(from) - 1].pop();
      stackTable1[Number(to) - 1].push(crate);
    }
  });
  let message = stackTable1.map(stack => stack[stack.length - 1]).join('');
  return message;
};

const partTwo = async (stackTable: string[][], moves: Move[]): Promise<string> => {
  let stackTable1 = stackTable.map(item => ([...item])); // clone stackTable
  moves.forEach(({ count, from, to }) => {
    const stack = [];
    for (let index = 0; index < Number(count); index++) {
      const crate: any = stackTable1[Number(from) - 1].pop();
      stack.unshift(crate);
    }
    stackTable1[Number(to) - 1].push(...stack);
  });
  let message = stackTable1.map(stack => stack[stack.length - 1]).join('');
  return message;
};


export const main = async () => {
  try {
    const input: string = await readFile('./public/day5_input.txt');
    const { stackTable, moves } = await parseInput(input);
    console.table(stackTable);
    /* Part one */
    const message1 = await partOne(stackTable, moves);
    console.log(`Part One message ${message1}`);
    /* Part two */
    const message2 = await partTwo(stackTable, moves);
    console.log(`Part Two message ${message2}`);

  } catch (e) {
    console.log(e);
  }
};
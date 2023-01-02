#!/usr/bin/env node
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';

import { readFile } from './readFile.js';
import { day01 } from "./day01.js";

const main = async (argv: any) => {
  console.log('Start!');
  console.clear();
  console.log(figlet.textSync('Advent of Code!'));
  
  console.time('total');
  const spinner = createSpinner('Running an Quest...\n').start();

  if (argv[2] === 'day1') {
    const input = await readFile('./public/day01_input.txt');
    await day01(input);
  }
  console.log('\n');
  
  spinner.success({ text: `Quest done!` });
  console.timeEnd('total');
}

await main(process.argv);


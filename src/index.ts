#!/usr/bin/env node
import { readFile } from './readFile.js';
import { day01 } from "./day01.js";


const main = async (argv: any) => {
  console.log('Start!');

  if(argv[2] === 'day1'){
    const input = await readFile('./public/day01_input.txt');
    await day01(input);
  }

  console.log('End!');
}

await main(process.argv);


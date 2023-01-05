#!/usr/bin/env node
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';

import { main as day1 } from "./day1.js";
import { main as day2 } from "./day2.js";
import { main as day3 } from "./day3.js";
import { main as day4 } from "./day4.js";
import { main as day5 } from "./day5.js";
import { main as day6 } from "./day6.js";
import { main as day7 } from "./day7.js";
import { main as day8 } from "./day8.js";
import { main as day9 } from "./day9.js";
import { main as day10 } from "./day10.js";
import { main as day11 } from "./day11.js";

const main = async (argv: any) => { 
  console.log('Start!');
  console.clear();
  console.log(figlet.textSync('Advent of Code!'));
  
  console.time('total');
  const spinner = createSpinner('Running an Quest...\n').start();

  switch (argv[2]) {
    case 'day1': await day1(); break;
    case 'day2': await day2(); break;
    case 'day3': await day3(); break;
    case 'day4': await day4(); break;
    case 'day5': await day5(); break;
    case 'day6': await day6(); break;
    case 'day7': await day7(); break;
    case 'day8': await day8(); break;
    case 'day9': await day9(); break;
    case 'day10': await day10(); break;
    case 'day11': await day11(); break;
    
    default: throw new Error(`unknown parameter ${argv[2]}`);
  }

  console.log('\n');
  spinner.success({ text: `Quest done!` });
  console.timeEnd('total');
}

await main(process.argv);


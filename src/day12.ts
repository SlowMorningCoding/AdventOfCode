import figlet from 'figlet';
import { readFile } from './readFile.js';

type Position = { x: number, y: number, value: string, move: string };
const elevation = 'abcdefghijklmnopqrstuvwxyz';
const moves = ['>', 'v', '^', '<'];

async function main() {
  try {
    console.clear();
    console.log(figlet.textSync('Advent of Code - Day12'));
    console.time('total time');
    /* Parse input */
    const input: string = await readFile('./public/input_day12.txt');
    const map = await parseInput(input);

    /* Part one */
    //const p1Result = await partOne(map);
    //console.log(`Part One: ${p1Result}`);

    /* Part two */
    const p2Result = await partTwo(map);
    console.log(`Part Two: ${p2Result}`);

  } catch (e) {
    console.log(e);
  }
  console.timeEnd('total time');
};

async function parseInput(input: string): Promise<string[][]> {
  const data: string[][] = input.split(/\r?\n/).map((s) => s.split(''));
  return data;
};

async function partOne(map: string[][]): Promise<number> {
  const routeMap = [...map];
  // Start
  const start: Position = await findPosition('S', routeMap);
  start.value = 'a';
  // Finish
  const finish: Position = await findPosition('E', routeMap);
  finish.value = 'z';
  routeMap[finish.y][finish.x] = 'z';

  let routes: Position[][] = [[start]];
  let theRoute: Position[] | undefined = undefined;

  let stepCount = 0;
  while (theRoute === undefined && stepCount < 10_000) {
    stepCount += 1;
    const routesToFollow: Position[][] = [];

    for (const route of routes) {
      const position: Position | undefined = route.pop();
      if (position === undefined) throw new Error("undefined position");

      for (const move of moves) {
        const nextPosition = await tryToStepUp(move, position, routeMap);
        if (nextPosition !== undefined) {
          // Mark to map
          routeMap[nextPosition.y][nextPosition.x] = '.';
          // Create new route
          const newRoute: Position[] = [...route];
          const currentPosition = { x: position.x, y: position.y, value: position.value, move };
          newRoute.push(currentPosition)
          newRoute.push(nextPosition);
          routesToFollow.push(newRoute);
          // check finish
          if (nextPosition.x === finish.x && nextPosition.y === finish.y) {
            theRoute = newRoute;
            break;
          }
        }
      }

      if (theRoute !== undefined) break;
    }
    routes = [...routesToFollow];

    console.clear();
    printMap(routeMap);
    //console.table(routes.map(r => r.map(p => `${p.value}`).join('')));
    console.log(theRoute);
    console.log(stepCount);
    await sleep(50);
  }

  return 0;
};

async function tryToStepUp(move: string, position: Position, map: string[][]): Promise<Position | undefined> {
  const nextPosition: Position = { x: 0, y: 0, value: '', move: '' };
  switch (move) {
    case '>':
      nextPosition.x = position.x + 1;
      nextPosition.y = position.y;
      break;
    case '<':
      nextPosition.x = position.x - 1;
      nextPosition.y = position.y;
      break;
    case '^':
      nextPosition.x = position.x;
      nextPosition.y = position.y - 1;
      break;
    case 'v':
      nextPosition.x = position.x;
      nextPosition.y = position.y + 1;
      break;
    default: throw new Error("unknown move");
  }
  // test out of map
  if (nextPosition.x < 0 || nextPosition.y < 0 || nextPosition.x >= map[0].length || nextPosition.y >= map.length) return undefined;
  nextPosition.value = map[nextPosition.y][nextPosition.x];
  // test move hight
  if (elevation.indexOf(nextPosition.value) < 0 || elevation.indexOf(position.value) - elevation.indexOf(nextPosition.value) < -1) return undefined;
  return nextPosition;
}

async function tryToStepDown(move: string, position: Position, map: string[][]): Promise<Position | undefined> {
  const nextPosition: Position = { x: 0, y: 0, value: '', move: '' };
  switch (move) {
    case '>':
      nextPosition.x = position.x + 1;
      nextPosition.y = position.y;
      break;
    case '<':
      nextPosition.x = position.x - 1;
      nextPosition.y = position.y;
      break;
    case '^':
      nextPosition.x = position.x;
      nextPosition.y = position.y - 1;
      break;
    case 'v':
      nextPosition.x = position.x;
      nextPosition.y = position.y + 1;
      break;
    default: throw new Error("unknown move");
  }
  // test out of map
  if (nextPosition.x < 0 || nextPosition.y < 0 || nextPosition.x >= map[0].length || nextPosition.y >= map.length) return undefined;
  nextPosition.value = map[nextPosition.y][nextPosition.x];
  // test move low
  console.log(`${nextPosition.value} ${elevation.indexOf(nextPosition.value) < 0} : ${position.value} -> ${nextPosition.value} = ${elevation.indexOf(position.value) - elevation.indexOf(nextPosition.value)}`);
  if (elevation.indexOf(nextPosition.value) < 0 || elevation.indexOf(position.value) - elevation.indexOf(nextPosition.value) > 1) return undefined;
  console.log(`ok`);
  return nextPosition;
}

async function findPosition(mark: string, map: string[][]): Promise<Position> {
  let position: Position | undefined = undefined;
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf(mark);
    if (x >= 0) {
      position = { x, y, value: mark, move: 'S' };
      break;
    }
  };
  if (position === undefined) throw new Error(`Can't find position with mark ${mark}!`);
  return position;
};

function printMap(map: string[][]) {
  for (const line of map) {
    console.log(line.join(''))
  }
};

async function partTwo(map: string[][]): Promise<number> {
  const routeMap = [...map];
  // Start
  const start: Position = await findPosition('S', routeMap);
  start.value = 'a';
  routeMap[start.y][start.x] = 'a';
  // Finish
  const finish: Position = await findPosition('E', routeMap);
  finish.value = 'z';
  //routeMap[finish.y][finish.x] = 'E';

  let routes: Position[][] = [[finish]];
  let theRoute: Position[] | undefined = undefined;

  let stepCount = 0;
  while (theRoute === undefined && stepCount < 10_000 && routes.length) {
    stepCount += 1;
    const routesToFollow: Position[][] = [];

    for (const route of routes) {
      const position: Position | undefined = route.pop();
      if (position === undefined) throw new Error("undefined position");

      for (const move of moves) {
        const nextPosition = await tryToStepDown(move, position, routeMap);
        if (nextPosition !== undefined) {
          // Mark to map
          routeMap[nextPosition.y][nextPosition.x] = '.';
          // Create new route
          const newRoute: Position[] = [...route];
          const currentPosition = { x: position.x, y: position.y, value: position.value, move };
          newRoute.push(currentPosition)
          newRoute.push(nextPosition);
          routesToFollow.push(newRoute);
          // check finish
          if (nextPosition.value === 'a') {
            theRoute = newRoute;
            break;
          }
        }
      }

      if (theRoute !== undefined) break;
    }
    routes = [...routesToFollow];

    console.clear();
    printMap(routeMap);
    //console.table(routes.map(r => r.map(p => `${p.value}`).join('')));
    console.log(theRoute);
    console.log(stepCount);
    await sleep(50);
  }

  return 0;
};

async function sleep(ms: number = 100): Promise<any> {
  return new Promise((r) => setTimeout(r, ms));
}

await main();

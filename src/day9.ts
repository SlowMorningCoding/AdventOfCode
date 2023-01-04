#!/usr/bin/env node
import { readFile } from './readFile.js';

type Move = { direction: string, distance: number };
type Marker = { name: string, x: number, y: number };

const sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));

class Knot {
  public name: string;
  public x: number;
  public y: number;
  public positionHistory: string[];
  public speed = 1;
  public maxDistance = 1;

  public constructor(name: string) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.positionHistory = [];
    this.positionHistory.push([this.x, this.y].join(','));
  }

  public move(direction: string) {
    switch (direction) {
      case 'U': this.y += this.speed;
        break;
      case 'D': this.y -= this.speed;
        break;
      case 'R': this.x += this.speed;
        break;
      case 'L': this.x -= this.speed;
        break;
      default: throw new Error("Unknown direction!");
    }
    this.positionHistory.push([this.x, this.y].join(','));
  }

  public follow(px: number, py: number) {
    let xDirDist: number = px - this.x;
    let yDirDist: number = py - this.y;
    if (Math.abs(xDirDist) > this.maxDistance || Math.abs(yDirDist) > this.maxDistance) {
      // left right
      if (xDirDist < 0) this.x -= this.speed;
      else if (xDirDist > 0) this.x += this.speed;
      // up down
      if (yDirDist < 0) this.y -= this.speed;
      else if (yDirDist > 0) this.y += this.speed;
    }
    this.positionHistory.push([this.x, this.y].join(','));
  }

  public getMarker(name: string = ''): Marker {
    return { name: (name.length ? name : this.name), x: this.x, y: this.y }
  }
}

class RopeMap {
  public xMin: number;
  public xMax: number;
  public yMin: number;
  public yMax: number;
  public markers: Marker[];

  public constructor(xMin: number, yMax: number, xMax: number, yMin: number) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.markers = [];
  }

  public setMarkkers(markers: Marker[]) {
    markers.sort((a, b) => { return a.y === b.y ? a.x - b.x : a.y - b.y; });
    // Remove dublicate positions
    const newMarkkers = markers.filter((m, index, arr) => arr.findIndex(e => e.x === m.x && e.y === m.y) === index);
    this.markers = newMarkkers;
    newMarkkers.forEach(m => {
      if (m.x > this.xMax) this.xMax = m.x;
      if (m.x < this.xMin) this.xMin = m.x;
      if (m.y > this.yMax) this.yMax = m.y;
      if (m.y < this.yMin) this.yMin = m.y;
    });
  }

  public draw() {
    // console.clear()
    console.log(`(${this.xMin},${this.yMax} x ${this.xMax},${this.yMin})`)
    let py = this.yMax;
    while (py >= this.yMin) { // lines
      const lineMarkkers = this.markers.filter(m => m.y === py);
      let px = this.xMin;
      let lineStr = '';
      while (px <= this.xMax) {
        const pMark = lineMarkkers.find(m => m.x === px);
        if (pMark) lineStr += pMark.name;
        else if (px === 0) lineStr += '|';
        else if (py === 0) lineStr += '-';
        else lineStr += '.';
        px += 1;
      }
      console.log(lineStr);
      py -= 1;
    }
  }
}

const parseInput = async (input: string): Promise<Move[]> => {
  return input.split(/\r?\n/) // lines
    .map(line => {
      let [direction, sDistance] = line.split(' ');
      return { direction, distance: Number(sDistance) };
    })
};

const partOne = async (moves: Move[]): Promise<string> => {
  const head = new Knot("H");
  const tail = new Knot("T");
  const ropeMap = new RopeMap(0, 0, 0, 0);
  let stepCount = 0;
  const totalSteps = moves.reduce((acc, cur) => acc + cur.distance, 0)
  const tailMarkers: Marker[] = [];

  for (const move of moves) {
    let pDistance: number = move.distance;
    while (pDistance > 0) {
      stepCount += 1;
      head.move(move.direction);
      tail.follow(head.x, head.y);
      if (!tailMarkers.find((m) => m.x === tail.x && m.y === tail.y)) tailMarkers.push(tail.getMarker('#'));
      pDistance -= 1;

    }
  };

  ropeMap.setMarkkers([
    head.getMarker(),
    tail.getMarker(),
    ...tailMarkers
  ])
  ropeMap.draw();
  console.log('\n');
  /*
  console.clear()
  ropeMap.draw();
  console.log(`${stepCount}/${totalSteps} ${move.direction} H:${head.x},${head.y} T:${tail.x},${tail.y}`);
  await sleep();
  */

  const tailPositions: number = tail.positionHistory.reduce((acc: number, current: string, index: number, arr: string[]) => {
    if (arr.indexOf(current) === index) acc += 1;
    return acc;
  }, 0);

  return `Tail posisions ${tailPositions} of ${tail.positionHistory.length}`;
};

const partTwo = async (moves: Move[]): Promise<string> => {
  const head = new Knot("H");
  const tail1 = new Knot("1");
  const tail2 = new Knot("2");
  const tail3 = new Knot("3");
  const tail4 = new Knot("4");
  const tail5 = new Knot("5");
  const tail6 = new Knot("6");
  const tail7 = new Knot("7");
  const tail8 = new Knot("8");
  const tail9 = new Knot("9");
  const ropeMap = new RopeMap(0, 0, 0, 0);
  let stepCount = 0;
  const totalSteps = moves.reduce((acc, cur) => acc + cur.distance, 0)
  const tailMarkers: Marker[] = [];

  for (const move of moves) {
    let pDistance: number = move.distance;
    while (pDistance > 0) {
      stepCount += 1;
      head.move(move.direction);
      tail1.follow(head.x, head.y);
      tail2.follow(tail1.x, tail1.y);
      tail3.follow(tail2.x, tail2.y);
      tail4.follow(tail3.x, tail3.y);
      tail5.follow(tail4.x, tail4.y);
      tail6.follow(tail5.x, tail5.y);
      tail7.follow(tail6.x, tail6.y);
      tail8.follow(tail7.x, tail7.y);
      tail9.follow(tail8.x, tail8.y);
      if (!tailMarkers.find((m) => m.x === tail9.x && m.y === tail9.y)) tailMarkers.push(tail9.getMarker('#'));
      pDistance -= 1;
    }
  };

  ropeMap.setMarkkers([
    head.getMarker(),
    tail1.getMarker(),
    tail2.getMarker(),
    tail3.getMarker(),
    tail4.getMarker(),
    tail5.getMarker(),
    tail6.getMarker(),
    tail7.getMarker(),
    tail8.getMarker(),
    tail9.getMarker(),
    ...tailMarkers
  ])
  ropeMap.draw();
  console.log('\n');
  /*
  console.clear()
  ropeMap.draw();
  await sleep();
  */

  const tailPositions: number = tail9.positionHistory.reduce((acc: number, current: string, index: number, arr: string[]) => {
    if (arr.indexOf(current) === index) acc += 1;
    return acc;
  }, 0);
  return `Tail posisions ${tailPositions} of ${tail9.positionHistory.length}`;
};

export const main = async () => {
  try {
    /* Get input data */
    const input: string = await readFile('./public/day9_input.txt');
    const moves: Move[] = await parseInput(input);

    /* Part one */
    const result1 = await partOne(moves);
    console.log(`Part One: ${result1}`);

    /* Part two */
    const result2 = await partTwo(moves);
    console.log(`Part Two: ${result2}`);

  } catch (e) {
    console.log(e);
  }
};

#!/usr/bin/env node
import { readFile } from './readFile.js';

type Move = { direction: string, distance: number };

class Knot {
  public name: string;
  public x: number;
  public y: number;
  public moveHistory: string[];
  public speed = 1;
  public maxDistance = 1;

  public constructor(name: string) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.moveHistory = [];
  }

  public step(direction: string): number[] {
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
    const newPosition = [this.x, this.y];
    this.moveHistory.push(newPosition.join(','));
    return newPosition;
  }

  public follow(px: number, py: number) {
    // left right
    let xDirDist: number = px - this.x;
    if (Math.abs(xDirDist) > this.maxDistance) {
      if (xDirDist < 0) this.x -= this.speed;
      else this.x += this.speed;
    }
    // up down
    let yDirDist: number = py - this.y;
    if (Math.abs(yDirDist) > this.maxDistance) {
      if (yDirDist < 0) this.y -= this.speed;
      else this.y += this.speed;
    }
    const newPosition = [this.x, this.y];
    this.moveHistory.push(newPosition.join(','));
    return newPosition;
  }
}

const parseInput = async (input: string): Promise<Move[]> => {
  return input.split(/[\r]?\n/) // lines
    .map(line => {
      let [direction, sDistance] = line.split(' ');
      return { direction, distance: Number(sDistance) };
    })
};

const partOne = async (moves: Move[]): Promise<string> => {




  return `Todo`;
};

const partTwo = async (): Promise<string> => {
  return `Todo`;
};

export const main = async () => {
  try {
    /* Get input data */
    const input: string = await readFile('./public/day0_input.txt');
    const moves: Move[] = await parseInput(input);

    /* Part one */
    const result1 = await partOne(moves);
    console.log(`Part One: ${result1}`);

    /* Part two */
    const result2 = await partTwo();
    console.log(`Part Two: ${result2}`);

  } catch (e) {
    console.log(e);
  }
};

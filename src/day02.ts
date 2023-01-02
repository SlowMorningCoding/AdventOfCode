#!/usr/bin/env node
type Action = { opponent: string, respose: string };

const parseInput = async (input: string): Promise<Action[]> => {
  const lines: string[] = input.split(/[\r]?\n/);

  const strategy: Action[] = lines.map((line) => {
    const [opponent, respose]: string[] = line.split(' ');
    return { opponent, respose };
  });
  return strategy;
};


export const day02 = async (input: string) => {
  try {
    const strategy = await parseInput(input);

    console.table(strategy);

  } catch (e) {
    console.log(e);
  }
};

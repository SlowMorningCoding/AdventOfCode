#!/usr/bin/env node
import { readFile } from './readFile.js';

type File = { type: string, path: string, size: number };
const fileSystem: File[] = [{ type: 'dir', path: ' ', size: 0 }];
let position: string[] = [' '];

const scanFiles = async (input: string) => {
  const commands: string[] = input.split(/\$/).map(s => s.trim());
  commands.filter(s => s).forEach(command => {
    // Commands: cd, ls
    if (command.match(/^cd/g)) {
      const path = command.slice(3);
      if (path === "/") position = [' '];
      else if (path === "..") position.pop();
      else if (path.match(/[a-zA-Z\d]./g)) position.push(path);
      else throw new Error(`unknown path: "${path}"`);
    }
    else if (command.match(/^ls/g)) {
      const lines: string[] = command.split(/[\r]?\n/);
      lines.shift();
      const files: File[] = lines.map(s => {
        const file = s.split(' ');
        if (file[0] === 'dir') {
          return { type: 'dir', path: [...position, file[1]].join('/'), size: 0 };
        }
        return { type: 'file', path: [...position, file[1]].join('/'), size: Number(file[0]) };
      });
      // add files to filesystem
      files.forEach(file => {
        fileSystem.push(file);
        if (file.type === 'file') {
          // Add size to dir and subdirs
          const filePath = file.path.split('/');
          while (filePath.length > 1) {
            filePath.pop();
            let fileIndex = fileSystem.findIndex(f => f.type === 'dir' && f.path === filePath.join('/'));
            if (fileIndex >= 0) fileSystem[fileIndex].size += file.size;
            else console.log('fileIndex', fileIndex, filePath.join('/'));
          }
        }
      });
    }
    else throw new Error(`unknown command: "${command}"`);
  });
}

const partOne = async (): Promise<string> => {
  const fsSearch: File[] = fileSystem.filter(file => file.type==='dir' && file.size <= 100000);
  console.table(fsSearch);
  return `${fsSearch.reduce((accumulator, current: File) => accumulator + current.size, 0)}`;
};

const partTwo = async (): Promise<string> => {
  return ``;
};


export const main = async () => {
  try {
    const input: string = await readFile('./public/day7_input.txt');
    await scanFiles(input);
    console.table(fileSystem);
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

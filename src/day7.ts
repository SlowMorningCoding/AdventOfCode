import { readFile } from './readFile.js';

type File = { type: string, path: string, size: number };
const fileSystem: File[] = [{ type: 'dir', path: ' ', size: 0 }];
let position: string[] = [' '];

const cdCommand = async (command: string) => {
  const path = command.slice(3);
  if (path === "/") position = [' '];
  else if (path === "..") position.pop();
  else if (path.match(/[a-zA-Z\d]./g)) position.push(path);
  else throw new Error(`unknown path: "${path}"`);
}
const lsCommand = async (command: string) => {
  const lines: string[] = command.split(/\r?\n/);
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

const scanFiles = async (input: string) => {
  const commands: string[] = input.split(/\$/)
    .map(s => s.trim())
    .filter(s => s);
  // Commands: cd, ls
  for (const command of commands) {
    if (command.match(/^cd/g)) {
      await cdCommand(command);
    }
    else if (command.match(/^ls/g)) {
      await lsCommand(command);
    }
    else throw new Error(`unknown command: "${command}"`);
  }
}

const partOne = async (): Promise<string> => {
  const fsSearch: File[] = fileSystem.filter(file => file.type === 'dir' && file.size <= 100000);
  console.table(fsSearch);
  return `${fsSearch.reduce((accumulator, current: File) => accumulator + current.size, 0)}`;
};

const partTwo = async (): Promise<string> => {
  const totalSpace: number = 70000000;
  const spaceNeed: number = 30000000
  let unusedSpace: number = -1;
  // get dirs
  const fsSearch: File[] = fileSystem.filter(file => file.type === 'dir')
    .sort((a: File, b: File) => a.size - b.size);
  // calculate unused space
  const root: File = fsSearch.find(f => f.path === ' ') ?? { type: '', path: ' ', size: 0 };
  unusedSpace = totalSpace - root.size;
  // find dir to delete
  const dirToDelete: File = fsSearch.find(f => f.size > spaceNeed - unusedSpace) ?? { type: '', path: 'none', size: 0 };

  return `${dirToDelete.type} ${dirToDelete.path} ${dirToDelete.size}`;
};

export const main = async () => {
  try {
    /* Parse input */
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

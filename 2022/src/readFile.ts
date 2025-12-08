import * as fs from 'fs';

export const readFile = async (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent;
}

import { readFile } from './readFile.js';

type Action = { opponent: string, response: string, score: number };

const winTable: string[] = ['👊', '✋', '✌️', '👊'];

const calculateScore = (opponent: string, response: string): number => {
  /* The total score of round is the score for the shape you selected (Rock: 1p, Paper: 2p, Scissors: 3p)
   plus outcome of the round (you lost: 0p, draw: 3p, won: 6p)
   */
  let score = 0;
  // shape score
  switch (response) {
    case '👊': score += 1; break;
    case '✋': score += 2; break;
    case '✌️': score += 3; break;
  }
  // outcome score
  const winningShape = winTable[winTable.indexOf(opponent) + 1];
  // Draw 
  if (opponent === response) score += 3;
  // Win
  if (response === winningShape) score += 6;
  // Lose 0p
  return score;
}

const partOne = async (input: string): Promise<Action[]> => {
  const lines: string[] = input.split(/\r?\n/);
  const strategy: Action[] = lines.map((line) => {
    let [opponent, response]: string[] = line.split(' ');
    // opponent play: A for Rock, B for Paper, and C for Scissors.
    switch (opponent) {
      case 'A':
        opponent = '👊'; // js: \uD83D\uDC4A html: &#x1F44A;
        break;
      case 'B':
        opponent = '✋'; // js: \u270B html: &#x270B;;
        break;
      case 'C':
        opponent = '✌️'; // js: \u270C\uFE0F html: &#x270C;&#xFE0F;
        break;
      default:
        throw new Error(`Unknown opponent character "${opponent}"`);
    }
    // response play: X for Rock, Y for Paper, and Z for Scissors.
    switch (response) {
      case 'X':
        response = '👊'; // js: \uD83D\uDC4A html: &#x1F44A;
        break;
      case 'Y':
        response = '✋'; // js: \u270B html: &#x270B;;
        break;
      case 'Z':
        response = '✌️'; // js: \u270C\uFE0F html: &#x270C;&#xFE0F;
        break;
      default:
        throw new Error(`Unknown response character "${response}"`);
    }
    const score = calculateScore(opponent, response);
    return { opponent, response, score };
  });
  return strategy;
};

const partTwo = async (input: string): Promise<Action[]> => {
  const lines: string[] = input.split(/\r?\n/);
  const strategy: Action[] = lines.map((line) => {
    let [opponent, response]: string[] = line.split(' ');
    // opponent play: A for Rock, B for Paper, and C for Scissors.
    switch (opponent) {
      case 'A': opponent = '👊'; // js: \uD83D\uDC4A html: &#x1F44A;
        break;
      case 'B': opponent = '✋'; // js: \u270B html: &#x270B;;
        break;
      case 'C': opponent = '✌️'; // js: \u270C\uFE0F html: &#x270C;&#xFE0F;
        break;
      default: throw new Error(`Unknown opponent character "${opponent}"`);
    }
    // response play: X lose, Y draw, Z win
    switch (response) {
      case 'X': response = winTable[winTable.indexOf(opponent, 1) - 1];
        break;
      case 'Y': response = opponent;
        break;
      case 'Z': response = winTable[winTable.indexOf(opponent) + 1];
        break;
      default:
        throw new Error(`Unknown response character "${response}"`);
    }
    const score = calculateScore(opponent, response);
    return { opponent, response, score };
  });
  return strategy;
};

export const main = async () => {
  try {
    /* Parse input */
    const input: string = await readFile('./public/day2_input.txt');
    
    /* Part one */
    let scoreTable1: Action[] = await partOne(input);
    scoreTable1.push({ opponent: '', response: '', score: scoreTable1.reduce((accumulator, current: Action) => accumulator + current.score, 0) });
    console.table(scoreTable1);

    /* Part two */
    let scoreTable2: Action[] = await partTwo(input);
    scoreTable2.push({ opponent: '', response: '', score: scoreTable2.reduce((accumulator, current: Action) => accumulator + current.score, 0) });
    console.table(scoreTable2);

  } catch (e) {
    console.log(e);
  }
};

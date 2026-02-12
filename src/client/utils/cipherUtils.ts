export type PuzzleType = 'shift' | 'number' | 'reverse';

export interface Puzzle {
  type: PuzzleType;
  example: { input: string, output: string };
  question: string;
  answer: string;
  explanation: string;
}

const WORDS = ["APPLE", "TIGER", "EARTH", "SPACE", "WATER", "MUSIC", "PEACE", "SMILE", "LIGHT", "DREAM", "GAMES", "WORLD", "NEPAL", "DELHI", "PARIS", "TOKYO", "BRAIN", "LOGIC", "POWER", "SMART"];

export const generatePuzzle = (): Puzzle => {
  const type = Math.random() > 0.6 ? 'number' : Math.random() > 0.5 ? 'shift' : 'reverse';
  const word1 = WORDS[Math.floor(Math.random() * WORDS.length)];
  let word2 = WORDS[Math.floor(Math.random() * WORDS.length)];
  while (word1 === word2) {
    word2 = WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  switch (type) {
    case 'number':
      return generateNumberPuzzle(word1, word2);
    case 'shift':
      return generateShiftPuzzle(word1, word2);
    case 'reverse':
      return generateReversePuzzle(word1, word2);
    default:
      return generateShiftPuzzle(word1, word2);
  }
};

const generateShiftPuzzle = (w1: string, w2: string): Puzzle => {
  const shift = Math.floor(Math.random() * 5) + 1; // 1 to 5
  // Randomly deciding direction: + or -
  const direction = Math.random() > 0.5 ? 1 : -1;
  const actualShift = shift * direction;

  const transform = (word: string) => word.split('').map(c => {
    const code = c.charCodeAt(0);
    // A=65, Z=90
    let newCode = code + actualShift;
    if (newCode > 90) newCode = 65 + (newCode - 91);
    if (newCode < 65) newCode = 90 - (64 - newCode);
    return String.fromCharCode(newCode);
  }).join('');

  return {
    type: 'shift',
    example: { input: w1, output: transform(w1) },
    question: w2,
    answer: transform(w2),
    explanation: `Each letter is shifted ${actualShift > 0 ? 'forward' : 'backward'} by ${shift}.`
  };
};

const generateNumberPuzzle = (w1: string, w2: string): Puzzle => {
  // Simple A=1, B=2 schema for now. Could add variations later.
  const transform = (word: string) => word.split('').map(c => c.charCodeAt(0) - 64).join('-');

  return {
    type: 'number',
    example: { input: w1, output: transform(w1) },
    question: w2,
    answer: transform(w2), // e.g. "14-5-16-1-12"
    explanation: "Each letter is replaced by its position in the alphabet (A=1, B=2...)."
  };
};

const generateReversePuzzle = (w1: string, w2: string): Puzzle => {
   const transform = (word: string) => word.split('').reverse().join('');
    return {
    type: 'reverse',
    example: { input: w1, output: transform(w1) },
    question: w2,
    answer: transform(w2),
    explanation: "The word is simply reversed."
  };
};

export type PuzzleType = 'shift' | 'number' | 'reverse';

export interface Puzzle {
  type: PuzzleType;
  example: { input: string, output: string };
  question: string;
  answer: string;
  explanation: string;
}

const WORDS = ["APPLE", "TIGER", "EARTH", "SPACE", "WATER", "MUSIC", "PEACE", "SMILE", "LIGHT", "DREAM", "GAMES", "WORLD", "NEPAL", "DELHI", "PARIS", "TOKYO", "BRAIN", "LOGIC", "POWER", "SMART"];

// Linear Congruential Generator for seeded random numbers
class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns a pseudo-random number between 0 and 1
  next(): number {
    const a = 1664525;
    const c = 1013904223;
    const m = 4294967296; // 2^32
    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }
}

// Global RNG instance
let rng: SeededRNG | null = null;

// Helper to get random number using either seeded RNG or Math.random
const getRandom = (): number => {
  return rng ? rng.next() : Math.random();
};

export const getDailySeed = (): number => {
  const dateStr = getTodayString().replace(/-/g, '');
  return parseInt(dateStr, 10);
};

export const getTodayString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const generatePuzzle = (seed?: number): Puzzle => {
  if (seed !== undefined) {
    rng = new SeededRNG(seed);
  } else {
    rng = null; 
  }

  const typeProb = getRandom();
  const type = typeProb > 0.6 ? 'number' : typeProb > 0.3 ? 'shift' : 'reverse';
  
  const w1Index = Math.floor(getRandom() * WORDS.length);
  const word1 = WORDS[w1Index] || "APPLE";
  
  let w2Index = Math.floor(getRandom() * WORDS.length);
  // Ensure distinct words
  while (w1Index === w2Index) {
    w2Index = Math.floor(getRandom() * WORDS.length);
  }
  const word2 = WORDS[w2Index] || "BRAIN";

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
  const shift = Math.floor(getRandom() * 5) + 1; // 1 to 5
  // Randomly deciding direction: + or -
  const direction = getRandom() > 0.5 ? 1 : -1;
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

export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

export type DailyStatusResponse = {
  isSolved: boolean;
  username: string | null;
  avatarUrl: string | null;
};

export type CompleteDailyResponse = {
  success: boolean;
  streak: number; 
};

export type PuzzleData = {
  puzzleType: 'shift' | 'number' | 'reverse';
  exampleInput: string;
  exampleOutput: string;
  question: string;
  answer: string;
  explanation: string;
  author: string;
};

export type CreatePostResponse = {
  success: boolean;
  postId?: string;
  url?: string;
  message?: string;
};

export type GetPuzzleResponse = {
  found: boolean;
  puzzle?: PuzzleData;
};

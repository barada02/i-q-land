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

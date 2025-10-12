// Shared constants for mobile and web

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export const POINTS = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

export const CATEGORIES = [
  'arrays',
  'strings',
  'linked-lists',
  'trees',
  'graphs',
  'dynamic-programming',
  'sorting',
  'searching',
  'recursion',
  'hash-tables',
  'two-pointers',
  'sliding-window',
  'binary-search',
  'backtracking',
  'greedy',
] as const;
export type Category = typeof CATEGORIES[number];

export const LANGUAGES = {
  python: 'Python',
  javascript: 'JavaScript',
} as const;

export const STATUS_TYPES = ['not_started', 'attempted', 'solved'] as const;
export type StatusType = typeof STATUS_TYPES[number];

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  github_username?: string;
  current_streak: number;
  longest_streak: number;
  total_challenges_solved: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  starter_code_python?: string;
  starter_code_javascript?: string;
  test_cases: TestCase[];
  hints?: Hint[];
  solution_explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  tags?: string[];
  points: number;
  order_index?: number;
  created_at: string;
}

export interface TestCase {
  input: string;
  expected: string;
  explanation?: string;
}

export interface Hint {
  text: string;
  video_url?: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'not_started' | 'attempted' | 'solved';
  code?: string;
  language?: 'python' | 'javascript';
  attempts: number;
  time_spent?: number;
  solved_at?: string;
  created_at: string;
  updated_at: string;
  challenge?: Challenge;
}

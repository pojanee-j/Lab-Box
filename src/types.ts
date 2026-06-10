export type QuestionType = 'fill_blank' | 'multiple_choice' | 'order_steps' | 'choose_command' | 'debug_code';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  questionText: string;
  codeSnippet?: string; // Opt code context
  choices?: string[];   // For multiple_choice, choose_command, etc.
  correctAnswer?: string; // For MCQ, fill_blank
  correctOrder?: string[]; // For order_steps (lines of code to re-arrange)
  hint: string;
  explanation: string;
  points: number;
}

export interface PlayerAnswer {
  questionId: string;
  questionText: string;
  type: QuestionType;
  topic: string;
  isCorrect: boolean;
  scoreEarned: number;
  timeSpent: number; // in seconds
  usedHint: boolean;
  userAnswer: string; // Serialized actual answer
}

export interface TopicStat {
  topic: string;
  correct: number;
  total: number;
}

export interface GameSession {
  id?: string;
  uid: string;
  displayName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalScore: number;
  maxScore: number;
  percentage: number;
  topicStats: Record<string, { correct: number; total: number }>;
  startedAt: string; // ISO string
  completedAt: string; // ISO string
  answers: PlayerAnswer[];
}

export interface LeaderboardUser {
  uid: string;
  displayName: string;
  highestScore: number;
  totalGames: number;
  lastPlayedAt: string; // ISO string
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
}

export type AppState = 'auth' | 'dashboard' | 'setup' | 'play' | 'summary' | 'history' | 'leaderboard';

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  role: 'admin' | 'teacher' | 'student';
  gradeLevel: number;
  totalXp: number;
  streakDays: number;
}

export interface Subject {
  id: number;
  code: 'MATH' | 'VIETNAMESE' | 'ENGLISH' | 'SCIENCE';
  name: string;
  icon: string;
  colorTheme: 'blue' | 'red' | 'amber' | 'emerald';
  description: string;
}

export interface Game {
  id: number;
  lessonId: number;
  typeCode: 'SPEED_RACE' | 'BALANCE_SCALE' | 'PIZZA_FRACTION' | 'WORD_MATCH';
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  maxScore: number;
  timeLimit: number;
}

export interface Lesson {
  id: number;
  chapterId: number;
  lessonNumber: number;
  title: string;
  summary: string;
  games: Game[];
}

export interface Chapter {
  id: number;
  subjectId: number;
  gradeLevel: number;
  publisher: string;
  title: string;
  lessons: Lesson[];
}

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
  content: string;
  options: QuestionOption[];
}

export interface GameSession {
  sessionId: string;
  game: Game;
  questions: Question[];
}

export interface AnswerResult {
  isCorrect: boolean;
  correctOptionId: number;
  explanation: string;
  currentScore?: number;
  correctCount?: number;
}

export interface Badge {
  userId: string;
  badgeCode: string;
  name: string;
  icon: string;
  desc: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  fullName: string;
  avatarUrl: string;
  gradeLevel: number;
  totalXp: number;
  streakDays: number;
}

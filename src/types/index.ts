// ===== USER TYPES =====
export type ExamGroup = 'I' | 'II' | 'III' | 'IV' | 'V';
export type SubGroup = 'RK' | 'RI' | 'DT' | 'TC' | null;
export type AppLanguage = 'az' | 'ru';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  examGroup: ExamGroup;
  subGroup: SubGroup;
  targetUniversity?: string;
  targetScore?: number;
  language: AppLanguage;
  isPremium: boolean;
  createdAt: string;
}

// ===== SUBJECT / EXAM TYPES =====
export interface Subject {
  id: string;
  name: string;
  nameAz: string;
  icon: string;
  color: string;
  groups: ExamGroup[];
  maxScore: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  nameAz: string;
  order: number;
  grade: number; // 6-11 sinif
}

// ===== QUESTION TYPES =====
export type QuestionType = 'closed' | 'open' | 'written';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  options: QuestionOption[];
  explanation?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  points: number;
}

// ===== TEST / EXAM TYPES =====
export type TestType = 'topic' | 'block' | 'daily';

export interface Test {
  id: string;
  type: TestType;
  title: string;
  subjectId?: string;
  topicId?: string;
  examGroup?: ExamGroup;
  questions: Question[];
  duration: number; // seconds
  createdAt: string;
}

export interface TestAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  answers: TestAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalTime: number;
  completedAt: string;
}

// ===== GAMIFICATION TYPES =====
export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalTestsCompleted: number;
  totalStudyTimeMinutes: number;
  dailyGoalCompleted: boolean;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  nameAz: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: number;
  type: 'streak' | 'questions' | 'tests' | 'score' | 'time' | 'special';
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  xp: number;
  level: number;
  rank: number;
  examGroup: ExamGroup;
  streak: number;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'allTime';

export interface DailyGoal {
  questionsTarget: number;
  questionsCompleted: number;
  xpTarget: number;
  xpEarned: number;
  testsTarget: number;
  testsCompleted: number;
}

// ===== LEAGUE TYPES =====
export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'ruby';

export interface League {
  tier: LeagueTier;
  name: string;
  nameAz: string;
  minXPPerWeek: number;
  color: string;
  icon: string;
}

// ===== LEVEL TYPES =====
export interface LevelInfo {
  level: number;
  name: string;
  nameAz: string;
  minXP: number;
  maxXP: number;
}

// ===== NAVIGATION TYPES =====
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  GroupSelection: undefined;
  SubjectList: undefined;
  TopicList: { subjectId: string };
  TestScreen: { testId: string };
  TestResult: { resultId: string };
  Leaderboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Premium: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Subjects: undefined;
  Stats: undefined;
  LeaderboardTab: undefined;
  ProfileTab: undefined;
};

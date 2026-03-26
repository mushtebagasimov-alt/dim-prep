import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  ExamGroup,
  SubGroup,
  UserStats,
  TestResult,
  DailyGoal,
  LeaderboardEntry,
  LeaderboardPeriod,
  Badge,
} from '../types';
import { BADGES, XP_REWARDS, getLevelForXP } from '../constants/gamification';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Stats
  stats: UserStats;
  dailyGoal: DailyGoal;

  // Test Results
  testResults: TestResult[];

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  leaderboardPeriod: LeaderboardPeriod;

  // Actions - Auth
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, examGroup: ExamGroup, subGroup: SubGroup) => Promise<boolean>;
  logout: () => void;
  setExamGroup: (group: ExamGroup) => void;
  loadUser: () => Promise<void>;

  // Actions - Stats
  addXP: (amount: number) => void;
  updateStreak: () => void;
  incrementQuestionsAnswered: (correct: boolean) => void;
  completeTest: () => void;
  addStudyTime: (minutes: number) => void;
  checkAndUnlockBadges: () => void;
  resetDailyGoal: () => void;

  // Actions - Test Results
  addTestResult: (result: TestResult) => void;

  // Actions - Leaderboard
  setLeaderboardPeriod: (period: LeaderboardPeriod) => void;
  loadLeaderboard: () => void;
}

const DEFAULT_STATS: UserStats = {
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  totalTestsCompleted: 0,
  totalStudyTimeMinutes: 0,
  dailyGoalCompleted: false,
  badges: [...BADGES],
};

const DEFAULT_DAILY_GOAL: DailyGoal = {
  questionsTarget: 20,
  questionsCompleted: 0,
  xpTarget: 100,
  xpEarned: 0,
  testsTarget: 2,
  testsCompleted: 0,
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: '1', userName: 'Əli Həsənov', xp: 2500, level: 7, rank: 1, examGroup: 'I', streak: 15 },
  { userId: '2', userName: 'Aynur Məmmədova', xp: 2200, level: 6, rank: 2, examGroup: 'I', streak: 12 },
  { userId: '3', userName: 'Tural İsmayılov', xp: 2100, level: 6, rank: 3, examGroup: 'II', streak: 20 },
  { userId: '4', userName: 'Günel Əliyeva', xp: 1900, level: 5, rank: 4, examGroup: 'III', streak: 8 },
  { userId: '5', userName: 'Rəşad Quliyev', xp: 1800, level: 5, rank: 5, examGroup: 'I', streak: 10 },
  { userId: '6', userName: 'Nigar Hüseynova', xp: 1600, level: 5, rank: 6, examGroup: 'IV', streak: 7 },
  { userId: '7', userName: 'Kamran Nəsirov', xp: 1500, level: 5, rank: 7, examGroup: 'II', streak: 14 },
  { userId: '8', userName: 'Leyla Babayeva', xp: 1400, level: 4, rank: 8, examGroup: 'III', streak: 5 },
  { userId: '9', userName: 'Orxan Səfərov', xp: 1300, level: 4, rank: 9, examGroup: 'I', streak: 9 },
  { userId: '10', userName: 'Səbinə Rzayeva', xp: 1200, level: 4, rank: 10, examGroup: 'IV', streak: 6 },
];

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  stats: { ...DEFAULT_STATS },
  dailyGoal: { ...DEFAULT_DAILY_GOAL },
  testResults: [],
  leaderboard: MOCK_LEADERBOARD,
  leaderboardPeriod: 'weekly',

  // Auth Actions
  login: async (email: string, _password: string) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData) as User;
        if (user.email === email) {
          set({ user, isAuthenticated: true });
          // Load stats
          const statsData = await AsyncStorage.getItem('stats');
          if (statsData) {
            set({ stats: JSON.parse(statsData) });
          }
          const resultsData = await AsyncStorage.getItem('testResults');
          if (resultsData) {
            set({ testResults: JSON.parse(resultsData) });
          }
          return true;
        }
      }
      // For MVP, create user on login if not exists
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        examGroup: 'I',
        subGroup: null,
        language: 'az',
        isPremium: false,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      set({ user: newUser, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },

  register: async (name: string, email: string, _password: string, examGroup: ExamGroup, subGroup: SubGroup) => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        examGroup,
        subGroup,
        language: 'az',
        isPremium: false,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('stats', JSON.stringify(DEFAULT_STATS));
      set({ user: newUser, isAuthenticated: true, stats: { ...DEFAULT_STATS } });
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, stats: { ...DEFAULT_STATS } });
  },

  setExamGroup: (group: ExamGroup) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, examGroup: group };
      set({ user: updatedUser });
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  loadUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData) as User;
        const statsData = await AsyncStorage.getItem('stats');
        const stats = statsData ? JSON.parse(statsData) : DEFAULT_STATS;
        const resultsData = await AsyncStorage.getItem('testResults');
        const testResults = resultsData ? JSON.parse(resultsData) : [];
        set({ user, isAuthenticated: true, stats, testResults, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  // Stats Actions
  addXP: (amount: number) => {
    const { stats, dailyGoal } = get();
    const newXP = stats.totalXP + amount;
    const newLevel = getLevelForXP(newXP).level;
    const newDailyGoal = {
      ...dailyGoal,
      xpEarned: dailyGoal.xpEarned + amount,
    };
    const updatedStats = {
      ...stats,
      totalXP: newXP,
      level: newLevel,
    };
    set({ stats: updatedStats, dailyGoal: newDailyGoal });
    AsyncStorage.setItem('stats', JSON.stringify(updatedStats));
  },

  updateStreak: () => {
    const { stats } = get();
    const today = new Date().toISOString().split('T')[0];
    const lastStudy = stats.lastStudyDate;

    let newStreak = stats.currentStreak;
    if (!lastStudy) {
      newStreak = 1;
    } else if (lastStudy === today) {
      return; // already studied today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastStudy === yesterday) {
        newStreak = stats.currentStreak + 1;
      } else {
        newStreak = 1; // streak broken
      }
    }

    const updatedStats = {
      ...stats,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, stats.longestStreak),
      lastStudyDate: today,
    };
    set({ stats: updatedStats });
    AsyncStorage.setItem('stats', JSON.stringify(updatedStats));

    // Streak bonus XP
    if (newStreak > 1) {
      get().addXP(XP_REWARDS.streakBonus * newStreak);
    }
  },

  incrementQuestionsAnswered: (correct: boolean) => {
    const { stats, dailyGoal } = get();
    const updatedStats = {
      ...stats,
      totalQuestionsAnswered: stats.totalQuestionsAnswered + 1,
      totalCorrectAnswers: correct ? stats.totalCorrectAnswers + 1 : stats.totalCorrectAnswers,
    };
    const newDailyGoal = {
      ...dailyGoal,
      questionsCompleted: dailyGoal.questionsCompleted + 1,
    };
    set({ stats: updatedStats, dailyGoal: newDailyGoal });
    AsyncStorage.setItem('stats', JSON.stringify(updatedStats));

    if (correct) {
      get().addXP(XP_REWARDS.correctAnswer);
    }
  },

  completeTest: () => {
    const { stats, dailyGoal } = get();
    const updatedStats = {
      ...stats,
      totalTestsCompleted: stats.totalTestsCompleted + 1,
    };
    const newDailyGoal = {
      ...dailyGoal,
      testsCompleted: dailyGoal.testsCompleted + 1,
    };
    set({ stats: updatedStats, dailyGoal: newDailyGoal });
    AsyncStorage.setItem('stats', JSON.stringify(updatedStats));
    get().addXP(XP_REWARDS.testCompleted);
  },

  addStudyTime: (minutes: number) => {
    const { stats } = get();
    const updatedStats = {
      ...stats,
      totalStudyTimeMinutes: stats.totalStudyTimeMinutes + minutes,
    };
    set({ stats: updatedStats });
    AsyncStorage.setItem('stats', JSON.stringify(updatedStats));
  },

  checkAndUnlockBadges: () => {
    const { stats } = get();
    const updatedBadges: Badge[] = stats.badges.map((badge) => {
      if (badge.unlockedAt) return badge;

      let unlocked = false;
      switch (badge.type) {
        case 'streak':
          unlocked = stats.currentStreak >= badge.requirement;
          break;
        case 'questions':
          unlocked = stats.totalQuestionsAnswered >= badge.requirement;
          break;
        case 'tests':
          unlocked = stats.totalTestsCompleted >= badge.requirement;
          break;
        case 'time':
          unlocked = stats.totalStudyTimeMinutes >= badge.requirement;
          break;
      }

      if (unlocked) {
        return { ...badge, unlockedAt: new Date().toISOString() };
      }
      return badge;
    });

    const updatedStats = { ...stats, badges: updatedBadges };
    set({ stats: updatedStats });
    AsyncStorage.setItem('stats', JSON.stringify(updatedStats));
  },

  resetDailyGoal: () => {
    set({ dailyGoal: { ...DEFAULT_DAILY_GOAL } });
  },

  // Test Results
  addTestResult: (result: TestResult) => {
    const { testResults } = get();
    const updated = [result, ...testResults];
    set({ testResults: updated });
    AsyncStorage.setItem('testResults', JSON.stringify(updated));

    get().completeTest();
    get().updateStreak();
    get().checkAndUnlockBadges();

    // Perfect test bonus
    if (result.percentage === 100) {
      get().addXP(XP_REWARDS.perfectTest);
    }
  },

  // Leaderboard
  setLeaderboardPeriod: (period: LeaderboardPeriod) => {
    set({ leaderboardPeriod: period });
  },

  loadLeaderboard: () => {
    // In MVP, use mock data. In production, this would be an API call.
    set({ leaderboard: MOCK_LEADERBOARD });
  },
}));

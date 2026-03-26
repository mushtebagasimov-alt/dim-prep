import { Badge, LevelInfo, League, LeagueTier } from '../types';

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Beginner', nameAz: 'Başlanğıc', minXP: 0, maxXP: 100 },
  { level: 2, name: 'Learner', nameAz: 'Öyrənən', minXP: 100, maxXP: 300 },
  { level: 3, name: 'Student', nameAz: 'Tələbə', minXP: 300, maxXP: 600 },
  { level: 4, name: 'Scholar', nameAz: 'Alim', minXP: 600, maxXP: 1000 },
  { level: 5, name: 'Advanced', nameAz: 'İrəliləyən', minXP: 1000, maxXP: 1500 },
  { level: 6, name: 'Expert', nameAz: 'Ekspert', minXP: 1500, maxXP: 2200 },
  { level: 7, name: 'Master', nameAz: 'Usta', minXP: 2200, maxXP: 3000 },
  { level: 8, name: 'Grandmaster', nameAz: 'Böyük Usta', minXP: 3000, maxXP: 4000 },
  { level: 9, name: 'Legend', nameAz: 'Əfsanə', minXP: 4000, maxXP: 5500 },
  { level: 10, name: 'Champion', nameAz: 'Çempion', minXP: 5500, maxXP: Infinity },
];

export const LEAGUES: League[] = [
  { tier: 'bronze', name: 'Bronze League', nameAz: 'Bürünc Liqa', minXPPerWeek: 0, color: '#CD7F32', icon: 'shield' },
  { tier: 'silver', name: 'Silver League', nameAz: 'Gümüş Liqa', minXPPerWeek: 100, color: '#C0C0C0', icon: 'shield' },
  { tier: 'gold', name: 'Gold League', nameAz: 'Qızıl Liqa', minXPPerWeek: 300, color: '#FFD700', icon: 'shield' },
  { tier: 'diamond', name: 'Diamond League', nameAz: 'Almaz Liqa', minXPPerWeek: 600, color: '#B9F2FF', icon: 'diamond' },
  { tier: 'ruby', name: 'Ruby League', nameAz: 'Rubin Liqa', minXPPerWeek: 1000, color: '#E0115F', icon: 'diamond' },
];

export const BADGES: Badge[] = [
  { id: 'streak_3', name: '3-Day Streak', nameAz: '3 Günlük Seriya', description: '3 gün ardıcıl öyrən', icon: 'flame', unlockedAt: null, requirement: 3, type: 'streak' },
  { id: 'streak_7', name: 'Week Warrior', nameAz: 'Həftə Döyüşçüsü', description: '7 gün ardıcıl öyrən', icon: 'flame', unlockedAt: null, requirement: 7, type: 'streak' },
  { id: 'streak_30', name: 'Monthly Master', nameAz: 'Aylıq Usta', description: '30 gün ardıcıl öyrən', icon: 'flame', unlockedAt: null, requirement: 30, type: 'streak' },
  { id: 'streak_100', name: 'Century Streak', nameAz: '100 Günlük Seriya', description: '100 gün ardıcıl öyrən', icon: 'flame', unlockedAt: null, requirement: 100, type: 'streak' },
  { id: 'questions_50', name: 'Question Hunter', nameAz: 'Sual Ovçusu', description: '50 sual cavabla', icon: 'help-circle', unlockedAt: null, requirement: 50, type: 'questions' },
  { id: 'questions_200', name: 'Question Master', nameAz: 'Sual Ustası', description: '200 sual cavabla', icon: 'help-circle', unlockedAt: null, requirement: 200, type: 'questions' },
  { id: 'questions_1000', name: 'Question Legend', nameAz: 'Sual Əfsanəsi', description: '1000 sual cavabla', icon: 'help-circle', unlockedAt: null, requirement: 1000, type: 'questions' },
  { id: 'tests_5', name: 'Test Taker', nameAz: 'Test Həlledici', description: '5 test tamamla', icon: 'document-text', unlockedAt: null, requirement: 5, type: 'tests' },
  { id: 'tests_20', name: 'Test Pro', nameAz: 'Test Professional', description: '20 test tamamla', icon: 'document-text', unlockedAt: null, requirement: 20, type: 'tests' },
  { id: 'tests_50', name: 'Test King', nameAz: 'Test Kralı', description: '50 test tamamla', icon: 'trophy', unlockedAt: null, requirement: 50, type: 'tests' },
  { id: 'score_90', name: 'Perfectionist', nameAz: 'Perfeksionist', description: 'Bir testdə 90%+ al', icon: 'star', unlockedAt: null, requirement: 90, type: 'score' },
  { id: 'score_100', name: 'Flawless', nameAz: 'Mükəmməl', description: 'Bir testdə 100% al', icon: 'star', unlockedAt: null, requirement: 100, type: 'score' },
  { id: 'time_60', name: 'Dedicated', nameAz: 'Sadiq', description: '60 dəqiqə öyrən', icon: 'time', unlockedAt: null, requirement: 60, type: 'time' },
  { id: 'time_300', name: 'Hard Worker', nameAz: 'Çalışqan', description: '300 dəqiqə öyrən', icon: 'time', unlockedAt: null, requirement: 300, type: 'time' },
];

export const XP_REWARDS = {
  correctAnswer: 10,
  wrongAnswer: 0,
  testCompleted: 25,
  perfectTest: 50,
  dailyGoalCompleted: 30,
  streakBonus: 5, // per day of streak
  firstLoginOfDay: 10,
  challengeWon: 40,
};

export function getLevelForXP(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getLeagueForWeeklyXP(weeklyXP: number): League {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (weeklyXP >= LEAGUES[i].minXPPerWeek) {
      return LEAGUES[i];
    }
  }
  return LEAGUES[0];
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelForXP(xp);
  const current = xp - level.minXP;
  const needed = level.maxXP === Infinity ? 1000 : level.maxXP - level.minXP;
  const percentage = Math.min((current / needed) * 100, 100);
  return { current, needed, percentage };
}

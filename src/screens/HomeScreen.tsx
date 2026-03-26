import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useStore } from '../store/useStore';
import { getSubjectsForGroup } from '../constants/subjects';
import { getLevelForXP, getXPProgress } from '../constants/gamification';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onSubjectPress: (subjectId: string) => void;
  onStatsPress: () => void;
  onProfilePress: () => void;
}

export default function HomeScreen({ onSubjectPress, onStatsPress, onProfilePress }: HomeScreenProps) {
  const user = useStore((s) => s.user);
  const stats = useStore((s) => s.stats);
  const dailyGoal = useStore((s) => s.dailyGoal);

  if (!user) return null;

  const subjects = getSubjectsForGroup(user.examGroup);
  const level = getLevelForXP(stats.totalXP);
  const xpProgress = getXPProgress(stats.totalXP);
  const dailyProgress = Math.min(
    (dailyGoal.questionsCompleted / dailyGoal.questionsTarget) * 100,
    100
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Salam, {user.name}!</Text>
          <Text style={styles.groupText}>Qrup {user.examGroup} - {level.nameAz}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Streak & XP Card */}
      <View style={styles.streakCard}>
        <View style={styles.streakRow}>
          <View style={styles.streakItem}>
            <Ionicons name="flame" size={28} color={stats.currentStreak > 0 ? COLORS.streakActive : COLORS.streakInactive} />
            <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
            <Text style={styles.streakLabel}>Gün seriya</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakItem}>
            <Ionicons name="star" size={28} color={COLORS.xpGold} />
            <Text style={styles.streakNumber}>{stats.totalXP}</Text>
            <Text style={styles.streakLabel}>XP</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakItem}>
            <Ionicons name="trophy" size={28} color={COLORS.accent} />
            <Text style={styles.streakNumber}>{level.level}</Text>
            <Text style={styles.streakLabel}>Səviyyə</Text>
          </View>
        </View>
        {/* XP Progress Bar */}
        <View style={styles.xpProgressContainer}>
          <View style={styles.xpProgressBar}>
            <View style={[styles.xpProgressFill, { width: `${xpProgress.percentage}%` }]} />
          </View>
          <Text style={styles.xpProgressText}>
            {xpProgress.current}/{xpProgress.needed} XP
          </Text>
        </View>
      </View>

      {/* Daily Goal */}
      <View style={styles.dailyGoalCard}>
        <View style={styles.dailyGoalHeader}>
          <Text style={styles.dailyGoalTitle}>Gündəlik Hədəf</Text>
          <Text style={styles.dailyGoalPercentage}>{Math.round(dailyProgress)}%</Text>
        </View>
        <View style={styles.dailyGoalProgressBar}>
          <View style={[styles.dailyGoalProgressFill, { width: `${dailyProgress}%` }]} />
        </View>
        <View style={styles.dailyGoalStats}>
          <View style={styles.dailyGoalStat}>
            <Ionicons name="help-circle" size={16} color={COLORS.primary} />
            <Text style={styles.dailyGoalStatText}>
              {dailyGoal.questionsCompleted}/{dailyGoal.questionsTarget} sual
            </Text>
          </View>
          <View style={styles.dailyGoalStat}>
            <Ionicons name="document-text" size={16} color={COLORS.secondary} />
            <Text style={styles.dailyGoalStatText}>
              {dailyGoal.testsCompleted}/{dailyGoal.testsTarget} test
            </Text>
          </View>
          <View style={styles.dailyGoalStat}>
            <Ionicons name="star" size={16} color={COLORS.xpGold} />
            <Text style={styles.dailyGoalStatText}>
              {dailyGoal.xpEarned}/{dailyGoal.xpTarget} XP
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: COLORS.primary }]}>
          <Ionicons name="flash" size={24} color={COLORS.textWhite} />
          <Text style={styles.quickActionText}>Blok Sınaq</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: COLORS.secondary }]}
          onPress={onStatsPress}
        >
          <Ionicons name="stats-chart" size={24} color={COLORS.textWhite} />
          <Text style={styles.quickActionText}>Statistika</Text>
        </TouchableOpacity>
      </View>

      {/* Subjects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fənlər</Text>
        <View style={styles.subjectGrid}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={styles.subjectCard}
              onPress={() => onSubjectPress(subject.id)}
            >
              <View style={[styles.subjectIcon, { backgroundColor: subject.color + '15' }]}>
                <Ionicons name={subject.icon as any} size={28} color={subject.color} />
              </View>
              <Text style={styles.subjectName} numberOfLines={1}>
                {subject.nameAz}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son Nəticələr</Text>
        <RecentResults />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function RecentResults() {
  const testResults = useStore((s) => s.testResults);
  const recent = testResults.slice(0, 3);

  if (recent.length === 0) {
    return (
      <View style={styles.emptyResults}>
        <Ionicons name="document-text-outline" size={48} color={COLORS.textLight} />
        <Text style={styles.emptyResultsText}>Hələ test həll etməmisən</Text>
        <Text style={styles.emptyResultsSubtext}>İlk testinə başla!</Text>
      </View>
    );
  }

  return (
    <View style={styles.resultsList}>
      {recent.map((result) => (
        <View key={result.id} style={styles.resultItem}>
          <View
            style={[
              styles.resultBadge,
              {
                backgroundColor:
                  result.percentage >= 80
                    ? COLORS.success + '20'
                    : result.percentage >= 50
                    ? COLORS.warning + '20'
                    : COLORS.error + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.resultPercentage,
                {
                  color:
                    result.percentage >= 80
                      ? COLORS.success
                      : result.percentage >= 50
                      ? COLORS.warning
                      : COLORS.error,
                },
              ]}
            >
              {Math.round(result.percentage)}%
            </Text>
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>
              {result.correctCount}/{result.correctCount + result.wrongCount} doğru
            </Text>
            <Text style={styles.resultDate}>
              {new Date(result.completedAt).toLocaleDateString('az-AZ')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  groupText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileButton: {
    marginLeft: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  streakCard: {
    marginHorizontal: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  streakNumber: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  streakLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  xpProgressContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.xs,
  },
  xpProgressBar: {
    height: 6,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: COLORS.xpGold,
    borderRadius: 3,
  },
  xpProgressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: 'right',
  },
  dailyGoalCard: {
    marginHorizontal: SPACING.xxl,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.sm,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dailyGoalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  dailyGoalPercentage: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  dailyGoalProgressBar: {
    height: 8,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  dailyGoalProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  dailyGoalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dailyGoalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dailyGoalStatText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  quickActionText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  section: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  subjectCard: {
    width: (width - SPACING.xxl * 2 - SPACING.md * 2) / 3,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  subjectIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  subjectName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptyResults: {
    alignItems: 'center',
    padding: SPACING.xxxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  emptyResultsText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptyResultsSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
  resultsList: {
    gap: SPACING.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  resultBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultPercentage: {
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
});

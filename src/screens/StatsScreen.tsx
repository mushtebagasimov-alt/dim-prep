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
import { getLevelForXP, getXPProgress } from '../constants/gamification';

const { width } = Dimensions.get('window');

interface StatsScreenProps {
  onBack?: () => void;
}

export default function StatsScreen({ onBack }: StatsScreenProps) {
  const stats = useStore((s) => s.stats);
  const testResults = useStore((s) => s.testResults);
  const level = getLevelForXP(stats.totalXP);
  const xpProgress = getXPProgress(stats.totalXP);

  const accuracy =
    stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;

  const avgScore =
    testResults.length > 0
      ? Math.round(testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length)
      : 0;

  const studyHours = Math.floor(stats.totalStudyTimeMinutes / 60);
  const studyMinutes = stats.totalStudyTimeMinutes % 60;

  // Badges
  const unlockedBadges = stats.badges.filter((b) => b.unlockedAt !== null);
  const lockedBadges = stats.badges.filter((b) => b.unlockedAt === null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Statistika</Text>
      </View>

      {/* Level Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelNumber}>{level.level}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelName}>{level.nameAz}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpBarFill, { width: `${xpProgress.percentage}%` }]} />
          </View>
          <Text style={styles.xpText}>{stats.totalXP} XP toplam</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsGrid}>
        <StatCard icon="flame" color={COLORS.streakActive} value={`${stats.currentStreak}`} label="Gün seriya" />
        <StatCard icon="trophy" color={COLORS.xpGold} value={`${stats.longestStreak}`} label="Ən uzun seriya" />
        <StatCard icon="checkmark-circle" color={COLORS.success} value={`${accuracy}%`} label="Dəqiqlik" />
        <StatCard icon="document-text" color={COLORS.info} value={`${stats.totalTestsCompleted}`} label="Test sayı" />
        <StatCard icon="help-circle" color={COLORS.primary} value={`${stats.totalQuestionsAnswered}`} label="Sual sayı" />
        <StatCard icon="time" color={COLORS.accent} value={`${studyHours}s ${studyMinutes}d`} label="Öyrənmə vaxtı" />
      </View>

      {/* Average Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orta nəticə</Text>
        <View style={styles.avgScoreCard}>
          <View style={styles.avgScoreCircle}>
            <Text style={styles.avgScoreValue}>{avgScore}%</Text>
          </View>
          <View style={styles.avgScoreInfo}>
            <View style={styles.avgScoreRow}>
              <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.avgScoreLabel}>Doğru: {stats.totalCorrectAnswers}</Text>
            </View>
            <View style={styles.avgScoreRow}>
              <View style={[styles.dot, { backgroundColor: COLORS.error }]} />
              <Text style={styles.avgScoreLabel}>
                Yanlış: {stats.totalQuestionsAnswered - stats.totalCorrectAnswers}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Rozetlər ({unlockedBadges.length}/{stats.badges.length})
        </Text>
        <View style={styles.badgesGrid}>
          {unlockedBadges.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <View style={[styles.badgeIcon, { backgroundColor: COLORS.xpGold + '20' }]}>
                <Ionicons name={badge.icon as any} size={24} color={COLORS.xpGold} />
              </View>
              <Text style={styles.badgeName} numberOfLines={1}>{badge.nameAz}</Text>
            </View>
          ))}
          {lockedBadges.map((badge) => (
            <View key={badge.id} style={[styles.badgeCard, styles.badgeLocked]}>
              <View style={[styles.badgeIcon, { backgroundColor: COLORS.surfaceSecondary }]}>
                <Ionicons name="lock-closed" size={24} color={COLORS.textLight} />
              </View>
              <Text style={[styles.badgeName, styles.badgeNameLocked]} numberOfLines={1}>
                {badge.nameAz}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son testlər</Text>
        {testResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Hələ test həll etməmisən</Text>
          </View>
        ) : (
          testResults.slice(0, 10).map((result) => (
            <View key={result.id} style={styles.testResultItem}>
              <View
                style={[
                  styles.testResultBadge,
                  {
                    backgroundColor:
                      result.percentage >= 70 ? COLORS.success + '15' : COLORS.warning + '15',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.testResultPercentage,
                    {
                      color: result.percentage >= 70 ? COLORS.success : COLORS.warning,
                    },
                  ]}
                >
                  {result.percentage}%
                </Text>
              </View>
              <View style={styles.testResultInfo}>
                <Text style={styles.testResultTitle}>
                  {result.correctCount}/{result.correctCount + result.wrongCount} doğru
                </Text>
                <Text style={styles.testResultDate}>
                  {new Date(result.completedAt).toLocaleDateString('az-AZ')}
                </Text>
              </View>
              <Text style={styles.testResultScore}>
                {result.score}/{result.maxScore}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function StatCard({
  icon,
  color,
  value,
  label,
}: {
  icon: string;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    width: (width - SPACING.xxl * 2 - SPACING.md * 2) / 3,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  value: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  levelCard: {
    marginHorizontal: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    ...SHADOWS.md,
  },
  levelCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  levelInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  levelName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  xpBar: {
    height: 8,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.xpGold,
    borderRadius: 4,
  },
  xpText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.xl,
    gap: SPACING.md,
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
  avgScoreCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
    ...SHADOWS.sm,
  },
  avgScoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avgScoreValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  avgScoreInfo: {
    gap: SPACING.sm,
  },
  avgScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  avgScoreLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  badgeCard: {
    width: (width - SPACING.xxl * 2 - SPACING.md * 2) / 3,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: COLORS.textLight,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  testResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  testResultBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testResultPercentage: {
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
  },
  testResultInfo: {
    flex: 1,
  },
  testResultTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  testResultDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  testResultScore: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

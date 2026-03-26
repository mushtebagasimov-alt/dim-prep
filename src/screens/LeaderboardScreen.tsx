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
import { LeaderboardPeriod } from '../types';

const { width } = Dimensions.get('window');

const PERIOD_OPTIONS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: 'Günlük' },
  { key: 'weekly', label: 'Həftəlik' },
  { key: 'monthly', label: 'Aylıq' },
  { key: 'allTime', label: 'Ümumi' },
];

export default function LeaderboardScreen() {
  const leaderboard = useStore((s) => s.leaderboard);
  const leaderboardPeriod = useStore((s) => s.leaderboardPeriod);
  const setLeaderboardPeriod = useStore((s) => s.setLeaderboardPeriod);
  const user = useStore((s) => s.user);
  const stats = useStore((s) => s.stats);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Liderlik Tablosu</Text>
      </View>

      {/* Period Tabs */}
      <View style={styles.periodTabs}>
        {PERIOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.periodTab,
              leaderboardPeriod === option.key && styles.periodTabActive,
            ]}
            onPress={() => setLeaderboardPeriod(option.key)}
          >
            <Text
              style={[
                styles.periodTabText,
                leaderboardPeriod === option.key && styles.periodTabTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podium}>
        {/* 2nd place */}
        {top3[1] && (
          <View style={styles.podiumItem}>
            <View style={[styles.podiumAvatar, { backgroundColor: COLORS.leagueSilver }]}>
              <Text style={styles.podiumAvatarText}>{top3[1].userName.charAt(0)}</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[1].userName.split(' ')[0]}</Text>
            <Text style={styles.podiumXP}>{top3[1].xp} XP</Text>
            <View style={[styles.podiumPillar, styles.podiumPillar2]}>
              <Text style={styles.podiumRank}>2</Text>
            </View>
          </View>
        )}

        {/* 1st place */}
        {top3[0] && (
          <View style={styles.podiumItem}>
            <Ionicons name="trophy" size={24} color={COLORS.xpGold} style={styles.crownIcon} />
            <View style={[styles.podiumAvatar, styles.podiumAvatar1, { backgroundColor: COLORS.leagueGold }]}>
              <Text style={styles.podiumAvatarText}>{top3[0].userName.charAt(0)}</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[0].userName.split(' ')[0]}</Text>
            <Text style={styles.podiumXP}>{top3[0].xp} XP</Text>
            <View style={[styles.podiumPillar, styles.podiumPillar1]}>
              <Text style={styles.podiumRank}>1</Text>
            </View>
          </View>
        )}

        {/* 3rd place */}
        {top3[2] && (
          <View style={styles.podiumItem}>
            <View style={[styles.podiumAvatar, { backgroundColor: COLORS.leagueBronze }]}>
              <Text style={styles.podiumAvatarText}>{top3[2].userName.charAt(0)}</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[2].userName.split(' ')[0]}</Text>
            <Text style={styles.podiumXP}>{top3[2].xp} XP</Text>
            <View style={[styles.podiumPillar, styles.podiumPillar3]}>
              <Text style={styles.podiumRank}>3</Text>
            </View>
          </View>
        )}
      </View>

      {/* Rest of leaderboard */}
      <View style={styles.listContainer}>
        {rest.map((entry) => (
          <View key={entry.userId} style={styles.listItem}>
            <Text style={styles.listRank}>{entry.rank}</Text>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>{entry.userName.charAt(0)}</Text>
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{entry.userName}</Text>
              <Text style={styles.listGroup}>Qrup {entry.examGroup}</Text>
            </View>
            <View style={styles.listRight}>
              <Text style={styles.listXP}>{entry.xp} XP</Text>
              <View style={styles.listStreak}>
                <Ionicons name="flame" size={12} color={COLORS.streakActive} />
                <Text style={styles.listStreakText}>{entry.streak}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Your Position */}
      {user && (
        <View style={styles.yourPosition}>
          <View style={styles.yourPositionCard}>
            <Text style={styles.yourPositionLabel}>Sənin mövqeyin</Text>
            <View style={styles.yourPositionContent}>
              <Text style={styles.yourPositionRank}>#11</Text>
              <View style={styles.listAvatar}>
                <Text style={styles.listAvatarText}>{user.name.charAt(0)}</Text>
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{user.name}</Text>
                <Text style={styles.listGroup}>Qrup {user.examGroup}</Text>
              </View>
              <Text style={styles.listXP}>{stats.totalXP} XP</Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: 60,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  periodTabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  periodTab: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: COLORS.primary,
  },
  periodTabText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodTabTextActive: {
    color: COLORS.textWhite,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.xxl,
    height: 220,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
  },
  crownIcon: {
    marginBottom: SPACING.xs,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  podiumAvatar1: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: COLORS.xpGold,
  },
  podiumAvatarText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  podiumName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  podiumXP: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  podiumPillar: {
    width: '80%',
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  podiumPillar1: {
    height: 80,
    backgroundColor: COLORS.xpGold + '30',
  },
  podiumPillar2: {
    height: 60,
    backgroundColor: COLORS.leagueSilver + '30',
  },
  podiumPillar3: {
    height: 45,
    backgroundColor: COLORS.leagueBronze + '30',
  },
  podiumRank: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  listContainer: {
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  listRank: {
    width: 24,
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listAvatarText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  listGroup: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  listRight: {
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  listXP: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  listStreakText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.streakActive,
    fontWeight: '600',
  },
  yourPosition: {
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.xxl,
  },
  yourPositionCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  yourPositionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  yourPositionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  yourPositionRank: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

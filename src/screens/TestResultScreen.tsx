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
import { TestResult } from '../types';

const { width } = Dimensions.get('window');

interface TestResultScreenProps {
  result: TestResult;
  onBack: () => void;
  onRetry: () => void;
}

export default function TestResultScreen({ result, onBack, onRetry }: TestResultScreenProps) {
  const isGood = result.percentage >= 70;
  const isMedium = result.percentage >= 40 && result.percentage < 70;

  const getGrade = () => {
    if (result.percentage >= 90) return { text: 'Əla!', icon: 'trophy', color: COLORS.xpGold };
    if (result.percentage >= 70) return { text: 'Yaxşı!', icon: 'thumbs-up', color: COLORS.success };
    if (result.percentage >= 50) return { text: 'Orta', icon: 'remove-circle', color: COLORS.warning };
    return { text: 'Daha çox çalış', icon: 'sad', color: COLORS.error };
  };

  const grade = getGrade();
  const totalAnswered = result.correctCount + result.wrongCount;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Result Header */}
      <View style={[styles.resultHeader, { backgroundColor: grade.color }]}>
        <Ionicons name={grade.icon as any} size={64} color={COLORS.textWhite} />
        <Text style={styles.gradeText}>{grade.text}</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scorePercentage}>{result.percentage}%</Text>
          <Text style={styles.scoreLabel}>Nəticə</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
          <Text style={styles.statValue}>{result.correctCount}</Text>
          <Text style={styles.statLabel}>Doğru</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="close-circle" size={28} color={COLORS.error} />
          <Text style={styles.statValue}>{result.wrongCount}</Text>
          <Text style={styles.statLabel}>Yanlış</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="remove-circle" size={28} color={COLORS.textLight} />
          <Text style={styles.statValue}>{result.unansweredCount}</Text>
          <Text style={styles.statLabel}>Cavabsız</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={28} color={COLORS.info} />
          <Text style={styles.statValue}>
            {Math.floor(result.totalTime / 60)}:{(result.totalTime % 60).toString().padStart(2, '0')}
          </Text>
          <Text style={styles.statLabel}>Vaxt</Text>
        </View>
      </View>

      {/* Score Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>Bal hesabı</Text>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Doğru cavablar</Text>
          <Text style={[styles.breakdownValue, { color: COLORS.success }]}>
            +{result.correctCount * 8} bal
          </Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Yanlış cavablar (cərimə -25%)</Text>
          <Text style={[styles.breakdownValue, { color: COLORS.error }]}>
            -{result.wrongCount * 2} bal
          </Text>
        </View>
        <View style={styles.breakdownDivider} />
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabelBold}>Ümumi bal</Text>
          <Text style={styles.breakdownValueBold}>
            {result.score}/{result.maxScore}
          </Text>
        </View>
      </View>

      {/* Accuracy Indicator */}
      <View style={styles.accuracyCard}>
        <Text style={styles.accuracyTitle}>Dəqiqlik</Text>
        <View style={styles.accuracyBarContainer}>
          <View style={styles.accuracyBar}>
            <View
              style={[
                styles.accuracyFill,
                {
                  width: `${totalAnswered > 0 ? (result.correctCount / totalAnswered) * 100 : 0}%`,
                  backgroundColor: isGood ? COLORS.success : isMedium ? COLORS.warning : COLORS.error,
                },
              ]}
            />
          </View>
          <Text style={styles.accuracyPercentage}>
            {totalAnswered > 0 ? Math.round((result.correctCount / totalAnswered) * 100) : 0}%
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={20} color={COLORS.textWhite} />
          <Text style={styles.retryButtonText}>Yenidən həll et</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={onBack}>
          <Ionicons name="home" size={20} color={COLORS.primary} />
          <Text style={styles.homeButtonText}>Ana səhifə</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  resultHeader: {
    paddingTop: 70,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    gap: SPACING.md,
  },
  gradeText: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  scoreLabel: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxl,
    marginTop: -20,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.xs,
    ...SHADOWS.md,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  breakdownCard: {
    marginHorizontal: SPACING.xxl,
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.sm,
  },
  breakdownTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  breakdownLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  breakdownValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  breakdownLabelBold: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  breakdownValueBold: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  accuracyCard: {
    marginHorizontal: SPACING.xxl,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.sm,
  },
  accuracyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  accuracyBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  accuracyBar: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 5,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    borderRadius: 5,
  },
  accuracyPercentage: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  actions: {
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  retryButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  homeButton: {
    backgroundColor: 'transparent',
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  homeButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
});

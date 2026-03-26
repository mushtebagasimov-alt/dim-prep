import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useStore } from '../store/useStore';
import { getLevelForXP, getLeagueForWeeklyXP } from '../constants/gamification';
import { GROUP_INFO } from '../constants/subjects';
import { ExamGroup } from '../types';

interface ProfileScreenProps {
  onGroupChange?: () => void;
}

export default function ProfileScreen({ onGroupChange }: ProfileScreenProps) {
  const user = useStore((s) => s.user);
  const stats = useStore((s) => s.stats);
  const logout = useStore((s) => s.logout);
  const setExamGroup = useStore((s) => s.setExamGroup);

  if (!user) return null;

  const level = getLevelForXP(stats.totalXP);
  const league = getLeagueForWeeklyXP(stats.totalXP); // simplified for MVP

  const handleLogout = () => {
    Alert.alert('Çıxış', 'Hesabdan çıxmaq istəyirsən?', [
      { text: 'Xeyr', style: 'cancel' },
      { text: 'Bəli', onPress: logout },
    ]);
  };

  const handleChangeGroup = () => {
    Alert.alert(
      'Qrupu dəyiş',
      'Yeni qrup seç:',
      (Object.keys(GROUP_INFO) as ExamGroup[]).map((group) => ({
        text: `${group} - ${GROUP_INFO[group].nameAz}`,
        onPress: () => setExamGroup(group),
      })),
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.badges}>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>Qrup {user.examGroup}</Text>
          </View>
          <View style={[styles.profileBadge, { backgroundColor: league.color + '20' }]}>
            <Text style={[styles.profileBadgeText, { color: league.color }]}>{league.nameAz}</Text>
          </View>
          <View style={[styles.profileBadge, { backgroundColor: COLORS.primary + '15' }]}>
            <Text style={[styles.profileBadgeText, { color: COLORS.primary }]}>Səviyyə {level.level}</Text>
          </View>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{stats.totalXP}</Text>
          <Text style={styles.summaryLabel}>XP</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{stats.currentStreak}</Text>
          <Text style={styles.summaryLabel}>Seriya</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{stats.totalTestsCompleted}</Text>
          <Text style={styles.summaryLabel}>Test</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {stats.totalQuestionsAnswered > 0
              ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
              : 0}%
          </Text>
          <Text style={styles.summaryLabel}>Dəqiqlik</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Hesab</Text>

        <MenuItem
          icon="person-outline"
          label="Profil məlumatları"
          onPress={() => {}}
        />
        <MenuItem
          icon="school-outline"
          label={`Qrup: ${user.examGroup} - ${GROUP_INFO[user.examGroup].nameAz}`}
          onPress={handleChangeGroup}
          showArrow
        />
        <MenuItem
          icon="diamond-outline"
          label="Premium"
          sublabel={user.isPremium ? 'Aktiv' : 'Aktivləşdir'}
          onPress={() => {}}
          showArrow
          highlight={!user.isPremium}
        />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Tənzimləmələr</Text>

        <MenuItem icon="notifications-outline" label="Bildirişlər" onPress={() => {}} showArrow />
        <MenuItem icon="language-outline" label="Dil: Azərbaycanca" onPress={() => {}} showArrow />
        <MenuItem icon="moon-outline" label="Qaranlıq rejim" onPress={() => {}} showArrow />
        <MenuItem icon="help-circle-outline" label="Yardım" onPress={() => {}} showArrow />
        <MenuItem icon="information-circle-outline" label="Haqqında" onPress={() => {}} showArrow />
      </View>

      <View style={styles.menuSection}>
        <MenuItem icon="share-outline" label="Paylaş" onPress={() => {}} />
        <MenuItem icon="star-outline" label="Dəyərləndir" onPress={() => {}} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Çıxış</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>DIM Hazırlıq v1.0.0</Text>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function MenuItem({
  icon,
  label,
  sublabel,
  onPress,
  showArrow,
  highlight,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  showArrow?: boolean;
  highlight?: boolean;
}) {
  return (
    <TouchableOpacity style={menuStyles.item} onPress={onPress}>
      <Ionicons name={icon as any} size={22} color={highlight ? COLORS.primary : COLORS.textSecondary} />
      <View style={menuStyles.itemContent}>
        <Text style={[menuStyles.itemLabel, highlight && menuStyles.itemLabelHighlight]}>{label}</Text>
        {sublabel && (
          <Text style={[menuStyles.itemSublabel, highlight && { color: COLORS.primary }]}>
            {sublabel}
          </Text>
        )}
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />}
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  itemLabelHighlight: {
    fontWeight: '600',
  },
  itemSublabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarLargeText: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  userName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  profileBadge: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  profileBadgeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statsSummary: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xxl,
    ...SHADOWS.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    marginBottom: SPACING.xl,
  },
  menuSectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.xxl,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  logoutText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xxl,
  },
});

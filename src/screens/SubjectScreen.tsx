import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { SUBJECTS } from '../constants/subjects';
import { getQuestionsForSubject } from '../constants/sampleQuestions';

interface SubjectScreenProps {
  subjectId: string;
  onBack: () => void;
  onStartTest: (subjectId: string, topicId?: string) => void;
}

export default function SubjectScreen({ subjectId, onBack, onStartTest }: SubjectScreenProps) {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const questions = getQuestionsForSubject(subjectId);

  if (!subject) return null;

  // Group questions by topic
  const topicMap = new Map<string, { id: string; name: string; count: number }>();
  questions.forEach((q) => {
    const existing = topicMap.get(q.topicId);
    if (existing) {
      existing.count++;
    } else {
      topicMap.set(q.topicId, { id: q.topicId, name: q.topicId.replace(/_/g, ' '), count: 1 });
    }
  });
  const topics = Array.from(topicMap.values());

  const topicNames: Record<string, string> = {
    algebra_basics: 'Cəbr əsasları',
    geometry: 'Həndəsə',
    trigonometry: 'Triqonometriya',
    mechanics: 'Mexanika',
    electricity: 'Elektrik',
    periodic_table: 'Dövri cədvəl',
    azerbaijan_history: 'Azərbaycan tarixi',
    azerbaijan_geography: 'Azərbaycan coğrafiyası',
    cell_biology: 'Hüceyrə biologiyası',
    grammar: 'Qrammatika',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: subject.color }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name={subject.icon as any} size={48} color={COLORS.textWhite} />
          <Text style={styles.headerTitle}>{subject.nameAz}</Text>
          <Text style={styles.headerSubtitle}>{questions.length} sual mövcuddur</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Test */}
        <TouchableOpacity
          style={styles.quickTestCard}
          onPress={() => onStartTest(subjectId)}
        >
          <View style={styles.quickTestLeft}>
            <Ionicons name="flash" size={24} color={COLORS.primary} />
            <View>
              <Text style={styles.quickTestTitle}>Sürətli Test</Text>
              <Text style={styles.quickTestSubtitle}>Bütün mövzulardan qarışıq</Text>
            </View>
          </View>
          <Ionicons name="play-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Topics */}
        <Text style={styles.sectionTitle}>Mövzular</Text>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicCard}
            onPress={() => onStartTest(subjectId, topic.id)}
          >
            <View style={[styles.topicIcon, { backgroundColor: subject.color + '15' }]}>
              <Ionicons name="book" size={20} color={subject.color} />
            </View>
            <View style={styles.topicInfo}>
              <Text style={styles.topicName}>{topicNames[topic.id] || topic.name}</Text>
              <Text style={styles.topicCount}>{topic.count} sual</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}

        {topics.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Bu fən üçün suallar tezliklə əlavə olunacaq</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerContent: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: SPACING.xxl,
  },
  quickTestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xxl,
    ...SHADOWS.md,
  },
  quickTestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  quickTestTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  quickTestSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  topicIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  topicCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxxl,
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

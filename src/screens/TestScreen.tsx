import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Question, TestAnswer, TestResult } from '../types';
import { getQuestionsForSubject, getRandomQuestions } from '../constants/sampleQuestions';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

interface TestScreenProps {
  subjectId: string;
  topicId?: string;
  onBack: () => void;
  onComplete: (result: TestResult) => void;
}

export default function TestScreen({ subjectId, topicId, onBack, onComplete }: TestScreenProps) {
  const user = useStore((s) => s.user);
  const incrementQuestionsAnswered = useStore((s) => s.incrementQuestionsAnswered);
  const addTestResult = useStore((s) => s.addTestResult);

  // Get questions
  const [questions] = useState<Question[]>(() => {
    let qs = topicId
      ? getQuestionsForSubject(subjectId).filter((q) => q.topicId === topicId)
      : getQuestionsForSubject(subjectId);
    // Shuffle and limit
    qs = [...qs].sort(() => Math.random() - 0.5).slice(0, Math.min(qs.length, 10));
    return qs;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, TestAnswer>>(new Map());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions.length * 120); // 2 min per question
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedOption(optionId);
  };

  const handleConfirm = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = currentQuestion.options.find((o) => o.id === selectedOption)?.isCorrect ?? false;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    const answer: TestAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      isCorrect,
      timeSpent,
    };

    setAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion.id, answer);
      return newMap;
    });

    incrementQuestionsAnswered(isCorrect);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      handleFinish();
    }
  };

  const handleFinish = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const answersArray = Array.from(answers.values());
    const correctCount = answersArray.filter((a) => a.isCorrect).length;
    const wrongCount = answersArray.filter((a) => !a.isCorrect).length;
    const unansweredCount = questions.length - answersArray.length;

    // DIM scoring: correct = +points, wrong = -25% of points
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    let score = 0;
    answersArray.forEach((a) => {
      const q = questions.find((qq) => qq.id === a.questionId);
      if (!q) return;
      if (a.isCorrect) {
        score += q.points;
      } else {
        score -= q.points * 0.25; // DIM penalty
      }
    });
    score = Math.max(0, score);

    const result: TestResult = {
      id: Date.now().toString(),
      testId: `${subjectId}_${topicId || 'mixed'}_${Date.now()}`,
      userId: user?.id || '',
      answers: answersArray,
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      correctCount,
      wrongCount,
      unansweredCount,
      totalTime: answersArray.reduce((sum, a) => sum + a.timeSpent, 0),
      completedAt: new Date().toISOString(),
    };

    addTestResult(result);
    onComplete(result);
  }, [answers, questions, isFinished, subjectId, topicId, user, addTestResult, onComplete]);

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Bu mövzu üçün sual tapılmadı</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Geri qayıt</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Testi bitir?',
              'Testi yarımçıq qoymaq istəyirsən?',
              [
                { text: 'Xeyr', style: 'cancel' },
                { text: 'Bəli', onPress: handleFinish },
              ]
            );
          }}
        >
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{questions.length}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Ionicons
            name="time"
            size={18}
            color={timeLeft < 60 ? COLORS.error : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.timerText,
              timeLeft < 60 && styles.timerTextDanger,
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Question */}
      <ScrollView
        style={styles.questionContainer}
        contentContainerStyle={styles.questionContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionHeader}>
          <View style={styles.difficultyBadge}>
            {Array.from({ length: currentQuestion.difficulty }).map((_, i) => (
              <Ionicons key={i} name="star" size={12} color={COLORS.xpGold} />
            ))}
          </View>
          <Text style={styles.pointsBadge}>{currentQuestion.points} bal</Text>
        </View>

        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option.id;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D, E

            let optionStyle = styles.option;
            let letterStyle = styles.optionLetter;
            let textStyle = styles.optionText;

            if (showExplanation) {
              if (option.isCorrect) {
                optionStyle = { ...styles.option, ...styles.optionCorrect };
                letterStyle = { ...styles.optionLetter, ...styles.optionLetterCorrect };
                textStyle = { ...styles.optionText, ...styles.optionTextCorrect };
              } else if (isSelected && !option.isCorrect) {
                optionStyle = { ...styles.option, ...styles.optionWrong };
                letterStyle = { ...styles.optionLetter, ...styles.optionLetterWrong };
                textStyle = { ...styles.optionText, ...styles.optionTextWrong };
              }
            } else if (isSelected) {
              optionStyle = { ...styles.option, ...styles.optionSelected };
              letterStyle = { ...styles.optionLetter, ...styles.optionLetterSelected };
              textStyle = { ...styles.optionText, ...styles.optionTextSelected };
            }

            return (
              <TouchableOpacity
                key={option.id}
                style={optionStyle}
                onPress={() => handleSelectOption(option.id)}
                disabled={showExplanation}
              >
                <View style={letterStyle}>
                  <Text style={styles.letterText}>{letter}</Text>
                </View>
                <Text style={textStyle}>{option.text}</Text>
                {showExplanation && option.isCorrect && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                )}
                {showExplanation && isSelected && !option.isCorrect && (
                  <Ionicons name="close-circle" size={24} color={COLORS.error} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <View style={styles.explanationCard}>
            <View style={styles.explanationHeader}>
              <Ionicons name="bulb" size={20} color={COLORS.accent} />
              <Text style={styles.explanationTitle}>İzah</Text>
            </View>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        {!showExplanation ? (
          <TouchableOpacity
            style={[styles.confirmButton, !selectedOption && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={!selectedOption}
          >
            <Text style={styles.confirmButtonText}>Təsdiqlə</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < questions.length - 1 ? 'Növbəti sual' : 'Nəticəni gör'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.textWhite} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  progressBarContainer: {
    flex: 1,
    gap: SPACING.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  timerTextDanger: {
    color: COLORS.error,
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    padding: SPACING.xxl,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  difficultyBadge: {
    flexDirection: 'row',
    gap: 2,
  },
  pointsBadge: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  questionText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 28,
    marginBottom: SPACING.xxl,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  optionCorrect: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
  },
  optionWrong: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '10',
  },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLetterSelected: {
    backgroundColor: COLORS.primary,
  },
  optionLetterCorrect: {
    backgroundColor: COLORS.success,
  },
  optionLetterWrong: {
    backgroundColor: COLORS.error,
  },
  letterText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  optionText: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: COLORS.success,
    fontWeight: '600',
  },
  optionTextWrong: {
    color: COLORS.error,
    fontWeight: '600',
  },
  explanationCard: {
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.accent + '10',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  explanationTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.accent,
  },
  explanationText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  bottomBar: {
    padding: SPACING.xxl,
    paddingBottom: 34,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  nextButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  backBtn: {
    alignSelf: 'center',
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  backBtnText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
});

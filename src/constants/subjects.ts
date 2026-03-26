import { Subject, ExamGroup } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    nameAz: 'Riyaziyyat',
    icon: 'calculator',
    color: '#4F46E5',
    groups: ['I', 'II', 'III', 'IV', 'V'],
    maxScore: 100,
  },
  {
    id: 'physics',
    name: 'Physics',
    nameAz: 'Fizika',
    icon: 'flash',
    color: '#7C3AED',
    groups: ['I', 'IV'],
    maxScore: 100,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    nameAz: 'Kimya',
    icon: 'flask',
    color: '#EC4899',
    groups: ['I', 'IV'],
    maxScore: 100,
  },
  {
    id: 'biology',
    name: 'Biology',
    nameAz: 'Biologiya',
    icon: 'leaf',
    color: '#10B981',
    groups: ['IV'],
    maxScore: 100,
  },
  {
    id: 'history',
    name: 'History',
    nameAz: 'Tarix',
    icon: 'book',
    color: '#F59E0B',
    groups: ['II', 'III'],
    maxScore: 100,
  },
  {
    id: 'geography',
    name: 'Geography',
    nameAz: 'Coğrafiya',
    icon: 'earth',
    color: '#06B6D4',
    groups: ['II'],
    maxScore: 100,
  },
  {
    id: 'literature',
    name: 'Literature',
    nameAz: 'Ədəbiyyat',
    icon: 'library',
    color: '#8B5CF6',
    groups: ['III'],
    maxScore: 100,
  },
  {
    id: 'azerbaijani',
    name: 'Azerbaijani Language',
    nameAz: 'Azərbaycan dili',
    icon: 'language',
    color: '#EF4444',
    groups: ['I', 'II', 'III', 'IV', 'V'],
    maxScore: 100,
  },
  {
    id: 'foreign_lang',
    name: 'Foreign Language',
    nameAz: 'Xarici dil',
    icon: 'globe',
    color: '#3B82F6',
    groups: ['I', 'II', 'III', 'IV', 'V'],
    maxScore: 100,
  },
];

export const GROUP_SUBJECTS: Record<ExamGroup, string[]> = {
  I: ['math', 'physics', 'chemistry', 'azerbaijani', 'foreign_lang'],
  II: ['math', 'history', 'geography', 'azerbaijani', 'foreign_lang'],
  III: ['azerbaijani', 'math', 'foreign_lang', 'literature', 'history'],
  IV: ['math', 'physics', 'chemistry', 'biology', 'azerbaijani', 'foreign_lang'],
  V: ['azerbaijani', 'math', 'foreign_lang'],
};

export const GROUP_INFO: Record<ExamGroup, { name: string; nameAz: string; description: string }> = {
  I: {
    name: 'Technical',
    nameAz: 'Texniki',
    description: 'Mühəndislik, IT, Fizika, Riyaziyyat, Memarlıq',
  },
  II: {
    name: 'Geography-History',
    nameAz: 'Coğrafiya-Tarix',
    description: 'İqtisadiyyat, İdarəetmə, Coğrafiya',
  },
  III: {
    name: 'Language-History',
    nameAz: 'Dil-Tarix',
    description: 'Hüquq, Tarix, Filologiya, Jurnalistika',
  },
  IV: {
    name: 'Medical',
    nameAz: 'Tibbi',
    description: 'Tibb, Əczaçılıq, Biologiya',
  },
  V: {
    name: 'Art',
    nameAz: 'İncəsənət',
    description: 'İncəsənət, Musiqi, İdman, Jurnalistika',
  },
};

export function getSubjectsForGroup(group: ExamGroup): Subject[] {
  const subjectIds = GROUP_SUBJECTS[group];
  return SUBJECTS.filter((s) => subjectIds.includes(s.id));
}

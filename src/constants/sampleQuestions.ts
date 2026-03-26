import { Question } from '../types';

export const SAMPLE_QUESTIONS: Question[] = [
  // === RIYAZIYYAT (Mathematics) ===
  {
    id: 'math_1',
    subjectId: 'math',
    topicId: 'algebra_basics',
    type: 'closed',
    text: '2x + 5 = 15 tənliyini həll edin.',
    options: [
      { id: 'a', text: 'x = 3', isCorrect: false },
      { id: 'b', text: 'x = 5', isCorrect: true },
      { id: 'c', text: 'x = 7', isCorrect: false },
      { id: 'd', text: 'x = 10', isCorrect: false },
      { id: 'e', text: 'x = 4', isCorrect: false },
    ],
    explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
    difficulty: 1,
    points: 8,
  },
  {
    id: 'math_2',
    subjectId: 'math',
    topicId: 'algebra_basics',
    type: 'closed',
    text: '3x² - 12 = 0 tənliyinin müsbət kökünü tapın.',
    options: [
      { id: 'a', text: 'x = 1', isCorrect: false },
      { id: 'b', text: 'x = 2', isCorrect: true },
      { id: 'c', text: 'x = 3', isCorrect: false },
      { id: 'd', text: 'x = 4', isCorrect: false },
      { id: 'e', text: 'x = 6', isCorrect: false },
    ],
    explanation: '3x² = 12 → x² = 4 → x = 2 (müsbət kök)',
    difficulty: 2,
    points: 8,
  },
  {
    id: 'math_3',
    subjectId: 'math',
    topicId: 'geometry',
    type: 'closed',
    text: 'Dairənin radiusu 7 sm olarsa, sahəsini tapın. (π ≈ 22/7)',
    options: [
      { id: 'a', text: '154 sm²', isCorrect: true },
      { id: 'b', text: '44 sm²', isCorrect: false },
      { id: 'c', text: '77 sm²', isCorrect: false },
      { id: 'd', text: '49 sm²', isCorrect: false },
      { id: 'e', text: '132 sm²', isCorrect: false },
    ],
    explanation: 'S = πr² = (22/7) × 7² = 22 × 7 = 154 sm²',
    difficulty: 2,
    points: 8,
  },
  {
    id: 'math_4',
    subjectId: 'math',
    topicId: 'trigonometry',
    type: 'closed',
    text: 'sin²α + cos²α ifadəsinin qiyməti neçədir?',
    options: [
      { id: 'a', text: '0', isCorrect: false },
      { id: 'b', text: '1', isCorrect: true },
      { id: 'c', text: '2', isCorrect: false },
      { id: 'd', text: '-1', isCorrect: false },
      { id: 'e', text: 'α-dan asılıdır', isCorrect: false },
    ],
    explanation: 'Triqonometriyanın əsas tənliyi: sin²α + cos²α = 1',
    difficulty: 1,
    points: 8,
  },
  {
    id: 'math_5',
    subjectId: 'math',
    topicId: 'algebra_basics',
    type: 'closed',
    text: 'log₂8 ifadəsinin qiyməti neçədir?',
    options: [
      { id: 'a', text: '2', isCorrect: false },
      { id: 'b', text: '3', isCorrect: true },
      { id: 'c', text: '4', isCorrect: false },
      { id: 'd', text: '8', isCorrect: false },
      { id: 'e', text: '1', isCorrect: false },
    ],
    explanation: 'log₂8 = log₂2³ = 3',
    difficulty: 2,
    points: 8,
  },

  // === FİZİKA (Physics) ===
  {
    id: 'phys_1',
    subjectId: 'physics',
    topicId: 'mechanics',
    type: 'closed',
    text: 'Cismin kütləsi 5 kq, ona təsir edən qüvvə 20 N olarsa, cismin təcilini tapın.',
    options: [
      { id: 'a', text: '2 m/s²', isCorrect: false },
      { id: 'b', text: '4 m/s²', isCorrect: true },
      { id: 'c', text: '5 m/s²', isCorrect: false },
      { id: 'd', text: '10 m/s²', isCorrect: false },
      { id: 'e', text: '100 m/s²', isCorrect: false },
    ],
    explanation: 'Nyutonun II qanunu: F = ma → a = F/m = 20/5 = 4 m/s²',
    difficulty: 1,
    points: 8,
  },
  {
    id: 'phys_2',
    subjectId: 'physics',
    topicId: 'mechanics',
    type: 'closed',
    text: 'Sərbəst düşmə təcili g = 10 m/s² olarsa, 2 saniyədə cisim nə qədər yol gedir? (v₀ = 0)',
    options: [
      { id: 'a', text: '10 m', isCorrect: false },
      { id: 'b', text: '20 m', isCorrect: true },
      { id: 'c', text: '30 m', isCorrect: false },
      { id: 'd', text: '40 m', isCorrect: false },
      { id: 'e', text: '5 m', isCorrect: false },
    ],
    explanation: 's = v₀t + gt²/2 = 0 + 10×4/2 = 20 m',
    difficulty: 2,
    points: 8,
  },
  {
    id: 'phys_3',
    subjectId: 'physics',
    topicId: 'electricity',
    type: 'closed',
    text: 'Gərginlik 12 V, müqavimət 4 Ω olarsa, cərəyan şiddətini tapın.',
    options: [
      { id: 'a', text: '2 A', isCorrect: false },
      { id: 'b', text: '3 A', isCorrect: true },
      { id: 'c', text: '4 A', isCorrect: false },
      { id: 'd', text: '48 A', isCorrect: false },
      { id: 'e', text: '8 A', isCorrect: false },
    ],
    explanation: 'Om qanunu: I = U/R = 12/4 = 3 A',
    difficulty: 1,
    points: 8,
  },

  // === KİMYA (Chemistry) ===
  {
    id: 'chem_1',
    subjectId: 'chemistry',
    topicId: 'periodic_table',
    type: 'closed',
    text: 'Suyun kimyəvi formulu hansıdır?',
    options: [
      { id: 'a', text: 'CO₂', isCorrect: false },
      { id: 'b', text: 'H₂O', isCorrect: true },
      { id: 'c', text: 'NaCl', isCorrect: false },
      { id: 'd', text: 'H₂SO₄', isCorrect: false },
      { id: 'e', text: 'O₂', isCorrect: false },
    ],
    explanation: 'Suyun kimyəvi formulu H₂O-dur (2 hidrogen + 1 oksigen atomu)',
    difficulty: 1,
    points: 8,
  },
  {
    id: 'chem_2',
    subjectId: 'chemistry',
    topicId: 'periodic_table',
    type: 'closed',
    text: 'Dövri cədvəldə neçə qrup var?',
    options: [
      { id: 'a', text: '7', isCorrect: false },
      { id: 'b', text: '18', isCorrect: true },
      { id: 'c', text: '8', isCorrect: false },
      { id: 'd', text: '10', isCorrect: false },
      { id: 'e', text: '14', isCorrect: false },
    ],
    explanation: 'Dövri cədvəldə 18 qrup (sütun) var.',
    difficulty: 1,
    points: 8,
  },

  // === TARİX (History) ===
  {
    id: 'hist_1',
    subjectId: 'history',
    topicId: 'azerbaijan_history',
    type: 'closed',
    text: 'Azərbaycan Xalq Cümhuriyyəti hansı ildə elan olunub?',
    options: [
      { id: 'a', text: '1917', isCorrect: false },
      { id: 'b', text: '1918', isCorrect: true },
      { id: 'c', text: '1920', isCorrect: false },
      { id: 'd', text: '1991', isCorrect: false },
      { id: 'e', text: '1945', isCorrect: false },
    ],
    explanation: 'Azərbaycan Xalq Cümhuriyyəti 28 may 1918-ci ildə elan olunub.',
    difficulty: 1,
    points: 8,
  },
  {
    id: 'hist_2',
    subjectId: 'history',
    topicId: 'azerbaijan_history',
    type: 'closed',
    text: 'Azərbaycan Respublikasının müstəqilliyi hansı tarixdə bərpa olunub?',
    options: [
      { id: 'a', text: '30 avqust 1991', isCorrect: false },
      { id: 'b', text: '18 oktyabr 1991', isCorrect: true },
      { id: 'c', text: '28 may 1918', isCorrect: false },
      { id: 'd', text: '9 noyabr 1989', isCorrect: false },
      { id: 'e', text: '25 dekabr 1991', isCorrect: false },
    ],
    explanation: 'Azərbaycan 18 oktyabr 1991-ci ildə müstəqilliyini bərpa edib.',
    difficulty: 1,
    points: 8,
  },

  // === COĞRAFİYA (Geography) ===
  {
    id: 'geo_1',
    subjectId: 'geography',
    topicId: 'azerbaijan_geography',
    type: 'closed',
    text: 'Azərbaycanın paytaxtı hansıdır?',
    options: [
      { id: 'a', text: 'Gəncə', isCorrect: false },
      { id: 'b', text: 'Bakı', isCorrect: true },
      { id: 'c', text: 'Sumqayıt', isCorrect: false },
      { id: 'd', text: 'Mingəçevir', isCorrect: false },
      { id: 'e', text: 'Şəki', isCorrect: false },
    ],
    explanation: 'Azərbaycanın paytaxtı Bakı şəhəridir.',
    difficulty: 1,
    points: 8,
  },

  // === BİOLOGİYA (Biology) ===
  {
    id: 'bio_1',
    subjectId: 'biology',
    topicId: 'cell_biology',
    type: 'closed',
    text: 'Hüceyrənin enerji stansiyası hansı orqanoiddir?',
    options: [
      { id: 'a', text: 'Ribosomlar', isCorrect: false },
      { id: 'b', text: 'Mitoxondrilər', isCorrect: true },
      { id: 'c', text: 'Lizosomlar', isCorrect: false },
      { id: 'd', text: 'Nüvə', isCorrect: false },
      { id: 'e', text: 'Xloroplastlar', isCorrect: false },
    ],
    explanation: 'Mitoxondrilər hüceyrənin enerji stansiyası adlanır, çünki ATF sintez edirlər.',
    difficulty: 1,
    points: 8,
  },

  // === AZƏRBAYCAN DİLİ ===
  {
    id: 'az_1',
    subjectId: 'azerbaijani',
    topicId: 'grammar',
    type: 'closed',
    text: '"Uşaqlar bağda oynayırdılar" cümləsində xəbər hansı sözdür?',
    options: [
      { id: 'a', text: 'Uşaqlar', isCorrect: false },
      { id: 'b', text: 'oynayırdılar', isCorrect: true },
      { id: 'c', text: 'bağda', isCorrect: false },
      { id: 'd', text: 'bağ', isCorrect: false },
      { id: 'e', text: 'oyna', isCorrect: false },
    ],
    explanation: 'Xəbər cümlədə mübtədanın nə etdiyini bildirir. "Oynayırdılar" xəbərdir.',
    difficulty: 1,
    points: 8,
  },
];

export function getQuestionsForSubject(subjectId: string): Question[] {
  return SAMPLE_QUESTIONS.filter((q) => q.subjectId === subjectId);
}

export function getRandomQuestions(subjectId: string, count: number): Question[] {
  const subjectQuestions = getQuestionsForSubject(subjectId);
  const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

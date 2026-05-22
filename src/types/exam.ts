export type Subject = '중개사법' | '공법' | '공시세법';

export type QuestionCategory =
  | 'recent_frequent'
  | 'past'
  | 'issue'
  | 'trap'
  | 'easy';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'trap';

export type SourceType = 'original' | 'modified' | 'predicted' | 'weak_review';

export type ChoiceNumber = 1 | 2 | 3 | 4 | 5;

export type Question = {
  id: string;
  sourceRound: number;
  sourceYear?: number;
  subject: Subject;
  examNumber: number;
  displayNumber: number;
  chapter: string;
  topic: string;
  lawRef?: string;
  difficulty: Difficulty;
  sourceType: SourceType;
  category: QuestionCategory;
  frequencyScore: number;
  issueScore?: number;
  trapType?: string;
  questionText: string;
  choices: [string, string, string, string, string];
  answer: ChoiceNumber;
  explanation: string;
  memoryNote?: string;
  lawUpdateNote?: string;
  sourceTitle?: string;
};

export type ReleasedRoundMeta = {
  round: number;
  year: number;
  title: string;
  sourceUrl: string;
  lawBasis: string;
  note: string;
};

export type UserAnswer = {
  questionId: string;
  selectedChoice?: ChoiceNumber;
  isCorrect?: boolean;
  timeSpentSeconds?: number;
  changedCount?: number;
};

export type ExamMode = 'first_period' | 'brokerage_only' | 'public_law_only' | 'registry_tax_only';

export type ExamConfig = {
  mode: ExamMode;
  title: string;
  subjects: Subject[];
  durationMinutes: number;
};

export type ExamSession = {
  config: ExamConfig;
  roundMeta?: ReleasedRoundMeta;
  questions: Question[];
  answers: Record<string, UserAnswer>;
  currentIndex: number;
  remainingSeconds: number;
  isPaused: boolean;
};

export type SubjectScore = {
  subject: Subject;
  total: number;
  correct: number;
  score: number;
};

export type QuestionResult = {
  question: Question;
  selectedChoice?: ChoiceNumber;
  isCorrect: boolean;
};

export type ExamScore = {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  subjectScores: SubjectScore[];
  questionResults: QuestionResult[];
};

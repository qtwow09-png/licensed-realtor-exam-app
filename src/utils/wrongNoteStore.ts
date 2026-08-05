import { decorateQuestionPart } from '../data/examPartBlueprints';
import type {
  ChoiceNumber,
  ExamScore,
  Question,
  QuestionResult,
  Subject,
  WrongNote,
  WrongNoteAttempt,
} from '../types/exam';

const wrongNotesStorageKey = 'licensed-realtor-exam-wrong-notes';
const releasedRoundStoragePrefixes = [
  'licensed-realtor-exam-next-released-round',
  'licensed-realtor-exam-random-round-queue',
  'licensed-realtor-exam-last-random-round',
  'licensed-realtor-exam-selected-round',
];
const maxStoredAttempts = 50;
const masteryStreakTarget = 2;
const smartReviewLimit = 20;

const subjects: Subject[] = ['중개사법', '공법', '공시세법'];

export type WrongNoteStats = {
  total: number;
  active: number;
  mastered: number;
  repeatWrong: number;
  keyMemory: number;
  attemptsLast7Days: number;
  attemptsLast30Days: number;
};

export type WeakTopic = {
  subject: Subject;
  chapter: string;
  wrongCount: number;
  questionCount: number;
};

export type WeakPartStat = {
  subject: Subject;
  part: string;
  wrongCount: number;
  correctCount: number;
  totalAttempts: number;
  wrongRate: number;
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function normalizeNote(note: WrongNote): WrongNote {
  const correctStreak = note.correctStreak ?? 0;
  const decorated = decorateQuestionPart({
    ...note,
    id: note.questionId,
    sourceType: 'weak_review',
    category: 'trap',
    difficulty: 'hard',
    frequencyScore: 0,
    examNumber: 0,
    displayNumber: 0,
  });

  return {
    ...note,
    examPart: note.examPart ?? decorated.examPart,
    topicPart: note.topicPart ?? decorated.topicPart,
    wrongCount: Number.isFinite(note.wrongCount) ? note.wrongCount : 0,
    correctCount: Number.isFinite(note.correctCount) ? note.correctCount : 0,
    attempts: Array.isArray(note.attempts) ? note.attempts.slice(-maxStoredAttempts) : [],
    correctStreak,
    status: note.status ?? (correctStreak >= masteryStreakTarget ? 'mastered' : 'active'),
  };
}

function hasAnsweredWrongAttempt(note: WrongNote): boolean {
  return note.lastSelectedChoice !== undefined || Boolean(
    note.attempts?.some((attempt) => !attempt.isCorrect && attempt.selectedChoice !== undefined),
  );
}

function readMap(): Record<string, WrongNote> {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const rawNotes = window.localStorage.getItem(wrongNotesStorageKey);
    if (!rawNotes) {
      return {};
    }

    const parsed = JSON.parse(rawNotes) as Record<string, WrongNote>;
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([, note]) => hasAnsweredWrongAttempt(note))
        .map(([questionId, note]) => [questionId, normalizeNote(note)]),
    );
  } catch {
    return {};
  }
}

function writeMap(notes: Record<string, WrongNote>): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(wrongNotesStorageKey, JSON.stringify(notes));
  } catch {
    // 저장 공간이 일시적으로 부족해도 풀이 화면은 계속 사용할 수 있게 합니다.
  }
}

function stableQuestionId(question: Question): string {
  return question.originQuestionId ?? question.id.split('-round-')[0];
}

function appendAttempt(
  note: WrongNote,
  result: QuestionResult,
  now: string,
): WrongNoteAttempt[] {
  return [
    ...(note.attempts ?? []),
    {
      at: now,
      selectedChoice: result.selectedChoice as ChoiceNumber | undefined,
      isCorrect: result.isCorrect,
    },
  ].slice(-maxStoredAttempts);
}

function noteFromResult(result: QuestionResult, now: string): WrongNote {
  const question = decorateQuestionPart(result.question);

  return {
    questionId: stableQuestionId(question),
    subject: question.subject,
    chapter: question.chapter,
    topic: question.topic,
    examPart: question.examPart,
    topicPart: question.topicPart,
    lawRef: question.lawRef,
    questionText: question.questionText,
    choices: question.choices,
    answer: question.answer,
    explanation: question.explanation,
    explanationVerified: question.explanationVerified,
    explanationSource: question.explanationSource,
    sourceRound: question.sourceRound,
    sourceYear: question.sourceYear,
    sourceTitle: question.sourceTitle,
    lawUpdateNote: question.lawUpdateNote,
    subSubject: question.subSubject,
    originalSource: question.originalSource,
    isLawUpdated: question.isLawUpdated,
    lawUpdateDescription: question.lawUpdateDescription,
    needsReview: question.needsReview,
    trapType: question.trapType,
    wrongCount: 0,
    correctCount: 0,
    correctStreak: 0,
    status: 'active',
    lastSelectedChoice: result.selectedChoice,
    lastWrongAt: now,
    attempts: [],
  };
}

function sortNotes(notes: WrongNote[]): WrongNote[] {
  return [...notes].sort((left, right) => {
    if (right.wrongCount !== left.wrongCount) {
      return right.wrongCount - left.wrongCount;
    }

    return new Date(right.lastWrongAt).getTime() - new Date(left.lastWrongAt).getTime();
  });
}

export function recordWrongNotes(score: ExamScore): void {
  const notes = readMap();
  const now = new Date().toISOString();

  score.questionResults.forEach((result) => {
    if (!result.isCorrect && result.selectedChoice === undefined) {
      return;
    }

    const resultQuestion = decorateQuestionPart(result.question);
    const questionId = stableQuestionId(resultQuestion);
    const existing = notes[questionId];

    if (!result.isCorrect) {
      const nextNote = existing ?? noteFromResult({ ...result, question: resultQuestion }, now);
      notes[questionId] = {
        ...nextNote,
        questionText: resultQuestion.questionText,
        choices: resultQuestion.choices,
        answer: resultQuestion.answer,
        explanation: resultQuestion.explanation,
        explanationVerified: resultQuestion.explanationVerified,
        explanationSource: resultQuestion.explanationSource,
        examPart: resultQuestion.examPart,
        topicPart: resultQuestion.topicPart,
        lawUpdateNote: resultQuestion.lawUpdateNote,
        subSubject: resultQuestion.subSubject,
        originalSource: resultQuestion.originalSource,
        isLawUpdated: resultQuestion.isLawUpdated,
        lawUpdateDescription: resultQuestion.lawUpdateDescription,
        needsReview: resultQuestion.needsReview,
        sourceTitle: resultQuestion.sourceTitle,
        wrongCount: (existing?.wrongCount ?? 0) + 1,
        correctStreak: 0,
        status: 'active',
        lastSelectedChoice: result.selectedChoice,
        lastWrongAt: now,
        attempts: appendAttempt(nextNote, result, now),
      };
      return;
    }

    if (existing) {
      const correctStreak = (existing.correctStreak ?? 0) + 1;
      notes[questionId] = {
        ...existing,
        correctCount: existing.correctCount + 1,
        correctStreak,
        status: correctStreak >= masteryStreakTarget ? 'mastered' : 'active',
        lastCorrectAt: now,
        attempts: appendAttempt(existing, result, now),
      };
    }
  });

  writeMap(notes);
}

export function getWrongNotes(subject?: Subject): WrongNote[] {
  const notes = Object.values(readMap());
  const filteredNotes = subject ? notes.filter((note) => note.subject === subject) : notes;

  return sortNotes(filteredNotes);
}

export function getActiveWrongNotes(subject?: Subject): WrongNote[] {
  return getWrongNotes(subject).filter((note) => note.status !== 'mastered');
}

export function getMasteredWrongNotes(): WrongNote[] {
  return getWrongNotes().filter((note) => note.status === 'mastered');
}

export function getKeyMemoryWrongNotes(): WrongNote[] {
  return getWrongNotes().filter((note) => note.wrongCount >= 3);
}

export function getWrongNoteCount(): number {
  return getActiveWrongNotes().length;
}

export function getWrongNoteCountsBySubject(): Record<Subject, number> {
  return subjects.reduce((counts, subject) => ({
    ...counts,
    [subject]: getActiveWrongNotes(subject).length,
  }), {} as Record<Subject, number>);
}

export function getWrongNoteStats(): WrongNoteStats {
  const notes = getWrongNotes();
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const attempts = notes.flatMap((note) => note.attempts ?? []);

  return {
    total: notes.length,
    active: notes.filter((note) => note.status !== 'mastered').length,
    mastered: notes.filter((note) => note.status === 'mastered').length,
    repeatWrong: notes.filter((note) => note.wrongCount >= 2).length,
    keyMemory: notes.filter((note) => note.wrongCount >= 3).length,
    attemptsLast7Days: attempts.filter((attempt) => new Date(attempt.at).getTime() >= sevenDaysAgo).length,
    attemptsLast30Days: attempts.filter((attempt) => new Date(attempt.at).getTime() >= thirtyDaysAgo).length,
  };
}

export function getWeakTopics(limit = 5): WeakTopic[] {
  const topicMap = new Map<string, WeakTopic>();

  getActiveWrongNotes().forEach((note) => {
    const key = `${note.subject}::${note.chapter}`;
    const existing = topicMap.get(key);

    topicMap.set(key, {
      subject: note.subject,
      chapter: note.chapter,
      wrongCount: (existing?.wrongCount ?? 0) + note.wrongCount,
      questionCount: (existing?.questionCount ?? 0) + 1,
    });
  });

  return Array.from(topicMap.values())
    .sort((left, right) => (
      right.wrongCount - left.wrongCount || right.questionCount - left.questionCount
    ))
    .slice(0, limit);
}

export function getWeakPartStats(limit = 8): WeakPartStat[] {
  const grouped = new Map<string, WeakPartStat>();

  getActiveWrongNotes().forEach((note) => {
    const part = note.topicPart ?? note.examPart ?? note.topic;
    const key = `${note.subject}::${part}`;
    const previous = grouped.get(key) ?? {
      subject: note.subject,
      part,
      wrongCount: 0,
      correctCount: 0,
      totalAttempts: 0,
      wrongRate: 0,
    };
    const wrongCount = previous.wrongCount + note.wrongCount;
    const correctCount = previous.correctCount + note.correctCount;
    const totalAttempts = wrongCount + correctCount;

    grouped.set(key, {
      ...previous,
      wrongCount,
      correctCount,
      totalAttempts,
      wrongRate: totalAttempts > 0 ? Math.round((wrongCount / totalAttempts) * 100) : 0,
    });
  });

  return Array.from(grouped.values())
    .sort((left, right) => {
      if (right.wrongRate !== left.wrongRate) {
        return right.wrongRate - left.wrongRate;
      }

      return right.wrongCount - left.wrongCount;
    })
    .slice(0, limit);
}

export function buildWrongReviewQuestions(): Question[] {
  return getActiveWrongNotes()
    .slice(0, smartReviewLimit)
    .map((note, index) => ({
      id: `${note.questionId}-wrong-review-${Date.now()}-${index}`,
      originQuestionId: note.questionId,
      sourceRound: note.sourceRound,
      sourceYear: note.sourceYear,
      subject: note.subject,
      examNumber: index + 1,
      displayNumber: index + 1,
      chapter: note.chapter,
      topic: note.topic,
      examPart: note.examPart,
      topicPart: note.topicPart,
      lawRef: note.lawRef,
      difficulty: note.wrongCount >= 3 ? 'trap' : 'hard',
      sourceType: 'weak_review',
      category: 'trap',
      frequencyScore: Math.min(100, 70 + note.wrongCount * 5),
      trapType: note.trapType,
      questionText: note.questionText,
      choices: note.choices,
      answer: note.answer,
      explanation: note.explanation,
      explanationVerified: note.explanationVerified,
      explanationSource: note.explanationSource,
      lawUpdateNote: note.lawUpdateNote,
      subSubject: note.subSubject,
      originalSource: note.originalSource,
      isLawUpdated: note.isLawUpdated,
      lawUpdateDescription: note.lawUpdateDescription,
      needsReview: note.needsReview,
      sourceTitle: note.sourceTitle,
    }));
}

export function resetStudyData(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(wrongNotesStorageKey);
  Object.keys(window.localStorage)
    .filter((key) => releasedRoundStoragePrefixes.some((prefix) => key.startsWith(prefix)))
    .forEach((key) => window.localStorage.removeItem(key));
}

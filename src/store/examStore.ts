import { firstReleasedRound, releasedRoundByNumber, shuffledReleasedRoundNumbers } from '../data/releasedRounds';
import type { ChoiceNumber, ExamConfig, ExamMode, ExamSession, ReleasedRoundMeta, Subject, UserAnswer } from '../types/exam';
import { buildExamPaper } from '../utils/buildExamPaper';
import { buildWrongReviewQuestions } from '../utils/wrongNoteStore';

export const examConfigs: Record<ExamMode, ExamConfig> = {
  first_period: {
    mode: 'first_period',
    title: '2차 1교시',
    subjects: ['중개사법', '공법'],
    durationMinutes: 100,
  },
  brokerage_only: {
    mode: 'brokerage_only',
    title: '중개사법 단독',
    subjects: ['중개사법'],
    durationMinutes: 50,
  },
  public_law_only: {
    mode: 'public_law_only',
    title: '공법 단독',
    subjects: ['공법'],
    durationMinutes: 50,
  },
  registry_tax_only: {
    mode: 'registry_tax_only',
    title: '공시법/세법 단독',
    subjects: ['공시세법'],
    durationMinutes: 50,
  },
};

const roundStoragePrefix = 'licensed-realtor-exam-random-round-queue';
const lastRoundStoragePrefix = 'licensed-realtor-exam-last-random-round';

function storageKey(mode: ExamMode): string {
  return `${roundStoragePrefix}:${mode}`;
}

function lastRoundKey(mode: ExamMode): string {
  return `${lastRoundStoragePrefix}:${mode}`;
}

function readRoundQueue(mode: ExamMode): number[] {
  if (typeof window === 'undefined') {
    return shuffledReleasedRoundNumbers();
  }

  const storedQueue = window.localStorage.getItem(storageKey(mode));

  if (!storedQueue) {
    return [];
  }

  try {
    const parsedQueue = JSON.parse(storedQueue);
    return Array.isArray(parsedQueue)
      ? parsedQueue.filter((round) => Number.isInteger(round))
      : [];
  } catch {
    return [];
  }
}

function writeRoundQueue(mode: ExamMode, queue: number[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey(mode), JSON.stringify(queue));
}

function readLastRound(mode: ExamMode): number | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const storedRound = Number(window.localStorage.getItem(lastRoundKey(mode)));
  return Number.isFinite(storedRound) && storedRound > 0 ? storedRound : undefined;
}

function writeLastRound(mode: ExamMode, round: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(lastRoundKey(mode), String(round));
}

function pickRandomRound(mode: ExamMode): ReleasedRoundMeta {
  const lastRound = readLastRound(mode);
  const queue = readRoundQueue(mode);
  const nextQueue = queue.length > 0 ? [...queue] : shuffledReleasedRoundNumbers(lastRound);
  const nextRound = nextQueue.shift();

  writeRoundQueue(mode, nextQueue);

  if (!nextRound) {
    return firstReleasedRound();
  }

  writeLastRound(mode, nextRound);
  return releasedRoundByNumber(nextRound);
}

export function createExamSession(mode: ExamMode): ExamSession {
  const config = examConfigs[mode];
  const roundMeta = pickRandomRound(mode);
  const questions = buildExamPaper({ mode, subjects: config.subjects, roundMeta });

  return {
    config,
    roundMeta,
    questions,
    answers: {},
    currentIndex: 0,
    remainingSeconds: config.durationMinutes * 60,
    isPaused: false,
  };
}

export function createWrongReviewSession(): ExamSession | null {
  const questions = buildWrongReviewQuestions();

  if (questions.length === 0) {
    return null;
  }

  const durationMinutes = Math.max(20, Math.ceil(questions.length * 1.25));

  return {
    config: {
      mode: 'first_period',
      title: '틀린문제 복습',
      subjects: Array.from(new Set(questions.map((question) => question.subject))) as Subject[],
      durationMinutes,
    },
    isWrongReview: true,
    questions,
    answers: {},
    currentIndex: 0,
    remainingSeconds: durationMinutes * 60,
    isPaused: false,
  };
}

export function setAnswer(
  answers: Record<string, UserAnswer>,
  questionId: string,
  selectedChoice: ChoiceNumber,
): Record<string, UserAnswer> {
  const previous = answers[questionId];
  return {
    ...answers,
    [questionId]: {
      questionId,
      selectedChoice,
      changedCount: previous?.selectedChoice && previous.selectedChoice !== selectedChoice
        ? (previous.changedCount ?? 0) + 1
        : previous?.changedCount ?? 0,
    },
  };
}

export function subjectLabel(subjects: Subject[]): string {
  return subjects.join(' + ');
}

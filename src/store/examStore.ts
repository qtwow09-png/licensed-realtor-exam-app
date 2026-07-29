import { latestReleasedRound, releasedRoundByNumber } from '../data/releasedRounds';
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

const roundStoragePrefix = 'licensed-realtor-exam-selected-round';

function storageKey(mode: ExamMode): string {
  return `${roundStoragePrefix}:${mode}`;
}

export function readSelectedRound(mode: ExamMode): number {
  if (typeof window === 'undefined') {
    return latestReleasedRound().round;
  }

  const storedRound = Number(window.localStorage.getItem(storageKey(mode)));
  return Number.isFinite(storedRound) && storedRound > 0
    ? releasedRoundByNumber(storedRound).round
    : latestReleasedRound().round;
}

export function writeSelectedRound(mode: ExamMode, round: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey(mode), String(releasedRoundByNumber(round).round));
}

export function createExamSession(mode: ExamMode, round: number): ExamSession {
  const config = examConfigs[mode];
  const roundMeta = releasedRoundByNumber(round);
  const questions = buildExamPaper({ mode, subjects: config.subjects, roundMeta });
  writeSelectedRound(mode, roundMeta.round);

  return {
    config,
    roundMeta,
    selectedRound: roundMeta.round,
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

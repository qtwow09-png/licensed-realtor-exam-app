import { firstReleasedRound, nextReleasedRound, releasedRoundByNumber } from '../data/releasedRounds';
import type { ChoiceNumber, ExamConfig, ExamMode, ExamSession, ReleasedRoundMeta, Subject, UserAnswer } from '../types/exam';
import { buildExamPaper } from '../utils/buildExamPaper';

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

const roundStoragePrefix = 'licensed-realtor-exam-next-released-round';

function storageKey(mode: ExamMode): string {
  return `${roundStoragePrefix}:${mode}`;
}

function readNextRound(mode: ExamMode): ReleasedRoundMeta {
  if (typeof window === 'undefined') {
    return firstReleasedRound();
  }

  const storedRound = Number(window.localStorage.getItem(storageKey(mode)));
  return Number.isFinite(storedRound) && storedRound > 0
    ? releasedRoundByNumber(storedRound)
    : firstReleasedRound();
}

function advanceNextRound(mode: ExamMode, currentRound: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey(mode), String(nextReleasedRound(currentRound).round));
}

export function createExamSession(mode: ExamMode): ExamSession {
  const config = examConfigs[mode];
  const roundMeta = readNextRound(mode);
  const questions = buildExamPaper({ mode, subjects: config.subjects, roundMeta });
  advanceNextRound(mode, roundMeta.round);

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

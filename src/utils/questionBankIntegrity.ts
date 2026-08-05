import type { Question, Subject, SubSubject } from '../types/exam';
import { decorateQuestionPart, targetPartsForSubject } from '../data/examPartBlueprints';
import { expectsExampleBox, parseQuestionText } from './questionTextParser';

export const recentRounds = [30, 31, 32, 33, 34, 35, 36];
export const legacyRounds = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
export const recentQuestionRatio = 0.7;

const subjectTargetCounts: Record<Subject, number> = {
  중개사법: 40,
  공법: 40,
  공시세법: 40,
};

export const registryTaxTargets: Record<SubSubject, number> = {
  중개사법: 0,
  공법: 0,
  지적법: 12,
  등기법: 12,
  세법: 16,
};

export type QuestionBankIntegrityReport = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    totalQuestions: number;
    recentQuestions: number;
    legacyQuestions: number;
    boxQuestions: number;
    reviewQuestions: number;
  };
};

export class QuestionBankIntegrityError extends Error {
  report: QuestionBankIntegrityReport;

  constructor(report: QuestionBankIntegrityReport) {
    super(report.errors.join('\n'));
    this.name = 'QuestionBankIntegrityError';
    this.report = report;
  }
}

function isRecentRound(round: number): boolean {
  return recentRounds.includes(round);
}

function isLegacyRound(round: number): boolean {
  return legacyRounds.includes(round);
}

function recentTarget(total: number): number {
  return Math.round(total * recentQuestionRatio);
}

function legacyTarget(total: number): number {
  return total - recentTarget(total);
}

function addPoolAvailabilityErrors(
  questions: Question[],
  subject: Subject,
  targetCount: number,
  errors: string[],
) {
  const subjectQuestions = questions.filter((question) => question.subject === subject && !question.needsReview);
  const recentCount = subjectQuestions.filter((question) => isRecentRound(question.sourceRound)).length;
  const legacyCount = subjectQuestions.filter((question) => isLegacyRound(question.sourceRound)).length;
  const requiredRecent = recentTarget(targetCount);
  const requiredLegacy = legacyTarget(targetCount);

  if (recentCount < requiredRecent) {
    errors.push(`${subject}: 30~36회 검증 문항 ${recentCount}개, 필요 ${requiredRecent}개`);
  }

  if (legacyCount < requiredLegacy) {
    errors.push(`${subject}: 20~29회 검증 문항 ${legacyCount}개, 필요 ${requiredLegacy}개`);
  }
}

function addPartAvailabilityErrors(
  questions: Question[],
  subject: Subject,
  errors: string[],
) {
  const decoratedQuestions = questions.map(decorateQuestionPart);

  targetPartsForSubject(subject).forEach((part) => {
    const partQuestions = decoratedQuestions.filter((question) => (
      question.subject === subject
      && question.examPart === part.label
      && !question.needsReview
    ));
    const recentCount = partQuestions.filter((question) => isRecentRound(question.sourceRound)).length;
    const legacyCount = partQuestions.filter((question) => isLegacyRound(question.sourceRound)).length;
    const requiredRecent = recentTarget(part.targetCount);
    const requiredLegacy = legacyTarget(part.targetCount);

    if (recentCount < requiredRecent) {
      errors.push(`${subject}/${part.label}: 30~36회 검증 문항 ${recentCount}개, 필요 ${requiredRecent}개`);
    }

    if (legacyCount < requiredLegacy) {
      errors.push(`${subject}/${part.label}: 20~29회 검증 문항 ${legacyCount}개, 필요 ${requiredLegacy}개`);
    }
  });
}

function addRegistryTaxAvailabilityErrors(questions: Question[], errors: string[]) {
  (['지적법', '등기법', '세법'] as SubSubject[]).forEach((subSubject) => {
    const targetCount = registryTaxTargets[subSubject];
    const subQuestions = questions.filter((question) => (
      question.subject === '공시세법'
      && question.subSubject === subSubject
      && !question.needsReview
    ));
    const recentCount = subQuestions.filter((question) => isRecentRound(question.sourceRound)).length;
    const legacyCount = subQuestions.filter((question) => isLegacyRound(question.sourceRound)).length;
    const requiredRecent = recentTarget(targetCount);
    const requiredLegacy = legacyTarget(targetCount);

    if (recentCount < requiredRecent) {
      errors.push(`공시세법/${subSubject}: 30~36회 검증 문항 ${recentCount}개, 필요 ${requiredRecent}개`);
    }

    if (legacyCount < requiredLegacy) {
      errors.push(`공시세법/${subSubject}: 20~29회 검증 문항 ${legacyCount}개, 필요 ${requiredLegacy}개`);
    }
  });
}

export function validateQuestionBankForExam(
  questions: Question[],
  subjects: Subject[],
): QuestionBankIntegrityReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  let boxQuestions = 0;
  let reviewQuestions = 0;

  questions.forEach((question) => {
    if (ids.has(question.id)) {
      errors.push(`${question.id}: 문제 ID가 중복됩니다.`);
    }
    ids.add(question.id);

    if (question.needsReview) {
      reviewQuestions += 1;
    }

    if (!question.questionText.trim()) {
      errors.push(`${question.id}: 문제 본문이 비어 있습니다.`);
    }

    if (!Array.isArray(question.choices) || question.choices.length !== 5) {
      errors.push(`${question.id}: 보기가 5개가 아닙니다.`);
    } else {
      question.choices.forEach((choice, index) => {
        if (!choice.trim()) {
          errors.push(`${question.id}: ${index + 1}번 보기가 비어 있습니다.`);
        }
      });
    }

    if (!Number.isInteger(question.answer) || question.answer < 1 || question.answer > 5) {
      errors.push(`${question.id}: 정답이 1~5 범위가 아닙니다.`);
    }

    if (question.isLawUpdated && !question.lawUpdateDescription?.trim()) {
      errors.push(`${question.id}: 현행법 보정 문항인데 보정 설명이 없습니다.`);
    }

    if (!question.originalSource?.includes('Q-Net') && !question.originalSource?.includes('q-net')) {
      warnings.push(`${question.id}: Q-Net 공식 출처 문구를 확인할 수 없습니다.`);
    }

    if (question.originalSource?.includes('보조 추출')) {
      warnings.push(`${question.id}: 보조 추출 출처가 포함되어 PDF 원문 대조 검수가 필요합니다.`);
    }

    if (expectsExampleBox(question.questionText)) {
      boxQuestions += 1;
      const parsed = parseQuestionText(question.questionText);

      if (parsed.examples.length === 0) {
        errors.push(`${question.id}: 박스형 표지가 있으나 박스 자료를 분리하지 못했습니다.`);
      }

      if (!parsed.stem) {
        errors.push(`${question.id}: 박스형 문항의 질문 본문을 분리하지 못했습니다.`);
      }
    }
  });

  subjects.forEach((subject) => {
    if (subject === '공시세법') {
      addRegistryTaxAvailabilityErrors(questions, errors);
      addPartAvailabilityErrors(questions, subject, errors);
      return;
    }

    addPoolAvailabilityErrors(questions, subject, subjectTargetCounts[subject], errors);
    addPartAvailabilityErrors(questions, subject, errors);
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    metrics: {
      totalQuestions: questions.length,
      recentQuestions: questions.filter((question) => isRecentRound(question.sourceRound)).length,
      legacyQuestions: questions.filter((question) => isLegacyRound(question.sourceRound)).length,
      boxQuestions,
      reviewQuestions,
    },
  };
}

export function assertQuestionBankReady(questions: Question[], subjects: Subject[]) {
  const report = validateQuestionBankForExam(questions, subjects);

  if (!report.ok) {
    throw new QuestionBankIntegrityError(report);
  }
}

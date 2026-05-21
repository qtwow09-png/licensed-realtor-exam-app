import { sampleQuestions } from '../data/sampleQuestions';
import type { ExamMode, Question, QuestionCategory, Subject } from '../types/exam';

const targetByCategory: Record<QuestionCategory, number> = {
  recent_frequent: 16,
  past: 8,
  issue: 4,
  trap: 8,
  easy: 4,
};

function stableShuffle<T>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const left = JSON.stringify(a);
    const right = JSON.stringify(b);
    return left.localeCompare(right, 'ko');
  });
}

function takeSubjectQuestions(subject: Subject): Question[] {
  const candidates = sampleQuestions.filter((question) => question.subject === subject);
  const selected: Question[] = [];

  Object.entries(targetByCategory).forEach(([category, targetCount]) => {
    const categoryQuestions = stableShuffle(
      candidates.filter((question) => question.category === category),
    );
    selected.push(...categoryQuestions.slice(0, targetCount));
  });

  const selectedIds = new Set(selected.map((question) => question.id));
  const fillers = stableShuffle(candidates.filter((question) => !selectedIds.has(question.id)));

  while (selected.length < 40 && fillers.length > 0) {
    selected.push(fillers[selected.length % fillers.length]);
  }

  return selected.slice(0, 40);
}

function displayStartFor(mode: ExamMode, subject: Subject, subjectIndex: number): number {
  if (mode === 'first_period') {
    return subjectIndex === 0 ? 1 : 41;
  }

  if (mode === 'public_law_only' && subject === '공법') {
    return 41;
  }

  return 1;
}

export function buildExamPaper(options: {
  mode: ExamMode;
  subjects: Subject[];
}): Question[] {
  const paper = options.subjects.flatMap((subject, subjectIndex) => {
    const startNumber = displayStartFor(options.mode, subject, subjectIndex);
    return takeSubjectQuestions(subject).map((question, index) => ({
      ...question,
      examNumber: index + 1,
      displayNumber: startNumber + index,
    }));
  });

  return paper;
}


import { sampleQuestions } from '../data/sampleQuestions';
import type { ChoiceNumber, ExamMode, Question, QuestionCategory, Subject } from '../types/exam';

const targetByCategory: Record<QuestionCategory, number> = {
  recent_frequent: 16,
  past: 8,
  issue: 4,
  trap: 8,
  easy: 4,
};

const lastPaperFingerprintByMode: Partial<Record<ExamMode, string>> = {};

function randomIndex(max: number): number {
  if (max <= 0) {
    return 0;
  }

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function shuffle<T>(items: T[]): T[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }

  return nextItems;
}

function shuffleChoices(question: Question): Pick<Question, 'choices' | 'answer'> {
  const choices = question.choices.map((choice, index) => ({
    choice,
    isCorrect: index + 1 === question.answer,
  }));
  const shuffledChoices = shuffle(choices);
  const answerIndex = shuffledChoices.findIndex((choice) => choice.isCorrect);

  return {
    choices: shuffledChoices.map((choice) => choice.choice) as Question['choices'],
    answer: (answerIndex + 1) as ChoiceNumber,
  };
}

function makeSessionVariant(question: Question, index: number, displayStart: number): Question {
  const choiceVariant = shuffleChoices(question);

  return {
    ...question,
    ...choiceVariant,
    id: `${question.id}-run-${Date.now()}-${index}-${randomIndex(100000)}`,
    examNumber: index + 1,
    displayNumber: displayStart + index,
  };
}

function takeSubjectQuestions(subject: Subject): Question[] {
  const candidates = sampleQuestions.filter((question) => question.subject === subject);
  const selected: Question[] = [];

  Object.entries(targetByCategory).forEach(([category, targetCount]) => {
    const categoryQuestions = shuffle(
      candidates.filter((question) => question.category === category),
    );
    selected.push(...categoryQuestions.slice(0, targetCount));
  });

  const selectedIds = new Set(selected.map((question) => question.id));
  const fillers = shuffle(candidates.filter((question) => !selectedIds.has(question.id)));

  while (selected.length < 40 && fillers.length > 0) {
    selected.push(fillers[selected.length % fillers.length]);
  }

  return shuffle(selected).slice(0, 40);
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
  let paper: Question[] = [];
  let fingerprint = '';
  let attempts = 0;

  do {
    attempts += 1;
    paper = options.subjects.flatMap((subject, subjectIndex) => {
      const startNumber = displayStartFor(options.mode, subject, subjectIndex);
      return takeSubjectQuestions(subject).map((question, index) => (
        makeSessionVariant(question, index, startNumber)
      ));
    });
    fingerprint = paper
      .map((question) => `${question.subject}:${question.topic}:${question.answer}:${question.choices.join('|')}`)
      .join('::');
  } while (fingerprint === lastPaperFingerprintByMode[options.mode] && attempts < 5);

  lastPaperFingerprintByMode[options.mode] = fingerprint;

  return paper;
}

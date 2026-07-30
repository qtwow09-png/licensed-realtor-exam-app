import { releasedExamQuestions } from '../data/releasedExamQuestions';
import type { ChoiceNumber, ExamMode, Question, Subject, SubSubject } from '../types/exam';

const registryTaxTargets: Record<SubSubject, number> = {
  중개사법: 0,
  공법: 0,
  지적법: 12,
  등기법: 12,
  세법: 16,
};

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

function displayStartFor(mode: ExamMode, subject: Subject, subjectIndex: number): number {
  if (mode === 'first_period') {
    return subjectIndex === 0 ? 1 : 41;
  }

  if (mode === 'public_law_only' && subject === '공법') {
    return 41;
  }

  return 1;
}

function balancedSample(pool: Question[], targetCount: number): Question[] {
  const rounds = shuffle(Array.from(new Set(pool.map((question) => question.sourceRound))).sort());
  const baseCount = Math.floor(targetCount / rounds.length);
  let remainder = targetCount % rounds.length;
  const selected: Question[] = [];
  const selectedIds = new Set<string>();

  rounds.forEach((round) => {
    const target = baseCount + (remainder > 0 ? 1 : 0);
    remainder -= 1;
    const roundQuestions = shuffle(pool.filter((question) => question.sourceRound === round));
    roundQuestions.slice(0, target).forEach((question) => {
      selected.push(question);
      selectedIds.add(question.id);
    });
  });

  if (selected.length < targetCount) {
    shuffle(pool.filter((question) => !selectedIds.has(question.id)))
      .slice(0, targetCount - selected.length)
      .forEach((question) => selected.push(question));
  }

  return selected.slice(0, targetCount);
}

function takeSubjectQuestions(subject: Subject): Question[] {
  const subjectQuestions = releasedExamQuestions.filter((question) => question.subject === subject);

  if (subject === '공시세법') {
    return (['지적법', '등기법', '세법'] as SubSubject[]).flatMap((subSubject) => (
      shuffle(
        balancedSample(
          subjectQuestions.filter((question) => question.subSubject === subSubject),
          registryTaxTargets[subSubject],
        ),
      )
    ));
  }

  return shuffle(balancedSample(subjectQuestions, 40));
}

function makeSessionQuestion(question: Question, index: number, displayStart: number): Question {
  const choiceVariant = shuffleChoices(question);

  return {
    ...question,
    ...choiceVariant,
    id: `${question.id}-run-${Date.now()}-${index}-${randomIndex(100000)}`,
    originQuestionId: question.id,
    sourceType: question.isLawUpdated ? 'modified' : 'original',
    sourceTitle: `제${question.sourceRound}회 실제 기출`,
    lawUpdateNote: question.isLawUpdated
      ? question.lawUpdateDescription
      : question.lawUpdateNote,
    displayNumber: displayStart + index,
  };
}

export function buildExamPaper(options: {
  mode: ExamMode;
  subjects: Subject[];
}): Question[] {
  return options.subjects.flatMap((subject, subjectIndex) => {
    const startNumber = displayStartFor(options.mode, subject, subjectIndex);
    return takeSubjectQuestions(subject).map((question, index) => (
      makeSessionQuestion(question, index, startNumber)
    ));
  });
}

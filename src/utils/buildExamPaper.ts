import { releasedExamQuestions } from '../data/releasedExamQuestions';
import { decorateQuestionPart, targetPartsForSubject } from '../data/examPartBlueprints';
import type { ChoiceNumber, ExamMode, Question, Subject } from '../types/exam';
import {
  assertQuestionBankReady,
  legacyRounds,
  recentQuestionRatio,
  recentRounds,
} from './questionBankIntegrity';

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

function takeRatioSample(pool: Question[], targetCount: number): Question[] {
  const verifiedPool = pool.filter((question) => !question.needsReview);
  const recentTarget = Math.round(targetCount * recentQuestionRatio);
  const legacyTarget = targetCount - recentTarget;
  const recentPool = verifiedPool.filter((question) => recentRounds.includes(question.sourceRound));
  const legacyPool = verifiedPool.filter((question) => legacyRounds.includes(question.sourceRound));

  return [
    ...balancedSample(recentPool, recentTarget),
    ...balancedSample(legacyPool, legacyTarget),
  ];
}

function takeTopicBalancedSample(pool: Question[], targetCount: number): Question[] {
  const selected: Question[] = [];
  const selectedIds = new Set<string>();
  const topicCounts = new Map<string, number>();
  const shuffledPool = shuffle(pool);

  shuffledPool.forEach((question) => {
    const topicPart = question.topicPart ?? question.topic;
    const topicCount = topicCounts.get(topicPart) ?? 0;

    if (selected.length >= targetCount || topicCount >= 2) {
      return;
    }

    selected.push(question);
    selectedIds.add(question.id);
    topicCounts.set(topicPart, topicCount + 1);
  });

  if (selected.length < targetCount) {
    shuffledPool
      .filter((question) => !selectedIds.has(question.id))
      .slice(0, targetCount - selected.length)
      .forEach((question) => selected.push(question));
  }

  return selected.slice(0, targetCount);
}

function takeSubjectQuestions(subject: Subject): Question[] {
  const subjectQuestions = releasedExamQuestions
    .filter((question) => question.subject === subject)
    .map(decorateQuestionPart);

  const selectedByPart = targetPartsForSubject(subject).flatMap((part) => (
    takeTopicBalancedSample(
      takeRatioSample(
        subjectQuestions.filter((question) => question.examPart === part.label),
        part.targetCount,
      ),
      part.targetCount,
    )
  ));

  if (subject === '공시세법') {
    return selectedByPart;
  }

  return shuffle(selectedByPart);
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
  assertQuestionBankReady(releasedExamQuestions, options.subjects);

  return options.subjects.flatMap((subject, subjectIndex) => {
    const startNumber = displayStartFor(options.mode, subject, subjectIndex);
    return takeSubjectQuestions(subject).map((question, index) => (
      makeSessionQuestion(question, index, startNumber)
    ));
  });
}

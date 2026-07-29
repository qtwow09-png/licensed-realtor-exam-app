import type { ExamScore, Question, QuestionResult, Subject, WrongNote } from '../types/exam';

const wrongNotesStorageKey = 'licensed-realtor-exam-wrong-notes';
const releasedRoundStoragePrefixes = [
  'licensed-realtor-exam-next-released-round',
  'licensed-realtor-exam-random-round-queue',
  'licensed-realtor-exam-last-random-round',
  'licensed-realtor-exam-selected-round',
];

const subjects: Subject[] = ['중개사법', '공법', '공시세법'];

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readMap(): Record<string, WrongNote> {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const rawNotes = window.localStorage.getItem(wrongNotesStorageKey);
    return rawNotes ? JSON.parse(rawNotes) as Record<string, WrongNote> : {};
  } catch {
    return {};
  }
}

function writeMap(notes: Record<string, WrongNote>): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(wrongNotesStorageKey, JSON.stringify(notes));
}

function stableQuestionId(question: Question): string {
  return question.originQuestionId ?? question.id.split('-round-')[0];
}

function noteFromResult(result: QuestionResult, now: string): WrongNote {
  const question = result.question;

  return {
    questionId: stableQuestionId(question),
    subject: question.subject,
    chapter: question.chapter,
    topic: question.topic,
    lawRef: question.lawRef,
    questionText: question.questionText,
    choices: question.choices,
    answer: question.answer,
    explanation: question.explanation,
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
    wrongCount: 1,
    correctCount: 0,
    lastSelectedChoice: result.selectedChoice,
    lastWrongAt: now,
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
    const questionId = stableQuestionId(result.question);
    const existing = notes[questionId];

    if (!result.isCorrect) {
      const nextNote = existing ?? noteFromResult(result, now);
      notes[questionId] = {
        ...nextNote,
        questionText: result.question.questionText,
        choices: result.question.choices,
        answer: result.question.answer,
        explanation: result.question.explanation,
        lawUpdateNote: result.question.lawUpdateNote,
        subSubject: result.question.subSubject,
        originalSource: result.question.originalSource,
        isLawUpdated: result.question.isLawUpdated,
        lawUpdateDescription: result.question.lawUpdateDescription,
        needsReview: result.question.needsReview,
        sourceTitle: result.question.sourceTitle,
        wrongCount: (existing?.wrongCount ?? 0) + 1,
        lastSelectedChoice: result.selectedChoice,
        lastWrongAt: now,
      };
      return;
    }

    if (existing) {
      notes[questionId] = {
        ...existing,
        correctCount: existing.correctCount + 1,
        lastCorrectAt: now,
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

export function getWrongNoteCount(): number {
  return Object.keys(readMap()).length;
}

export function getWrongNoteCountsBySubject(): Record<Subject, number> {
  return subjects.reduce((counts, subject) => ({
    ...counts,
    [subject]: getWrongNotes(subject).length,
  }), {} as Record<Subject, number>);
}

export function buildWrongReviewQuestions(): Question[] {
  return getWrongNotes().map((note, index) => ({
    id: `${note.questionId}-wrong-review-${Date.now()}-${index}`,
    originQuestionId: note.questionId,
    sourceRound: note.sourceRound,
    sourceYear: note.sourceYear,
    subject: note.subject,
    examNumber: index + 1,
    displayNumber: index + 1,
    chapter: note.chapter,
    topic: note.topic,
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

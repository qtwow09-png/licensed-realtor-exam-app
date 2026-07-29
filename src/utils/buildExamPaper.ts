import { releasedExamQuestions } from '../data/releasedExamQuestions';
import type { ExamMode, Question, ReleasedRoundMeta, Subject } from '../types/exam';

function displayStartFor(mode: ExamMode, subject: Subject, subjectIndex: number): number {
  if (mode === 'first_period') {
    return subjectIndex === 0 ? 1 : 41;
  }

  if (mode === 'public_law_only' && subject === '공법') {
    return 41;
  }

  return 1;
}

function makeSessionQuestion(
  question: Question,
  index: number,
  displayStart: number,
  roundMeta: ReleasedRoundMeta,
): Question {
  return {
    ...question,
    id: `${question.id}-run-${Date.now()}-${index}`,
    originQuestionId: question.id,
    sourceRound: roundMeta.round,
    sourceYear: roundMeta.year,
    sourceType: question.isLawUpdated ? 'modified' : 'original',
    sourceTitle: roundMeta.title,
    lawUpdateNote: question.isLawUpdated
      ? question.lawUpdateDescription
      : question.lawUpdateNote,
    examNumber: question.examNumber || index + 1,
    displayNumber: displayStart + index,
  };
}

export function buildExamPaper(options: {
  mode: ExamMode;
  subjects: Subject[];
  roundMeta: ReleasedRoundMeta;
}): Question[] {
  return options.subjects.flatMap((subject, subjectIndex) => {
    const startNumber = displayStartFor(options.mode, subject, subjectIndex);
    return releasedExamQuestions
      .filter((question) => question.sourceRound === options.roundMeta.round && question.subject === subject)
      .sort((left, right) => left.examNumber - right.examNumber)
      .map((question, index) => makeSessionQuestion(question, index, startNumber, options.roundMeta));
  });
}

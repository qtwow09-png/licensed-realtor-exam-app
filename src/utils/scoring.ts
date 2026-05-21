import type { ExamScore, Question, Subject, SubjectScore, UserAnswer } from '../types/exam';

export function scoreExam(
  questions: Question[],
  answers: Record<string, UserAnswer>,
): ExamScore {
  const questionResults = questions.map((question) => {
    const selectedChoice = answers[question.id]?.selectedChoice;
    return {
      question,
      selectedChoice,
      isCorrect: selectedChoice === question.answer,
    };
  });

  const correctCount = questionResults.filter((result) => result.isCorrect).length;
  const unansweredCount = questionResults.filter((result) => !result.selectedChoice).length;
  const wrongCount = questions.length - correctCount - unansweredCount;
  const score = Math.round((correctCount / questions.length) * 1000) / 10;
  const subjects = Array.from(new Set(questions.map((question) => question.subject))) as Subject[];

  const subjectScores: SubjectScore[] = subjects.map((subject) => {
    const subjectResults = questionResults.filter((result) => result.question.subject === subject);
    const subjectCorrect = subjectResults.filter((result) => result.isCorrect).length;
    return {
      subject,
      total: subjectResults.length,
      correct: subjectCorrect,
      score: Math.round((subjectCorrect / subjectResults.length) * 1000) / 10,
    };
  });

  return {
    totalQuestions: questions.length,
    correctCount,
    wrongCount,
    unansweredCount,
    score,
    subjectScores,
    questionResults,
  };
}


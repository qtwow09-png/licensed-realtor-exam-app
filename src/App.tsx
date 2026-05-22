import { useEffect, useMemo, useState } from 'react';
import { ExamPage } from './pages/ExamPage';
import { ExamSetupPage } from './pages/ExamSetupPage';
import { ResultPage } from './pages/ResultPage';
import { WrongNotePage } from './pages/WrongNotePage';
import { createExamSession, createWrongReviewSession, setAnswer } from './store/examStore';
import type { ChoiceNumber, ExamMode, ExamScore, ExamSession } from './types/exam';
import { scoreExam } from './utils/scoring';
import { getWrongNoteCount, recordWrongNotes, resetStudyData } from './utils/wrongNoteStore';

type AppPage = 'setup' | 'exam' | 'result' | 'wrongNotes';

export default function App() {
  const [page, setPage] = useState<AppPage>('setup');
  const [selectedMode, setSelectedMode] = useState<ExamMode>('first_period');
  const [session, setSession] = useState<ExamSession | null>(null);
  const [result, setResult] = useState<ExamScore | null>(null);
  const [wrongNoteCount, setWrongNoteCount] = useState(() => getWrongNoteCount());

  const currentResult = useMemo(() => {
    if (result) {
      return result;
    }

    if (!session) {
      return null;
    }

    return scoreExam(session.questions, session.answers);
  }, [result, session]);

  function startExam() {
    const nextSession = createExamSession(selectedMode);
    setSession(nextSession);
    setResult(null);
    setPage('exam');
  }

  function submitExam() {
    if (!session) {
      return;
    }

    const nextResult = scoreExam(session.questions, session.answers);
    recordWrongNotes(nextResult);
    setWrongNoteCount(getWrongNoteCount());
    setResult(nextResult);
    setPage('result');
  }

  function restart() {
    const nextSession = session?.isWrongReview
      ? createWrongReviewSession()
      : createExamSession(selectedMode);

    if (!nextSession) {
      setWrongNoteCount(0);
      setPage('setup');
      return;
    }

    setSession(nextSession);
    setResult(null);
    setPage('exam');
  }

  function startWrongReview() {
    const nextSession = createWrongReviewSession();

    if (!nextSession) {
      setWrongNoteCount(0);
      setPage('wrongNotes');
      return;
    }

    setSession(nextSession);
    setResult(null);
    setPage('exam');
  }

  function resetProgress() {
    if (!window.confirm('오답노트와 회차 진행도를 모두 초기화할까요?')) {
      return;
    }

    resetStudyData();
    setWrongNoteCount(0);
    setResult(null);
    setSession(null);
    setPage('setup');
  }

  function selectAnswer(questionId: string, choice: ChoiceNumber) {
    setSession((previous) => {
      if (!previous || previous.isPaused) {
        return previous;
      }

      return {
        ...previous,
        answers: setAnswer(previous.answers, questionId, choice),
      };
    });
  }

  function selectQuestion(index: number) {
    setSession((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        currentIndex: Math.min(Math.max(index, 0), previous.questions.length - 1),
      };
    });
  }

  function moveQuestion(delta: -1 | 1) {
    setSession((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        currentIndex: Math.min(Math.max(previous.currentIndex + delta, 0), previous.questions.length - 1),
      };
    });
  }

  function togglePause() {
    setSession((previous) => previous ? { ...previous, isPaused: !previous.isPaused } : previous);
  }

  useEffect(() => {
    if (page !== 'exam' || !session || session.isPaused) {
      return;
    }

    if (session.remainingSeconds <= 0) {
      submitExam();
      return;
    }

    const timer = window.setInterval(() => {
      setSession((previous) => {
        if (!previous || previous.isPaused) {
          return previous;
        }

        return {
          ...previous,
          remainingSeconds: Math.max(0, previous.remainingSeconds - 1),
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [page, session?.isPaused, session?.remainingSeconds]);

  if (page === 'setup') {
    return (
      <ExamSetupPage
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        onStart={startExam}
        wrongNoteCount={wrongNoteCount}
        onStartWrongReview={startWrongReview}
        onOpenWrongNotes={() => setPage('wrongNotes')}
        onResetProgress={resetProgress}
      />
    );
  }

  if (page === 'wrongNotes') {
    return (
      <WrongNotePage
        onBack={() => setPage('setup')}
        onStartWrongReview={startWrongReview}
        onResetProgress={resetProgress}
      />
    );
  }

  if (page === 'exam' && session) {
    return (
      <ExamPage
        session={session}
        onSelectAnswer={selectAnswer}
        onSelectQuestion={selectQuestion}
        onMove={moveQuestion}
        onTogglePause={togglePause}
        onSubmit={submitExam}
      />
    );
  }

  if (page === 'result' && currentResult) {
    return (
      <ResultPage
        score={currentResult}
        onRestart={restart}
        onOpenWrongNotes={() => setPage('wrongNotes')}
      />
    );
  }

  return null;
}

import { useEffect, useMemo, useState } from 'react';
import { ExamPage } from './pages/ExamPage';
import { ExamSetupPage } from './pages/ExamSetupPage';
import { ResultPage } from './pages/ResultPage';
import { createExamSession, setAnswer } from './store/examStore';
import type { ChoiceNumber, ExamMode, ExamScore, ExamSession } from './types/exam';
import { scoreExam } from './utils/scoring';

type AppPage = 'setup' | 'exam' | 'result';

export default function App() {
  const [page, setPage] = useState<AppPage>('setup');
  const [selectedMode, setSelectedMode] = useState<ExamMode>('first_period');
  const [session, setSession] = useState<ExamSession | null>(null);
  const [result, setResult] = useState<ExamScore | null>(null);

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

    setResult(scoreExam(session.questions, session.answers));
    setPage('result');
  }

  function restart() {
    setSession(null);
    setResult(null);
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
    return <ResultPage score={currentResult} onRestart={restart} />;
  }

  return null;
}


import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnswerSheet } from '../components/AnswerSheet';
import { ExamHeader } from '../components/ExamHeader';
import { QuestionPanel } from '../components/QuestionPanel';
import type { ChoiceNumber, ExamSession } from '../types/exam';

type ExamPageProps = {
  session: ExamSession;
  onSelectAnswer: (questionId: string, choice: ChoiceNumber) => void;
  onSelectQuestion: (index: number) => void;
  onMove: (delta: -1 | 1) => void;
  onGoHome: () => void;
  onTogglePause: () => void;
  onSubmit: () => void;
};

export function ExamPage({
  session,
  onSelectAnswer,
  onSelectQuestion,
  onMove,
  onGoHome,
  onTogglePause,
  onSubmit,
}: ExamPageProps) {
  const currentQuestion = session.questions[session.currentIndex];
  const answeredCount = Object.values(session.answers).filter((answer) => answer.selectedChoice).length;

  return (
    <main className="examPage">
      <ExamHeader
        session={session}
        answeredCount={answeredCount}
        onGoHome={onGoHome}
        onTogglePause={onTogglePause}
        onSubmit={onSubmit}
      />
      <div className="examBody">
        <AnswerSheet
          questions={session.questions}
          answers={session.answers}
          currentIndex={session.currentIndex}
          onSelectQuestion={onSelectQuestion}
          onSelectAnswer={onSelectAnswer}
        />
        <div className="paperArea">
          {session.isPaused ? (
            <section className="pausePanel">
              <h2>시험이 일시정지되었습니다.</h2>
              <p>재개 버튼을 누르면 타이머와 풀이가 다시 진행됩니다.</p>
            </section>
          ) : (
            <QuestionPanel
              question={currentQuestion}
              answer={session.answers[currentQuestion.id]}
              onSelectAnswer={onSelectAnswer}
            />
          )}
          <div className="navBar">
            <button type="button" onClick={() => onMove(-1)} disabled={session.currentIndex === 0}>
              <ArrowLeft size={17} />
              이전
            </button>
            <span>{session.currentIndex + 1} / {session.questions.length}</span>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={session.currentIndex === session.questions.length - 1}
            >
              다음
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

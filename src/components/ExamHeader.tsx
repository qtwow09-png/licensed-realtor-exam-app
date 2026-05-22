import { Home, Pause, Play, Send } from 'lucide-react';
import type { ExamSession } from '../types/exam';
import { subjectLabel } from '../store/examStore';
import { Timer } from './Timer';

type ExamHeaderProps = {
  session: ExamSession;
  answeredCount: number;
  onGoHome: () => void;
  onTogglePause: () => void;
  onSubmit: () => void;
};

export function ExamHeader({ session, answeredCount, onGoHome, onTogglePause, onSubmit }: ExamHeaderProps) {
  return (
    <header className="examHeader">
      <div>
        <p className="eyebrow">공인중개사 2차 모의시험</p>
        <h1>{session.config.title}</h1>
        <span>{subjectLabel(session.config.subjects)} · {answeredCount}/{session.questions.length}문항 답변</span>
        {session.roundMeta && (
          <span className="roundSource">{session.roundMeta.title} · {session.roundMeta.lawBasis}</span>
        )}
      </div>
      <div className="headerControls">
        <Timer remainingSeconds={session.remainingSeconds} isPaused={session.isPaused} />
        <button className="secondaryButton" type="button" onClick={onGoHome}>
          <Home size={17} />
          홈으로
        </button>
        <button className="secondaryButton" type="button" onClick={onTogglePause}>
          {session.isPaused ? <Play size={17} /> : <Pause size={17} />}
          {session.isPaused ? '재개' : '일시정지'}
        </button>
        <button className="primaryButton" type="button" onClick={onSubmit}>
          <Send size={17} />
          제출
        </button>
      </div>
    </header>
  );
}

import { Clock } from 'lucide-react';
import { formatSeconds } from '../utils/timer';

type TimerProps = {
  remainingSeconds: number;
  isPaused: boolean;
};

export function Timer({ remainingSeconds, isPaused }: TimerProps) {
  const isUrgent = remainingSeconds <= 10 * 60;

  return (
    <div className={`timer ${isUrgent ? 'timerUrgent' : ''}`}>
      <Clock size={18} />
      <span>{formatSeconds(remainingSeconds)}</span>
      {isPaused && <strong>일시정지</strong>}
    </div>
  );
}


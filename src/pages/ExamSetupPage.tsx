import { BookOpenCheck, ClipboardList, Landmark, Play, ScrollText } from 'lucide-react';
import { examConfigs } from '../store/examStore';
import type { ExamMode } from '../types/exam';

type ExamSetupPageProps = {
  selectedMode: ExamMode;
  onSelectMode: (mode: ExamMode) => void;
  onStart: () => void;
};

const modeIcons = {
  first_period: ClipboardList,
  brokerage_only: BookOpenCheck,
  public_law_only: Landmark,
  registry_tax_only: ScrollText,
};

export function ExamSetupPage({ selectedMode, onSelectMode, onStart }: ExamSetupPageProps) {
  return (
    <main className="setupPage">
      <section className="setupIntro">
        <p className="eyebrow">MVP 모의시험</p>
        <h1>공인중개사 2차 시험 대비 문제 풀이</h1>
        <p>공개 기출의 반복 쟁점을 현행 법령 기준으로 보정한 시험지를 제한시간 안에 풀이합니다.</p>
      </section>
      <section className="modeGrid" aria-label="시험 모드 선택">
        {(Object.keys(examConfigs) as ExamMode[]).map((mode) => {
          const config = examConfigs[mode];
          const Icon = modeIcons[mode];
          const active = selectedMode === mode;

          return (
            <button
              className={active ? 'modeCard active' : 'modeCard'}
              key={mode}
              type="button"
              onClick={() => onSelectMode(mode)}
            >
              <Icon size={24} />
              <strong>{config.title}</strong>
              <span>{config.subjects.join(' + ')}</span>
              <em>{config.durationMinutes}분 · {config.subjects.length * 40}문항 · 회차 순환</em>
            </button>
          );
        })}
      </section>
      <button className="startButton" type="button" onClick={onStart}>
        <Play size={20} />
        시험 시작
      </button>
    </main>
  );
}

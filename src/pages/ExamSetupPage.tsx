import { BookOpenCheck, ClipboardList, Landmark, NotebookTabs, Play, RefreshCcw, RotateCcw, ScrollText } from 'lucide-react';
import { numericMemoryCoverage, numericMemorySubjects, type NumericMemorySubject } from '../data/numericMemoryCodes';
import { examConfigs } from '../store/examStore';
import type { ExamMode } from '../types/exam';

type ExamSetupPageProps = {
  selectedMode: ExamMode;
  onSelectMode: (mode: ExamMode) => void;
  onStart: () => void;
  wrongNoteCount: number;
  onStartWrongReview: () => void;
  onOpenWrongNotes: () => void;
  onResetProgress: () => void;
  onOpenNumericMemory: (subject: NumericMemorySubject['subject']) => void;
};

const modeIcons = {
  first_period: ClipboardList,
  brokerage_only: BookOpenCheck,
  public_law_only: Landmark,
  registry_tax_only: ScrollText,
};

export function ExamSetupPage({
  selectedMode,
  onSelectMode,
  onStart,
  wrongNoteCount,
  onStartWrongReview,
  onOpenWrongNotes,
  onResetProgress,
  onOpenNumericMemory,
}: ExamSetupPageProps) {
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
      <section className="studyTools" aria-label="복습 도구">
        <button type="button" onClick={onStartWrongReview} disabled={wrongNoteCount === 0}>
          <RotateCcw size={18} />
          틀린문제 복습
          <span>{wrongNoteCount}</span>
        </button>
        <button type="button" onClick={onOpenWrongNotes}>
          <NotebookTabs size={18} />
          오답노트
        </button>
        <button type="button" onClick={onResetProgress}>
          <RefreshCcw size={18} />
          초기화
        </button>
      </section>
      <section className="numericMemorySection" aria-label="숫자 암기코드 노트">
        <div className="sectionHeader">
          <p className="eyebrow">22~36회 숫자 암기코드</p>
          <h2>숫자만 따로 보는 2차 시험 압축노트</h2>
          <p>{numericMemoryCoverage}</p>
        </div>
        <div className="numericSubjectButtonGrid">
          {numericMemorySubjects.map((subject) => (
            <button
              className="numericSubjectButton"
              key={subject.subject}
              type="button"
              onClick={() => onOpenNumericMemory(subject.subject)}
            >
              <div>
                <strong>{subject.subject}</strong>
                <span>{subject.groups.reduce((total, group) => total + group.items.length, 0)}개 숫자코드</span>
                <p>{subject.headline}</p>
              </div>
              <em>상세 보기</em>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

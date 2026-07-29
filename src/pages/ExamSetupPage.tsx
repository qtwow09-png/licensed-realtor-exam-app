import { BookOpenCheck, ClipboardList, Landmark, NotebookTabs, Play, RefreshCcw, RotateCcw, ScrollText } from 'lucide-react';
import { numericMemoryCoverage, numericMemorySubjects, type NumericMemorySubject } from '../data/numericMemoryCodes';
import { releasedRoundCatalog } from '../data/releasedRounds';
import { examConfigs } from '../store/examStore';
import type { ExamMode } from '../types/exam';

type ExamSetupPageProps = {
  selectedMode: ExamMode;
  selectedRound: number;
  onSelectMode: (mode: ExamMode) => void;
  onSelectRound: (round: number) => void;
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
  selectedRound,
  onSelectMode,
  onSelectRound,
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
        <p className="eyebrow">실제 기출 풀이</p>
        <h1>공인중개사 2차 시험 대비 문제 풀이</h1>
        <p>제30회부터 제36회까지 실제 공개 기출을 회차별 시험 순서 그대로 풀이합니다.</p>
      </section>
      <section className="roundPicker" aria-label="기출 회차 선택">
        <div>
          <strong>회차 선택</strong>
          <span>선택한 회차의 실제 문제 순서와 보기 순서를 유지합니다.</span>
        </div>
        <div className="roundButtonGroup">
          {releasedRoundCatalog.map((round) => (
            <button
              className={round.round === selectedRound ? 'active' : ''}
              key={round.round}
              type="button"
              onClick={() => onSelectRound(round.round)}
            >
              {round.round}회
            </button>
          ))}
        </div>
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
              <em>{config.durationMinutes}분 · {config.subjects.length * 40}문항 · 실제 {selectedRound}회</em>
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

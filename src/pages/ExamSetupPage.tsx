import { BookOpenCheck, ClipboardList, Landmark, NotebookTabs, Play, RefreshCcw, RotateCcw, ScrollText } from 'lucide-react';
import { numericMemoryCoverage, numericMemorySubjects, type NumericMemorySubject } from '../data/numericMemoryCodes';
import { examConfigs } from '../store/examStore';
import type { ExamMode } from '../types/exam';
import { getWeakPartStats } from '../utils/wrongNoteStore';

type ExamSetupPageProps = {
  selectedMode: ExamMode;
  onSelectMode: (mode: ExamMode) => void;
  onStart: () => void;
  wrongNoteCount: number;
  setupError?: string | null;
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
  setupError,
  onStartWrongReview,
  onOpenWrongNotes,
  onResetProgress,
  onOpenNumericMemory,
}: ExamSetupPageProps) {
  const weakPartStats = getWeakPartStats();

  return (
    <main className="setupPage">
      <section className="setupIntro">
        <p className="eyebrow">실제 기출 풀이</p>
        <h1>공인중개사 2차 시험 대비 문제 풀이</h1>
        <p>제20회부터 제36회까지 실제 공개 기출만 섞어 출제합니다. 새 문제를 만들지 않고 문항과 보기 순서만 바꿉니다.</p>
      </section>
      <section className="roundPicker" aria-label="혼합 출제 기준">
        <div>
          <strong>30~36회 70% + 20~29회 30%</strong>
          <span>공식 PDF 원문·최종정답 검증을 통과한 실제 기출만 출제합니다.</span>
        </div>
        <div className="roundRuleGroup">
          <span>문항 랜덤</span>
          <span>보기 랜덤</span>
          <span>실제 기출만</span>
          <span>공시 12/12/세법 16</span>
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
              <em>{config.durationMinutes}분 · {config.subjects.length * 40}문항 · 70:30 검증 혼합</em>
            </button>
          );
        })}
      </section>
      {setupError && (
        <section className="setupError" role="alert">
          <strong>시험 시작 보류</strong>
          <p>{setupError}</p>
        </section>
      )}
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
      <section className="weakPartSection" aria-label="취약파트 오답률">
        <div className="sectionHeader">
          <p className="eyebrow">오답률</p>
          <h2>자주 틀리는 취약파트</h2>
          <p>오답노트에 쌓인 기록을 기준으로 세부주제별 오답률을 보여줍니다.</p>
        </div>
        {weakPartStats.length === 0 ? (
          <div className="weakEmptyState">
            시험 제출 후 틀린 문제가 저장되면 취약파트 그래프가 표시됩니다.
          </div>
        ) : (
          <div className="weakChartList">
            {weakPartStats.map((stat) => (
              <div className="weakChartRow" key={`${stat.subject}-${stat.part}`}>
                <div>
                  <strong>{stat.part}</strong>
                  <span>{stat.subject} · 오답 {stat.wrongCount}회 · 정답복습 {stat.correctCount}회</span>
                </div>
                <div className="weakBarTrack" aria-label={`${stat.part} 오답률 ${stat.wrongRate}%`}>
                  <span style={{ width: `${stat.wrongRate}%` }} />
                </div>
                <em>{stat.wrongRate}%</em>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

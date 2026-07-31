import { useState } from 'react';
import { ArrowLeft, Archive, ChevronDown, Play, RefreshCcw } from 'lucide-react';
import type { Subject, WrongNote } from '../types/exam';
import {
  getActiveWrongNotes,
  getMasteredWrongNotes,
  getWeakTopics,
  getWrongNoteStats,
} from '../utils/wrongNoteStore';

type WrongNotePageProps = {
  onBack: () => void;
  onStartWrongReview: () => void;
  onResetProgress: () => void;
};

type WrongNoteView = 'active' | 'mastered';

const subjects: Subject[] = ['중개사법', '공법', '공시세법'];
const choiceLabels = ['-', '①', '②', '③', '④', '⑤'];

function choiceText(note: WrongNote, choice?: number): string {
  if (!choice || choice < 1 || choice > 5) {
    return '선택하지 않음';
  }

  return note.choices[choice - 1] ?? '선택지 확인 필요';
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function WrongNoteItem({ note }: { note: WrongNote }) {
  const mastered = note.status === 'mastered';

  return (
    <details className="wrongNoteItem">
      <summary className="wrongNoteHead">
        <div>
          <strong>{note.topic}</strong>
          <span>{note.chapter} · 제{note.sourceRound}회 기반</span>
        </div>
        <div className="wrongNoteStats">
          <span>{mastered ? '완료' : `오답 ${note.wrongCount}회`}</span>
          <span>최근 {formatDate(note.lastWrongAt)}</span>
        </div>
        <ChevronDown className="wrongNoteChevron" size={18} />
      </summary>
      <div className="wrongNoteBody">
        <p className="wrongQuestionText">{note.questionText}</p>
        {note.lawRef && <p className="lawRef">{note.lawRef}</p>}
        <div className="wrongChoiceCompare">
          <div>
            <span>최근 선택 {choiceLabels[note.lastSelectedChoice ?? 0]}</span>
            <p>{choiceText(note, note.lastSelectedChoice)}</p>
          </div>
          <div>
            <span>정답 {choiceLabels[note.answer]}</span>
            <p>{choiceText(note, note.answer)}</p>
          </div>
        </div>
        <p className="explanation">{note.explanation}</p>
      </div>
    </details>
  );
}

export function WrongNotePage({ onBack, onStartWrongReview, onResetProgress }: WrongNotePageProps) {
  const [view, setView] = useState<WrongNoteView>('active');
  const stats = getWrongNoteStats();
  const weakTopics = getWeakTopics();
  const notes = view === 'active' ? getActiveWrongNotes() : getMasteredWrongNotes();

  return (
    <main className="wrongNotePage">
      <section className="wrongNoteHero">
        <p className="eyebrow">누적 오답노트</p>
        <h1>자주 틀리는 문제와 유형부터 짧게 복습합니다.</h1>
        <p className="wrongNotePersistence">
          기록은 날짜가 바뀌어도 유지됩니다. 같은 문제를 연속 2회 맞히면 완료 보관함으로 이동합니다.
        </p>
        <div className="wrongNoteActions">
          <button className="secondaryActionButton" type="button" onClick={onBack}>
            <ArrowLeft size={18} />
            돌아가기
          </button>
          <button className="startButton" type="button" onClick={onStartWrongReview} disabled={stats.active === 0}>
            <Play size={18} />
            스마트 복습 시작
          </button>
          <button className="secondaryActionButton danger" type="button" onClick={onResetProgress}>
            <RefreshCcw size={18} />
            전체 기록 초기화
          </button>
        </div>
      </section>

      <section className="wrongNoteSummary" aria-label="오답 학습 요약">
        <div><span>복습할 문제</span><strong>{stats.active}</strong></div>
        <div><span>완료 보관</span><strong>{stats.mastered}</strong></div>
        <div><span>2회 이상 오답</span><strong>{stats.repeatWrong}</strong></div>
        <div><span>최근 7일 풀이</span><strong>{stats.attemptsLast7Days}</strong></div>
        <div><span>최근 30일 풀이</span><strong>{stats.attemptsLast30Days}</strong></div>
      </section>

      {weakTopics.length > 0 && (
        <section className="weakTopicPanel">
          <div>
            <p className="eyebrow">취약 유형 상위</p>
            <h2>반복 오답이 많은 단원</h2>
          </div>
          <div className="weakTopicList">
            {weakTopics.map((topic) => (
              <span key={`${topic.subject}-${topic.chapter}`}>
                {topic.subject} · {topic.chapter}
                <strong>{topic.wrongCount}회 / {topic.questionCount}문제</strong>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="wrongNoteViewTabs" aria-label="오답노트 보기 방식">
        <button className={view === 'active' ? 'active' : ''} type="button" onClick={() => setView('active')}>
          복습할 문제 <span>{stats.active}</span>
        </button>
        <button className={view === 'mastered' ? 'active' : ''} type="button" onClick={() => setView('mastered')}>
          <Archive size={17} /> 완료 보관함 <span>{stats.mastered}</span>
        </button>
      </section>

      {notes.length === 0 ? (
        <section className="emptyWrongNotes">
          <h2>{view === 'active' ? '현재 복습할 오답이 없습니다.' : '아직 완료한 문제가 없습니다.'}</h2>
          <p>
            {view === 'active'
              ? '시험을 제출하면 틀린 문제와 미답 문제가 자동으로 누적됩니다.'
              : '오답 문제를 연속 2회 맞히면 이곳에 보관됩니다.'}
          </p>
        </section>
      ) : (
        <section className="wrongSubjectGrid">
          {subjects.map((subject) => {
            const subjectNotes = notes.filter((note) => note.subject === subject);

            return (
              <div className="wrongSubjectColumn" key={subject}>
                <h2>{subject} <span>{subjectNotes.length}</span></h2>
                {subjectNotes.length === 0 ? (
                  <p className="emptySubject">저장된 문제 없음</p>
                ) : subjectNotes.map((note) => (
                  <WrongNoteItem key={note.questionId} note={note} />
                ))}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}

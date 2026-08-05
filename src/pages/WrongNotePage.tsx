import { useState } from 'react';
import { ArrowLeft, Archive, ChevronDown, KeyRound, Play, RefreshCcw } from 'lucide-react';
import type { Subject, WrongNote } from '../types/exam';
import {
  getActiveWrongNotes,
  getKeyMemoryWrongNotes,
  getMasteredWrongNotes,
  getWeakTopics,
  getWrongNoteStats,
} from '../utils/wrongNoteStore';

type WrongNotePageProps = {
  onBack: () => void;
  onStartWrongReview: () => void;
  onResetProgress: () => void;
};

type WrongNoteView = 'active' | 'mastered' | 'key';

const subjects: Subject[] = ['중개사법', '공법', '공시세법'];
const choiceLabels = ['-', '①', '②', '③', '④', '⑤'];

function choiceText(note: WrongNote, choice?: number): string {
  if (!choice || choice < 1 || choice > 5) {
    return '선택하지 않음';
  }

  return note.choices[choice - 1] ?? '선택지 확인 필요';
}

function compactText(value: string, maxLength: number): string {
  const normalizedValue = value.replace(/\s+/g, ' ').trim();

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1)}…`;
}

function wrongFeedback(note: WrongNote): string {
  const selectedText = choiceText(note, note.lastSelectedChoice);
  const answerText = choiceText(note, note.answer);

  if (!note.lastSelectedChoice) {
    return compactText(`미응답 문항입니다. 정답은 ${choiceLabels[note.answer]}번으로, 핵심 근거는 "${answerText}"입니다.`, 200);
  }

  return compactText(
    `오답 선택은 "${selectedText}"의 일부 표현을 맞는 요건으로 본 가능성이 큽니다. 정답은 ${choiceLabels[note.answer]}번, "${answerText}"가 법령상 기준에 맞습니다.`,
    200,
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function hasVerifiedDetailedExplanation(note: WrongNote): boolean {
  const explanation = note.explanation.trim();

  return Boolean(
    note.explanationVerified === true
    && note.explanationSource?.trim()
    && note.lawRef?.trim()
    && !note.needsReview
    && explanation
    && !explanation.includes('상세 법령 해설은 별도 검수 필요'),
  );
}

function VerifiedAnswerExplanation({ note }: { note: WrongNote }) {
  const isVerified = hasVerifiedDetailedExplanation(note);

  return (
    <section className="keyAnswerExplanation" aria-label="검증된 정답과 해설">
      <div className="keyAnswerTitle">
        <strong>정답 {choiceLabels[note.answer]}</strong>
        <span>{isVerified ? '근거 검증 완료' : '공식 정답 확인 · 상세 해설 검수 대기'}</span>
      </div>
      <p className="keyCorrectChoice">{choiceText(note, note.answer)}</p>
      {isVerified ? (
        <>
          <p className="explanation">{note.explanation}</p>
          <p className="keyEvidence">법령 근거: {note.lawRef}</p>
          <p className="keyEvidence">해설 검증 출처: {note.explanationSource}</p>
        </>
      ) : (
        <p className="keyExplanationPending">
          저장된 Q-Net 공개 기출 최종정답으로 정답을 확인했습니다. 상세 법리 해설은 법조문과 공식 근거의
          교차 검증이 끝나기 전에는 제공하지 않습니다.
        </p>
      )}
      <p className="keyEvidence">출처: {note.originalSource ?? note.sourceTitle ?? `제${note.sourceRound}회 공개 기출`}</p>
    </section>
  );
}

function WrongNoteItem({ note }: { note: WrongNote }) {
  const mastered = note.status === 'mastered';

  return (
    <details className="wrongNoteItem">
      <summary className="wrongNoteHead">
        <div>
          <strong>{note.topic}</strong>
          <span>{note.chapter} · {note.examPart ?? note.subSubject} · 제{note.sourceRound}회 기반</span>
        </div>
        <div className="wrongNoteStats">
          <span>{mastered ? '완료' : `오답 ${note.wrongCount}회`}</span>
          <span>최근 {formatDate(note.lastWrongAt)}</span>
        </div>
        <ChevronDown className="wrongNoteChevron" size={18} />
      </summary>
      <div className="wrongNoteBody">
        <p className="wrongQuestionText">{note.questionText}</p>
        {note.topicPart && <p className="partMeta">{note.topicPart}</p>}
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
        <div className="wrongFeedback">
          <strong>짧은 해설</strong>
          <p>{wrongFeedback(note)}</p>
        </div>
        {note.explanation && <p className="explanation">{note.explanation}</p>}
      </div>
    </details>
  );
}

function KeyMemoryItem({ note }: { note: WrongNote }) {
  return (
    <details className="wrongNoteItem keyMemoryItem" open>
      <summary className="wrongNoteHead">
        <div>
          <strong>{note.topic}</strong>
          <span>{note.chapter} · 제{note.sourceRound}회 실제 기출</span>
        </div>
        <div className="wrongNoteStats">
          <span>오답 {note.wrongCount}회</span>
          <span>최근 {formatDate(note.lastWrongAt)}</span>
        </div>
        <ChevronDown className="wrongNoteChevron" size={18} />
      </summary>
      <div className="wrongNoteBody">
        <p className="wrongQuestionText">{note.questionText}</p>
        {note.topicPart && <p className="partMeta">{note.topicPart}</p>}
        <ol className="keyChoiceList">
          {note.choices.map((choice, index) => (
            <li className={index + 1 === note.answer ? 'correct' : ''} key={`${note.questionId}-${index}`}>
              <span>{choiceLabels[index + 1]}</span>
              {choice}
            </li>
          ))}
        </ol>
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
        <VerifiedAnswerExplanation note={note} />
      </div>
    </details>
  );
}

export function WrongNotePage({ onBack, onStartWrongReview, onResetProgress }: WrongNotePageProps) {
  const [view, setView] = useState<WrongNoteView>('active');
  const stats = getWrongNoteStats();
  const weakTopics = getWeakTopics();
  const notes = view === 'active'
    ? getActiveWrongNotes()
    : view === 'mastered'
      ? getMasteredWrongNotes()
      : getKeyMemoryWrongNotes();

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
        <div><span>KEY 암기문항</span><strong>{stats.keyMemory}</strong></div>
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
        <button className={view === 'key' ? 'active key' : ''} type="button" onClick={() => setView('key')}>
          <KeyRound size={17} /> KEY 암기문항 <span>{stats.keyMemory}</span>
        </button>
      </section>

      {notes.length === 0 ? (
        <section className="emptyWrongNotes">
          <h2>
            {view === 'active'
              ? '현재 복습할 오답이 없습니다.'
              : view === 'mastered'
                ? '아직 완료한 문제가 없습니다.'
                : '아직 3회 이상 틀린 KEY 암기문항이 없습니다.'}
          </h2>
          <p>
            {view === 'active'
              ? '시험을 제출하면 답을 선택했지만 틀린 문제만 자동으로 누적됩니다.'
              : view === 'mastered'
                ? '오답 문제를 연속 2회 맞히면 이곳에 보관됩니다.'
                : '같은 문제를 3회 이상 틀리면 문제, 선택지, 공식 정답과 검증 상태가 이곳에 자동으로 모입니다.'}
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
                  view === 'key'
                    ? <KeyMemoryItem key={note.questionId} note={note} />
                    : <WrongNoteItem key={note.questionId} note={note} />
                ))}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}


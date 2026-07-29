import { ArrowLeft, Play, RefreshCcw } from 'lucide-react';
import type { Subject, WrongNote } from '../types/exam';
import { getWrongNoteCountsBySubject, getWrongNotes } from '../utils/wrongNoteStore';

type WrongNotePageProps = {
  onBack: () => void;
  onStartWrongReview: () => void;
  onResetProgress: () => void;
};

const subjects: Subject[] = ['중개사법', '공법', '공시세법'];
const choiceLabels = ['-', '①', '②', '③', '④', '⑤'];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getChoiceText(note: WrongNote, choice?: number): string {
  if (!choice) {
    return '선택하지 않음';
  }

  return note.choices[choice - 1] ?? '지문 정보 없음';
}

function WrongNoteItem({ note }: { note: WrongNote }) {
  const selectedChoice = note.lastSelectedChoice;
  const selectedLabel = selectedChoice ? choiceLabels[selectedChoice] : '미응답';
  const answerLabel = choiceLabels[note.answer];

  return (
    <article className="wrongNoteItem">
      <div className="wrongNoteHead">
        <div>
          <strong>{note.topic}</strong>
          <span>{note.chapter} · 제{note.sourceRound}회 기반</span>
        </div>
        <div className="wrongNoteStats">
          <span>오답 {note.wrongCount}회</span>
          <span>최근 {formatDate(note.lastWrongAt)}</span>
        </div>
      </div>
      <p className="wrongQuestionText">{note.questionText}</p>
      {note.lawRef && <p className="lawRef">{note.lawRef}</p>}
      <div className="answerCompare">
        <div>
          <strong>내가 고른 답: {selectedLabel}</strong>
          <p>{getChoiceText(note, selectedChoice)}</p>
        </div>
        <div>
          <strong>정답: {answerLabel}</strong>
          <p>{getChoiceText(note, note.answer)}</p>
        </div>
      </div>
      {note.lawUpdateNote && <p className="lawUpdateNote">2026년 현행법 반영: {note.lawUpdateNote}</p>}
      <p className="explanation">{note.explanation}</p>
    </article>
  );
}

export function WrongNotePage({ onBack, onStartWrongReview, onResetProgress }: WrongNotePageProps) {
  const notes = getWrongNotes();
  const counts = getWrongNoteCountsBySubject();

  return (
    <main className="wrongNotePage">
      <section className="wrongNoteHero">
        <p className="eyebrow">오답노트</p>
        <h1>내가 고른 지문과 실제 정답 지문을 바로 비교합니다.</h1>
        <div className="wrongNoteActions">
          <button className="secondaryActionButton" type="button" onClick={onBack}>
            <ArrowLeft size={18} />
            돌아가기
          </button>
          <button className="startButton" type="button" onClick={onStartWrongReview} disabled={notes.length === 0}>
            <Play size={18} />
            틀린문제 복습
          </button>
          <button className="secondaryActionButton danger" type="button" onClick={onResetProgress}>
            <RefreshCcw size={18} />
            초기화
          </button>
        </div>
      </section>

      {notes.length === 0 ? (
        <section className="emptyWrongNotes">
          <h2>아직 저장된 오답이 없습니다.</h2>
          <p>시험을 제출하면 틀린 문제와 미답 문제가 자동으로 과목별 오답노트에 쌓입니다.</p>
        </section>
      ) : (
        <section className="wrongSubjectGrid">
          {subjects.map((subject) => {
            const subjectNotes = getWrongNotes(subject);

            return (
              <div className="wrongSubjectColumn" key={subject}>
                <h2>{subject} <span>{counts[subject]}</span></h2>
                {subjectNotes.length === 0 ? (
                  <p className="emptySubject">저장된 오답 없음</p>
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

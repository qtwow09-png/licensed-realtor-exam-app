import { RotateCcw } from 'lucide-react';
import type { ExamScore } from '../types/exam';

type ResultPageProps = {
  score: ExamScore;
  onRestart: () => void;
};

const choiceLabels = ['-', '①', '②', '③', '④', '⑤'];

export function ResultPage({ score, onRestart }: ResultPageProps) {
  return (
    <main className="resultPage">
      <section className="resultSummary">
        <p className="eyebrow">채점 결과</p>
        <h1>{score.score}점</h1>
        <div className="summaryGrid">
          <div><span>총 문항</span><strong>{score.totalQuestions}</strong></div>
          <div><span>정답</span><strong>{score.correctCount}</strong></div>
          <div><span>오답</span><strong>{score.wrongCount}</strong></div>
          <div><span>미답</span><strong>{score.unansweredCount}</strong></div>
        </div>
      </section>
      <section className="subjectScores">
        {score.subjectScores.map((subjectScore) => (
          <div key={subjectScore.subject}>
            <strong>{subjectScore.subject}</strong>
            <span>{subjectScore.correct}/{subjectScore.total} · {subjectScore.score}점</span>
          </div>
        ))}
      </section>
      <section className="reviewList">
        <h2>문항별 해설</h2>
        {score.questionResults.map((result) => (
          <article className={result.isCorrect ? 'reviewItem correct' : 'reviewItem wrong'} key={result.question.id}>
            <div className="reviewHead">
              <strong>{result.question.displayNumber}. {result.question.topic}</strong>
              <span>{result.isCorrect ? '정답' : result.selectedChoice ? '오답' : '미답'}</span>
            </div>
            <p>{result.question.questionText}</p>
            <div className="answerCompare">
              <span>선택: {choiceLabels[result.selectedChoice ?? 0]}</span>
              <span>정답: {choiceLabels[result.question.answer]}</span>
            </div>
            <p className="explanation">{result.question.explanation}</p>
          </article>
        ))}
      </section>
      <button className="startButton" type="button" onClick={onRestart}>
        <RotateCcw size={18} />
        다시 풀기
      </button>
    </main>
  );
}

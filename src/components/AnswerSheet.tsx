import type { ChoiceNumber, Question, UserAnswer } from '../types/exam';

type AnswerSheetProps = {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  onSelectAnswer: (questionId: string, choice: ChoiceNumber) => void;
};

const choices: ChoiceNumber[] = [1, 2, 3, 4, 5];

export function AnswerSheet({
  questions,
  answers,
  currentIndex,
  onSelectQuestion,
  onSelectAnswer,
}: AnswerSheetProps) {
  return (
    <aside className="answerSheet" aria-label="답안표">
      <div className="answerSheetHeader">
        <strong>답안표</strong>
        <span>① ② ③ ④ ⑤</span>
      </div>
      <div className="answerRows">
        {questions.map((question, index) => {
          const selected = answers[question.id]?.selectedChoice;
          const isCurrent = currentIndex === index;
          const rowClass = [
            'answerRow',
            isCurrent ? 'current' : '',
            selected ? 'answered' : 'unanswered',
          ].join(' ');

          return (
            <div className={rowClass} key={question.id}>
              <button className="numberButton" type="button" onClick={() => onSelectQuestion(index)}>
                {question.displayNumber}
              </button>
              <div className="choiceCells">
                {choices.map((choice) => (
                  <button
                    aria-label={`${question.displayNumber}번 ${choice}번 선택`}
                    className={selected === choice ? 'choiceCell selected' : 'choiceCell'}
                    key={choice}
                    type="button"
                    onClick={() => onSelectAnswer(question.id, choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}


import type { ChoiceNumber, Question, UserAnswer } from '../types/exam';

type QuestionPanelProps = {
  question: Question;
  answer?: UserAnswer;
  onSelectAnswer: (questionId: string, choice: ChoiceNumber) => void;
};

const choiceLabels = ['①', '②', '③', '④', '⑤'];

export function QuestionPanel({ question, answer, onSelectAnswer }: QuestionPanelProps) {
  return (
    <section className="questionPanel">
      <div className="questionMeta">
        <span>{question.subject}</span>
        <span>{question.chapter}</span>
        <span>{question.category}</span>
        <span>{question.difficulty}</span>
      </div>
      <h2>{question.displayNumber}. {question.questionText}</h2>
      {question.lawRef && <p className="lawRef">{question.lawRef}</p>}
      <div className="choiceList">
        {question.choices.map((choice, index) => {
          const choiceNumber = (index + 1) as ChoiceNumber;
          const selected = answer?.selectedChoice === choiceNumber;

          return (
            <button
              className={selected ? 'questionChoice selected' : 'questionChoice'}
              key={choice}
              type="button"
              onClick={() => onSelectAnswer(question.id, choiceNumber)}
            >
              <span>{choiceLabels[index]}</span>
              {choice}
            </button>
          );
        })}
      </div>
      {question.memoryNote && <p className="memoryNote">{question.memoryNote}</p>}
    </section>
  );
}


import type { ChoiceNumber, Question, UserAnswer } from '../types/exam';

type QuestionPanelProps = {
  question: Question;
  answer?: UserAnswer;
  onSelectAnswer: (questionId: string, choice: ChoiceNumber) => void;
};

const choiceLabels = ['①', '②', '③', '④', '⑤'];
const itemMarkerPattern = /\s(?=ㄱ\.\s?)/;

function splitQuestionText(questionText: string): {
  stem: string;
  examples: string[];
} {
  const [stem, itemText] = questionText.split(itemMarkerPattern, 2);

  if (!itemText) {
    return { stem: questionText, examples: [] };
  }

  return {
    stem,
    examples: itemText
      .split(/\s+(?=[ㄱㄴㄷㄹㅁㅂ]\.\s?)/)
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export function QuestionPanel({ question, answer, onSelectAnswer }: QuestionPanelProps) {
  const parsedQuestion = splitQuestionText(question.questionText);

  return (
    <section className="questionPanel">
      <div className="questionMeta">
        <span>{question.subject}</span>
        <span>{question.chapter}</span>
        <span>{question.category}</span>
        <span>{question.difficulty}</span>
        {question.sourceTitle && <span>{question.sourceTitle}</span>}
      </div>
      <h2>{question.displayNumber}. {parsedQuestion.stem}</h2>
      {parsedQuestion.examples.length > 0 && (
        <div className="questionExampleBox" aria-label="보기자료">
          {parsedQuestion.examples.map((example) => (
            <p key={example}>{example}</p>
          ))}
        </div>
      )}
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
    </section>
  );
}

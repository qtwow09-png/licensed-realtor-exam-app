import type { ChoiceNumber, Question, UserAnswer } from '../types/exam';

type QuestionPanelProps = {
  question: Question;
  answer?: UserAnswer;
  onSelectAnswer: (questionId: string, choice: ChoiceNumber) => void;
};

const choiceLabels = ['①', '②', '③', '④', '⑤'];

function splitQuestionText(questionText: string): {
  stem: string;
  examples: string[];
} {
  const itemMatch = questionText.match(/\s(?=ㄱ[.．]\s?)/);

  if (itemMatch?.index !== undefined) {
    const stem = questionText.slice(0, itemMatch.index).trim();
    const itemText = questionText.slice(itemMatch.index).trim();

    return {
      stem,
      examples: itemText
        .split(/\s+(?=[ㄱㄴㄷㄹㅁㅂ][.．]\s?)/)
        .map((item) => item.trim())
        .filter(Boolean),
    };
  }

  const circleMatch = questionText.match(/\s(?=○\s?)/);

  if (circleMatch?.index !== undefined) {
    const stem = questionText.slice(0, circleMatch.index).trim();
    const itemText = questionText.slice(circleMatch.index).trim();

    return {
      stem,
      examples: itemText
        .split(/\s+(?=○\s?)/)
        .map((item) => item.trim())
        .filter(Boolean),
    };
  }

  return {
    stem: questionText,
    examples: [],
  };
}

export function QuestionPanel({ question, answer, onSelectAnswer }: QuestionPanelProps) {
  const parsedQuestion = splitQuestionText(question.questionText);

  return (
    <section className="questionPanel">
      <div className="questionMeta">
        <span>{question.subject}</span>
        {question.subSubject && <span>{question.subSubject}</span>}
        <span>{question.chapter}</span>
        <span>{question.isLawUpdated ? '현행법 보정' : '원문'}</span>
        {question.needsReview && <span>검수 필요</span>}
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
      {question.lawUpdateNote && <p className="lawUpdateNote">{question.lawUpdateNote}</p>}
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

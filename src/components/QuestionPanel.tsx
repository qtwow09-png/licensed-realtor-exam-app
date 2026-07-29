import type { ChoiceNumber, Question, QuestionBox, UserAnswer } from '../types/exam';

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

function QuestionBoxView({ box }: { box: QuestionBox }) {
  return (
    <div className="questionExampleBox" aria-label={box.title ?? '보기자료'}>
      {box.title && <strong className="questionBoxTitle">〈{box.title}〉</strong>}
      {box.lines.map((line, index) => (
        <p key={`${index}-${line}`}>{line}</p>
      ))}
      {box.footer && <p className="questionBoxFooter">{box.footer}</p>}
    </div>
  );
}

export function QuestionPanel({ question, answer, onSelectAnswer }: QuestionPanelProps) {
  const parsedQuestion = splitQuestionText(question.questionText);
  const explicitBoxes = question.questionBoxes ?? [];
  const fallbackBoxes: QuestionBox[] = parsedQuestion.examples.length > 0
    ? [{ lines: parsedQuestion.examples }]
    : [];
  const boxes = explicitBoxes.length > 0 ? explicitBoxes : fallbackBoxes;
  const stem = explicitBoxes.length > 0 ? question.questionText : parsedQuestion.stem;

  return (
    <section className="questionPanel">
      <div className="questionMeta">
        <span>{question.subject}</span>
        <span>{question.chapter}</span>
        <span>{question.category}</span>
        <span>{question.difficulty}</span>
        {question.sourceTitle && <span>{question.sourceTitle}</span>}
      </div>
      <h2>{question.displayNumber}. {stem}</h2>
      {boxes.map((box, index) => (
        <QuestionBoxView key={`${question.id}-box-${index}`} box={box} />
      ))}
      {question.lawRef && <p className="lawRef">{question.lawRef}</p>}
      <div className="choiceList">
        {question.choices.map((choice, index) => {
          const choiceNumber = (index + 1) as ChoiceNumber;
          const selected = answer?.selectedChoice === choiceNumber;

          return (
            <button
              className={selected ? 'questionChoice selected' : 'questionChoice'}
              key={`${choiceNumber}-${choice}`}
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
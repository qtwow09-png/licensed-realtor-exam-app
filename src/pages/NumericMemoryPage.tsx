import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import { numericMemorySubjects, type NumericMemoryItem, type NumericMemorySubject } from '../data/numericMemoryCodes';

type NumericMemoryPageProps = {
  selectedSubject: NumericMemorySubject['subject'];
  onSelectSubject: (subject: NumericMemorySubject['subject']) => void;
  onBack: () => void;
};

const boilerplatePattern = /제\d+회 .*실제 등장한 숫자 쟁점입니다/;

function numberKind(numbers: string): string {
  const kinds = [
    numbers.match(/년|개월|월|일/) ? '기한' : '',
    numbers.match(/원|만원|억원|천만원|백만원/) ? '금액' : '',
    numbers.match(/%|퍼센트|배/) ? '비율·배수' : '',
    numbers.match(/회|차례/) ? '횟수' : '',
    numbers.match(/명|인/) ? '인원' : '',
    numbers.match(/㎡|제곱미터|평방미터/) ? '면적' : '',
  ].filter(Boolean);

  return kinds.length > 0 ? kinds.join(', ') : '기준값';
}

function trimSentence(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function numericExplanation(item: NumericMemoryItem, groupSummary: string): string {
  if (item.point && !boilerplatePattern.test(item.point)) {
    return trimSentence(item.point);
  }

  const primaryNumbers = item.numbers
    .split(',')
    .map((number) => number.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(', ');
  const kind = numberKind(item.numbers);
  const why = trimSentence(item.why);
  const shortWhy = why.length > 95 ? `${why.slice(0, 95).trim()}...` : why;

  return `${primaryNumbers}은 ${item.theme}에서 ${kind}을 구분하는 숫자입니다. ${shortWhy || groupSummary}`;
}

export function NumericMemoryPage({
  selectedSubject,
  onSelectSubject,
  onBack,
}: NumericMemoryPageProps) {
  const subject = numericMemorySubjects.find((item) => item.subject === selectedSubject) ?? numericMemorySubjects[0];
  const itemCount = subject.groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <main className="numericMemoryPage">
      <header className="numericMemoryHero">
        <button className="secondaryActionButton" type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          홈으로
        </button>
        <div>
          <p className="eyebrow">기출 숫자 전수분석 노트</p>
          <h1>{subject.subject} 숫자 암기코드</h1>
          <p>{subject.headline}</p>
        </div>
      </header>

      <nav className="numericSubjectTabs" aria-label="숫자 암기 과목 선택">
        {numericMemorySubjects.map((item) => (
          <button
            className={item.subject === subject.subject ? 'active' : ''}
            key={item.subject}
            type="button"
            onClick={() => onSelectSubject(item.subject)}
          >
            {item.subject}
            <span>{item.groups.reduce((total, group) => total + group.items.length, 0)}</span>
          </button>
        ))}
      </nav>

      <section className="numericDetailIntro">
        <BookOpenCheck size={22} />
        <strong>{itemCount}개 숫자코드</strong>
        <p>{subject.sourceNote}</p>
      </section>

      <div className="numericDetailGrid">
        {subject.groups.map((group) => (
          <section className="numericDetailGroup" key={group.title}>
            <div className="numericDetailGroupHead">
              <h2>{group.title}</h2>
              <span>{group.items.length}개</span>
              <p>{group.summary}</p>
            </div>
            <div className="numericDetailList">
              {group.items.map((item) => {
                const explanation = numericExplanation(item, group.summary);

                return (
                  <article className="numericDetailItem" key={`${group.title}-${item.code}-${item.source}`}>
                    <button className="memoryCodeButton" type="button" aria-describedby={`${item.code}-${item.source}`}>
                      {item.code}
                      <span className="memoryTooltip" role="tooltip" id={`${item.code}-${item.source}`}>
                        {explanation}
                      </span>
                    </button>
                    <div>
                      <div className="numericDetailItemHead">
                        <strong>{item.theme}</strong>
                        <span>{item.source}</span>
                      </div>
                      <em>{item.numbers}</em>
                      <p>{explanation}</p>
                      <small>{item.cue}</small>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import { numericMemorySubjects, type NumericMemorySubject } from '../data/numericMemoryCodes';

type NumericMemoryPageProps = {
  selectedSubject: NumericMemorySubject['subject'];
  onSelectSubject: (subject: NumericMemorySubject['subject']) => void;
  onBack: () => void;
};

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
              {group.items.map((item) => (
                <article className="numericDetailItem" key={`${group.title}-${item.code}-${item.source}`}>
                  <button className="memoryCodeButton" type="button" aria-describedby={`${item.code}-${item.source}`}>
                    {item.code}
                    <span className="memoryTooltip" role="tooltip" id={`${item.code}-${item.source}`}>
                      {item.why}
                    </span>
                  </button>
                  <div>
                    <div className="numericDetailItemHead">
                      <strong>{item.theme}</strong>
                      <span>{item.source}</span>
                    </div>
                    <em>{item.numbers}</em>
                    <p>{item.point}</p>
                    <small>{item.cue}</small>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

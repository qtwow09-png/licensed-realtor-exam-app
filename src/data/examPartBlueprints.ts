import type { Question, Subject } from '../types/exam';

export type ExamPartBlueprint = {
  id: string;
  subject: Subject;
  label: string;
  targetCount: number;
  source: string;
};

export const examPartBlueprints: ExamPartBlueprint[] = [
  {
    id: 'brokerage-law-reporting',
    subject: '중개사법',
    label: '공인중개사법령·부동산거래신고',
    targetCount: 28,
    source: 'EBS 수험가이드 2차 출제범위 70% 내외',
  },
  {
    id: 'brokerage-practice',
    subject: '중개사법',
    label: '중개실무',
    targetCount: 12,
    source: 'EBS 수험가이드 2차 출제범위 30% 내외',
  },
  {
    id: 'public-national-land',
    subject: '공법',
    label: '국토계획법',
    targetCount: 12,
    source: 'EBS 수험가이드 2차 출제범위 30% 내외',
  },
  {
    id: 'public-development-renewal',
    subject: '공법',
    label: '도시개발법·도시정비법',
    targetCount: 12,
    source: 'EBS 수험가이드 2차 출제범위 30% 내외',
  },
  {
    id: 'public-housing-building-farmland',
    subject: '공법',
    label: '주택법·건축법·농지법',
    targetCount: 16,
    source: 'EBS 수험가이드 2차 출제범위 40% 내외',
  },
  {
    id: 'registry-cadastral',
    subject: '공시세법',
    label: '지적법',
    targetCount: 12,
    source: 'EBS 수험가이드 2차 출제범위 30% 내외',
  },
  {
    id: 'registry-registration',
    subject: '공시세법',
    label: '등기법',
    targetCount: 12,
    source: 'EBS 수험가이드 2차 출제범위 30% 내외',
  },
  {
    id: 'tax-law',
    subject: '공시세법',
    label: '세법',
    targetCount: 16,
    source: 'EBS 수험가이드 2차 출제범위 40% 내외',
  },
];

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function classifyExamPart(question: Question): string {
  const text = `${question.topic} ${question.questionText} ${question.lawRef ?? ''}`;

  if (question.subject === '중개사법') {
    if (includesAny(text, ['중개실무', '확인·설명', '확인ㆍ설명', '중개보수', '전속중개계약', '일반중개계약', '거래계약서'])) {
      return '중개실무';
    }

    return '공인중개사법령·부동산거래신고';
  }

  if (question.subject === '공법') {
    if (includesAny(text, ['도시개발법', '도시개발사업', '환지', '도시 및 주거환경정비법', '정비사업', '조합설립', '관리처분계획'])) {
      return '도시개발법·도시정비법';
    }

    if (includesAny(text, ['주택법', '건축법', '농지법', '사업계획승인', '건축허가', '건축신고', '농지전용'])) {
      return '주택법·건축법·농지법';
    }

    return '국토계획법';
  }

  return question.subSubject ?? '공시세법';
}

export function classifyTopicPart(question: Question): string {
  const text = `${question.topic} ${question.questionText} ${question.lawRef ?? ''}`;
  const examPart = classifyExamPart(question);

  if (question.subSubject === '지적법') {
    if (includesAny(text, ['부동산종합공부'])) return '지적법 > 부동산종합공부';
    if (includesAny(text, ['지적공부', '토지대장', '임야대장', '공유지연명부'])) return '지적법 > 지적공부';
    if (includesAny(text, ['지목', '지번', '경계', '면적'])) return '지적법 > 토지표시';
    if (includesAny(text, ['토지의 이동', '합병', '분할', '등록전환', '신규등록'])) return '지적법 > 토지이동';
    if (includesAny(text, ['축척변경'])) return '지적법 > 축척변경';
    if (includesAny(text, ['지적측량'])) return '지적법 > 지적측량';
  }

  if (question.subSubject === '등기법') {
    if (includesAny(text, ['가등기'])) return '등기법 > 가등기';
    if (includesAny(text, ['소유권', '저당권', '전세권', '지상권', '지역권'])) return '등기법 > 권리등기';
    if (includesAny(text, ['표시등기', '변경등기', '말소등기'])) return '등기법 > 표시·변경·말소';
    return '등기법 > 등기절차';
  }

  if (question.subSubject === '세법') {
    if (includesAny(text, ['취득세'])) return '세법 > 취득세';
    if (includesAny(text, ['재산세'])) return '세법 > 재산세';
    if (includesAny(text, ['종합부동산세'])) return '세법 > 종합부동산세';
    if (includesAny(text, ['양도소득세'])) return '세법 > 양도소득세';
    if (includesAny(text, ['등록면허세'])) return '세법 > 등록면허세';
    return '세법 > 조세총론';
  }

  return `${examPart} > ${question.topic.replace(/\s+/g, ' ').slice(0, 24)}`;
}

export function decorateQuestionPart(question: Question): Question {
  return {
    ...question,
    examPart: question.examPart ?? classifyExamPart(question),
    topicPart: question.topicPart ?? classifyTopicPart(question),
  };
}

export function targetPartsForSubject(subject: Subject): ExamPartBlueprint[] {
  return examPartBlueprints.filter((part) => part.subject === subject);
}

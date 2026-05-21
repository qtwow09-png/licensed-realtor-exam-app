import type { ChoiceNumber, Difficulty, Question, QuestionCategory, SourceType, Subject } from '../types/exam';

type CategoryMeta = {
  category: QuestionCategory;
  label: string;
  count: number;
  difficulty: Difficulty;
  sourceType: SourceType;
  sourceRound: number;
};

type PublicLawSeed = {
  chapter: string;
  topic: string;
  lawRef: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  sourceType: SourceType;
  sourceRound: number;
  questionText: string;
  choices: [string, string, string, string, string];
  answer: ChoiceNumber;
  explanation: string;
  trapType?: string;
};

type AuthoredQuestionSeed = {
  chapter: string;
  topic: string;
  lawRef: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  sourceType: SourceType;
  sourceRound: number;
  questionText: string;
  correctChoice: string;
  distractors: [string, string, string, string];
  answer: ChoiceNumber;
  explanation: string;
  trapType?: string;
};

type OfficialQuestionOverride = {
  index: number;
  seed: AuthoredQuestionSeed;
};

const categoryPlan: CategoryMeta[] = [
  { category: 'recent_frequent', label: '최근 빈출', count: 16, difficulty: 'normal', sourceType: 'modified', sourceRound: 36 },
  { category: 'past', label: '과거 기출', count: 8, difficulty: 'normal', sourceType: 'original', sourceRound: 28 },
  { category: 'issue', label: '최신 이슈', count: 4, difficulty: 'hard', sourceType: 'predicted', sourceRound: 36 },
  { category: 'trap', label: '함정', count: 8, difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35 },
  { category: 'easy', label: '기본', count: 4, difficulty: 'easy', sourceType: 'modified', sourceRound: 33 },
];

const subjectChapters: Record<Subject, string[]> = {
  중개사법: ['중개업 등록', '중개대상물 확인설명', '거래계약서', '보수와 실비', '지도감독과 벌칙'],
  공법: ['국토계획법', '도시개발법', '도시정비법', '건축법', '주택법', '농지법'],
  공시세법: ['공간정보법', '부동산등기법', '취득세', '재산세', '양도소득세'],
};

const subjectTopics: Record<Subject, string[]> = {
  중개사법: ['등록 결격사유', '개업공인중개사 의무', '확인설명서 기재사항', '전속중개계약', '손해배상책임'],
  공법: ['용도지역', '개발행위허가', '정비구역', '건축허가', '주택건설사업계획'],
  공시세법: ['지적공부', '토지이동', '등기절차', '취득세 과세표준', '양도소득세 비과세'],
};

const lawRefs: Record<Subject, string> = {
  중개사법: '공인중개사법 및 시행령',
  공법: '국토계획법, 건축법 등',
  공시세법: '공간정보관리법, 부동산등기법, 지방세법',
};

const officialBrokerageOverrides: OfficialQuestionOverride[] = [
  {
    index: 0,
    seed: { chapter: '부동산거래신고', topic: '거래신고 30일', lawRef: '부동산 거래신고 등에 관한 법률 제3조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '개업공인중개사가 매매계약을 중개하여 거래계약서를 작성ㆍ교부한 경우 부동산 거래신고 기한으로 옳은 것은?', correctChoice: '거래계약 체결일부터 30일 이내에 신고해야 한다.', distractors: ['거래계약 체결일부터 7일 이내에 신고해야 한다.', '잔금 지급일부터 60일 이내에만 신고하면 된다.', '소유권이전등기 접수일부터 2개월 이내에 신고한다.', '거래계약서를 보존하는 5년 안에만 신고하면 된다.'], answer: 1, explanation: '부동산 매매계약의 거래신고는 계약 체결일부터 30일 이내가 핵심입니다.', trapType: '30일 신고기한' },
  },
  {
    index: 1,
    seed: { chapter: '중개대상물 확인설명', topic: '확인설명서 보존 3년', lawRef: '공인중개사법 제25조 및 시행령 제21조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '중개대상물 확인ㆍ설명서 사본 보존기간에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 확인ㆍ설명서 사본을 3년간 보존해야 한다.', distractors: ['확인ㆍ설명서 사본은 30일만 보존하면 된다.', '확인ㆍ설명서 사본은 1년간만 보존하면 된다.', '확인ㆍ설명서 사본은 거래계약서와 같이 5년간 보존해야 한다.', '거래당사자가 서명하면 보존의무는 없다.'], answer: 2, explanation: '확인ㆍ설명서 사본은 3년, 거래계약서는 5년으로 구별해야 합니다.', trapType: '3년ㆍ5년 구별' },
  },
  {
    index: 2,
    seed: { chapter: '거래계약서', topic: '거래계약서 보존 5년', lawRef: '공인중개사법 제26조 및 시행령 제22조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '개업공인중개사가 중개가 완성되어 거래계약서를 작성한 경우 거래계약서 보존기간으로 옳은 것은?', correctChoice: '거래계약서 원본ㆍ사본 또는 전자문서를 5년간 보존해야 한다.', distractors: ['거래계약서는 작성일부터 30일만 보존하면 된다.', '거래계약서는 확인ㆍ설명서와 같이 3년만 보존하면 된다.', '거래계약서는 등기 완료 즉시 폐기해야 한다.', '거래당사자가 원하면 보존기간은 10일로 단축된다.'], answer: 4, explanation: '거래계약서는 5년 보존이 핵심이며 확인ㆍ설명서 3년과 함께 출제되기 쉽습니다.', trapType: '거래계약서 5년' },
  },
  {
    index: 3,
    seed: { chapter: '보수와 실비', topic: '중개보수 계산', lawRef: '공인중개사법 제32조 및 중개보수 한도 규정', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '주택 매매 거래금액이 4억원이고 해당 거래의 중개보수 상한요율이 0.4퍼센트인 경우, 부가가치세를 제외한 중개보수 상한액으로 옳은 것은?', correctChoice: '160만원', distractors: ['16만원', '120만원', '200만원', '400만원'], answer: 3, explanation: '4억원 × 0.4퍼센트 = 160만원입니다. 계산형 문제에서는 거래금액, 요율, 한도액 적용 여부를 차례로 확인해야 합니다.', trapType: '중개보수 산식 계산' },
  },
  {
    index: 24,
    seed: { chapter: '손해배상책임', topic: '보증금액', lawRef: '공인중개사법 제30조 및 시행령 제24조', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '개업공인중개사의 손해배상책임 보장금액에 관한 설명으로 옳은 것은?', correctChoice: '법인인 개업공인중개사는 2억원 이상, 분사무소를 두는 경우 분사무소마다 1억원 이상을 추가로 설정해야 한다.', distractors: ['법인과 개인은 모두 5천만원 이상이면 충분하다.', '법인은 1억원 이상이고 분사무소 추가 보증은 필요 없다.', '분사무소마다 2억원 이상을 추가해야 하며 본점 보증은 필요 없다.', '손해배상책임 보장은 업무정지 후 30일 안에만 설정하면 된다.'], answer: 1, explanation: '손해배상책임 보장은 법인 2억원 이상, 분사무소마다 1억원 이상 추가를 구별해야 합니다.', trapType: '보증금액 숫자' },
  },
  {
    index: 28,
    seed: { chapter: '지도감독과 벌칙', topic: '업무정지 6개월', lawRef: '공인중개사법 제39조', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '개업공인중개사에 대한 업무정지 처분의 기간에 관한 설명으로 옳은 것은?', correctChoice: '등록관청은 법정 사유가 있는 경우 6개월의 범위에서 기간을 정하여 업무정지를 명할 수 있다.', distractors: ['업무정지는 언제나 30일로 고정된다.', '업무정지는 3년의 범위에서 국토교통부장관만 명할 수 있다.', '업무정지 처분은 형벌이므로 등록관청은 할 수 없다.', '업무정지를 받으면 공인중개사 자격은 예외 없이 즉시 취소된다.'], answer: 3, explanation: '업무정지는 6개월 범위의 행정처분이고 자격취소와 구별합니다.', trapType: '6개월 업무정지' },
  },
  {
    index: 29,
    seed: { chapter: '중개보조원', topic: '과태료 500만원', lawRef: '공인중개사법 제51조', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '중개보조원 고지의무 위반과 관련한 과태료 설명으로 옳은 것은?', correctChoice: '중개보조원임을 미리 알리지 않은 사람과 그 소속 개업공인중개사는 500만원 이하의 과태료 대상이 될 수 있다.', distractors: ['해당 위반은 언제나 3년 이하의 징역형만 부과된다.', '중개보조원 고지의무 위반에는 아무 제재가 없다.', '과태료 상한은 5천만원이다.', '고지의무 위반은 부동산등기법상 등기 지연 과태료와 동일하다.'], answer: 2, explanation: '중개보조원 고지의무 위반은 500만원 이하 과태료와 연결됩니다.', trapType: '과태료 상한' },
  },
];

const officialPublicLawOverrides: OfficialQuestionOverride[] = [
  {
    index: 0,
    seed: { chapter: '국토계획법', topic: '개발행위허가 대상', lawRef: '국토계획법 제56조 및 시행령 제51조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '개발행위허가 대상에 해당할 수 있는 것을 모두 고른 것은? ㄱ. 건축물의 건축 ㄴ. 공작물의 설치 ㄷ. 토지의 형질변경 ㄹ. 토석채취 ㅁ. 토지분할 ㅂ. 물건을 쌓아놓는 행위', correctChoice: 'ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ', distractors: ['ㄱ, ㄴ, ㄷ', 'ㄱ, ㄷ, ㅁ', 'ㄴ, ㄹ, ㅂ', 'ㄱ, ㄴ, ㄷ, ㄹ'], answer: 5, explanation: '개발행위허가 유형은 건축물 건축, 공작물 설치, 토지 형질변경, 토석채취, 토지분할, 물건 적치까지 묶어 암기해야 합니다.', trapType: '개발행위 열거' },
  },
  {
    index: 1,
    seed: { chapter: '국토계획법', topic: '개발행위허가 제한기간', lawRef: '국토계획법 제63조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '개발행위허가 제한기간에 관한 설명으로 옳은 것은?', correctChoice: '일정한 경우 한 차례만 3년 이내의 기간 동안 개발행위허가를 제한할 수 있고, 사유에 따라 2년 이내 연장이 문제될 수 있다.', distractors: ['개발행위허가 제한기간은 언제나 30일이다.', '개발행위허가 제한은 제한기간 없이 영구적으로만 가능하다.', '개발행위허가 제한기간은 토지거래계약 신고기한과 같이 30일이다.', '제한기간은 시장ㆍ군수가 임의로 10년까지 정할 수 있다.'], answer: 1, explanation: '개발행위허가 제한은 3년 이내와 2년 이내 연장 구조가 핵심입니다.', trapType: '3년ㆍ2년 제한기간' },
  },
  {
    index: 2,
    seed: { chapter: '국토계획법', topic: '토지거래허가 이행강제금', lawRef: '국토계획법 제124조의2', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '토지거래계약허가 후 토지이용의무 불이행에 대한 이행강제금 설명으로 옳은 것은?', correctChoice: '이행강제금은 토지이용의무기간 범위에서 최장 5년간, 1년에 한 번씩 반복 부과될 수 있다.', distractors: ['이행강제금은 최초 1회만 부과할 수 있고 반복 부과는 불가능하다.', '이행강제금은 매월 한 번씩 30년간 부과된다.', '이행강제금은 취득세 신고기한이 지나면 자동 면제된다.', '토지거래허가를 받으면 이용의무와 이행강제금은 전혀 문제되지 않는다.'], answer: 3, explanation: '토지거래허가 후 이용의무 위반은 최장 5년, 연 1회 반복 부과 구조를 확인해야 합니다.', trapType: '5년ㆍ연 1회' },
  },
  {
    index: 3,
    seed: { chapter: '건축법', topic: '건폐율ㆍ용적률 계산', lawRef: '건축법 및 국토계획법상 건폐율ㆍ용적률 산정 구조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '대지면적 500제곱미터, 건축면적 250제곱미터, 연면적 1,200제곱미터인 건축물이 있다. 이 중 용적률 산정에서 제외되는 지하층 면적이 200제곱미터라면 건폐율과 용적률로 옳은 것은?', correctChoice: '건폐율 50퍼센트, 용적률 200퍼센트', distractors: ['건폐율 40퍼센트, 용적률 240퍼센트', '건폐율 50퍼센트, 용적률 240퍼센트', '건폐율 60퍼센트, 용적률 200퍼센트', '건폐율 200퍼센트, 용적률 50퍼센트'], answer: 4, explanation: '건폐율은 250㎡ ÷ 500㎡ = 50퍼센트입니다. 용적률은 산정 연면적 1,000㎡ ÷ 500㎡ = 200퍼센트입니다.', trapType: '건폐율ㆍ용적률 계산' },
  },
  {
    index: 24,
    seed: { chapter: '건축법', topic: '가설건축물 존치기간', lawRef: '건축법 시행령 제15조', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '신고 대상 가설건축물의 존치기간과 관련한 설명으로 가장 적절한 것은?', correctChoice: '가설건축물은 유형에 따라 통상 3년 이내 존치기간이 문제될 수 있고, 연장 또는 별도 인허가 관계를 함께 검토해야 한다.', distractors: ['가설건축물은 신고만 하면 언제나 영구 존치할 수 있다.', '가설건축물 존치기간은 부동산 거래신고 30일과 동일하다.', '가설건축물은 건축법상 도로ㆍ대지 요건과 전혀 관련이 없다.', '가설건축물 신고에는 어떤 경우에도 개발행위허가 문제가 연결될 수 없다.'], answer: 4, explanation: '가설건축물은 3년 이내 존치기간과 인허가 의제 여부가 시험 함정입니다.', trapType: '가설건축물 3년' },
  },
  {
    index: 28,
    seed: { chapter: '도시개발법', topic: '환지처분 후 등기촉탁 14일', lawRef: '도시개발법 제43조', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '환지처분 공고 후 등기와 관련한 설명으로 옳은 것은?', correctChoice: '시행자는 환지처분이 공고되면 공고 후 14일 이내에 관할 등기소에 등기를 촉탁하거나 신청해야 한다.', distractors: ['환지처분 공고 후 30일 이내에 부동산 거래신고를 하면 등기촉탁은 필요 없다.', '환지처분 공고 후 5년 이내면 언제든지 등기하면 된다.', '환지처분이 공고되면 등기 없이도 모든 등기기록이 자동 정리된다.', '환지처분 후 등기기간은 양도소득세 예정신고기한과 동일하게 2개월이다.'], answer: 2, explanation: '도시개발법상 환지처분 공고 후 등기 촉탁ㆍ신청 14일을 다른 신고기한과 혼동하지 않아야 합니다.', trapType: '14일 등기촉탁' },
  },
];

const officialRegistryTaxOverrides: OfficialQuestionOverride[] = [
  {
    index: 0,
    seed: { chapter: '공간정보법', topic: '신규등록 60일', lawRef: '공간정보의 구축 및 관리 등에 관한 법률 제77조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '토지의 신규등록 신청기간에 관한 설명으로 옳은 것은?', correctChoice: '토지소유자는 신규등록할 토지가 있으면 사유 발생일부터 60일 이내에 지적소관청에 신청해야 한다.', distractors: ['사유 발생일부터 7일 이내에 등기소에 신청해야 한다.', '계약 체결일부터 30일 이내에 세무서에 신고해야 한다.', '양도일이 속하는 달의 말일부터 2개월 이내에 신청한다.', '소유권이전등기 후 5년 이내에만 신청하면 된다.'], answer: 1, explanation: '신규등록은 사유 발생일부터 60일 이내 지적소관청 신청입니다.', trapType: '신규등록 60일' },
  },
  {
    index: 1,
    seed: { chapter: '공간정보법', topic: '등록전환 60일', lawRef: '공간정보의 구축 및 관리 등에 관한 법률 제78조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '등록전환 신청기간에 관한 설명으로 옳은 것은?', correctChoice: '등록전환할 토지가 있으면 사유 발생일부터 60일 이내에 지적소관청에 등록전환을 신청해야 한다.', distractors: ['등록전환은 환지처분 공고 후 14일 이내 등기소에 신청한다.', '등록전환은 거래계약 체결일부터 30일 이내에 신고한다.', '등록전환은 양도소득세 확정신고 기간에만 신청한다.', '등록전환은 신청기간 제한이 전혀 없다.'], answer: 2, explanation: '신규등록ㆍ등록전환ㆍ지목변경은 60일 구조로 함께 정리해야 합니다.', trapType: '등록전환 60일' },
  },
  {
    index: 2,
    seed: { chapter: '공간정보법', topic: '지목변경 60일', lawRef: '공간정보의 구축 및 관리 등에 관한 법률 제81조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '지목변경 신청기간에 관한 설명으로 옳은 것은?', correctChoice: '지목변경할 토지가 있으면 사유 발생일부터 60일 이내에 지적소관청에 신청해야 한다.', distractors: ['지목변경은 등기 원인일부터 14일 이내에 등기소에 신청한다.', '지목변경은 계약일부터 30일 이내에 부동산 거래신고로 갈음한다.', '지목변경은 양도일이 속하는 달의 말일부터 2개월 이내 세무서에 신고한다.', '지목변경은 사유 발생일부터 3년 이내면 언제든지 가능하다.'], answer: 3, explanation: '지목변경도 사유 발생일부터 60일 이내 지적소관청 신청입니다.', trapType: '지목변경 60일' },
  },
  {
    index: 3,
    seed: { chapter: '취득세', topic: '취득세 계산', lawRef: '지방세법상 취득세 과세표준 및 세율 구조', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '부동산 취득가액이 6억원이고 적용 취득세율이 1퍼센트라고 할 때, 지방교육세와 농어촌특별세를 제외한 취득세 산출세액으로 옳은 것은?', correctChoice: '600만원', distractors: ['60만원', '300만원', '660만원', '6,000만원'], answer: 2, explanation: '취득세 산출세액은 과세표준에 세율을 곱합니다. 6억원 × 1퍼센트 = 600만원입니다.', trapType: '취득세 산출세액 계산' },
  },
  {
    index: 16,
    seed: { chapter: '부동산등기', topic: '소유권이전등기 60일', lawRef: '부동산등기 특별조치법 제2조', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 29, questionText: '부동산 소유권이전등기 신청의무 기간에 관한 설명으로 옳은 것은?', correctChoice: '대가적 채무를 서로 부담하는 계약의 경우 반대급부 이행이 완료된 날부터 60일 이내에 소유권이전등기를 신청해야 한다.', distractors: ['계약 체결일부터 무조건 7일 이내에 신청해야 한다.', '환지처분 공고일부터 14일 이내 규정만 적용된다.', '양도소득세 예정신고기한과 같아 항상 말일부터 2개월이다.', '등기신청 의무기간은 5년이다.'], answer: 1, explanation: '소유권이전등기는 반대급부 이행 완료일부터 60일 이내를 기본으로 봅니다.', trapType: '등기 60일' },
  },
  {
    index: 24,
    seed: { chapter: '양도소득세', topic: '예정신고 2개월', lawRef: '국세청 양도소득세 신고납부안내', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '토지 또는 건물 양도소득세 예정신고ㆍ납부기한으로 옳은 것은?', correctChoice: '양도일이 속하는 달의 말일부터 2개월 이내에 예정신고ㆍ납부해야 한다.', distractors: ['양도계약 체결일부터 30일 이내에 신고한다.', '반대급부 이행 완료일부터 60일 이내에 등기소에 신고한다.', '매년 6월 1일 현재 소유자가 신고한다.', '양도한 연도의 다음연도 12월 31일까지 신고한다.'], answer: 4, explanation: '부동산 양도소득세 예정신고는 양도일이 속하는 달의 말일부터 2개월 이내입니다.', trapType: '양도세 2개월' },
  },
  {
    index: 25,
    seed: { chapter: '양도소득세', topic: '확정신고 5월', lawRef: '국세청 양도소득세 신고납부안내', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '양도소득세 확정신고 기간에 관한 설명으로 옳은 것은?', correctChoice: '확정신고는 양도한 연도의 다음연도 5월 1일부터 5월 31일까지 하는 것이 원칙이다.', distractors: ['확정신고는 매년 6월 1일 하루에만 한다.', '확정신고는 계약 체결일부터 30일 이내에 한다.', '확정신고는 환지처분 공고 후 14일 이내에 한다.', '확정신고는 취득일부터 60일 이내에 한다.'], answer: 1, explanation: '양도소득세는 예정신고 2개월과 확정신고 다음연도 5월을 구별해야 합니다.', trapType: '확정신고 5월' },
  },
  {
    index: 28,
    seed: { chapter: '부동산등기', topic: '장기미등기 과징금', lawRef: '부동산 실권리자명의 등기에 관한 법률 제10조', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '장기미등기자에 대한 과징금 설명으로 옳은 것은?', correctChoice: '소유권이전등기 신청의무가 있는 자가 일정한 날부터 3년 이내에 등기를 신청하지 않으면 부동산평가액의 30% 범위에서 과징금이 부과될 수 있다.', distractors: ['장기미등기 과징금은 부동산평가액의 3%로 고정된다.', '60일 이내 등기신청을 하지 않으면 즉시 소유권이 국가에 귀속된다.', '장기미등기 과징금은 양도소득세 예정신고와 동일한 세금이다.', '장기미등기자는 14일 이내에 환지처분 등기만 하면 된다.'], answer: 2, explanation: '장기미등기자는 3년과 부동산평가액 30% 범위 과징금이 핵심 숫자입니다.', trapType: '3년ㆍ30% 과징금' },
  },
  {
    index: 29,
    seed: { chapter: '양도소득세', topic: '무신고가산세 20%', lawRef: '국세청 양도소득세 신고납부안내', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '부동산 양도소득세 예정신고를 하지 않은 경우 가산세 설명으로 옳은 것은?', correctChoice: '예정신고를 하지 않으면 납부할 세액의 20%인 무신고가산세가 문제될 수 있다.', distractors: ['예정신고를 하지 않아도 가산세는 전혀 없다.', '무신고가산세는 언제나 납부세액의 2%이다.', '무신고가산세는 지적소관청이 부과하는 지목변경 수수료이다.', '무신고가산세는 3년 이내 등기신청을 하지 않은 경우의 과징금과 동일하다.'], answer: 3, explanation: '양도소득세 예정신고 누락은 무신고가산세 20% 등과 연결됩니다.', trapType: '무신고가산세 20%' },
  },
];

const brokerageSeeds: AuthoredQuestionSeed[] = [
  { chapter: '중개업 등록', topic: '개설등록', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '중개사무소 개설등록에 관한 설명으로 옳은 것은?', correctChoice: '중개업을 영위하려는 자는 등록관청에 중개사무소 개설등록을 하여야 한다.', distractors: ['등록 없이 광고만 하면 중개업을 할 수 있다.', '개설등록은 국토교통부장관에게만 신청한다.', '법인은 어떠한 경우에도 개설등록을 할 수 없다.', '개설등록 후에는 등록증 게시 의무가 없다.'], answer: 1, explanation: '중개업을 하려면 등록관청에 개설등록을 해야 합니다.', trapType: '등록 주체와 관청 혼동' },
  { chapter: '중개업 등록', topic: '등록 결격사유', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '개설등록 결격사유에 관한 설명으로 옳지 않은 것은?', correctChoice: '파산선고를 받고 복권되지 아니한 자는 결격사유에 해당할 수 있다.', distractors: ['금고 이상의 실형 관련 결격은 일정 기간이 문제될 수 있다.', '법인의 임원에게 결격사유가 있으면 등록 제한이 문제될 수 있다.', '미성년자는 원칙적으로 개설등록을 할 수 없다.', '결격사유가 있어도 등록관청은 반드시 등록을 수리해야 한다.'], answer: 5, explanation: '결격사유가 있으면 개설등록이 제한됩니다.', trapType: '반드시 수리 표현' },
  { chapter: '중개업 등록', topic: '등록증', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '중개사무소 등록증에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 등록증을 중개사무소 안의 보기 쉬운 곳에 게시해야 한다.', distractors: ['등록증은 손님에게 보여주면 폐기해도 된다.', '등록증 대여는 자유롭게 허용된다.', '등록증 게시 의무는 법인에게만 적용된다.', '등록증은 중개보조원이 개인 명의로 사용할 수 있다.'], answer: 1, explanation: '등록증 게시와 명의대여 금지는 기본 의무입니다.', trapType: '등록증 대여 오답' },
  { chapter: '중개업 등록', topic: '사무소 명칭', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 34, questionText: '중개사무소 명칭 사용에 관한 설명으로 옳지 않은 것은?', correctChoice: '개업공인중개사가 아닌 자는 원칙적으로 공인중개사사무소 등 유사 명칭을 사용할 수 없다.', distractors: ['명칭은 소비자가 중개업 등록 여부를 오인하지 않도록 관리되어야 한다.', '법령상 허용되는 명칭 외의 표시 사용은 제재 대상이 될 수 있다.', '간판ㆍ광고 표시에서 등록관계 오인이 문제될 수 있다.', '무등록자도 공인중개사사무소 명칭을 제한 없이 사용할 수 있다.'], answer: 5, explanation: '무등록자의 유사 명칭 사용은 제한됩니다.', trapType: '무등록 명칭 사용' },
  { chapter: '중개업 등록', topic: '이중등록', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '개업공인중개사의 이중등록 등에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 둘 이상의 중개사무소를 둘 수 없는 것이 원칙이다.', distractors: ['같은 시ㆍ군ㆍ구 안에서는 무제한으로 분사무소를 둘 수 있다.', '개업공인중개사는 다른 개업공인중개사의 소속공인중개사가 될 수 있다.', '이중등록 제한은 중개보조원에게만 적용된다.', '법인은 본점 등록 없이 분사무소만으로 영업할 수 있다.'], answer: 1, explanation: '이중등록과 이중소속 제한은 자주 출제되는 기본 규제입니다.', trapType: '이중등록과 이중소속 혼동' },
  { chapter: '중개업 등록', topic: '휴업ㆍ폐업', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 33, questionText: '휴업 또는 폐업 신고에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 휴업ㆍ폐업 등 일정한 변경 사유가 있으면 등록관청에 신고해야 한다.', distractors: ['폐업 신고를 하면 과거 위반행위에 대한 제재가 모두 소멸한다.', '휴업 중에도 중개보조원 명의로 중개업을 계속할 수 있다.', '휴업 신고는 세무서에만 하면 공인중개사법상 절차가 끝난다.', '휴업 기간에는 등록증을 제3자에게 대여할 수 있다.'], answer: 1, explanation: '휴업ㆍ폐업은 등록관청 신고 사항입니다.', trapType: '세무 절차와 등록 절차 혼동' },
  { chapter: '중개대상물 확인설명', topic: '확인설명 의무', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '중개대상물 확인ㆍ설명 의무에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 권리관계, 거래 또는 이용 제한사항 등을 확인하여 설명해야 한다.', distractors: ['확인설명은 매수인이 요청한 경우에만 임의로 한다.', '등기사항증명서를 확인하면 모든 현황 확인 의무가 면제된다.', '중개보조원 단독 설명만으로 개업공인중개사의 의무가 항상 소멸한다.', '확인설명서는 계약 후 1년 이내에만 작성하면 된다.'], answer: 1, explanation: '확인ㆍ설명 의무는 중개사법 핵심 빈출입니다.', trapType: '요청 시에만 의무 오답' },
  { chapter: '중개대상물 확인설명', topic: '확인설명서 서명', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '중개대상물 확인ㆍ설명서의 서명 및 날인에 관한 설명으로 옳지 않은 것은?', correctChoice: '개업공인중개사와 중개행위를 한 소속공인중개사는 확인ㆍ설명서에 서명 및 날인해야 한다.', distractors: ['확인ㆍ설명서는 거래당사자에게 교부되어야 한다.', '서명ㆍ날인은 책임 소재 확인과 관련된다.', '소속공인중개사가 중개행위를 한 경우 그 표시가 문제된다.', '중개보조원이 단독으로 서명하면 개업공인중개사의 서명ㆍ날인은 언제나 불필요하다.'], answer: 5, explanation: '중개보조원은 공인중개사가 아니므로 단독 서명으로 대체할 수 없습니다.', trapType: '중개보조원 권한 과장' },
  { chapter: '거래계약서', topic: '거래계약서 작성', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '거래계약서 작성에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 중개가 완성된 때 거래계약서를 작성하여 거래당사자에게 교부해야 한다.', distractors: ['계약서 작성은 세입자가 원할 때만 선택적으로 한다.', '구두계약이면 중개가 완성되어도 계약서 작성 의무가 없다.', '거래계약서에는 중개대상물 표시가 전혀 필요 없다.', '계약서 보존 의무는 공인중개사법과 무관하다.'], answer: 1, explanation: '거래계약서 작성ㆍ교부ㆍ보존은 함께 암기해야 합니다.', trapType: '구두계약 예외 오답' },
  { chapter: '거래계약서', topic: '거짓 기재 금지', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '거래계약서 기재에 관한 설명으로 옳지 않은 것은?', correctChoice: '개업공인중개사는 거래금액 등 중요한 사항을 거짓으로 기재해서는 안 된다.', distractors: ['계약일, 거래금액, 대상물 표시 등은 정확한 기재가 필요하다.', '거짓 기재는 행정처분 또는 벌칙과 연결될 수 있다.', '당사자 요청이 있어도 법령 위반 기재는 문제될 수 있다.', '실거래가보다 낮은 금액으로 쓰는 것은 당사자가 합의하면 항상 적법하다.'], answer: 5, explanation: '다운계약서 등 거짓 기재는 당사자 합의와 무관하게 문제됩니다.', trapType: '당사자 합의 만능 오답' },
  { chapter: '보수와 실비', topic: '중개보수', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '중개보수에 관한 설명으로 옳은 것은?', correctChoice: '중개보수는 법령 또는 조례에서 정한 한도 범위 안에서 받을 수 있다.', distractors: ['중개보수는 개업공인중개사가 임의로 무제한 정할 수 있다.', '중개가 완성되지 않아도 언제나 전액을 청구할 수 있다.', '중개보수 한도는 모든 지역과 거래유형에서 완전히 동일하다.', '실비는 법령상 근거가 없어도 광고비 명목으로 무제한 받을 수 있다.'], answer: 1, explanation: '중개보수는 거래유형과 조례상 한도를 확인해야 합니다.', trapType: '보수 무제한 오답' },
  { chapter: '보수와 실비', topic: '초과보수 금지', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '중개보수 초과 수수에 관한 설명으로 옳지 않은 것은?', correctChoice: '법정 한도를 초과하여 중개보수를 받는 행위는 금지된다.', distractors: ['초과보수 약정은 행정상 제재와 연결될 수 있다.', '실비도 법령상 인정되는 범위가 문제된다.', '중개보수 산정은 거래금액과 거래유형에 따라 달라질 수 있다.', '당사자가 자발적으로 지급하면 법정 한도를 초과해도 아무 문제가 없다.'], answer: 5, explanation: '당사자 동의가 있어도 법정 한도를 넘는 보수 수수는 문제됩니다.', trapType: '자발 지급 오답' },
  { chapter: '지도감독과 벌칙', topic: '업무정지', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 34, questionText: '업무정지 처분에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사가 법령상 의무를 위반하면 일정한 경우 업무정지 처분을 받을 수 있다.', distractors: ['업무정지는 형사처벌이므로 등록관청은 관여할 수 없다.', '업무정지를 받으면 등록은 언제나 자동 말소된다.', '업무정지 중에는 다른 사람 명의로 같은 영업을 계속할 수 있다.', '업무정지는 소속공인중개사에게만 적용되고 개업공인중개사에게는 적용되지 않는다.'], answer: 1, explanation: '업무정지는 행정처분으로 등록취소와 구별해야 합니다.', trapType: '업무정지와 등록취소 혼동' },
  { chapter: '지도감독과 벌칙', topic: '등록취소', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '등록취소 사유에 관한 설명으로 옳은 것은?', correctChoice: '거짓이나 그 밖의 부정한 방법으로 등록한 경우 등록취소가 문제될 수 있다.', distractors: ['등록취소는 오직 중개보조원에게만 하는 처분이다.', '등록취소를 받으면 즉시 공인중개사 자격증도 항상 취소된다.', '등록취소 사유가 있어도 청문 절차는 어떤 경우에도 필요 없다.', '등록취소는 민사상 손해배상청구와 완전히 같은 제도이다.'], answer: 1, explanation: '부정등록 등은 중대한 등록취소 사유입니다.', trapType: '등록과 자격 구분' },
  { chapter: '광고', topic: '중개대상물 표시광고', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '중개대상물 표시ㆍ광고에 관한 설명으로 옳지 않은 것은?', correctChoice: '중개대상물 표시ㆍ광고는 존재하지 않는 매물을 있는 것처럼 표시해서는 안 된다.', distractors: ['가격, 면적, 입지 등 소비자 오인 요소가 문제될 수 있다.', '개업공인중개사가 아닌 자의 광고 행위는 제한될 수 있다.', '광고에는 중개사무소 정보 표시가 문제될 수 있다.', '허위매물 광고는 손님 유인 목적이면 언제나 허용된다.'], answer: 5, explanation: '허위ㆍ과장 광고는 중개시장 질서를 해치므로 금지됩니다.', trapType: '허위매물 허용 오답' },
  { chapter: '손해배상책임', topic: '보증 설정', lawRef: '공인중개사법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '손해배상책임 보장에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 업무 개시 전 손해배상책임 보장을 위한 보증 등을 설정해야 한다.', distractors: ['보증 설정은 폐업 후에만 하면 된다.', '손해배상책임 보장은 중개보조원 개인에게만 요구된다.', '보증 설정을 하면 고의 위법행위도 모두 적법해진다.', '보증 설정 사실은 거래당사자와 전혀 관련이 없다.'], answer: 1, explanation: '개업공인중개사의 손해배상책임 보장 제도는 거래 안전 장치입니다.', trapType: '보증 효과 과장' },
  { chapter: '중개대상물', topic: '중개대상물 범위', lawRef: '공인중개사법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 29, questionText: '공인중개사법상 중개대상물에 해당할 수 있는 것은?', correctChoice: '토지, 건축물 그 밖의 토지의 정착물은 중개대상물이 될 수 있다.', distractors: ['주식 매매는 언제나 공인중개사법상 중개대상물이다.', '자동차 매매는 토지 정착물이므로 중개대상물이다.', '동산인 가전제품은 단독으로 중개대상물에 해당한다.', '영업비밀 양도계약은 중개대상물의 전형적 예이다.'], answer: 1, explanation: '중개대상물은 토지, 건축물, 그 밖의 토지 정착물 등을 중심으로 봅니다.', trapType: '동산 혼입' },
  { chapter: '중개보조원', topic: '중개보조원 업무', lawRef: '공인중개사법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 28, questionText: '중개보조원에 관한 설명으로 옳은 것은?', correctChoice: '중개보조원은 개업공인중개사의 중개업무를 보조하는 자이다.', distractors: ['중개보조원은 독자적으로 중개계약을 체결할 수 있다.', '중개보조원은 공인중개사 자격증을 반드시 가진 사람만 가능하다.', '중개보조원 명의로 중개사무소 개설등록을 할 수 있다.', '중개보조원은 확인ㆍ설명서에 공인중개사로 서명할 수 있다.'], answer: 1, explanation: '중개보조원은 보조자이며 공인중개사 고유 업무와 구별됩니다.', trapType: '보조자 권한 과장' },
  { chapter: '소속공인중개사', topic: '소속공인중개사 신고', lawRef: '공인중개사법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 28, questionText: '소속공인중개사에 관한 설명으로 옳지 않은 것은?', correctChoice: '개업공인중개사가 소속공인중개사를 고용한 경우 등록관청 신고가 문제될 수 있다.', distractors: ['소속공인중개사는 공인중개사 자격을 가진 자이다.', '소속공인중개사는 중개행위와 관련해 서명ㆍ날인 의무가 문제될 수 있다.', '소속공인중개사의 업무상 행위는 개업공인중개사의 관리책임과 연결될 수 있다.', '소속공인중개사는 동시에 다른 중개사무소의 개업공인중개사가 될 수 있다.'], answer: 5, explanation: '소속공인중개사와 개업공인중개사의 이중소속ㆍ이중등록 제한을 구별해야 합니다.', trapType: '이중소속' },
  { chapter: '전속중개계약', topic: '전속중개계약', lawRef: '공인중개사법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 27, questionText: '전속중개계약에 관한 설명으로 옳은 것은?', correctChoice: '전속중개계약을 체결한 경우 개업공인중개사는 법령상 정해진 사항을 의뢰인에게 설명하고 계약서를 작성해야 한다.', distractors: ['전속중개계약은 반드시 구두로만 체결한다.', '전속중개계약을 체결하면 의뢰인은 어떤 경우에도 직접 거래할 수 없다.', '전속중개계약은 중개보조원과 의뢰인 사이에만 체결한다.', '전속중개계약에는 유효기간이 전혀 문제되지 않는다.'], answer: 1, explanation: '전속중개계약은 서면, 유효기간, 공개 의무 등을 함께 봐야 합니다.', trapType: '전속 효과 과장' },
  { chapter: '부동산거래신고', topic: '거래신고', lawRef: '부동산 거래신고 등에 관한 법률', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 29, questionText: '부동산 거래신고에 관한 설명으로 옳은 것은?', correctChoice: '부동산 매매계약 등은 법령상 정해진 기간 내 거래신고 대상이 될 수 있다.', distractors: ['거래신고는 임대차계약에는 어떤 경우에도 적용되지 않는다.', '거래신고를 하면 등기신청이 항상 자동 완료된다.', '다운계약 신고는 세금을 줄이면 적법하다.', '거래신고 의무는 공인중개사법상 중개보수와 동일한 제도이다.'], answer: 1, explanation: '거래신고는 실거래가 투명성을 위한 별도 법령상 절차입니다.', trapType: '신고와 등기 혼동' },
  { chapter: '금지행위', topic: '무등록 중개', lawRef: '공인중개사법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 27, questionText: '무등록 중개업에 관한 설명으로 옳지 않은 것은?', correctChoice: '개설등록을 하지 않고 중개업을 하는 행위는 금지된다.', distractors: ['무등록 중개업은 형사처벌과 연결될 수 있다.', '등록 명의 대여도 금지행위로 문제될 수 있다.', '중개보수 명목의 금품 수수 여부가 쟁점이 될 수 있다.', '인터넷으로만 중개하면 등록 없이 영업해도 항상 적법하다.'], answer: 5, explanation: '영업 방식이 온라인이라는 이유만으로 등록 의무가 사라지는 것은 아닙니다.', trapType: '온라인 예외 오답' },
  { chapter: '금지행위', topic: '부당한 이익 취득', lawRef: '공인중개사법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 26, questionText: '개업공인중개사의 금지행위로 가장 적절한 것은?', correctChoice: '거래당사자를 기망하여 부당한 이익을 얻는 행위', distractors: ['중개대상물 확인ㆍ설명서를 작성하는 행위', '등록증을 사무소에 게시하는 행위', '법정 한도 안에서 중개보수를 받는 행위', '거래계약서를 작성하여 교부하는 행위'], answer: 1, explanation: '기망ㆍ부당이익, 시세 조작, 투기 조장 등은 금지행위로 출제됩니다.', trapType: '정상 의무와 금지행위 구분' },
  { chapter: '행정처분', topic: '자격취소와 등록취소', lawRef: '공인중개사법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 29, questionText: '자격취소와 등록취소에 관한 설명으로 옳은 것은?', correctChoice: '공인중개사 자격에 대한 처분과 중개사무소 등록에 대한 처분은 구별해야 한다.', distractors: ['등록취소는 항상 자격취소와 같은 처분이다.', '자격정지는 개업공인중개사의 중개사무소 등록증을 새로 발급하는 절차이다.', '등록취소를 받으면 모든 행정처분 이력이 즉시 삭제된다.', '자격취소는 중개보조원에게만 적용된다.'], answer: 1, explanation: '자격과 등록은 처분 대상과 효과가 다릅니다.', trapType: '자격ㆍ등록 혼동' },
  { chapter: '광고', topic: '플랫폼 광고', lawRef: '공인중개사법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '온라인 중개대상물 광고에서 특히 문제되는 사항으로 가장 적절한 것은?', correctChoice: '실제 존재하지 않는 매물, 가격 왜곡, 광고 주체 표시 누락 등이 문제될 수 있다.', distractors: ['온라인 광고는 법령상 항상 중개대상물 표시ㆍ광고가 아니다.', '앱에 올린 광고는 소비자 오인 가능성을 전혀 판단하지 않는다.', '사진이 포함된 광고는 허위 표시가 될 수 없다.', '온라인 플랫폼 광고는 개업공인중개사 정보 표시와 무관하다.'], answer: 1, explanation: '온라인 광고도 허위ㆍ과장 표시와 광고 주체 표시 문제가 중요합니다.', trapType: '온라인 광고 예외' },
  { chapter: '전세사기 예방', topic: '권리관계 확인', lawRef: '공인중개사법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '임대차 중개 시 전세사기 예방 관점에서 확인ㆍ설명과 가장 밀접한 것은?', correctChoice: '등기사항, 선순위 권리, 보증금 회수 위험, 임대인의 권한 등을 확인하는 것', distractors: ['임차인이 젊으면 등기사항 확인은 생략하는 것', '시세보다 높은 보증금은 항상 안전하다고 설명하는 것', '확정일자는 세금 신고와 같다고 안내하는 것', '근저당권은 임대차와 아무 관련이 없다고 설명하는 것'], answer: 1, explanation: '임대차 중개에서는 선순위 권리와 보증금 회수 가능성이 핵심 확인 대상입니다.', trapType: '권리분석 누락' },
  { chapter: '전자계약', topic: '전자계약 활용', lawRef: '부동산 거래신고 등에 관한 법률', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '부동산 전자계약에 관한 설명으로 가장 적절한 것은?', correctChoice: '전자계약은 계약서 작성ㆍ보관ㆍ신고 절차의 전자화를 통해 거래 투명성을 높이는 데 활용될 수 있다.', distractors: ['전자계약을 쓰면 중개대상물 확인ㆍ설명 의무가 모두 사라진다.', '전자계약은 공인중개사 자격시험과 무관한 사적 메모이다.', '전자서명을 하면 당사자 본인확인은 언제나 불필요하다.', '전자계약은 임대차계약에는 절대로 사용할 수 없다.'], answer: 1, explanation: '전자계약은 절차를 전자화할 뿐 핵심 의무를 면제하는 제도가 아닙니다.', trapType: '전자화와 의무 면제 혼동' },
  { chapter: '임대차 신고', topic: '주택임대차 신고', lawRef: '부동산 거래신고 등에 관한 법률', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '주택 임대차 신고제에 관한 설명으로 옳은 것은?', correctChoice: '일정한 주택 임대차계약은 보증금ㆍ차임 등 계약 내용을 신고해야 할 수 있다.', distractors: ['임대차 신고를 하면 보증금 반환이 국가에 의해 무조건 보장된다.', '임대차 신고는 소유권이전등기와 같은 절차이다.', '신고 대상 여부는 계약 금액과 지역과 무관하게 항상 같다.', '신고 의무는 매도인에게만 있고 임대차 당사자와는 무관하다.'], answer: 1, explanation: '임대차 신고제는 대상 지역ㆍ금액ㆍ계약유형을 확인해야 합니다.', trapType: '신고 효과 과장' },
  { chapter: '중개대상물 확인설명', topic: '공부와 현황', lawRef: '공인중개사법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '공부상 내용과 실제 현황이 다른 경우 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 공부 확인과 함께 실제 이용상태 등 현황 차이를 확인ㆍ설명해야 한다.', distractors: ['등기부가 있으면 현장 확인은 법적으로 항상 금지된다.', '건축물대장과 현황이 다르면 무조건 거래계약은 무효이다.', '현황 차이는 매수인이 알아서 볼 사항이므로 설명 대상이 아니다.', '중개보조원이 구두로 봤다고 하면 확인설명서 작성은 생략된다.'], answer: 1, explanation: '공부와 현황의 불일치는 확인ㆍ설명 의무의 단골 함정입니다.', trapType: '공부만 확인 오답' },
  { chapter: '중개보수', topic: '거래금액 산정', lawRef: '공인중개사법 시행규칙', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '임대차 중개보수 산정에서 함정이 되기 쉬운 것은?', correctChoice: '보증금과 월차임이 함께 있는 경우 환산 거래금액 산정 기준을 확인해야 한다.', distractors: ['월세 계약은 중개보수를 절대 받을 수 없다.', '보증금이 있으면 월차임은 언제나 무시한다.', '중개보수는 임대인이 원하는 금액을 그대로 받는다.', '거래금액 산정은 공시지가만으로 결정한다.'], answer: 1, explanation: '임대차 보수 산정은 보증금과 월차임 환산 기준을 함께 봅니다.', trapType: '환산 거래금액' },
  { chapter: '금지행위', topic: '명의대여', lawRef: '공인중개사법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '명의대여에 관한 설명으로 옳지 않은 것은?', correctChoice: '공인중개사 자격증이나 등록증을 다른 사람에게 대여하는 행위는 금지된다.', distractors: ['명의대여는 무등록 중개업과 결합해 출제될 수 있다.', '등록 명의와 실제 영업자가 다른 경우 문제가 된다.', '명의대여는 행정처분과 벌칙의 대상이 될 수 있다.', '가족에게 빌려주는 경우에는 등록증 대여가 언제나 허용된다.'], answer: 5, explanation: '가족관계가 있어도 명의대여 금지가 당연히 사라지지 않습니다.', trapType: '가족 예외 오답' },
  { chapter: '전속중개계약', topic: '정보공개', lawRef: '공인중개사법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '전속중개계약 체결 후 정보공개에 관한 설명으로 옳은 것은?', correctChoice: '전속중개계약을 체결한 개업공인중개사는 법령상 정해진 방법으로 중개대상물 정보를 공개해야 할 수 있다.', distractors: ['전속중개계약은 비밀계약이므로 어떤 정보도 공개할 수 없다.', '정보공개 의무는 매도인의 나이만 공개하면 충분하다.', '전속중개계약을 체결하면 확인ㆍ설명 의무가 사라진다.', '전속중개계약은 중개보수 상한을 폐지하는 약정이다.'], answer: 1, explanation: '전속중개계약은 계약서 작성, 정보공개, 업무처리상황 통지와 연결됩니다.', trapType: '전속계약 효과 혼동' },
  { chapter: '행정처분', topic: '청문', lawRef: '공인중개사법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '등록취소 등 불이익 처분 절차에 관한 설명으로 가장 적절한 것은?', correctChoice: '중대한 불이익 처분에는 법령에 따른 의견진술 또는 청문 절차가 문제될 수 있다.', distractors: ['등록취소는 반드시 전화 한 통으로만 한다.', '청문은 세금 체납자에게만 적용되는 민사 절차이다.', '행정절차는 공인중개사법상 처분과 전혀 관련이 없다.', '처분 사유가 있으면 통지 없이 처분해야만 적법하다.'], answer: 1, explanation: '행정처분은 사유뿐 아니라 절차도 함께 출제됩니다.', trapType: '절차 무시 오답' },
  { chapter: '손해배상책임', topic: '책임 범위', lawRef: '공인중개사법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '중개사고와 손해배상책임에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사의 고의 또는 과실로 거래당사자에게 손해가 발생하면 손해배상책임이 문제될 수 있다.', distractors: ['보증보험에 가입하면 어떤 불법행위도 책임을 지지 않는다.', '중개보조원이 관여한 사고는 개업공인중개사와 언제나 무관하다.', '손해배상책임은 계약서가 있으면 절대 발생하지 않는다.', '중개사고는 형사문제만 되고 민사책임은 성립할 수 없다.'], answer: 1, explanation: '보증 제도와 손해배상책임의 성립 요건을 구별해야 합니다.', trapType: '보증 가입 면책 오답' },
  { chapter: '부동산거래신고', topic: '자금조달계획', lawRef: '부동산 거래신고 등에 관한 법률', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '자금조달계획서 제출에 관한 설명으로 옳은 것은?', correctChoice: '일정 지역ㆍ금액의 주택 거래에서는 자금조달계획서 제출이 문제될 수 있다.', distractors: ['자금조달계획서는 모든 전세계약에 예외 없이 제출한다.', '자금조달계획서는 건축물대장을 대신하는 공부이다.', '제출 대상 여부는 거래가격과 지역과 무관하다.', '자금조달계획서를 내면 취득세 납부가 면제된다.'], answer: 1, explanation: '자금조달계획은 거래신고와 함께 대상 요건을 확인해야 합니다.', trapType: '대상 요건 혼동' },
  { chapter: '확인설명', topic: '권리관계', lawRef: '공인중개사법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '권리관계 확인에 관한 설명으로 옳지 않은 것은?', correctChoice: '등기사항증명서의 갑구와 을구를 통해 소유권과 제한물권 등을 확인해야 한다.', distractors: ['가압류, 근저당권 등은 거래 위험 판단에 영향을 줄 수 있다.', '임대차 중개에서는 선순위 권리 확인이 중요하다.', '소유자와 계약 당사자가 다른 경우 대리권 확인이 문제된다.', '등기부에 근저당권이 있어도 보증금 회수 위험 설명은 언제나 금지된다.'], answer: 5, explanation: '선순위 권리와 보증금 회수 위험은 설명 대상이 될 수 있습니다.', trapType: '위험 설명 금지 오답' },
  { chapter: '기본', topic: '개업공인중개사', lawRef: '공인중개사법', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '개업공인중개사에 관한 설명으로 옳은 것은?', correctChoice: '개업공인중개사는 중개사무소 개설등록을 한 공인중개사 또는 법인을 말한다.', distractors: ['공인중개사 자격시험 응시자는 모두 개업공인중개사이다.', '중개보조원은 등록 없이 개업공인중개사가 된다.', '건물 소유자는 모두 개업공인중개사이다.', '임차인은 계약 체결과 동시에 개업공인중개사가 된다.'], answer: 1, explanation: '자격자, 개업공인중개사, 소속공인중개사, 중개보조원을 구분해야 합니다.', trapType: '용어 기본' },
  { chapter: '기본', topic: '공인중개사', lawRef: '공인중개사법', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '공인중개사에 관한 설명으로 옳은 것은?', correctChoice: '공인중개사는 법령에 따른 자격을 취득한 자를 말한다.', distractors: ['공인중개사는 부동산을 소유한 사람을 말한다.', '공인중개사는 임대차계약의 임차인을 말한다.', '공인중개사는 건축허가권자를 말한다.', '공인중개사는 취득세 납세의무자를 말한다.'], answer: 1, explanation: '공인중개사는 자격 개념이고 개업 여부와 구별됩니다.', trapType: '자격과 영업 구분' },
  { chapter: '기본', topic: '중개', lawRef: '공인중개사법', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '공인중개사법상 중개의 의미로 가장 적절한 것은?', correctChoice: '중개대상물에 대하여 거래당사자 간 매매ㆍ교환ㆍ임대차 등 권리의 득실변경 행위를 알선하는 것이다.', distractors: ['세금 신고서를 대신 작성하는 행위만을 말한다.', '건축허가 신청서를 접수하는 행위만을 말한다.', '등기소에서 등기부를 발급받는 행위만을 말한다.', '아파트 관리비를 징수하는 행위만을 말한다.'], answer: 1, explanation: '중개는 거래당사자 사이의 권리변동 행위 알선입니다.', trapType: '중개 개념 기본' },
  { chapter: '기본', topic: '중개대상물', lawRef: '공인중개사법', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '중개대상물의 예로 가장 적절한 것은?', correctChoice: '토지와 건축물', distractors: ['휴대전화', '승용차', '회사 주식', '영업비밀'], answer: 1, explanation: '토지와 건축물은 공인중개사법상 대표적인 중개대상물입니다.', trapType: '대상물 기본' },
];

const registryTaxSeeds: AuthoredQuestionSeed[] = [
  { chapter: '공간정보법', topic: '지번', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '지번에 관한 설명으로 옳은 것은?', correctChoice: '지번은 필지를 구별하기 위하여 지적소관청이 붙이는 번호이다.', distractors: ['지번은 건축물의 층수를 표시하는 번호이다.', '지번은 소유자의 주민등록번호와 동일하다.', '지번은 등기권리증 발급 순서를 뜻한다.', '지번은 취득세 세율을 직접 표시한다.'], answer: 1, explanation: '지번은 필지 식별을 위한 번호입니다.', trapType: '지번과 주소 혼동' },
  { chapter: '공간정보법', topic: '지목', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '지목에 관한 설명으로 옳지 않은 것은?', correctChoice: '지목은 토지의 주된 사용 목적에 따라 토지의 종류를 구분하여 표시한 것이다.', distractors: ['전, 답, 대, 임야 등은 지목의 예가 될 수 있다.', '하나의 필지에는 원칙적으로 하나의 지목을 설정한다.', '토지의 실제 이용상황과 공부상 지목이 다른 경우가 있을 수 있다.', '지목은 건축물 소유자의 성명을 표시하는 등기부 항목이다.'], answer: 5, explanation: '지목은 토지 종류 표시이지 소유자 성명 표시가 아닙니다.', trapType: '지목과 소유자 표시 혼동' },
  { chapter: '공간정보법', topic: '필지', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '필지에 관한 설명으로 옳은 것은?', correctChoice: '필지는 하나의 지번이 붙는 토지의 등록 단위이다.', distractors: ['필지는 건축물 한 동의 층별 구분 단위이다.', '필지는 임대차계약의 월세 납부 단위이다.', '필지는 양도소득세 기본세율 명칭이다.', '필지는 등기권리자의 인감증명서 번호이다.'], answer: 1, explanation: '필지는 지적공부 등록의 기본 단위입니다.', trapType: '등록 단위 기본' },
  { chapter: '공간정보법', topic: '지적공부', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '지적공부에 관한 설명으로 옳은 것은?', correctChoice: '토지대장, 임야대장, 지적도, 임야도 등은 지적공부에 해당할 수 있다.', distractors: ['등기필정보는 지적공부의 유일한 종류이다.', '건축물대장은 토지의 지번과 지목만 등록하는 지적공부이다.', '주민등록등본은 토지 면적을 공시하는 지적공부이다.', '납세고지서는 지적도와 동일한 공부이다.'], answer: 1, explanation: '지적공부 종류를 등기부ㆍ건축물대장과 구분해야 합니다.', trapType: '공부 종류 혼동' },
  { chapter: '공간정보법', topic: '신규등록', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '토지의 신규등록에 관한 설명으로 옳은 것은?', correctChoice: '새로 조성된 토지 등 지적공부에 등록되지 않은 토지는 신규등록 대상이 될 수 있다.', distractors: ['신규등록은 소유권보존등기와 언제나 같은 절차이다.', '신규등록은 토지의 소유자가 바뀔 때마다 반드시 한다.', '신규등록은 건축물 멸실신고의 다른 이름이다.', '신규등록은 취득세 신고를 하면 자동으로 항상 생략된다.'], answer: 1, explanation: '신규등록은 지적공부에 없는 토지를 새로 등록하는 절차입니다.', trapType: '지적등록과 등기 혼동' },
  { chapter: '공간정보법', topic: '분할', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '토지분할에 관한 설명으로 옳은 것은?', correctChoice: '하나의 필지를 둘 이상의 필지로 나누는 토지이동이다.', distractors: ['여러 필지를 하나의 필지로 합치는 절차이다.', '건축물의 호수를 새로 정하는 절차이다.', '소유권이전등기를 말소하는 등기 절차이다.', '양도소득세 예정신고를 분납하는 절차이다.'], answer: 1, explanation: '분할과 합병은 토지이동 유형의 기본입니다.', trapType: '분할과 합병 혼동' },
  { chapter: '공간정보법', topic: '합병', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '토지합병에 관한 설명으로 옳지 않은 것은?', correctChoice: '합병은 둘 이상의 필지를 하나의 필지로 합하는 토지이동이다.', distractors: ['합병에는 일정한 제한 사유가 문제될 수 있다.', '합병 후에는 새 지번 부여 등이 문제될 수 있다.', '지목이나 소유자 관계가 합병 가능성에 영향을 줄 수 있다.', '합병은 하나의 필지를 둘 이상으로 나누는 절차이다.'], answer: 5, explanation: '하나의 필지를 둘 이상으로 나누는 것은 분할입니다.', trapType: '분할ㆍ합병 반대 개념' },
  { chapter: '부동산등기법', topic: '등기사항', lawRef: '부동산등기법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '부동산등기기록에 관한 설명으로 옳은 것은?', correctChoice: '갑구에는 소유권에 관한 사항, 을구에는 소유권 외의 권리에 관한 사항이 기록된다.', distractors: ['갑구에는 근저당권만 기록되고 소유권은 기록되지 않는다.', '을구에는 소유권이전등기만 기록된다.', '표제부에는 소유자의 주민등록번호만 기록된다.', '등기기록은 지적도와 완전히 같은 공부이다.'], answer: 1, explanation: '표제부, 갑구, 을구의 역할 구분은 필수입니다.', trapType: '갑구ㆍ을구 혼동' },
  { chapter: '부동산등기법', topic: '표제부', lawRef: '부동산등기법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '등기기록의 표제부에 관한 설명으로 옳은 것은?', correctChoice: '표제부에는 부동산의 표시, 즉 소재ㆍ지번ㆍ지목ㆍ면적 등이 기록될 수 있다.', distractors: ['표제부에는 근저당권자의 채권최고액만 기록된다.', '표제부는 소유권 이전 순위번호만 기록한다.', '표제부는 양도소득세 예정신고서이다.', '표제부에는 임차인의 월세 납부 내역만 기록된다.'], answer: 1, explanation: '표제부는 권리관계가 아니라 부동산의 표시를 중심으로 봅니다.', trapType: '표시와 권리 구분' },
  { chapter: '부동산등기법', topic: '보존등기', lawRef: '부동산등기법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '소유권보존등기에 관한 설명으로 옳은 것은?', correctChoice: '미등기 부동산에 최초로 하는 소유권 등기이다.', distractors: ['이미 등기된 부동산의 소유자를 바꾸는 등기이다.', '근저당권을 설정하기 위한 유일한 등기이다.', '가압류를 말소하는 등기만을 말한다.', '취득세를 부과하는 세무서 내부 문서이다.'], answer: 1, explanation: '보존등기와 이전등기를 구별해야 합니다.', trapType: '보존ㆍ이전 구분' },
  { chapter: '부동산등기법', topic: '이전등기', lawRef: '부동산등기법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '소유권이전등기에 관한 설명으로 옳지 않은 것은?', correctChoice: '매매 등으로 소유권이 이전된 경우 그 변동을 공시하기 위한 등기이다.', distractors: ['등기권리자와 등기의무자가 공동으로 신청하는 것이 원칙이다.', '판결 등 일정한 경우 단독신청이 문제될 수 있다.', '등기원인과 그 연월일 기재가 문제될 수 있다.', '소유권이전등기는 미등기 부동산에 최초로 하는 등기만을 말한다.'], answer: 5, explanation: '미등기 부동산에 최초로 하는 등기는 보존등기입니다.', trapType: '보존등기 오답' },
  { chapter: '부동산등기법', topic: '공동신청', lawRef: '부동산등기법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '등기의 공동신청 원칙에 관한 설명으로 옳은 것은?', correctChoice: '권리의 변동을 수반하는 등기는 등기권리자와 등기의무자가 공동으로 신청하는 것이 원칙이다.', distractors: ['모든 등기는 세무서장이 단독으로 신청해야 한다.', '공동신청 원칙에는 어떠한 예외도 존재할 수 없다.', '등기권리자는 권리를 잃는 자만을 말한다.', '등기의무자는 언제나 매수인을 말한다.'], answer: 1, explanation: '공동신청 원칙과 예외를 함께 정리해야 합니다.', trapType: '권리자ㆍ의무자 혼동' },
  { chapter: '부동산등기법', topic: '근저당권등기', lawRef: '부동산등기법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '근저당권 설정등기에 관한 설명으로 옳은 것은?', correctChoice: '근저당권은 소유권 외의 권리로서 을구에 기록된다.', distractors: ['근저당권은 갑구의 소유권이전 순위에만 기록된다.', '근저당권 설정등기는 지목변경 신청과 동일하다.', '근저당권은 채권최고액을 기록할 수 없다.', '근저당권은 토지대장에만 기록되고 등기기록에는 기록되지 않는다.'], answer: 1, explanation: '근저당권은 을구 권리분석의 대표 항목입니다.', trapType: '갑구ㆍ을구' },
  { chapter: '부동산등기법', topic: '말소등기', lawRef: '부동산등기법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 34, questionText: '말소등기에 관한 설명으로 옳은 것은?', correctChoice: '기존 등기의 전부를 소멸시키기 위하여 하는 등기이다.', distractors: ['새 건물에 최초로 소유권을 공시하는 등기이다.', '토지의 면적을 측량하는 지적 절차이다.', '월세를 보증금으로 바꾸는 계약서이다.', '취득세율을 변경하는 조례이다.'], answer: 1, explanation: '말소등기, 변경등기, 경정등기를 구분해야 합니다.', trapType: '등기 종류 구분' },
  { chapter: '취득세', topic: '과세대상', lawRef: '지방세법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 36, questionText: '취득세에 관한 설명으로 옳은 것은?', correctChoice: '부동산을 취득한 자에게 취득세 납세의무가 성립할 수 있다.', distractors: ['취득세는 부동산을 양도한 자에게만 부과된다.', '취득세는 재산 보유 기간 매년 6월 1일 현재 부과되는 세금이다.', '취득세는 등기부 갑구의 순위번호이다.', '취득세는 지목변경 신청서의 명칭이다.'], answer: 1, explanation: '취득세는 취득 행위에 과세되는 지방세입니다.', trapType: '취득세와 재산세 혼동' },
  { chapter: '취득세', topic: '취득시기', lawRef: '지방세법', category: 'recent_frequent', difficulty: 'normal', sourceType: 'modified', sourceRound: 35, questionText: '취득세의 취득시기에 관한 설명으로 가장 적절한 것은?', correctChoice: '유상승계취득 등 취득 유형에 따라 사실상 취득일 또는 계약상 잔금지급일 등이 문제될 수 있다.', distractors: ['모든 취득의 취득시기는 매년 1월 1일로 고정된다.', '취득시기는 소유자가 원하는 날로 임의 지정한다.', '취득시기는 건축물의 층수에 따라 결정된다.', '취득시기는 등기소 직원의 생년월일이다.'], answer: 1, explanation: '취득시기는 취득세 신고ㆍ납부 기산점과 연결됩니다.', trapType: '취득시기 고정 오답' },
  { chapter: '재산세', topic: '과세기준일', lawRef: '지방세법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 29, questionText: '재산세 과세기준일에 관한 설명으로 옳은 것은?', correctChoice: '재산세는 과세기준일 현재 재산을 사실상 소유한 자가 납세의무자가 되는 것이 원칙이다.', distractors: ['재산세는 부동산을 매도한 모든 과거 소유자에게 영구히 부과된다.', '재산세는 등기를 신청한 날마다 매일 부과된다.', '재산세 과세기준일은 중개보수 지급일과 동일하다.', '재산세는 양도차익이 있을 때에만 부과된다.'], answer: 1, explanation: '재산세는 보유세이고 과세기준일이 중요합니다.', trapType: '취득세ㆍ양도세와 혼동' },
  { chapter: '재산세', topic: '납세의무자', lawRef: '지방세법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 29, questionText: '재산세 납세의무자에 관한 설명으로 옳은 것은?', correctChoice: '공부상 소유자와 사실상 소유자가 다른 경우 법령상 사실상 소유자 판단이 문제될 수 있다.', distractors: ['재산세는 항상 임차인에게만 부과된다.', '재산세는 공인중개사가 대신 납부하는 세금이다.', '재산세는 소유 여부와 무관하게 주소지만 있으면 부과된다.', '재산세 납세의무자는 등기소장이 임의로 정한다.'], answer: 1, explanation: '재산세는 과세기준일과 사실상 소유자 판단이 핵심입니다.', trapType: '소유자 판단' },
  { chapter: '종합부동산세', topic: '과세 개념', lawRef: '종합부동산세법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 28, questionText: '종합부동산세에 관한 설명으로 옳은 것은?', correctChoice: '일정 기준을 초과하여 보유한 주택 또는 토지에 대해 별도 과세가 문제될 수 있다.', distractors: ['종합부동산세는 부동산을 취득할 때 한 번 내는 취득세와 동일하다.', '종합부동산세는 모든 임대차계약의 중개보수이다.', '종합부동산세는 등기부 표제부의 면적 변경 등기이다.', '종합부동산세는 건축허가를 받을 때 제출하는 설계도면이다.'], answer: 1, explanation: '종부세는 고액 부동산 보유와 관련된 국세입니다.', trapType: '보유세와 취득세 구분' },
  { chapter: '양도소득세', topic: '양도', lawRef: '소득세법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 29, questionText: '양도소득세에서 양도의 의미로 가장 적절한 것은?', correctChoice: '자산에 대한 등기 또는 등록과 관계없이 매도ㆍ교환 등으로 사실상 유상 이전되는 것을 말한다.', distractors: ['양도는 재산세 과세기준일을 말한다.', '양도는 토지 지목을 전에서 대로 바꾸는 절차만을 말한다.', '양도는 건축물 사용승인 신청만을 말한다.', '양도는 중개보수를 지급하는 행위만을 말한다.'], answer: 1, explanation: '양도소득세는 자산의 유상 이전 개념이 출발점입니다.', trapType: '양도 개념' },
  { chapter: '양도소득세', topic: '1세대 1주택', lawRef: '소득세법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 28, questionText: '1세대 1주택 비과세에 관한 설명으로 옳은 것은?', correctChoice: '보유기간, 거주기간, 주택 수 등 법령상 요건을 충족해야 비과세가 문제될 수 있다.', distractors: ['주택을 팔면 언제나 아무 조건 없이 비과세된다.', '1세대 1주택 비과세는 취득세 감면과 동일하다.', '오피스텔은 실제 사용과 무관하게 언제나 주택 수에서 제외된다.', '비과세 요건은 매도인이 임의로 정할 수 있다.'], answer: 1, explanation: '비과세는 요건 충족 여부가 핵심이며 숫자와 예외가 자주 출제됩니다.', trapType: '무조건 비과세 오답' },
  { chapter: '양도소득세', topic: '장기보유특별공제', lawRef: '소득세법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 27, questionText: '장기보유특별공제에 관한 설명으로 옳은 것은?', correctChoice: '일정 기간 이상 보유한 자산의 양도차익 계산에서 공제 적용이 문제될 수 있다.', distractors: ['장기보유특별공제는 취득세 납부세액을 전액 환급하는 제도이다.', '장기보유특별공제는 보유기간과 관계없이 항상 100퍼센트 적용된다.', '장기보유특별공제는 지적공부의 지번 부여 절차이다.', '장기보유특별공제는 근저당권 채권최고액을 정하는 등기이다.'], answer: 1, explanation: '장기보유특별공제는 양도소득세 계산 구조에서 보유기간과 연결됩니다.', trapType: '공제율 과장' },
  { chapter: '공간정보법', topic: '지목변경', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 28, questionText: '지목변경에 관한 설명으로 옳은 것은?', correctChoice: '토지의 주된 사용 목적이 변경된 경우 지목변경 신청이 문제될 수 있다.', distractors: ['지목변경은 소유권을 다른 사람에게 이전하는 등기이다.', '지목변경은 양도소득세 세율을 선택하는 신고이다.', '지목변경은 건축물의 방 개수를 바꾸는 행위이다.', '지목변경은 임대차계약 갱신청구권 행사이다.'], answer: 1, explanation: '지목변경은 토지이동 중 하나로 실제 사용 목적 변경과 연결됩니다.', trapType: '지목변경과 등기 혼동' },
  { chapter: '부동산등기법', topic: '경정등기', lawRef: '부동산등기법', category: 'past', difficulty: 'normal', sourceType: 'original', sourceRound: 27, questionText: '경정등기에 관한 설명으로 옳은 것은?', correctChoice: '등기사항에 착오 또는 빠진 부분이 있는 경우 이를 바로잡기 위한 등기이다.', distractors: ['경정등기는 기존 등기를 전부 소멸시키는 등기만을 말한다.', '경정등기는 미등기 부동산 최초 등기이다.', '경정등기는 재산세 납세고지서이다.', '경정등기는 토지분할 측량성과도이다.'], answer: 1, explanation: '경정등기는 착오ㆍ누락을 바로잡는 등기입니다.', trapType: '말소등기와 경정등기 혼동' },
  { chapter: '취득세', topic: '중과세', lawRef: '지방세법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '주택 취득세 중과와 관련하여 확인할 사항으로 가장 적절한 것은?', correctChoice: '취득 주택 수, 조정대상지역 여부, 취득 원인과 예외 사유 등을 함께 검토해야 한다.', distractors: ['주택 수와 관계없이 모든 취득세율은 항상 0퍼센트이다.', '취득세 중과는 등기부 을구의 채권최고액을 말한다.', '취득세 중과는 임대차계약의 확정일자와 동일하다.', '취득세 중과 여부는 건축물 층수만으로 결정된다.'], answer: 1, explanation: '취득세 중과는 주택 수ㆍ지역ㆍ취득 원인ㆍ예외가 핵심입니다.', trapType: '중과 요건 단순화' },
  { chapter: '양도소득세', topic: '다주택자', lawRef: '소득세법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '다주택자 양도소득세 검토에서 가장 중요한 것은?', correctChoice: '양도일 현재 주택 수, 소재지, 보유ㆍ거주기간, 중과 배제 여부 등을 확인하는 것이다.', distractors: ['다주택자는 어떤 주택을 팔아도 항상 비과세된다.', '주택 수 판단은 지번 끝자리로만 결정된다.', '양도소득세는 매수인이 전액 부담하는 보유세이다.', '양도소득세는 등기 접수번호를 기준으로 면제된다.'], answer: 1, explanation: '다주택자 과세는 주택 수와 예외 규정을 함께 봐야 합니다.', trapType: '무조건 비과세 오답' },
  { chapter: '재산세', topic: '공정시장가액비율', lawRef: '지방세법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '재산세 계산에서 공정시장가액비율에 관한 설명으로 옳은 것은?', correctChoice: '과세표준 산정 과정에서 공시가격에 일정 비율을 적용하는 구조가 문제될 수 있다.', distractors: ['공정시장가액비율은 등기권리자의 지분율만을 뜻한다.', '공정시장가액비율은 모든 세목에서 항상 100퍼센트로 고정된다.', '공정시장가액비율은 건축물 사용승인일을 말한다.', '공정시장가액비율은 토지의 지목 중 하나이다.'], answer: 1, explanation: '재산세 과세표준은 공시가격과 공정시장가액비율 구조를 확인합니다.', trapType: '세액 계산 구조' },
  { chapter: '부동산등기법', topic: '전자신청', lawRef: '부동산등기법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '부동산등기 전자신청에 관한 설명으로 가장 적절한 것은?', correctChoice: '전자신청은 등기신청 방식의 전자화일 뿐 등기원인과 첨부정보 요건을 없애는 제도는 아니다.', distractors: ['전자신청을 하면 등기원인증서가 언제나 불필요하다.', '전자신청은 지적공부를 폐지하는 제도이다.', '전자신청은 취득세 납세의무를 자동 소멸시킨다.', '전자신청은 소유자 동의 없이 모든 등기를 가능하게 한다.'], answer: 1, explanation: '전자신청은 방식의 변화이지 실체 요건 면제가 아닙니다.', trapType: '전자화와 요건 면제 혼동' },
  { chapter: '공간정보법', topic: '축척변경', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '축척변경에 관한 설명으로 옳은 것은?', correctChoice: '지적도의 축척을 변경하여 등록하는 절차가 문제될 수 있다.', distractors: ['축척변경은 소유자를 매도인에서 매수인으로 바꾸는 등기이다.', '축척변경은 취득세 세율을 높이는 처분이다.', '축척변경은 건물 용도를 주택에서 상가로 바꾸는 행위이다.', '축척변경은 임대차기간을 연장하는 계약이다.'], answer: 1, explanation: '축척변경은 지적도면과 관련된 지적 절차입니다.', trapType: '도면 절차와 권리등기 혼동' },
  { chapter: '공간정보법', topic: '토지이동 신청', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '토지이동 신청에 관한 설명으로 옳지 않은 것은?', correctChoice: '토지소유자는 토지이동 사유가 있으면 법정 기간 내 지적소관청에 신청해야 할 수 있다.', distractors: ['분할, 합병, 지목변경 등은 토지이동으로 문제될 수 있다.', '지적소관청은 토지이동 정리와 지적공부 관리를 담당한다.', '토지이동은 등기부 표시 변경과 연결될 수 있다.', '토지이동 신청은 언제나 등기소에만 하고 지적소관청은 관여하지 않는다.'], answer: 5, explanation: '토지이동은 지적소관청 절차가 핵심이며 등기와 연결될 수는 있습니다.', trapType: '지적소관청과 등기소 혼동' },
  { chapter: '부동산등기법', topic: '등기의 효력', lawRef: '부동산등기법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '등기의 효력에 관한 설명으로 옳은 것은?', correctChoice: '부동산 물권변동은 법률행위로 인한 경우 등기를 해야 효력이 생기는 것이 원칙이다.', distractors: ['매매계약만 체결하면 등기 없이도 소유권이전 효력이 항상 완성된다.', '등기는 세금 신고서라서 물권변동과 무관하다.', '등기를 하면 무효인 법률행위도 언제나 유효가 된다.', '등기는 지목을 변경하는 측량 절차만을 말한다.'], answer: 1, explanation: '법률행위에 의한 부동산 물권변동은 등기주의가 핵심입니다.', trapType: '계약과 물권변동 혼동' },
  { chapter: '부동산등기법', topic: '등기권리자와 등기의무자', lawRef: '부동산등기법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '매매에 따른 소유권이전등기에서 일반적으로 옳은 것은?', correctChoice: '매수인은 등기권리자, 매도인은 등기의무자가 된다.', distractors: ['매도인은 등기권리자, 매수인은 등기의무자가 된다.', '중개보조원은 항상 등기권리자가 된다.', '등기소장은 등기의무자가 되어 소유권을 이전한다.', '임차인은 매매와 무관하게 항상 등기권리자가 된다.'], answer: 1, explanation: '권리를 얻는 자가 등기권리자, 권리를 잃는 자가 등기의무자입니다.', trapType: '권리자ㆍ의무자 반전' },
  { chapter: '취득세', topic: '신고납부', lawRef: '지방세법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '취득세 신고ㆍ납부에 관한 설명으로 옳은 것은?', correctChoice: '취득세는 취득일을 기준으로 법정 기한 내 신고ㆍ납부해야 하는 것이 원칙이다.', distractors: ['취득세는 양도인이 양도일 다음 해 5월에만 신고한다.', '취득세는 재산세 과세기준일에 자동으로만 부과된다.', '취득세 신고를 하지 않아도 가산세는 어떤 경우에도 없다.', '취득세는 등기부 을구에 채권최고액으로 기록된다.'], answer: 1, explanation: '취득세는 취득시기와 신고납부 기한이 연결됩니다.', trapType: '세목별 신고시기 혼동' },
  { chapter: '재산세', topic: '주택분 재산세', lawRef: '지방세법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '주택분 재산세에 관한 설명으로 옳은 것은?', correctChoice: '주택은 토지와 건물을 통합하여 주택분 재산세 과세가 문제될 수 있다.', distractors: ['주택분 재산세는 토지와 건물을 언제나 완전히 별도 세목으로만 과세한다.', '주택분 재산세는 매매계약 체결 즉시 매수인이 전액 신고납부한다.', '주택분 재산세는 양도소득세 장기보유특별공제이다.', '주택분 재산세는 지적도 축척변경 수수료이다.'], answer: 1, explanation: '주택분 재산세는 토지ㆍ건물 통합 평가 구조를 이해해야 합니다.', trapType: '토지ㆍ건물 과세 구조' },
  { chapter: '양도소득세', topic: '필요경비', lawRef: '소득세법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '양도소득세 계산에서 필요경비에 관한 설명으로 옳은 것은?', correctChoice: '취득가액, 자본적 지출액, 양도비 등 법령상 인정되는 금액이 필요경비로 문제될 수 있다.', distractors: ['필요경비는 양도자가 원하는 모든 생활비를 포함한다.', '필요경비는 재산세 과세기준일을 말한다.', '필요경비는 등기부 갑구 순위번호이다.', '필요경비는 지목변경 신청인의 이름이다.'], answer: 1, explanation: '필요경비는 양도차익 계산에서 인정 범위가 중요합니다.', trapType: '임의 비용 오답' },
  { chapter: '양도소득세', topic: '양도차익', lawRef: '소득세법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '양도차익 계산의 기본 구조로 옳은 것은?', correctChoice: '양도가액에서 취득가액과 필요경비 등을 차감하는 구조가 기본이다.', distractors: ['양도차익은 재산세 납세고지서의 고지번호이다.', '양도차익은 지번과 지목을 더한 값이다.', '양도차익은 매수인의 주민등록번호로 계산한다.', '양도차익은 중개보수 한도율과 항상 같다.'], answer: 1, explanation: '양도차익은 양도가액, 취득가액, 필요경비 구조로 봅니다.', trapType: '계산 구조 기본' },
  { chapter: '공간정보법', topic: '지적소관청', lawRef: '공간정보의 구축 및 관리 등에 관한 법률', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '지적소관청의 업무와 가장 관련이 깊은 것은?', correctChoice: '지적공부의 등록ㆍ관리와 토지이동 정리', distractors: ['양도소득세 세율 결정', '중개보수 약정', '근저당권 채권최고액 설정', '임대차 보증금 반환'], answer: 1, explanation: '지적소관청은 지적공부와 토지이동 업무를 담당합니다.', trapType: '기관 업무 기본' },
  { chapter: '부동산등기법', topic: '등기소', lawRef: '부동산등기법', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '등기소의 업무와 가장 관련이 깊은 것은?', correctChoice: '부동산 권리관계 등기의 접수와 기록', distractors: ['지방세 세율 조례 제정', '공인중개사 자격시험 출제', '건축물 공사감리', '농지전용허가'], answer: 1, explanation: '등기소는 부동산등기 기록을 담당합니다.', trapType: '기관 구분' },
  { chapter: '취득세', topic: '지방세', lawRef: '지방세법', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '취득세의 성격으로 옳은 것은?', correctChoice: '부동산 등 취득 행위에 과세되는 지방세이다.', distractors: ['부동산 양도차익에 과세되는 국세이다.', '토지 지번을 부여하는 지적 절차이다.', '소유권을 공시하는 등기이다.', '중개업 등록 수수료이다.'], answer: 1, explanation: '취득세는 취득 행위에 대한 지방세입니다.', trapType: '세목 기본' },
  { chapter: '양도소득세', topic: '국세', lawRef: '소득세법', category: 'easy', difficulty: 'easy', sourceType: 'modified', sourceRound: 33, questionText: '양도소득세의 성격으로 옳은 것은?', correctChoice: '부동산 등 자산의 양도로 발생한 소득에 과세되는 국세이다.', distractors: ['매년 보유 자체에 과세되는 지방세이다.', '지적공부에 지목을 등록하는 절차이다.', '부동산 소유권을 이전하는 등기이다.', '공인중개사의 업무정지 처분이다.'], answer: 1, explanation: '양도소득세는 양도소득에 대한 국세입니다.', trapType: '세목 기본' },
];

const publicLawSeeds: PublicLawSeed[] = [
  {
    chapter: '국토계획법',
    topic: '광역도시계획',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '광역도시계획에 관한 설명으로 옳은 것은?',
    choices: [
      '광역도시계획은 하나의 특별시 안에서만 수립할 수 있다.',
      '광역계획권은 장기적 발전방향을 제시하기 위한 공간 단위로 지정될 수 있다.',
      '광역도시계획은 도시ㆍ군관리계획의 세부 집행계획으로만 기능한다.',
      '시장 또는 군수는 관계 지방자치단체와 협의 없이 단독으로 광역도시계획을 확정한다.',
      '광역도시계획에는 기반시설의 배치 방향을 포함할 수 없다.',
    ],
    answer: 2,
    explanation: '광역도시계획은 광역계획권의 장기 발전방향과 공간구조를 제시하는 계획입니다.',
    trapType: '수립권자와 계획 위계 혼동',
  },
  {
    chapter: '국토계획법',
    topic: '도시ㆍ군기본계획',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '도시ㆍ군기본계획에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '도시ㆍ군기본계획은 관할 구역의 기본적인 공간구조와 장기발전방향을 제시한다.',
      '도시ㆍ군관리계획은 도시ㆍ군기본계획의 방향에 부합하도록 수립하는 것이 원칙이다.',
      '도시ㆍ군기본계획은 모든 필지별 건축물 용도를 직접 확정하는 처분이다.',
      '도시ㆍ군기본계획에는 토지이용, 교통, 환경 등에 관한 정책방향이 포함될 수 있다.',
      '일정한 경우 도시ㆍ군기본계획 수립 대상에서 제외되는 지방자치단체가 있을 수 있다.',
    ],
    answer: 3,
    explanation: '도시ㆍ군기본계획은 장기적ㆍ종합적 계획이지 필지별 용도를 직접 확정하는 도시ㆍ군관리계획이 아닙니다.',
    trapType: '기본계획과 관리계획 혼동',
  },
  {
    chapter: '국토계획법',
    topic: '도시ㆍ군관리계획',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 35,
    questionText: '도시ㆍ군관리계획으로 결정할 수 있는 사항이 아닌 것은?',
    choices: [
      '용도지역의 지정 또는 변경',
      '도시ㆍ군계획시설의 결정',
      '지구단위계획구역의 지정',
      '개별 공인중개사의 중개보수 상한 결정',
      '개발제한구역의 지정 또는 변경에 관한 계획',
    ],
    answer: 4,
    explanation: '중개보수 상한은 공법상 도시ㆍ군관리계획으로 결정하는 사항이 아닙니다.',
    trapType: '타 법령 영역 혼입',
  },
  {
    chapter: '국토계획법',
    topic: '용도지역',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '용도지역에 관한 설명으로 옳은 것은?',
    choices: [
      '용도지역은 도시지역에만 지정할 수 있고 비도시지역에는 지정할 수 없다.',
      '관리지역은 보전관리지역, 생산관리지역, 계획관리지역으로 세분될 수 있다.',
      '농림지역 안에서는 모든 개발행위가 예외 없이 금지된다.',
      '자연환경보전지역은 주거ㆍ상업ㆍ공업 기능의 집중을 목적으로 한다.',
      '용도지역은 조례로만 최초 지정할 수 있고 도시ㆍ군관리계획으로는 정할 수 없다.',
    ],
    answer: 2,
    explanation: '관리지역은 보전관리ㆍ생산관리ㆍ계획관리지역으로 세분됩니다.',
    trapType: '세분 체계 암기',
  },
  {
    chapter: '국토계획법',
    topic: '용도지구',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 34,
    questionText: '용도지구에 관한 설명으로 옳은 것은?',
    choices: [
      '용도지구는 용도지역의 제한을 보완하거나 강화하기 위하여 지정될 수 있다.',
      '용도지구가 지정되면 기존 용도지역은 자동으로 폐지된다.',
      '경관지구는 건축물의 미관과 관계가 없으므로 공법상 지정 대상이 아니다.',
      '방재지구는 문화재 보존만을 목적으로 지정된다.',
      '보호지구는 반드시 공업지역 안에서만 지정된다.',
    ],
    answer: 1,
    explanation: '용도지구는 용도지역의 기능을 증진하거나 경관ㆍ안전ㆍ보호 등을 위해 보완적으로 지정됩니다.',
    trapType: '용도지역과 용도지구 관계',
  },
  {
    chapter: '국토계획법',
    topic: '지구단위계획',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '지구단위계획에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '지구단위계획은 특정 지역을 체계적ㆍ계획적으로 관리하기 위한 도시ㆍ군관리계획이다.',
      '건축물의 용도, 건폐율, 용적률, 높이 등에 관한 사항을 정할 수 있다.',
      '기반시설의 배치와 규모에 관한 사항을 포함할 수 있다.',
      '지구단위계획은 토지이용을 전혀 제한하지 않는 행정 내부 문서에 불과하다.',
      '지구단위계획구역의 지정과 계획 수립은 구분하여 이해해야 한다.',
    ],
    answer: 4,
    explanation: '지구단위계획은 구체적 토지이용ㆍ건축 기준을 정할 수 있는 도시ㆍ군관리계획입니다.',
    trapType: '법적 성격 과소평가',
  },
  {
    chapter: '국토계획법',
    topic: '개발행위허가',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '개발행위허가 대상에 해당하는 것을 모두 고른 것은?',
    choices: [
      '건축물의 건축, 공작물의 설치, 토지의 형질변경',
      '주민등록 전입신고, 인감증명 발급, 확정일자 부여',
      '중개보수 약정, 권리금 계약, 임대차계약 갱신',
      '부동산 표시변경등기, 소유권보존등기, 말소등기',
      '취득세 신고, 재산세 부과, 양도소득세 예정신고',
    ],
    answer: 1,
    explanation: '개발행위허가의 전형적 대상은 건축물 건축, 공작물 설치, 토지 형질변경, 토석 채취, 물건 적치 등입니다.',
    trapType: '공법 절차와 민사ㆍ세무 절차 구분',
  },
  {
    chapter: '국토계획법',
    topic: '기반시설',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 33,
    questionText: '기반시설에 관한 설명으로 옳은 것은?',
    choices: [
      '도로ㆍ공원ㆍ수도공급설비 등은 기반시설의 예가 될 수 있다.',
      '기반시설은 민간이 설치하면 도시ㆍ군계획시설이 될 수 없다.',
      '학교는 교육시설이므로 기반시설 범위에 포함될 여지가 없다.',
      '기반시설은 반드시 토지소유자의 신청으로만 결정된다.',
      '도시ㆍ군계획시설 결정이 있으면 언제나 즉시 수용 절차가 완료된다.',
    ],
    answer: 1,
    explanation: '도로, 공원, 수도ㆍ전기ㆍ가스 공급설비, 학교 등은 기반시설 체계에서 다뤄질 수 있습니다.',
    trapType: '시설 예시와 절차 효과 혼동',
  },
  {
    chapter: '도시개발법',
    topic: '도시개발구역',
    lawRef: '도시개발법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 35,
    questionText: '도시개발구역의 지정에 관한 설명으로 옳은 것은?',
    choices: [
      '도시개발구역은 도시개발사업을 시행하기 위하여 지정될 수 있다.',
      '도시개발구역으로 지정되면 모든 토지는 즉시 국가 소유가 된다.',
      '도시개발구역 지정에는 개발계획 수립이 언제나 불필요하다.',
      '도시개발구역은 농지법에 따라 농업진흥지역으로만 지정된다.',
      '도시개발구역 지정권자는 사업시행자가 될 수 없다.',
    ],
    answer: 1,
    explanation: '도시개발구역은 도시개발사업의 공간 범위를 정하는 지정입니다.',
    trapType: '지정 효과 과장',
  },
  {
    chapter: '도시개발법',
    topic: '시행방식',
    lawRef: '도시개발법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '도시개발사업의 시행방식에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '수용 또는 사용방식으로 시행할 수 있다.',
      '환지방식으로 시행할 수 있다.',
      '수용ㆍ사용방식과 환지방식을 혼용할 수 있는 경우가 있다.',
      '환지방식은 토지의 권리관계 조정과 관련된다.',
      '도시개발사업은 법률상 오직 경매방식으로만 시행한다.',
    ],
    answer: 5,
    explanation: '도시개발사업은 수용ㆍ사용방식, 환지방식, 혼용방식 등으로 시행될 수 있습니다.',
    trapType: '시행방식 암기',
  },
  {
    chapter: '도시개발법',
    topic: '환지계획',
    lawRef: '도시개발법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 35,
    questionText: '환지계획에 관한 설명으로 옳은 것은?',
    choices: [
      '환지계획은 환지방식 사업에서 종전 토지와 환지의 관계를 정하는 계획이다.',
      '환지계획은 수용방식 사업에서 보상금 지급을 금지하기 위한 계획이다.',
      '환지계획이 인가되면 언제나 종전 토지 소유권이 즉시 소멸한다.',
      '환지계획에는 청산금에 관한 사항을 포함할 수 없다.',
      '환지예정지는 건축법상 대지와 아무 관련이 없다.',
    ],
    answer: 1,
    explanation: '환지계획은 환지방식에서 종전 토지, 환지, 청산금 등 권리 조정을 정하는 핵심 계획입니다.',
    trapType: '환지인가와 환지처분 효과 혼동',
  },
  {
    chapter: '도시정비법',
    topic: '정비사업 종류',
    lawRef: '도시 및 주거환경정비법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '정비사업에 관한 설명으로 옳은 것은?',
    choices: [
      '재개발사업과 재건축사업은 정비사업의 유형으로 구분된다.',
      '재건축사업은 반드시 농지를 대상으로만 시행한다.',
      '재개발사업은 기반시설 정비와 주거환경 개선과 무관하다.',
      '정비사업은 토지등소유자의 권리변동을 수반할 수 없다.',
      '정비사업은 도시ㆍ군관리계획과 항상 무관하게 독립적으로만 진행된다.',
    ],
    answer: 1,
    explanation: '정비사업은 재개발사업, 재건축사업 등으로 나뉘며 권리관계와 사업절차가 중요합니다.',
    trapType: '사업 유형 구분',
  },
  {
    chapter: '도시정비법',
    topic: '정비구역',
    lawRef: '도시 및 주거환경정비법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 34,
    questionText: '정비구역에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '정비구역은 정비사업을 계획적으로 시행하기 위하여 지정된다.',
      '정비계획에는 정비사업의 명칭, 위치, 면적 등이 포함될 수 있다.',
      '정비구역 지정은 주민의 권리관계와 이해관계에 영향을 줄 수 있다.',
      '정비구역이 지정되면 조합설립인가 없이도 모든 건축물이 자동 철거된다.',
      '정비구역의 지정ㆍ해제는 법정 절차에 따라 이루어진다.',
    ],
    answer: 4,
    explanation: '정비구역 지정만으로 모든 건축물이 자동 철거되는 것은 아니며 이후 사업시행 절차가 필요합니다.',
    trapType: '지정과 철거 효과 혼동',
  },
  {
    chapter: '도시정비법',
    topic: '조합설립',
    lawRef: '도시 및 주거환경정비법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 35,
    questionText: '정비사업조합에 관한 설명으로 옳은 것은?',
    choices: [
      '조합은 정비사업의 시행자가 될 수 있는 주체 중 하나이다.',
      '조합설립인가를 받으면 관리처분계획 인가 절차는 언제나 생략된다.',
      '조합원은 사업구역 밖의 모든 임차인을 포함한다.',
      '조합은 법인격을 가질 수 없으므로 계약의 당사자가 될 수 없다.',
      '조합설립에는 토지등소유자의 동의가 전혀 필요하지 않다.',
    ],
    answer: 1,
    explanation: '정비사업조합은 법정 요건과 인가를 거쳐 정비사업 시행자가 될 수 있습니다.',
    trapType: '조합 지위와 후속 절차 혼동',
  },
  {
    chapter: '건축법',
    topic: '건축허가',
    lawRef: '건축법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '건축허가에 관한 설명으로 옳은 것은?',
    choices: [
      '건축물을 건축하거나 대수선하려는 경우에는 원칙적으로 허가 또는 신고 절차를 검토해야 한다.',
      '건축허가를 받으면 다른 모든 법률상 인허가가 예외 없이 자동 면제된다.',
      '건축신고 대상인 건축물은 건축법 적용을 받지 않는다.',
      '건축허가는 건축주가 아닌 인근 주민만 신청할 수 있다.',
      '허가권자는 건축물의 대지와 도로 관계를 심사할 수 없다.',
    ],
    answer: 1,
    explanation: '건축ㆍ대수선은 규모와 내용에 따라 허가 또는 신고 절차가 문제됩니다.',
    trapType: '허가와 신고, 의제 효과 과장',
  },
  {
    chapter: '건축법',
    topic: '대지와 도로',
    lawRef: '건축법',
    category: 'recent_frequent',
    difficulty: 'normal',
    sourceType: 'modified',
    sourceRound: 36,
    questionText: '건축법상 대지와 도로의 관계에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '건축물의 대지는 원칙적으로 일정 너비 이상의 도로에 접해야 한다.',
      '접도 요건은 피난ㆍ소방ㆍ교통 등 공익과 관련된다.',
      '도로의 개념에는 건축법상 지정ㆍ공고된 도로가 포함될 수 있다.',
      '접도 요건은 모든 건축물에 대하여 조례나 법률상 예외 없이 완전히 배제된다.',
      '막다른 도로 등은 별도 기준이 문제될 수 있다.',
    ],
    answer: 4,
    explanation: '접도 요건은 원칙적으로 적용되며 예외와 세부 기준을 함께 봐야 합니다.',
    trapType: '절대 표현',
  },
  {
    chapter: '주택법',
    topic: '투기과열지구',
    lawRef: '주택법',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 29,
    questionText: '투기과열지구에 관한 설명으로 옳은 것은?',
    choices: [
      '주택가격 안정 등을 위하여 일정한 지역을 투기과열지구로 지정할 수 있다.',
      '투기과열지구로 지정되면 모든 부동산 거래가 무효가 된다.',
      '투기과열지구는 오직 농지 거래를 제한하기 위한 제도이다.',
      '투기과열지구의 지정은 지방세법상 취득세 신고와 동일한 절차이다.',
      '투기과열지구에서는 주택 공급 질서에 관한 규제가 전혀 적용되지 않는다.',
    ],
    answer: 1,
    explanation: '투기과열지구는 주택가격 안정과 투기 억제를 위한 주택법상 규제지역 제도입니다.',
    trapType: '규제지역 효과 과장',
  },
  {
    chapter: '농지법',
    topic: '농지취득자격증명',
    lawRef: '농지법',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 28,
    questionText: '농지취득자격증명에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '농지를 취득하려는 자는 원칙적으로 농지취득자격증명을 발급받아야 한다.',
      '농업경영계획서 제출 여부는 취득 목적과 사안에 따라 문제될 수 있다.',
      '상속으로 농지를 취득하는 경우에는 일반 매매와 다른 취급이 문제될 수 있다.',
      '농지취득자격증명은 농지의 소유 제한과 이용 목적 심사를 위한 제도이다.',
      '농지취득자격증명은 건축물 사용승인과 동일한 효력을 갖는다.',
    ],
    answer: 5,
    explanation: '농지취득자격증명은 농지 취득 자격 심사 제도이지 건축물 사용승인이 아닙니다.',
    trapType: '농지법과 건축법 절차 혼동',
  },
  {
    chapter: '농지법',
    topic: '농지전용',
    lawRef: '농지법',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 27,
    questionText: '농지전용에 관한 설명으로 옳은 것은?',
    choices: [
      '농지를 농작물 경작 외의 용도로 사용하려는 경우에는 농지전용허가 등이 문제될 수 있다.',
      '농지전용허가는 지목이 대지인 토지의 건축물 멸실 신고만을 의미한다.',
      '농업진흥지역 안의 농지는 모든 경우에 자유롭게 전용할 수 있다.',
      '농지전용은 소유권이전등기를 하면 별도 절차 없이 항상 완료된다.',
      '농지전용부담금은 중개보수 산정 기준이다.',
    ],
    answer: 1,
    explanation: '농지를 비농업 용도로 사용하려면 농지전용허가ㆍ협의ㆍ신고 및 부담금 문제가 발생할 수 있습니다.',
    trapType: '전용과 등기 혼동',
  },
  {
    chapter: '건축법',
    topic: '건폐율',
    lawRef: '건축법, 국토계획법',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 29,
    questionText: '건폐율에 관한 설명으로 옳은 것은?',
    choices: [
      '건폐율은 대지면적에 대한 건축면적의 비율을 말한다.',
      '건폐율은 연면적을 대지면적으로 나눈 비율이다.',
      '건폐율은 건축물의 층수와 관계없이 항상 100퍼센트로 고정된다.',
      '건폐율 제한은 용도지역과 무관하게 전국 동일 기준만 적용된다.',
      '건폐율은 취득세 과세표준을 산정하기 위한 세율이다.',
    ],
    answer: 1,
    explanation: '건폐율은 대지면적 대비 건축면적의 비율입니다. 용적률과 구분해야 합니다.',
    trapType: '건폐율과 용적률 혼동',
  },
  {
    chapter: '건축법',
    topic: '용적률',
    lawRef: '건축법, 국토계획법',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 28,
    questionText: '용적률에 관한 설명으로 옳은 것은?',
    choices: [
      '용적률은 대지면적에 대한 연면적의 비율을 말한다.',
      '용적률은 건축면적을 건축물 높이로 나눈 값이다.',
      '용적률은 모든 용도지역에서 동일하게 무제한 허용된다.',
      '지하층 면적은 어떠한 경우에도 용적률 산정에서 제외될 수 없다.',
      '용적률은 토지거래허가구역 지정권자의 이름을 뜻한다.',
    ],
    answer: 1,
    explanation: '용적률은 대지면적에 대한 연면적 비율이며 산정 제외 범위는 별도 기준을 확인해야 합니다.',
    trapType: '산식과 산입 범위 혼동',
  },
  {
    chapter: '국토계획법',
    topic: '토지거래허가구역',
    lawRef: '부동산 거래신고 등에 관한 법률, 국토계획법 관련 제도',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 29,
    questionText: '토지거래허가구역 안의 토지거래에 관한 설명으로 옳은 것은?',
    choices: [
      '허가 대상인 토지거래계약은 허가를 받아야 효력이 문제없이 발생한다.',
      '허가구역에서는 토지거래계약서를 작성할 수 없다.',
      '토지거래허가는 건축물의 사용승인을 대체한다.',
      '허가를 받지 않은 계약도 언제나 확정적으로 유효하다.',
      '토지거래허가구역은 중개사무소 개설등록을 금지하는 구역이다.',
    ],
    answer: 1,
    explanation: '토지거래허가구역에서는 일정 토지거래계약에 허가가 필요하고 무허가 계약의 효력이 쟁점이 됩니다.',
    trapType: '허가 전 계약 효력',
  },
  {
    chapter: '도시정비법',
    topic: '관리처분계획',
    lawRef: '도시 및 주거환경정비법',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 28,
    questionText: '관리처분계획에 관한 설명으로 옳은 것은?',
    choices: [
      '분양대상자, 종전ㆍ종후 자산 평가, 분담금 등에 관한 사항이 문제될 수 있다.',
      '관리처분계획은 정비구역 지정 전에 반드시 먼저 인가된다.',
      '관리처분계획 인가 후에는 이전고시가 절대로 필요 없다.',
      '관리처분계획은 농지취득자격증명 발급을 위한 서류이다.',
      '관리처분계획은 중개대상물 확인설명서와 동일한 문서이다.',
    ],
    answer: 1,
    explanation: '관리처분계획은 정비사업에서 조합원 권리배분과 분담금 등을 정하는 핵심 절차입니다.',
    trapType: '정비사업 절차 순서',
  },
  {
    chapter: '건축법',
    topic: '사용승인',
    lawRef: '건축법',
    category: 'past',
    difficulty: 'normal',
    sourceType: 'original',
    sourceRound: 27,
    questionText: '건축물 사용승인에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '허가 또는 신고 대상 건축물은 공사 완료 후 사용승인 절차가 문제될 수 있다.',
      '사용승인은 건축물이 허가 내용 등에 맞게 공사되었는지 확인하는 절차와 관련된다.',
      '사용승인을 받기 전 사용 제한이 문제될 수 있다.',
      '사용승인은 소유권보존등기를 신청하면 항상 자동으로 생략된다.',
      '임시사용승인 제도가 문제될 수 있다.',
    ],
    answer: 4,
    explanation: '등기 절차가 건축법상 사용승인 절차를 당연히 생략시키는 것은 아닙니다.',
    trapType: '건축행정과 등기 절차 혼동',
  },
  {
    chapter: '주택법',
    topic: '분양가상한제',
    lawRef: '주택법',
    category: 'issue',
    difficulty: 'hard',
    sourceType: 'predicted',
    sourceRound: 36,
    questionText: '분양가상한제에 관한 설명으로 가장 적절한 것은?',
    choices: [
      '분양가상한제는 주택의 분양가격 산정에 일정한 제한을 두는 제도이다.',
      '분양가상한제는 임대차보증금 반환채권을 소멸시키는 제도이다.',
      '분양가상한제가 적용되면 전매제한 등 다른 규제는 법률상 절대 병행될 수 없다.',
      '분양가상한제는 모든 오피스텔 임대차에 자동 적용되는 민법 규정이다.',
      '분양가상한제 적용 여부는 주택 공급 지역이나 유형과 무관하게 항상 같다.',
    ],
    answer: 1,
    explanation: '분양가상한제는 주택 분양가격을 일정 기준에 따라 제한하는 제도이며 적용 대상과 효과를 구분해야 합니다.',
    trapType: '규제 효과 확대 해석',
  },
  {
    chapter: '주택법',
    topic: '전매제한',
    lawRef: '주택법',
    category: 'issue',
    difficulty: 'hard',
    sourceType: 'predicted',
    sourceRound: 36,
    questionText: '주택의 전매제한에 관한 설명으로 옳은 것은?',
    choices: [
      '전매제한은 일정 기간 주택 또는 입주자로 선정된 지위의 전매를 제한하는 제도이다.',
      '전매제한은 매매계약서에 특약이 있으면 법정 제한이 언제나 소멸한다.',
      '전매제한은 모든 토지 임대차계약에 적용되는 등기법상 제도이다.',
      '전매제한 기간은 지역, 주택 유형, 공급 방식과 관계없이 언제나 1개월이다.',
      '전매제한 위반은 행정상 제재와 무관하다.',
    ],
    answer: 1,
    explanation: '전매제한은 주택 공급 질서와 투기 억제를 위한 제도이며 대상과 기간은 사안별로 확인해야 합니다.',
    trapType: '기간 고정 오답',
  },
  {
    chapter: '국토계획법',
    topic: '성장관리계획',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'issue',
    difficulty: 'hard',
    sourceType: 'predicted',
    sourceRound: 36,
    questionText: '성장관리계획에 관한 설명으로 옳은 것은?',
    choices: [
      '비시가화지역 등의 난개발을 방지하고 계획적 개발을 유도하기 위한 계획으로 활용될 수 있다.',
      '성장관리계획은 모든 건축허가를 금지하는 처분이다.',
      '성장관리계획구역에서는 개발행위허가 기준이 전혀 적용되지 않는다.',
      '성장관리계획은 공인중개사의 손해배상책임 한도를 정한다.',
      '성장관리계획은 지방세 납부기한 연장 신청서와 동일하다.',
    ],
    answer: 1,
    explanation: '성장관리계획은 난개발 방지와 계획적 개발 유도 목적의 제도입니다.',
    trapType: '제도 목적 혼동',
  },
  {
    chapter: '건축법',
    topic: '생활숙박시설',
    lawRef: '건축법, 주택법 관련 규제',
    category: 'issue',
    difficulty: 'hard',
    sourceType: 'predicted',
    sourceRound: 36,
    questionText: '생활숙박시설과 관련한 공법상 쟁점으로 가장 적절한 것은?',
    choices: [
      '건축물 용도, 숙박업 영업, 주거 사용 제한 등이 함께 문제될 수 있다.',
      '생활숙박시설은 법률상 언제나 공동주택으로만 분류된다.',
      '생활숙박시설은 건축법상 용도분류와 무관하므로 용도변경이 문제되지 않는다.',
      '생활숙박시설을 분양받으면 농지취득자격증명이 반드시 필요하다.',
      '생활숙박시설은 모든 지역에서 학교시설로 간주된다.',
    ],
    answer: 1,
    explanation: '생활숙박시설은 건축물 용도와 실제 사용 형태의 불일치, 숙박업 신고, 주거 사용 제한 등이 함께 쟁점이 됩니다.',
    trapType: '용도와 실제 사용 혼동',
  },
  {
    chapter: '국토계획법',
    topic: '개발행위허가 제한',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '개발행위허가 제한에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '도시ㆍ군관리계획 수립 중인 지역 등에서는 일정 기간 개발행위허가가 제한될 수 있다.',
      '개발행위허가 제한은 무질서한 개발을 방지하기 위한 수단으로 활용될 수 있다.',
      '제한 기간과 절차는 법령상 요건을 따른다.',
      '개발행위허가 제한이 있으면 토지소유권 자체가 예외 없이 즉시 소멸한다.',
      '제한은 토지이용계획과 공익상 필요를 고려하여 문제된다.',
    ],
    answer: 4,
    explanation: '개발행위허가 제한은 행위 제한이지 토지소유권의 즉시 소멸을 의미하지 않습니다.',
    trapType: '행위 제한과 권리 소멸 혼동',
  },
  {
    chapter: '건축법',
    topic: '대수선',
    lawRef: '건축법',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '대수선에 관한 설명으로 옳은 것은?',
    choices: [
      '대수선은 건축물의 주요 구조부 등에 대한 일정한 수선ㆍ변경 행위를 의미할 수 있다.',
      '대수선은 실내 벽지 교체만을 의미하므로 건축법과 무관하다.',
      '대수선은 언제나 개발행위허가만 받으면 건축법상 절차가 필요 없다.',
      '대수선 신고 또는 허가 대상은 건축물 규모와 관계없이 전혀 없다.',
      '대수선은 농지전용허가의 다른 명칭이다.',
    ],
    answer: 1,
    explanation: '대수선은 주요 구조부 등과 관련한 건축법상 개념이며 허가ㆍ신고 여부를 검토해야 합니다.',
    trapType: '일상 수리와 법정 대수선 구분',
  },
  {
    chapter: '도시정비법',
    topic: '이전고시',
    lawRef: '도시 및 주거환경정비법',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '정비사업의 이전고시에 관한 설명으로 옳은 것은?',
    choices: [
      '이전고시는 관리처분계획에 따른 권리 이전ㆍ확정과 관련되는 후속 절차이다.',
      '이전고시는 정비구역 지정 전에 반드시 먼저 하는 절차이다.',
      '이전고시가 있으면 조합설립동의 절차가 소급하여 모두 무효가 된다.',
      '이전고시는 농지전용부담금을 산정하기 위한 고시이다.',
      '이전고시는 중개보수 지급기한을 정하는 행정처분이다.',
    ],
    answer: 1,
    explanation: '이전고시는 정비사업 후반부에서 대지ㆍ건축물 권리 이전과 관련되는 절차입니다.',
    trapType: '절차 순서 혼동',
  },
  {
    chapter: '도시개발법',
    topic: '환지처분',
    lawRef: '도시개발법',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '환지처분에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '환지처분은 환지계획에 따라 권리관계를 최종적으로 정리하는 처분이다.',
      '환지처분이 공고되면 종전 토지와 환지 사이의 권리 변동 효과가 문제된다.',
      '청산금은 환지처분과 관련하여 문제될 수 있다.',
      '환지처분은 오직 임대차계약 갱신청구권 행사 방식만을 정한다.',
      '환지처분은 환지방식 도시개발사업에서 중요하다.',
    ],
    answer: 4,
    explanation: '환지처분은 임대차계약 갱신청구권 제도가 아니라 도시개발사업의 권리관계 정리 절차입니다.',
    trapType: '민사 임대차 제도 혼입',
  },
  {
    chapter: '주택법',
    topic: '리모델링',
    lawRef: '주택법',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '공동주택 리모델링에 관한 설명으로 옳은 것은?',
    choices: [
      '공동주택 리모델링은 증축 범위, 안전진단, 동의요건 등이 문제될 수 있다.',
      '리모델링은 언제나 재건축사업과 동일하여 별도 제도 구분이 없다.',
      '리모델링을 하면 토지 소유권은 반드시 국가로 귀속된다.',
      '리모델링 허가는 농지취득자격증명으로 대체된다.',
      '리모델링은 주택법상 규율 대상이 될 수 없다.',
    ],
    answer: 1,
    explanation: '공동주택 리모델링은 재건축과 구분되는 제도이며 증축, 안전진단, 동의요건 등이 쟁점입니다.',
    trapType: '재건축과 리모델링 혼동',
  },
  {
    chapter: '농지법',
    topic: '농업진흥지역',
    lawRef: '농지법',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '농업진흥지역에 관한 설명으로 옳은 것은?',
    choices: [
      '농업진흥지역은 농지를 효율적으로 보전ㆍ이용하기 위하여 지정되는 지역이다.',
      '농업진흥지역 안에서는 모든 건축물이 아무 절차 없이 자유롭게 허용된다.',
      '농업진흥지역은 상업지역의 세부 용도지역이다.',
      '농업진흥지역 지정은 중개사무소 개설등록의 결격사유를 정한다.',
      '농업진흥지역은 토지거래허가구역과 언제나 동일한 구역이다.',
    ],
    answer: 1,
    explanation: '농업진흥지역은 우량농지 보전과 농업 목적 이용을 위한 농지법상 지역제도입니다.',
    trapType: '지역제도 간 명칭 혼동',
  },
  {
    chapter: '건축법',
    topic: '위반건축물',
    lawRef: '건축법',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '위반건축물에 대한 조치로 옳은 것은?',
    choices: [
      '시정명령, 이행강제금 부과 등이 문제될 수 있다.',
      '위반건축물은 발견 즉시 소유자의 동의 없이 항상 소유권이전등기가 완료된다.',
      '위반건축물에는 어떠한 행정상 제재도 할 수 없다.',
      '건축법 위반 여부는 토지의 취득세율만으로 판단한다.',
      '위반건축물 표시는 중개보수 영수증에만 기재한다.',
    ],
    answer: 1,
    explanation: '건축법 위반 건축물에는 시정명령, 이행강제금 등 행정상 조치가 문제됩니다.',
    trapType: '제재 수단 혼동',
  },
  {
    chapter: '국토계획법',
    topic: '용도지역별 행위제한',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'trap',
    difficulty: 'trap',
    sourceType: 'weak_review',
    sourceRound: 35,
    questionText: '용도지역별 행위제한에 관한 설명으로 옳지 않은 것은?',
    choices: [
      '용도지역에 따라 건축할 수 있는 건축물의 종류와 규모가 달라질 수 있다.',
      '조례는 법령의 범위에서 세부 기준을 정할 수 있다.',
      '행위제한은 토지이용의 공공복리와 관련된다.',
      '상업지역으로 지정되면 모든 공장과 위험시설이 아무 제한 없이 허용된다.',
      '건폐율과 용적률 제한도 용도지역별로 문제될 수 있다.',
    ],
    answer: 4,
    explanation: '상업지역이라도 건축물 용도와 규모에 대한 제한이 있으며 모든 시설이 무제한 허용되는 것은 아닙니다.',
    trapType: '용도지역 효과 과장',
  },
  {
    chapter: '국토계획법',
    topic: '도시지역',
    lawRef: '국토의 계획 및 이용에 관한 법률',
    category: 'easy',
    difficulty: 'easy',
    sourceType: 'modified',
    sourceRound: 33,
    questionText: '도시지역의 세분으로 옳은 것은?',
    choices: [
      '주거지역, 상업지역, 공업지역, 녹지지역',
      '보전관리지역, 생산관리지역, 계획관리지역, 농림지역',
      '문화재보호구역, 투기과열지구, 조정대상지역, 정비구역',
      '학교용지, 도로용지, 하천용지, 임야',
      '재개발구역, 재건축구역, 리모델링구역, 환지구역',
    ],
    answer: 1,
    explanation: '도시지역은 주거ㆍ상업ㆍ공업ㆍ녹지지역으로 세분됩니다.',
    trapType: '기본 분류 암기',
  },
  {
    chapter: '건축법',
    topic: '건축물 용도',
    lawRef: '건축법',
    category: 'easy',
    difficulty: 'easy',
    sourceType: 'modified',
    sourceRound: 33,
    questionText: '건축법상 건축물 용도에 관한 설명으로 옳은 것은?',
    choices: [
      '건축물은 용도별로 분류되며 용도변경 시 별도 절차가 문제될 수 있다.',
      '건축물 용도는 소유자가 마음대로 정하면 법적으로 항상 확정된다.',
      '모든 건축물 용도는 주택 하나로만 분류된다.',
      '건축물 용도는 등기부의 소유자 주소와 같은 개념이다.',
      '용도변경은 건축법상 절차와 무관하다.',
    ],
    answer: 1,
    explanation: '건축물은 용도별로 분류되고 용도변경은 허가ㆍ신고 등 절차가 문제될 수 있습니다.',
    trapType: '용도분류 기본',
  },
  {
    chapter: '도시개발법',
    topic: '도시개발사업',
    lawRef: '도시개발법',
    category: 'easy',
    difficulty: 'easy',
    sourceType: 'modified',
    sourceRound: 33,
    questionText: '도시개발사업의 기본 목적으로 가장 적절한 것은?',
    choices: [
      '계획적인 도시개발을 통하여 쾌적한 도시환경을 조성하는 것',
      '개업공인중개사의 보수 상한을 정하는 것',
      '취득세와 재산세의 세율을 통일하는 것',
      '부동산등기부의 갑구와 을구를 폐지하는 것',
      '임대차계약의 보증금 반환기일을 정하는 것',
    ],
    answer: 1,
    explanation: '도시개발법은 계획적 도시개발과 도시환경 조성을 목적으로 하는 공법 영역입니다.',
    trapType: '법 목적 구분',
  },
  {
    chapter: '농지법',
    topic: '농지 소유',
    lawRef: '농지법',
    category: 'easy',
    difficulty: 'easy',
    sourceType: 'modified',
    sourceRound: 33,
    questionText: '농지법의 기본 원칙에 관한 설명으로 옳은 것은?',
    choices: [
      '농지는 원칙적으로 자기의 농업경영에 이용하려는 자가 소유할 수 있다는 원칙이 있다.',
      '농지는 누구나 투기 목적으로 제한 없이 소유할 수 있다.',
      '농지는 건축물이 있는 토지만을 의미한다.',
      '농지 소유 제한은 주택임대차보호법에서만 정한다.',
      '농지는 항상 상업지역 안에만 존재한다.',
    ],
    answer: 1,
    explanation: '농지법은 경자유전 원칙에 기초하여 농지 소유와 이용을 제한합니다.',
    trapType: '농지법 기본 원칙',
  },
];

const hardPublicLawSeeds: AuthoredQuestionSeed[] = [
  { chapter: '국토계획법', topic: '광역도시계획', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '광역도시계획과 도시ㆍ군기본계획에 관한 설명으로 옳은 것은?', correctChoice: '광역도시계획은 광역계획권의 장기발전방향을 제시하는 계획이고, 도시ㆍ군기본계획은 관할 구역의 기본 공간구조와 장기발전방향을 제시하는 계획이다.', distractors: ['광역도시계획은 개별 필지의 건축허가 여부를 직접 확정하는 처분이다.', '도시ㆍ군기본계획은 도시ㆍ군관리계획보다 항상 하위의 집행계획이다.', '광역도시계획이 수립되면 도시ㆍ군관리계획은 법률상 당연히 폐지된다.', '도시ㆍ군기본계획은 토지소유자의 신청이 있어야만 수립할 수 있다.'], answer: 3, explanation: '광역도시계획과 도시ㆍ군기본계획은 모두 장기ㆍ종합계획 성격이며, 필지별 제한을 직접 확정하는 관리계획과 구별해야 합니다.', trapType: '계획 위계 비교' },
  { chapter: '국토계획법', topic: '도시ㆍ군관리계획', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '도시ㆍ군관리계획으로 결정할 수 있는 사항을 모두 고른 것은? ㄱ. 용도지역의 지정 또는 변경 ㄴ. 지구단위계획구역의 지정 ㄷ. 도시ㆍ군계획시설의 결정 ㄹ. 중개보수 상한의 결정', correctChoice: 'ㄱ, ㄴ, ㄷ', distractors: ['ㄱ, ㄹ', 'ㄴ, ㄷ, ㄹ', 'ㄱ, ㄴ, ㄷ, ㄹ', 'ㄷ, ㄹ'], answer: 2, explanation: '용도지역, 지구단위계획구역, 도시ㆍ군계획시설은 관리계획 사항이지만 중개보수 상한은 공인중개사법 영역입니다.', trapType: '타 법령 혼입' },
  { chapter: '국토계획법', topic: '용도지역', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '용도지역의 세분에 관한 설명으로 옳지 않은 것은?', correctChoice: '관리지역은 주거지역ㆍ상업지역ㆍ공업지역ㆍ녹지지역으로 세분된다.', distractors: ['도시지역은 주거지역ㆍ상업지역ㆍ공업지역ㆍ녹지지역으로 세분될 수 있다.', '관리지역은 보전관리지역ㆍ생산관리지역ㆍ계획관리지역으로 세분될 수 있다.', '농림지역과 자연환경보전지역은 도시지역의 세부 용도지역이 아니다.', '용도지역별 건축 제한은 법령과 조례를 함께 확인해야 한다.'], answer: 1, explanation: '주거ㆍ상업ㆍ공업ㆍ녹지는 도시지역의 세분이고, 관리지역은 보전관리ㆍ생산관리ㆍ계획관리로 세분됩니다.', trapType: '용도지역 세분 체계' },
  { chapter: '국토계획법', topic: '용도지구와 용도구역', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '용도지역ㆍ용도지구ㆍ용도구역에 관한 설명으로 가장 적절한 것은?', correctChoice: '용도지구는 용도지역의 제한을 강화하거나 완화ㆍ보완하기 위하여 지정될 수 있고, 용도구역은 시가지의 무질서한 확산 방지 등 별도 목적을 가진다.', distractors: ['용도지구가 지정되면 기존 용도지역은 항상 자동 폐지된다.', '개발제한구역은 용도지역의 세부 구분에 불과하다.', '용도지역은 도시지역 안에서만 지정되고 비도시지역에는 지정되지 않는다.', '용도구역은 개별 건축물의 소유권 이전을 공시하기 위한 등기제도이다.'], answer: 4, explanation: '용도지역ㆍ지구ㆍ구역은 목적과 기능이 다릅니다. 지구는 지역 제한의 보완 기능, 구역은 개발제한 등 별도 정책 목적을 가집니다.', trapType: '지역ㆍ지구ㆍ구역 혼동' },
  { chapter: '국토계획법', topic: '지구단위계획', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '지구단위계획에 관한 설명으로 옳지 않은 것은?', correctChoice: '지구단위계획은 주민에게 아무런 토지이용 제한을 줄 수 없는 행정 내부의 권고문에 불과하다.', distractors: ['지구단위계획은 도시ㆍ군관리계획의 한 유형으로 이해한다.', '건축물의 용도, 건폐율, 용적률, 높이 등에 관한 사항을 정할 수 있다.', '기반시설의 배치와 규모에 관한 사항이 포함될 수 있다.', '지구단위계획구역 지정과 구체적인 계획 내용은 구별하여 보아야 한다.'], answer: 5, explanation: '지구단위계획은 구체적 토지이용과 건축 기준을 정할 수 있는 관리계획입니다.', trapType: '법적 성격 과소평가' },
  { chapter: '국토계획법', topic: '개발행위허가 대상', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '개발행위허가 대상에 해당할 수 있는 것을 모두 고른 것은? ㄱ. 건축물의 건축 ㄴ. 공작물의 설치 ㄷ. 토지의 형질변경 ㄹ. 토석의 채취 ㅁ. 부동산 매매계약서 검인', correctChoice: 'ㄱ, ㄴ, ㄷ, ㄹ', distractors: ['ㄱ, ㄴ, ㅁ', 'ㄷ, ㄹ, ㅁ', 'ㄱ, ㄴ, ㄷ, ㄹ, ㅁ', 'ㄴ, ㄹ'], answer: 1, explanation: '개발행위허가 대상은 건축물 건축, 공작물 설치, 토지 형질변경, 토석 채취, 물건 적치 등이 핵심입니다. 계약서 검인은 아닙니다.', trapType: '대상 열거형' },
  { chapter: '국토계획법', topic: '개발행위허가 기준', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 35, questionText: '개발행위허가 기준에 관한 설명으로 옳은 것은?', correctChoice: '도시ㆍ군관리계획의 내용, 주변 환경과의 조화, 기반시설 확보 여부 등은 허가 기준 판단에서 문제될 수 있다.', distractors: ['허가권자는 신청인이 토지소유자이면 다른 기준을 심사할 수 없다.', '개발행위허가는 민법상 매매계약이 있으면 자동으로 의제된다.', '기반시설 확보 여부는 개발행위허가와 전혀 관련이 없다.', '개발행위허가는 용도지역별 행위제한보다 언제나 우선하여 모든 행위를 허용한다.'], answer: 2, explanation: '개발행위허가는 계획 적합성, 환경, 기반시설 등 공익적 기준을 종합적으로 봅니다.', trapType: '허가 기준과 사권 혼동' },
  { chapter: '국토계획법', topic: '개발행위허가 제한', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 35, questionText: '개발행위허가 제한에 관한 설명으로 옳지 않은 것은?', correctChoice: '개발행위허가 제한이 고시되면 그 구역 토지의 소유권은 별도 절차 없이 모두 국가에 이전된다.', distractors: ['도시ㆍ군관리계획을 수립 중인 지역 등에서는 일정한 경우 개발행위허가가 제한될 수 있다.', '제한은 무질서한 개발을 방지하기 위한 수단이 될 수 있다.', '제한 기간과 절차는 법령상 요건을 따른다.', '개발행위허가 제한은 행위 제한이지 그 자체로 모든 사법상 권리관계를 소멸시키는 것은 아니다.'], answer: 1, explanation: '개발행위허가 제한은 행정상 행위 제한이지 소유권의 당연 이전이 아닙니다.', trapType: '행위 제한과 소유권 이전 혼동' },
  { chapter: '국토계획법', topic: '도시ㆍ군계획시설', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '도시ㆍ군계획시설에 관한 설명으로 옳은 것은?', correctChoice: '도로ㆍ공원ㆍ학교 등 기반시설 중 도시ㆍ군관리계획으로 결정된 시설은 도시ㆍ군계획시설이 될 수 있다.', distractors: ['모든 기반시설은 관리계획 결정 없이도 당연히 도시ㆍ군계획시설이다.', '도시ㆍ군계획시설 결정이 있으면 그 즉시 보상과 수용절차가 모두 완료된다.', '도시ㆍ군계획시설은 민간이 설치하는 경우에는 절대로 될 수 없다.', '도시ㆍ군계획시설은 부동산등기법상 갑구에만 기록되는 권리이다.'], answer: 3, explanation: '기반시설과 도시ㆍ군계획시설은 구별해야 하며, 관리계획 결정 여부가 중요합니다.', trapType: '기반시설과 계획시설 구별' },
  { chapter: '도시개발법', topic: '도시개발구역과 개발계획', lawRef: '도시개발법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '도시개발구역과 개발계획에 관한 설명으로 옳은 것은?', correctChoice: '도시개발구역은 도시개발사업을 시행하기 위한 구역이고, 개발계획에는 사업의 명칭ㆍ목적ㆍ시행방식 등 사업의 기본 내용이 문제될 수 있다.', distractors: ['도시개발구역 지정이 있으면 모든 토지의 소유권은 즉시 사업시행자에게 이전된다.', '개발계획은 환지방식에서는 필요하지만 수용 또는 사용방식에서는 법률상 언제나 금지된다.', '도시개발구역은 반드시 농업진흥지역 안에서만 지정된다.', '도시개발구역 지정과 동시에 환지처분이 완료된다.'], answer: 2, explanation: '구역 지정, 개발계획, 실시계획, 시행방식, 처분 효과를 순서대로 구별해야 합니다.', trapType: '구역 지정 효과 과장' },
  { chapter: '도시개발법', topic: '시행방식', lawRef: '도시개발법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '도시개발사업의 시행방식에 관한 설명으로 옳지 않은 것은?', correctChoice: '도시개발사업은 법률상 오직 경매방식으로만 시행할 수 있다.', distractors: ['수용 또는 사용방식으로 시행할 수 있다.', '환지방식으로 시행할 수 있다.', '수용 또는 사용방식과 환지방식을 혼용할 수 있는 경우가 있다.', '환지방식에서는 종전 토지와 환지 사이의 권리 조정이 핵심 쟁점이 된다.'], answer: 4, explanation: '도시개발사업의 대표 시행방식은 수용ㆍ사용방식, 환지방식, 혼용방식입니다.', trapType: '시행방식 열거' },
  { chapter: '도시개발법', topic: '환지계획과 환지처분', lawRef: '도시개발법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 35, questionText: '환지방식 도시개발사업에 관한 설명으로 가장 적절한 것은?', correctChoice: '환지계획은 환지처분의 기초가 되고, 환지처분 공고 후 종전 토지와 환지 사이의 권리 변동 효과가 문제된다.', distractors: ['환지계획 인가만으로 언제나 환지처분의 모든 효과가 즉시 발생한다.', '환지처분은 수용방식에서 보상금을 산정하지 않기 위한 내부 문서일 뿐이다.', '환지예정지 지정이 있으면 청산금은 어떠한 경우에도 발생할 수 없다.', '환지방식에서는 종전 토지의 권리관계가 전혀 고려되지 않는다.'], answer: 5, explanation: '환지계획, 환지예정지, 환지처분, 청산금의 순서와 효과를 나누어 봐야 합니다.', trapType: '환지 절차 효과' },
  { chapter: '도시정비법', topic: '정비사업 종류', lawRef: '도시 및 주거환경정비법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '정비사업에 관한 설명으로 옳은 것은?', correctChoice: '재개발사업은 정비기반시설이 열악하고 노후ㆍ불량건축물이 밀집한 지역의 주거환경 개선 등과 관련되고, 재건축사업은 정비기반시설이 양호하더라도 노후ㆍ불량건축물의 공동주택 등을 대상으로 문제될 수 있다.', distractors: ['재개발사업과 재건축사업은 모두 농지전용허가만으로 시행된다.', '재건축사업은 항상 토지수용방식으로만 시행하고 조합은 설립할 수 없다.', '재개발사업은 토지등소유자의 권리변동과 무관하므로 관리처분계획이 문제되지 않는다.', '정비사업은 도시ㆍ군관리계획과 어떠한 관련도 가질 수 없다.'], answer: 1, explanation: '재개발과 재건축은 대상 지역과 사업 성격이 다르며, 정비구역ㆍ조합ㆍ사업시행계획ㆍ관리처분계획과 연결됩니다.', trapType: '재개발ㆍ재건축 비교' },
  { chapter: '도시정비법', topic: '정비사업 절차', lawRef: '도시 및 주거환경정비법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '정비사업의 일반적 절차 흐름으로 가장 자연스러운 것은?', correctChoice: '정비계획 수립 및 정비구역 지정 → 조합설립인가 → 사업시행계획인가 → 관리처분계획인가 → 이전고시', distractors: ['관리처분계획인가 → 정비구역 지정 → 조합설립인가 → 사업시행계획인가 → 이전고시', '조합설립인가 → 이전고시 → 정비구역 지정 → 사업시행계획인가 → 관리처분계획인가', '이전고시 → 관리처분계획인가 → 사업시행계획인가 → 조합설립인가 → 정비구역 지정', '사업시행계획인가 → 정비구역 지정 → 이전고시 → 조합설립인가 → 관리처분계획인가'], answer: 3, explanation: '정비사업은 구역 지정, 조합, 사업시행, 관리처분, 이전고시의 큰 흐름을 잡아야 합니다.', trapType: '절차 순서' },
  { chapter: '도시정비법', topic: '조합설립과 동의', lawRef: '도시 및 주거환경정비법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 35, questionText: '정비사업조합에 관한 설명으로 옳지 않은 것은?', correctChoice: '조합설립인가를 받으면 사업시행계획인가와 관리처분계획인가는 법률상 항상 생략된다.', distractors: ['조합은 정비사업 시행자가 될 수 있는 주체 중 하나이다.', '조합설립에는 토지등소유자 등 이해관계인의 동의 요건이 문제될 수 있다.', '조합은 법인으로 보는 취급이 문제될 수 있다.', '조합설립인가와 사업시행계획인가는 서로 다른 절차이다.'], answer: 5, explanation: '조합설립인가가 후속 인가 절차를 당연히 생략시키는 것은 아닙니다.', trapType: '인가 절차 생략 오답' },
  { chapter: '건축법', topic: '건축허가와 신고', lawRef: '건축법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '건축허가와 건축신고에 관한 설명으로 가장 적절한 것은?', correctChoice: '건축물의 건축 또는 대수선은 규모ㆍ용도ㆍ지역 등에 따라 허가 또는 신고 대상이 될 수 있고, 신고 대상이라고 하여 건축법 적용이 배제되는 것은 아니다.', distractors: ['건축신고 대상 건축물은 건축법상 건축물이 아니므로 대지와 도로 관계를 검토하지 않는다.', '건축허가를 받으면 모든 다른 법률상 인허가는 예외 없이 자동 면제된다.', '건축허가는 토지소유자가 아닌 인근 주민만 신청할 수 있다.', '건축신고는 공인중개사법상 중개보수 신고와 동일한 절차이다.'], answer: 2, explanation: '건축허가ㆍ신고는 구분하되, 신고 대상도 건축법상 규율을 받습니다. 인허가 의제도 범위가 있습니다.', trapType: '허가ㆍ신고와 의제 범위' },
  { chapter: '건축법', topic: '대지와 도로', lawRef: '건축법', category: 'recent_frequent', difficulty: 'hard', sourceType: 'modified', sourceRound: 36, questionText: '건축법상 대지와 도로에 관한 설명으로 옳지 않은 것은?', correctChoice: '접도 요건은 모든 건축물에 대하여 법령상 예외 없이 완전히 배제된다.', distractors: ['건축물의 대지는 원칙적으로 일정 기준 이상의 도로에 접해야 한다.', '접도 요건은 피난ㆍ소방ㆍ교통 등 공익과 관련된다.', '건축법상 도로에는 일정한 지정ㆍ공고 절차를 거친 도로가 포함될 수 있다.', '막다른 도로 등은 별도의 세부 기준이 문제될 수 있다.'], answer: 4, explanation: '접도 요건은 건축법 핵심 함정입니다. 원칙, 예외, 막다른 도로 기준을 함께 봐야 합니다.', trapType: '접도 의무 절대 표현' },
  { chapter: '주택법', topic: '사업계획승인', lawRef: '주택법', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 29, questionText: '주택건설사업계획승인에 관한 설명으로 옳은 것은?', correctChoice: '일정 규모 이상의 주택건설사업은 주택법상 사업계획승인 대상이 될 수 있고, 승인을 받은 경우 건축허가 등 다른 인허가 의제 여부가 문제될 수 있다.', distractors: ['사업계획승인은 소유권이전등기를 신청하면 당연히 생략된다.', '사업계획승인은 주택을 매수한 개인의 취득세 신고와 동일한 절차이다.', '사업계획승인을 받으면 분양가상한제, 전매제한 등 주택 공급 관련 규제는 언제나 적용되지 않는다.', '사업계획승인은 토지 확보 여부와 관계없이 신청만 하면 반드시 승인된다.'], answer: 1, explanation: '주택법에서는 사업계획승인 대상, 승인권자, 인허가 의제, 공급 규제를 함께 연결해 묻습니다.', trapType: '승인과 타 규제 관계' },
  { chapter: '주택법', topic: '투기과열지구', lawRef: '주택법', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 29, questionText: '투기과열지구와 조정대상지역 등 주택 규제지역에 관한 설명으로 옳은 것은?', correctChoice: '규제지역 지정은 주택가격 안정과 투기 억제 등을 목적으로 하며, 청약ㆍ전매ㆍ대출ㆍ세제 등 여러 제도와 연결되어 효과가 달라질 수 있다.', distractors: ['투기과열지구로 지정되면 모든 부동산 매매계약은 별도 처분 없이 무효가 된다.', '투기과열지구는 농지 거래만을 제한하기 위한 농지법상 구역이다.', '투기과열지구와 조정대상지역은 명칭만 다르고 지정 요건과 효과가 항상 동일하다.', '규제지역 지정은 부동산등기법상 을구에 기록되는 근저당권 설정등기이다.'], answer: 2, explanation: '규제지역은 지정 목적과 효과를 구분해야 하며, 무효ㆍ농지법ㆍ등기제도와 혼동하면 안 됩니다.', trapType: '규제지역 효과 과장' },
  { chapter: '농지법', topic: '농지취득자격증명', lawRef: '농지법', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 28, questionText: '농지취득자격증명에 관한 설명으로 옳지 않은 것은?', correctChoice: '농지취득자격증명은 건축법상 건축물 사용승인과 동일한 효력을 가지므로 농지 취득 후 건축물 사용도 당연히 허용한다.', distractors: ['농지를 취득하려는 자는 원칙적으로 농지취득자격증명을 발급받아야 할 수 있다.', '농업경영계획서 제출 여부는 취득 목적과 사안에 따라 문제될 수 있다.', '상속 등 일정한 취득은 일반 매매와 다른 취급이 문제될 수 있다.', '농지취득자격증명은 농지 소유 제한과 이용 목적 심사와 연결된다.'], answer: 3, explanation: '농지취득자격증명은 농지 취득 자격 심사 제도이고 건축물 사용승인이 아닙니다.', trapType: '농지법과 건축법 절차 혼동' },
  { chapter: '농지법', topic: '농지전용', lawRef: '농지법', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 28, questionText: '농지전용에 관한 설명으로 옳은 것은?', correctChoice: '농지를 농작물 경작이나 다년생식물 재배 등 농업생산 또는 농지개량 외의 용도로 사용하려면 농지전용허가ㆍ협의ㆍ신고 등이 문제될 수 있다.', distractors: ['농지전용은 소유권이전등기만 하면 별도 절차 없이 항상 완료된다.', '농업진흥지역 안의 농지는 모든 경우에 자유롭게 전용할 수 있다.', '농지전용부담금은 공인중개사 중개보수의 다른 명칭이다.', '농지전용허가는 지목이 대지인 토지의 건축물 멸실신고와 동일하다.'], answer: 4, explanation: '농지전용은 농지를 비농업 용도로 쓰는 절차이며, 허가ㆍ협의ㆍ신고와 부담금을 구분해야 합니다.', trapType: '전용과 등기 혼동' },
  { chapter: '건축법', topic: '건폐율과 용적률', lawRef: '건축법, 국토계획법', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 29, questionText: '건폐율과 용적률에 관한 설명으로 옳은 것은?', correctChoice: '건폐율은 대지면적에 대한 건축면적의 비율이고, 용적률은 대지면적에 대한 연면적의 비율을 말한다.', distractors: ['건폐율은 대지면적에 대한 연면적의 비율이고, 용적률은 건축면적의 비율이다.', '건폐율과 용적률은 모든 용도지역에서 동일하게 100퍼센트로 고정된다.', '건폐율 제한은 건축법과 관계가 있으나 국토계획법상 용도지역별 제한과는 전혀 관련이 없다.', '용적률 산정 시 지하층 등 산입 제외 범위는 어떠한 경우에도 문제될 수 없다.'], answer: 2, explanation: '건폐율은 건축면적, 용적률은 연면적입니다. 산입 제외와 용도지역별 제한이 함정입니다.', trapType: '건폐율ㆍ용적률 산식' },
  { chapter: '국토계획법', topic: '토지거래허가구역', lawRef: '부동산 거래신고 등에 관한 법률', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 29, questionText: '토지거래허가구역 안의 허가 대상 토지거래계약에 관한 설명으로 가장 적절한 것은?', correctChoice: '허가 대상 계약은 허가를 받아야 효력이 완성되고, 허가 전 계약의 효력과 허가 신청 절차가 쟁점이 된다.', distractors: ['허가구역에서는 토지거래계약서 작성 자체가 법률상 전면 금지된다.', '허가를 받지 않은 계약도 언제나 확정적으로 유효하여 행정청은 관여할 수 없다.', '토지거래허가는 건축물 사용승인과 동일한 절차이다.', '토지거래허가구역은 중개사무소 개설등록을 제한하기 위한 공인중개사법상 구역이다.'], answer: 1, explanation: '토지거래허가구역에서는 허가 대상, 허가 전 계약 효력, 이용 목적 심사가 자주 출제됩니다.', trapType: '허가 전 계약 효력' },
  { chapter: '도시정비법', topic: '관리처분계획', lawRef: '도시 및 주거환경정비법', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 28, questionText: '관리처분계획에 관한 설명으로 옳은 것은?', correctChoice: '분양대상자, 종전ㆍ종후 자산 평가, 분담금, 정비사업비 추산액 등 권리배분에 관한 사항이 문제될 수 있다.', distractors: ['관리처분계획은 정비구역 지정 전에 반드시 먼저 인가된다.', '관리처분계획인가가 있으면 이전고시는 어떠한 경우에도 필요 없다.', '관리처분계획은 농지취득자격증명을 발급하기 위한 농지법상 서류이다.', '관리처분계획은 개업공인중개사가 작성하는 중개대상물 확인설명서와 동일하다.'], answer: 4, explanation: '관리처분계획은 조합원 권리배분과 분담금의 핵심 절차이고 사업 후반부 절차와 연결됩니다.', trapType: '정비사업 문서 구분' },
  { chapter: '건축법', topic: '사용승인', lawRef: '건축법', category: 'past', difficulty: 'hard', sourceType: 'original', sourceRound: 27, questionText: '건축물 사용승인에 관한 설명으로 옳지 않은 것은?', correctChoice: '소유권보존등기를 신청하면 건축법상 사용승인 절차는 언제나 자동으로 생략된다.', distractors: ['허가 또는 신고 대상 건축물은 공사 완료 후 사용승인 절차가 문제될 수 있다.', '사용승인은 건축물이 허가 또는 신고 내용 등에 맞게 공사되었는지 확인하는 절차와 관련된다.', '사용승인을 받기 전 사용 제한이 문제될 수 있다.', '일정한 경우 임시사용승인이 문제될 수 있다.'], answer: 5, explanation: '등기 절차와 건축행정 절차는 구별됩니다. 보존등기가 사용승인을 당연히 대체하지 않습니다.', trapType: '등기와 건축행정 혼동' },
  { chapter: '주택법', topic: '분양가상한제', lawRef: '주택법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '분양가상한제에 관한 설명으로 가장 적절한 것은?', correctChoice: '분양가상한제는 주택 분양가격을 일정 기준에 따라 제한하는 제도이고, 적용 지역ㆍ주택 유형ㆍ전매제한 등 다른 규제와 함께 검토해야 한다.', distractors: ['분양가상한제가 적용되면 전매제한 등 다른 주택 규제는 법률상 절대로 병행될 수 없다.', '분양가상한제는 모든 오피스텔 임대차계약에 자동 적용되는 민법상 제도이다.', '분양가상한제는 임대차보증금 반환채권을 소멸시키는 등기제도이다.', '분양가상한제 적용 여부는 지역이나 공급 방식과 관계없이 항상 동일하다.'], answer: 2, explanation: '분양가상한제는 분양가격 규제이며 다른 공급 규제와 병행될 수 있습니다.', trapType: '규제 효과 확대 해석' },
  { chapter: '주택법', topic: '전매제한', lawRef: '주택법', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '주택의 전매제한에 관한 설명으로 옳은 것은?', correctChoice: '전매제한은 일정 기간 주택 또는 입주자로 선정된 지위의 전매를 제한하는 제도이고, 기간과 대상은 지역ㆍ주택유형ㆍ공급방식에 따라 달라질 수 있다.', distractors: ['전매제한 기간은 전국 모든 주택에서 언제나 1개월로 고정된다.', '매매계약서에 특약을 두면 법정 전매제한은 언제나 소멸한다.', '전매제한은 부동산등기법상 가등기의 다른 명칭이다.', '전매제한 위반은 주택 공급 질서와 무관하므로 행정상 제재가 문제될 수 없다.'], answer: 1, explanation: '전매제한은 대상과 기간이 고정값이 아니라 사안별 규정을 확인해야 합니다.', trapType: '기간 고정 오답' },
  { chapter: '국토계획법', topic: '성장관리계획', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '성장관리계획에 관한 설명으로 가장 적절한 것은?', correctChoice: '비시가화지역 등의 난개발을 방지하고 계획적 개발을 유도하기 위하여 성장관리계획구역과 성장관리계획이 문제될 수 있다.', distractors: ['성장관리계획은 모든 건축허가와 개발행위허가를 영구히 금지하는 처분이다.', '성장관리계획구역에서는 개발행위허가 기준을 전혀 적용하지 않는다.', '성장관리계획은 공인중개사의 손해배상책임 한도를 정하는 제도이다.', '성장관리계획은 재산세 납부기한 연장 신청서와 동일하다.'], answer: 4, explanation: '성장관리계획은 난개발 방지와 계획적 개발 유도를 위한 제도로, 개발행위허가와 함께 묻기 좋습니다.', trapType: '제도 목적 혼동' },
  { chapter: '건축법', topic: '생활숙박시설', lawRef: '건축법, 주택법 관련 규제', category: 'issue', difficulty: 'hard', sourceType: 'predicted', sourceRound: 36, questionText: '생활숙박시설과 관련한 공법상 쟁점으로 가장 적절한 것은?', correctChoice: '건축물 용도, 숙박업 영업, 실제 주거 사용 제한, 용도변경 가능성 등이 함께 문제될 수 있다.', distractors: ['생활숙박시설은 법률상 언제나 공동주택으로만 분류되므로 숙박업과 관련이 없다.', '생활숙박시설은 건축법상 용도분류와 무관하므로 용도변경이 문제될 수 없다.', '생활숙박시설을 분양받으면 농지취득자격증명이 반드시 필요하다.', '생활숙박시설은 모든 용도지역에서 학교시설로 간주된다.'], answer: 3, explanation: '생활숙박시설은 건축물 용도와 실제 사용 형태의 불일치가 핵심 쟁점입니다.', trapType: '용도와 실제 사용 혼동' },
  { chapter: '건축법', topic: '대수선', lawRef: '건축법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '대수선에 관한 설명으로 옳은 것은?', correctChoice: '대수선은 건축물의 주요 구조부 등에 대한 일정한 수선ㆍ변경 행위를 의미할 수 있고, 허가 또는 신고 대상 여부를 검토해야 한다.', distractors: ['대수선은 실내 벽지 교체만을 의미하므로 건축법과 무관하다.', '대수선은 언제나 개발행위허가만 받으면 건축법상 절차가 전부 면제된다.', '대수선 신고 또는 허가 대상은 건축물 규모와 관계없이 전혀 없다.', '대수선은 농지전용허가의 다른 명칭이다.'], answer: 2, explanation: '대수선은 일상적 수리와 구분되는 건축법상 개념입니다.', trapType: '일상 수리와 법정 대수선 구분' },
  { chapter: '도시정비법', topic: '이전고시', lawRef: '도시 및 주거환경정비법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '정비사업의 이전고시에 관한 설명으로 옳은 것은?', correctChoice: '이전고시는 관리처분계획에 따른 대지 또는 건축물의 권리 이전ㆍ확정과 관련되는 후속 절차이다.', distractors: ['이전고시는 정비구역 지정 전에 반드시 먼저 하는 절차이다.', '이전고시가 있으면 조합설립동의 절차가 소급하여 모두 무효가 된다.', '이전고시는 농지전용부담금을 산정하기 위한 농지법상 고시이다.', '이전고시는 개업공인중개사의 중개보수 지급기한을 정하는 행정처분이다.'], answer: 2, explanation: '이전고시는 정비사업 후반부 권리 이전 절차입니다. 정비구역 지정 전 절차가 아닙니다.', trapType: '절차 순서 혼동' },
  { chapter: '도시개발법', topic: '환지처분', lawRef: '도시개발법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '환지처분에 관한 설명으로 옳지 않은 것은?', correctChoice: '환지처분은 오직 임대차계약 갱신청구권 행사 방식만을 정한다.', distractors: ['환지처분은 환지계획에 따라 권리관계를 최종적으로 정리하는 처분이다.', '환지처분이 공고되면 종전 토지와 환지 사이의 권리 변동 효과가 문제될 수 있다.', '청산금은 환지처분과 관련하여 문제될 수 있다.', '환지처분은 환지방식 도시개발사업에서 중요하다.'], answer: 5, explanation: '환지처분은 임대차계약 갱신청구권이 아니라 도시개발사업상 권리관계 정리 절차입니다.', trapType: '민사 임대차 제도 혼입' },
  { chapter: '주택법', topic: '리모델링', lawRef: '주택법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '공동주택 리모델링에 관한 설명으로 옳은 것은?', correctChoice: '공동주택 리모델링은 재건축과 구별되며 증축 범위, 안전진단, 동의요건, 허가 등이 문제될 수 있다.', distractors: ['리모델링은 언제나 재건축사업과 동일하여 별도 제도 구분이 없다.', '리모델링을 하면 대지 소유권은 반드시 국가로 귀속된다.', '리모델링 허가는 농지취득자격증명으로 대체된다.', '리모델링은 주택법상 규율 대상이 될 수 없다.'], answer: 3, explanation: '리모델링과 재건축은 시험에서 자주 비교됩니다. 증축 범위와 동의요건을 함께 봐야 합니다.', trapType: '재건축과 리모델링 혼동' },
  { chapter: '농지법', topic: '농업진흥지역', lawRef: '농지법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '농업진흥지역에 관한 설명으로 옳은 것은?', correctChoice: '농업진흥지역은 농지를 효율적으로 보전ㆍ이용하기 위하여 지정되는 지역이고 농업진흥구역과 농업보호구역의 구분이 문제될 수 있다.', distractors: ['농업진흥지역 안에서는 모든 건축물과 개발행위가 아무 절차 없이 자유롭게 허용된다.', '농업진흥지역은 상업지역의 세부 용도지역이다.', '농업진흥지역 지정은 중개사무소 개설등록의 결격사유를 정한다.', '농업진흥지역은 토지거래허가구역과 언제나 동일한 구역이다.'], answer: 4, explanation: '농업진흥지역은 농지 보전 목적의 농지법상 지역제도이며, 국토계획법상 용도지역과 구분해야 합니다.', trapType: '지역제도 간 명칭 혼동' },
  { chapter: '건축법', topic: '위반건축물', lawRef: '건축법', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '위반건축물에 대한 조치로 옳은 것은?', correctChoice: '허가 또는 신고 내용과 다르게 건축된 경우 시정명령, 이행강제금 부과 등이 문제될 수 있다.', distractors: ['위반건축물은 발견 즉시 소유자의 동의 없이 항상 소유권이전등기가 완료된다.', '위반건축물에는 어떠한 행정상 제재도 할 수 없다.', '건축법 위반 여부는 토지의 취득세율만으로 판단한다.', '위반건축물 표시는 중개보수 영수증에만 기재한다.'], answer: 1, explanation: '위반건축물은 시정명령과 이행강제금이 핵심입니다.', trapType: '제재 수단 혼동' },
  { chapter: '국토계획법', topic: '용도지역별 행위제한', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'trap', difficulty: 'trap', sourceType: 'weak_review', sourceRound: 35, questionText: '용도지역별 행위제한에 관한 설명으로 옳지 않은 것은?', correctChoice: '상업지역으로 지정되면 모든 공장과 위험시설이 아무 제한 없이 허용된다.', distractors: ['용도지역에 따라 건축할 수 있는 건축물의 종류와 규모가 달라질 수 있다.', '조례는 법령의 범위에서 세부 기준을 정할 수 있다.', '행위제한은 토지이용의 공공복리와 관련된다.', '건폐율과 용적률 제한도 용도지역별로 문제될 수 있다.'], answer: 5, explanation: '상업지역이라도 건축물 용도와 규모 제한이 있으며 모든 시설이 무제한 허용되는 것은 아닙니다.', trapType: '용도지역 효과 과장' },
  { chapter: '국토계획법', topic: '도시지역 세분', lawRef: '국토의 계획 및 이용에 관한 법률', category: 'easy', difficulty: 'normal', sourceType: 'modified', sourceRound: 33, questionText: '도시지역과 관리지역의 세분을 바르게 연결한 것은?', correctChoice: '도시지역: 주거ㆍ상업ㆍ공업ㆍ녹지 / 관리지역: 보전관리ㆍ생산관리ㆍ계획관리', distractors: ['도시지역: 보전관리ㆍ생산관리ㆍ계획관리 / 관리지역: 주거ㆍ상업ㆍ공업ㆍ녹지', '도시지역: 농업진흥ㆍ농업보호 / 관리지역: 투기과열ㆍ조정대상', '도시지역: 재개발ㆍ재건축 / 관리지역: 환지ㆍ수용ㆍ사용', '도시지역: 갑구ㆍ을구ㆍ표제부 / 관리지역: 전ㆍ답ㆍ대'], answer: 2, explanation: '기본 문항도 단순 암기보다 비교형으로 익혀야 실전에서 덜 흔들립니다.', trapType: '기본 분류 비교' },
  { chapter: '건축법', topic: '건축물 용도변경', lawRef: '건축법', category: 'easy', difficulty: 'normal', sourceType: 'modified', sourceRound: 33, questionText: '건축물 용도변경에 관한 설명으로 옳은 것은?', correctChoice: '건축물의 용도를 변경하려는 경우 변경 전후 용도군과 규모 등에 따라 허가ㆍ신고ㆍ기재내용 변경 등이 문제될 수 있다.', distractors: ['건축물 용도는 소유자가 마음대로 정하면 건축법상 절차 없이 항상 확정된다.', '모든 용도변경은 건축허가보다 강한 토지수용절차이다.', '용도변경은 부동산등기법상 소유권이전등기와 동일하다.', '용도변경은 농지전용허가를 받으면 모든 경우 자동 완료된다.'], answer: 1, explanation: '용도변경은 용도군과 절차 구분이 기본이며, 생활숙박시설 같은 이슈와도 연결됩니다.', trapType: '용도변경 절차' },
  { chapter: '도시개발법', topic: '도시개발사업 목적', lawRef: '도시개발법', category: 'easy', difficulty: 'normal', sourceType: 'modified', sourceRound: 33, questionText: '도시개발사업과 정비사업을 비교한 설명으로 옳은 것은?', correctChoice: '도시개발사업은 계획적 도시개발과 도시환경 조성을 목적으로 하고, 정비사업은 노후ㆍ불량건축물 밀집지역 등의 주거환경 개선과 권리관계 정비가 문제될 수 있다.', distractors: ['도시개발사업과 정비사업은 모두 취득세 신고만을 의미한다.', '도시개발사업은 농지취득자격증명으로만 시행하고 정비사업은 건축물대장 발급으로만 시행한다.', '도시개발사업에는 환지방식이 있을 수 없고 정비사업에는 관리처분계획이 문제될 수 없다.', '도시개발사업과 정비사업은 모두 공인중개사의 중개보수 한도를 정하는 제도이다.'], answer: 3, explanation: '도시개발법과 도시정비법은 이름이 비슷하지만 사업 목적과 절차가 다릅니다.', trapType: '개발사업과 정비사업 비교' },
  { chapter: '농지법', topic: '농지 소유 원칙', lawRef: '농지법', category: 'easy', difficulty: 'normal', sourceType: 'modified', sourceRound: 33, questionText: '농지법상 농지 소유 원칙에 관한 설명으로 옳은 것은?', correctChoice: '농지는 원칙적으로 자기의 농업경영에 이용하거나 이용할 자가 소유할 수 있다는 원칙이 적용된다.', distractors: ['농지는 누구나 투기 목적으로 제한 없이 소유할 수 있다.', '농지는 건축물이 있는 토지만을 의미하므로 전과 답은 농지가 아니다.', '농지 소유 제한은 주택임대차보호법에서만 정한다.', '농지는 항상 상업지역 안에만 존재한다.'], answer: 4, explanation: '농지법은 경자유전 원칙, 농지취득자격증명, 농지전용 제한을 하나로 묶어 봐야 합니다.', trapType: '농지법 기본 원칙' },
];

function answerFor(index: number): ChoiceNumber {
  return ((index % 5) + 1) as ChoiceNumber;
}

function makeChoices(subject: Subject, topic: string, answer: ChoiceNumber): [string, string, string, string, string] {
  const choices = [
    `${topic}에 관한 원칙적 설명으로 타당하다.`,
    `${subject} 절차에서는 신고 또는 허가 요건을 먼저 검토한다.`,
    `기한, 주체, 서면 작성 여부를 함께 판단해야 한다.`,
    `예외 규정이 있더라도 모든 경우에 동일하게 적용된다고 볼 수 있다.`,
    `위반 시 행정상 제재 또는 과태료가 문제될 수 있다.`,
  ] as [string, string, string, string, string];

  choices[answer - 1] = `${topic}의 요건과 효과를 법령 문언에 맞게 연결한 설명이다.`;
  return choices;
}

function makeQuestion(subject: Subject, serial: number, meta: CategoryMeta, categoryIndex: number): Question {
  const chapter = subjectChapters[subject][serial % subjectChapters[subject].length];
  const topic = subjectTopics[subject][serial % subjectTopics[subject].length];
  const answer = answerFor(serial + categoryIndex);

  return {
    id: `${subject}-${meta.category}-${categoryIndex + 1}`,
    sourceRound: meta.sourceRound,
    sourceYear: 1989 + meta.sourceRound,
    subject,
    examNumber: serial + 1,
    displayNumber: serial + 1,
    chapter,
    topic,
    lawRef: lawRefs[subject],
    difficulty: meta.difficulty,
    sourceType: meta.sourceType,
    category: meta.category,
    frequencyScore: Math.max(55, 96 - categoryIndex * 3 - serial),
    issueScore: meta.category === 'issue' ? 85 - categoryIndex * 4 : undefined,
    trapType: meta.category === 'trap' ? '절대 표현과 예외 혼동' : undefined,
    questionText: `[${meta.label}] ${subject}의 ${chapter} 중 ${topic}에 관한 설명으로 옳은 것은?`,
    choices: makeChoices(subject, topic, answer),
    answer,
    explanation: `${topic}은 ${lawRefs[subject]}의 기본 요건, 절차, 효과를 함께 확인해야 합니다. 정답 선택지는 요건과 효과를 가장 정확하게 연결합니다.`,
    memoryNote: `${subject} ${topic}: 주체, 기한, 서면 여부를 묶어서 암기하세요.`,
  };
}

function buildPublicLawQuestions(): Question[] {
  return publicLawSeeds.map((seed, index) => ({
    id: `공법-${seed.category}-${index + 1}`,
    sourceRound: seed.sourceRound,
    sourceYear: 1989 + seed.sourceRound,
    subject: '공법',
    examNumber: index + 1,
    displayNumber: index + 1,
    chapter: seed.chapter,
    topic: seed.topic,
    lawRef: seed.lawRef,
    difficulty: seed.difficulty,
    sourceType: seed.sourceType,
    category: seed.category,
    frequencyScore: Math.max(55, 98 - index),
    issueScore: seed.category === 'issue' ? 88 - index : undefined,
    trapType: seed.trapType,
    questionText: seed.questionText,
    choices: seed.choices,
    answer: seed.answer,
    explanation: seed.explanation,
    memoryNote: `공법 ${seed.topic}: ${seed.trapType ?? '핵심 요건'}을 중심으로 복습하세요.`,
  }));
}

function makeAuthoredChoices(seed: AuthoredQuestionSeed): [string, string, string, string, string] {
  const choices = [...seed.distractors];
  choices.splice(seed.answer - 1, 0, seed.correctChoice);

  if (choices.length !== 5) {
    throw new Error(`${seed.questionText} 선택지는 5개여야 합니다.`);
  }

  return choices.slice(0, 5) as [string, string, string, string, string];
}

function applyOfficialOverrides(
  seeds: AuthoredQuestionSeed[],
  overrides: OfficialQuestionOverride[],
): AuthoredQuestionSeed[] {
  const nextSeeds = [...seeds];

  overrides.forEach(({ index, seed }) => {
    if (index < 0 || index >= nextSeeds.length) {
      throw new Error(`${seed.topic} 공식자료 문항 위치가 범위를 벗어났습니다.`);
    }

    nextSeeds[index] = seed;
  });

  return nextSeeds;
}

function buildAuthoredSubjectQuestions(subject: Subject, seeds: AuthoredQuestionSeed[]): Question[] {
  return seeds.map((seed, index) => ({
    id: `${subject}-${seed.category}-${index + 1}`,
    sourceRound: seed.sourceRound,
    sourceYear: 1989 + seed.sourceRound,
    subject,
    examNumber: index + 1,
    displayNumber: index + 1,
    chapter: seed.chapter,
    topic: seed.topic,
    lawRef: seed.lawRef,
    difficulty: seed.difficulty,
    sourceType: seed.sourceType,
    category: seed.category,
    frequencyScore: Math.max(55, 98 - index),
    issueScore: seed.category === 'issue' ? 88 - index : undefined,
    trapType: seed.trapType,
    questionText: seed.questionText,
    choices: makeAuthoredChoices(seed),
    answer: seed.answer,
    explanation: seed.explanation,
    memoryNote: `${subject} ${seed.topic}: ${seed.trapType ?? '핵심 요건'}을 중심으로 복습하세요.`,
  }));
}

function examLevelQuestionText(subject: Subject, seed: AuthoredQuestionSeed, index: number): string {
  const pattern = index % 4;

  if (subject === '중개사법') {
    if (pattern === 0) {
      return `${seed.questionText} 단, 등록관청ㆍ개업공인중개사ㆍ소속공인중개사ㆍ중개보조원의 지위를 구별하여 판단한다.`;
    }

    if (pattern === 1) {
      return `${seed.questionText} 법정 의무의 주체와 위반 시 제재 가능성을 함께 고려하여 고른다.`;
    }

    if (pattern === 2) {
      return `${seed.questionText} 거래당사자 합의가 있더라도 공인중개사법상 제한이 배제되는 것은 아님에 유의한다.`;
    }

    return `${seed.questionText} 다음 선택지 중 절대적 표현 또는 다른 법령 절차가 섞인 것을 배제하여 판단한다.`;
  }

  if (subject === '공시세법') {
    if (pattern === 0) {
      return `${seed.questionText} 지적공부ㆍ등기기록ㆍ세무신고 절차를 서로 구별하여 판단한다.`;
    }

    if (pattern === 1) {
      return `${seed.questionText} 과세대상ㆍ납세의무자ㆍ과세기준일 또는 등기신청 구조를 함께 고려한다.`;
    }

    if (pattern === 2) {
      return `${seed.questionText} 토지이동, 권리변동, 보유세와 거래세의 개념이 섞여 있는 선택지를 주의한다.`;
    }

    return `${seed.questionText} 실제 시험처럼 유사 용어의 효과와 담당 기관을 구별하여 고른다.`;
  }

  return seed.questionText;
}

function buildExamLevelSubjectQuestions(subject: Subject, seeds: AuthoredQuestionSeed[]): Question[] {
  return seeds.map((seed, index) => {
    const elevatedDifficulty: Difficulty =
      seed.category === 'easy' ? 'normal' : seed.category === 'trap' ? 'trap' : 'hard';

    return {
      id: `${subject}-exam-${seed.category}-${index + 1}`,
      sourceRound: seed.sourceRound,
      sourceYear: 1989 + seed.sourceRound,
      subject,
      examNumber: index + 1,
      displayNumber: index + 1,
      chapter: seed.chapter,
      topic: seed.topic,
      lawRef: seed.lawRef,
      difficulty: elevatedDifficulty,
      sourceType: seed.sourceType,
      category: seed.category,
      frequencyScore: Math.max(58, 99 - index),
      issueScore: seed.category === 'issue' ? 92 - index : undefined,
      trapType: seed.trapType,
      questionText: examLevelQuestionText(subject, seed, index),
      choices: makeAuthoredChoices(seed),
      answer: seed.answer,
      explanation: `${seed.explanation} 실전에서는 선택지의 주체, 절차, 효과, 예외 표현을 동시에 대조해야 합니다.`,
      memoryNote: `${subject} ${seed.topic}: ${seed.trapType ?? '핵심 요건'}과 유사 제도 차이를 함께 복습하세요.`,
    };
  });
}

function buildSubjectQuestions(subject: Subject): Question[] {
  if (subject === '중개사법') {
    return buildExamLevelSubjectQuestions(
      subject,
      applyOfficialOverrides(brokerageSeeds, officialBrokerageOverrides),
    );
  }

  if (subject === '공법') {
    return buildAuthoredSubjectQuestions(
      subject,
      applyOfficialOverrides(hardPublicLawSeeds, officialPublicLawOverrides),
    );
  }

  if (subject === '공시세법') {
    return buildExamLevelSubjectQuestions(
      subject,
      applyOfficialOverrides(registryTaxSeeds, officialRegistryTaxOverrides),
    );
  }

  const questions: Question[] = [];

  categoryPlan.forEach((meta) => {
    Array.from({ length: meta.count }).forEach((_, categoryIndex) => {
      questions.push(makeQuestion(subject, questions.length, meta, categoryIndex));
    });
  });

  return questions;
}

export const sampleQuestions: Question[] = [
  ...buildSubjectQuestions('중개사법'),
  ...buildSubjectQuestions('공법'),
  ...buildSubjectQuestions('공시세법'),
];

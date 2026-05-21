# MVP 상세 명세서

## 1. 프로젝트 목표

공인중개사 2차 시험을 실제 시험 환경과 유사하게 풀 수 있는 웹앱 MVP를 구현합니다.

MVP는 다음 흐름을 완성하는 것이 목표입니다.

```text
시험 설정 → 시험 응시 → 답안 선택 → 제출 → 채점 → 결과/해설 확인
```

---

## 2. 시험 모드

### 2.1 2차 1교시 모드

- 과목: 중개사법 + 공법
- 문항 수: 총 80문항
- 제한시간: 100분
- 표시 번호:
  - 중개사법: 1번~40번
  - 공법: 41번~80번

### 2.2 과목별 단독 모드

- 중개사법: 40문항
- 공법: 40문항
  - 표시 번호는 41번~80번 옵션 지원
- 공시법/세법: 40문항
- 제한시간:
  - 중개사법: 기본 50분
  - 공법: 기본 50분
  - 공시법/세법: 기본 50분

---

## 3. 문제 구성 비율

각 과목 40문항 기준:

| 카테고리 | 비율 | 문항 수 | 설명 |
|---|---:|---:|---|
| recent_frequent | 40% | 16 | 30회~36회 최근 빈출 |
| past | 20% | 8 | 22회~29회 과거 기출/변형 |
| issue | 10% | 4 | 최신 부동산 이슈 예상 |
| trap | 20% | 8 | 함정 문제 |
| easy | 10% | 4 | 쉬운 문제 |

MVP에서는 샘플 데이터가 부족할 수 있으므로, 부족분은 같은 과목의 다른 문제로 채웁니다.

---

## 4. 데이터 타입

```ts
export type Subject = '중개사법' | '공법' | '공시세법';

export type QuestionCategory =
  | 'recent_frequent'
  | 'past'
  | 'issue'
  | 'trap'
  | 'easy';

export type Question = {
  id: string;
  sourceRound: number;
  sourceYear?: number;
  subject: Subject;
  examNumber: number;
  displayNumber: number;
  chapter: string;
  topic: string;
  lawRef?: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'trap';
  sourceType: 'original' | 'modified' | 'predicted' | 'weak_review';
  category: QuestionCategory;
  frequencyScore: number;
  issueScore?: number;
  trapType?: string;
  questionText: string;
  choices: [string, string, string, string, string];
  answer: 1 | 2 | 3 | 4 | 5;
  explanation: string;
  memoryNote?: string;
};

export type UserAnswer = {
  questionId: string;
  selectedChoice?: 1 | 2 | 3 | 4 | 5;
  isCorrect?: boolean;
  timeSpentSeconds?: number;
  changedCount?: number;
};
```

---

## 5. 주요 컴포넌트

### 5.1 ExamSetupPage

역할:

- 시험 모드 선택
- 과목 선택
- 시험 시작

필수 요소:

- 2차 1교시 모드 버튼
- 중개사법 단독 버튼
- 공법 단독 버튼
- 공시법/세법 단독 버튼
- 시작 버튼

### 5.2 ExamPage

역할:

- 시험 응시 메인 화면

구성:

- 상단 ExamHeader
- 왼쪽 AnswerSheet
- 오른쪽 QuestionPanel
- 하단 이전/다음 버튼

### 5.3 ExamHeader

역할:

- 시험명 표시
- 남은 시간 표시
- 일시정지/재개 버튼
- 제출 버튼

### 5.4 Timer

역할:

- 남은 시간 계산
- 일시정지/재개
- 시간 종료 시 자동 제출

주의:

- 일시정지 중에는 시간이 줄어들지 않아야 합니다.
- 시간이 끝나면 자동으로 결과 화면으로 이동해야 합니다.

### 5.5 AnswerSheet

역할:

- 왼쪽 문항별 5지선다 체크테이블

기능:

- 문항 번호 표시
- ①②③④⑤ 선택 표시
- 문항 번호 클릭 시 해당 문제로 이동
- 선택지 클릭 시 답안 변경
- 현재 문항 강조
- 미답 문항 표시
- 답변 완료 문항 표시

### 5.6 QuestionPanel

역할:

- 현재 문제 본문과 선택지 표시

기능:

- 선택지 클릭 시 답안 저장
- 선택한 답 강조
- 문제 번호/과목/주제 표시

### 5.7 ResultPage

역할:

- 채점 결과 및 해설 표시

표시 정보:

- 총 문항 수
- 정답 수
- 오답 수
- 미답 수
- 점수
- 과목별 점수
- 문항별 해설
- 사용자가 선택한 답
- 정답

---

## 6. 시험지 생성 유틸

파일 예시:

```text
src/utils/buildExamPaper.ts
```

필수 기능:

```ts
buildExamPaper(options: {
  mode: ExamMode;
  subjects: Subject[];
}): Question[]
```

로직:

1. 선택 과목별 후보 문제 필터링
2. 카테고리별 목표 문항 수 계산
3. 카테고리별 문제 추출
4. 부족분은 같은 과목의 다른 문제로 보충
5. 문제 순서 섞기
6. displayNumber 재부여

---

## 7. 채점 유틸

파일 예시:

```text
src/utils/scoring.ts
```

필수 기능:

```ts
scoreExam(questions: Question[], answers: Record<string, UserAnswer>)
```

반환 정보:

- totalQuestions
- correctCount
- wrongCount
- unansweredCount
- score
- subjectScores
- questionResults

---

## 8. 화면 레이아웃

권장 구조:

```text
┌────────────────────────────────────────────────────────────┐
│ 시험명 / 과목 / 남은 시간 / 일시정지 / 제출                │
├───────────────┬────────────────────────────────────────────┤
│ 답안표         │ 문제 영역                                  │
│ 1 ①②③④⑤      │ 문제 번호                                  │
│ 2 ①②③④⑤      │ 문제 본문                                  │
│ ...           │ ① 선택지                                   │
│               │ ② 선택지                                   │
│               │ ③ 선택지                                   │
│               │ ④ 선택지                                   │
│               │ ⑤ 선택지                                   │
└───────────────┴────────────────────────────────────────────┘
```

---

## 9. UI 스타일

- 데스크톱 기준
- 시험지 같은 흰 배경
- 왼쪽 답안표는 고정 또는 sticky
- 현재 문항은 명확히 강조
- 미답 문항은 옅은 경고 표시
- 선택된 답은 진하게 표시
- 결과 화면에서는 정답/오답을 구분

---

## 10. 추후 확장

MVP 이후 아래 기능을 추가할 수 있도록 타입과 유틸을 분리합니다.

- SQLite + Prisma
- 문제 DB 관리
- ExamSession 저장
- UserAnswer 저장
- WeaknessStat 계산
- 자주 틀린 문항 피드백
- 피드백 암기노트 생성
- 약점 집중 모드

import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.resolve('src/data/releasedExamQuestions.json');
const questions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const rounds = Array.from({ length: 17 }, (_, index) => index + 20);
const recentRounds = [30, 31, 32, 33, 34, 35, 36];
const legacyRounds = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
const subjects = ['중개사법', '공법', '공시세법'];
const registryTaxTargets = {
  지적법: 12,
  등기법: 12,
  세법: 16,
};
const partTargets = [
  ['중개사법', '공인중개사법령·부동산거래신고', 28],
  ['중개사법', '중개실무', 12],
  ['공법', '국토계획법', 12],
  ['공법', '도시개발법·도시정비법', 12],
  ['공법', '주택법·건축법·농지법', 16],
  ['공시세법', '지적법', 12],
  ['공시세법', '등기법', 12],
  ['공시세법', '세법', 16],
];
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function countBy(items, key) {
  return items.filter((item) => item[key.name] === key.value).length;
}

function parseQuestionText(questionText) {
  const normalizedText = questionText.trim();
  const itemMatch = normalizedText.match(/\s(?=ㄱ[.．]\s?)/);

  if (itemMatch?.index !== undefined) {
    const itemText = normalizedText.slice(itemMatch.index).trim();
    return {
      stem: normalizedText.slice(0, itemMatch.index).trim(),
      examples: itemText.split(/\s+(?=[ㄱㄴㄷㄹㅁㅂ][.．]\s?)/).map((item) => item.trim()).filter(Boolean),
    };
  }

  const circleMatch = normalizedText.match(/\s(?=○\s?)/);

  if (circleMatch?.index !== undefined) {
    const itemText = normalizedText.slice(circleMatch.index).trim();
    return {
      stem: normalizedText.slice(0, circleMatch.index).trim(),
      examples: itemText.split(/\s+(?=○\s?)/).map((item) => item.trim()).filter(Boolean),
    };
  }

  return { stem: normalizedText, examples: [] };
}

function expectsExampleBox(questionText) {
  return /ㄱ[.．]|○/.test(questionText);
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function classifyExamPart(question) {
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

function requiredRecent(total) {
  return Math.round(total * 0.7);
}

function requiredLegacy(total) {
  return total - requiredRecent(total);
}

function assertRatioPool(label, pool, targetCount) {
  const verifiedPool = pool.filter((question) => !question.needsReview);
  const recentCount = verifiedPool.filter((question) => recentRounds.includes(question.sourceRound)).length;
  const legacyCount = verifiedPool.filter((question) => legacyRounds.includes(question.sourceRound)).length;
  const recentNeed = requiredRecent(targetCount);
  const legacyNeed = requiredLegacy(targetCount);

  if (recentCount < recentNeed) {
    fail(`${label}: 30~36회 검증 문항 ${recentCount}개, 필요 ${recentNeed}개`);
  }

  if (legacyCount < legacyNeed) {
    fail(`${label}: 20~29회 검증 문항 ${legacyCount}개, 필요 ${legacyNeed}개`);
  }
}

const ids = new Set();
let boxQuestionCount = 0;
let assistedSourceCount = 0;

for (const question of questions) {
  if (ids.has(question.id)) {
    fail(`중복 문제 ID: ${question.id}`);
  }
  ids.add(question.id);

  if (!Array.isArray(question.choices) || question.choices.length !== 5) {
    fail(`${question.id}: 보기가 5개가 아닙니다.`);
  } else {
    question.choices.forEach((choice, index) => {
      if (!String(choice).trim()) {
        fail(`${question.id}: ${index + 1}번 보기가 비어 있습니다.`);
      }
    });
  }

  if (!Number.isInteger(question.answer) || question.answer < 1 || question.answer > 5) {
    fail(`${question.id}: 정답이 1~5 범위가 아닙니다.`);
  }

  if (question.isLawUpdated && !question.lawUpdateDescription) {
    fail(`${question.id}: 현행법 보정 문항인데 보정 설명이 없습니다.`);
  }

  if (!question.originalSource?.includes('Q-Net') && !question.originalSource?.includes('q-net')) {
    warn(`${question.id}: Q-Net 공식 출처 문구를 확인할 수 없습니다.`);
  }

  if (question.originalSource?.includes('보조 추출')) {
    assistedSourceCount += 1;
  }

  if (expectsExampleBox(question.questionText)) {
    boxQuestionCount += 1;
    const parsed = parseQuestionText(question.questionText);

    if (!parsed.stem || parsed.examples.length === 0) {
      fail(`${question.id}: 박스형 문항을 화면 박스로 분리할 수 없습니다.`);
    }
  }
}

for (const round of rounds) {
  const roundQuestions = questions.filter((question) => question.sourceRound === round);

  if (roundQuestions.length !== 120) {
    fail(`제${round}회 총 문항 수 ${roundQuestions.length}, 기대값 120`);
  }

  for (const subject of subjects) {
    const subjectQuestions = roundQuestions.filter((question) => question.subject === subject);
    if (subjectQuestions.length !== 40) {
      fail(`제${round}회 ${subject} 문항 수 ${subjectQuestions.length}, 기대값 40`);
    }

    const numbers = subjectQuestions.map((question) => question.examNumber).sort((a, b) => a - b);
    const expected = Array.from({ length: 40 }, (_, index) => index + 1);
    if (numbers.join(',') !== expected.join(',')) {
      fail(`제${round}회 ${subject} 문항번호 누락/중복: ${numbers.join(',')}`);
    }
  }

  const registryTaxQuestions = roundQuestions.filter((question) => question.subject === '공시세법');
  const cadastralCount = countBy(registryTaxQuestions, { name: 'subSubject', value: '지적법' });
  const registryCount = countBy(registryTaxQuestions, { name: 'subSubject', value: '등기법' });
  const taxCount = countBy(registryTaxQuestions, { name: 'subSubject', value: '세법' });

  if (cadastralCount !== 12) {
    fail(`제${round}회 지적법 문항 수 ${cadastralCount}, 기대값 12`);
  }
  if (registryCount !== 12) {
    fail(`제${round}회 등기법 문항 수 ${registryCount}, 기대값 12`);
  }
  if (taxCount !== 16) {
    fail(`제${round}회 세법 문항 수 ${taxCount}, 기대값 16`);
  }
}

if (questions.length !== 2040) {
  fail(`전체 문항 수 ${questions.length}, 기대값 2040`);
}

assertRatioPool('중개사법', questions.filter((question) => question.subject === '중개사법'), 40);
assertRatioPool('공법', questions.filter((question) => question.subject === '공법'), 40);

for (const [subSubject, targetCount] of Object.entries(registryTaxTargets)) {
  assertRatioPool(
    `공시세법/${subSubject}`,
    questions.filter((question) => question.subject === '공시세법' && question.subSubject === subSubject),
    targetCount,
  );
}

for (const [subject, part, targetCount] of partTargets) {
  assertRatioPool(
    `${subject}/${part}`,
    questions.filter((question) => question.subject === subject && classifyExamPart(question) === part),
    targetCount,
  );
}

if (assistedSourceCount > 0) {
  warn(`보조 추출 출처가 포함된 문항 ${assistedSourceCount}개: 공식 PDF 원문 대조 전까지 현행 DB를 완전 검증본으로 볼 수 없습니다.`);
}

if (warnings.length > 0) {
  console.warn(`question bank warnings (${warnings.length})`);
  console.warn(warnings.slice(0, 20).join('\n'));
  if (warnings.length > 20) {
    console.warn(`... 외 ${warnings.length - 20}건`);
  }
}

if (failures.length > 0) {
  console.error(`question bank validation failed (${failures.length})`);
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`released exam validation passed: ${rounds.length} rounds, ${questions.length} questions, ${boxQuestionCount} box questions`);

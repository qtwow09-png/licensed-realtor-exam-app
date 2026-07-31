import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.resolve('src/data/releasedExamQuestions.json');
const questions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const rounds = Array.from({ length: 17 }, (_, index) => index + 20);
const subjects = ['중개사법', '공법', '공시세법'];
const failures = [];

function fail(message) {
  failures.push(message);
}

function countBy(items, key) {
  return items.filter((item) => item[key.name] === key.value).length;
}

const ids = new Set();

for (const question of questions) {
  if (ids.has(question.id)) {
    fail(`중복 문제 ID: ${question.id}`);
  }
  ids.add(question.id);

  if (!Array.isArray(question.choices) || question.choices.length !== 5) {
    fail(`${question.id}: 보기가 5개가 아닙니다.`);
  }

  if (!Number.isInteger(question.answer) || question.answer < 1 || question.answer > 5) {
    fail(`${question.id}: 정답이 1~5 범위가 아닙니다.`);
  }

  if (question.isLawUpdated && !question.lawUpdateDescription) {
    fail(`${question.id}: 현행법 보정 문항인데 보정 설명이 없습니다.`);
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

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('released exam validation passed: 17 rounds, 2040 questions');

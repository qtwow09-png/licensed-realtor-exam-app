import type { ReleasedRoundMeta } from '../types/exam';

const qnetQuestionUrl = 'https://www.q-net.or.kr/cst003.do?gId=08&gSite=L&id=cst00309';

export const releasedRoundCatalog: ReleasedRoundMeta[] = [
  30, 31, 32, 33, 34, 35, 36,
].map((round) => ({
  round,
  year: 1989 + round,
  title: `제${round}회 실제 기출`,
  sourceUrl: qnetQuestionUrl,
  lawBasis: '기출 원문 기준, 현행법 보정 문항은 별도 표시',
  note: 'Q-Net 공개 기출문제와 최종정답을 기준으로 회차별 실제 시험 순서를 유지합니다.',
}));

export const mixedReleasedRoundMeta: ReleasedRoundMeta = {
  round: 0,
  year: 0,
  title: '제30~36회 실제 기출 혼합',
  sourceUrl: qnetQuestionUrl,
  lawBasis: '기출 원문 기준, 현행법 보정 문항은 별도 표시',
  note: '제30~36회 실제 기출만 사용하되 회차, 문항 순서, 보기 순서를 섞어 출제합니다.',
};

export function firstReleasedRound(): ReleasedRoundMeta {
  return releasedRoundCatalog[0];
}

export function latestReleasedRound(): ReleasedRoundMeta {
  return releasedRoundCatalog[releasedRoundCatalog.length - 1];
}

export function releasedRoundByNumber(roundNumber: number): ReleasedRoundMeta {
  return releasedRoundCatalog.find((round) => round.round === roundNumber) ?? latestReleasedRound();
}

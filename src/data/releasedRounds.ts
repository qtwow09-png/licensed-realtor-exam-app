import type { ReleasedRoundMeta } from '../types/exam';

const qnetPastExamUrl = 'https://q-net.or.kr/cst003.do?gId=08&gSite=L&id=cst00309';

export const releasedRoundCatalog: ReleasedRoundMeta[] = [
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
].map((round) => ({
  round,
  year: 1989 + round,
  title: `제${round}회 공개 기출 기반 현행법 보정`,
  sourceUrl: qnetPastExamUrl,
  lawBasis: '2026년 5월 현재 시행 법령 기준',
  note: 'Q-Net 기출문제 내려받기 공개 자료에서 반복되는 출제 쟁점을 현행 법령 숫자ㆍ기간ㆍ벌칙 기준으로 보정한 세트입니다.',
}));

export function firstReleasedRound(): ReleasedRoundMeta {
  return releasedRoundCatalog[0];
}

function randomIndex(max: number): number {
  if (max <= 0) {
    return 0;
  }

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0] % max;
  }

  return Math.floor(Math.random() * max);
}

export function shuffledReleasedRoundNumbers(excludeRound?: number): number[] {
  const nextRounds = releasedRoundCatalog.map((round) => round.round);

  for (let index = nextRounds.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [nextRounds[index], nextRounds[swapIndex]] = [nextRounds[swapIndex], nextRounds[index]];
  }

  if (excludeRound && nextRounds[0] === excludeRound && nextRounds.length > 1) {
    [nextRounds[0], nextRounds[1]] = [nextRounds[1], nextRounds[0]];
  }

  return nextRounds;
}

export function releasedRoundByNumber(roundNumber: number): ReleasedRoundMeta {
  return releasedRoundCatalog.find((round) => round.round === roundNumber) ?? firstReleasedRound();
}

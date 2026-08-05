export type ParsedQuestionText = {
  stem: string;
  examples: string[];
  markerType: 'none' | 'korean-list' | 'circle-list';
};

export function parseQuestionText(questionText: string): ParsedQuestionText {
  const normalizedText = questionText.trim();
  const itemMatch = normalizedText.match(/\s(?=ㄱ[.．]\s?)/);

  if (itemMatch?.index !== undefined) {
    const stem = normalizedText.slice(0, itemMatch.index).trim();
    const itemText = normalizedText.slice(itemMatch.index).trim();

    return {
      stem,
      examples: itemText
        .split(/\s+(?=[ㄱㄴㄷㄹㅁㅂ][.．]\s?)/)
        .map((item) => item.trim())
        .filter(Boolean),
      markerType: 'korean-list',
    };
  }

  const circleMatch = normalizedText.match(/\s(?=○\s?)/);

  if (circleMatch?.index !== undefined) {
    const stem = normalizedText.slice(0, circleMatch.index).trim();
    const itemText = normalizedText.slice(circleMatch.index).trim();

    return {
      stem,
      examples: itemText
        .split(/\s+(?=○\s?)/)
        .map((item) => item.trim())
        .filter(Boolean),
      markerType: 'circle-list',
    };
  }

  return {
    stem: normalizedText,
    examples: [],
    markerType: 'none',
  };
}

export function expectsExampleBox(questionText: string): boolean {
  return /ㄱ[.．]|○/.test(questionText);
}

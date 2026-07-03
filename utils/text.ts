export function splitParagraphs(raw: string): string[] {
  return raw
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function splitSentences(raw: string): string[] {
  const normalized = raw.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g);
  if (!matches) return [normalized];
  return matches.map((s) => s.trim()).filter((s) => s.length > 0);
}

export function splitWords(raw: string): string[] {
  const matches = raw.match(/[A-Za-z][A-Za-z'-]*/g);
  return matches ?? [];
}

export function toTitleCase(input: string): string {
  const smallWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to",
    "from", "by", "of", "in", "with", "as", "into", "over", "vs",
  ]);
  const words = input.trim().split(/\s+/);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index !== 0 && index !== words.length - 1 && smallWords.has(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function capitalize(input: string): string {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return `${input.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function slugifyHashtag(word: string): string {
  return `#${word.replace(/[^A-Za-z0-9]/g, "")}`;
}

export function wordCount(raw: string): number {
  return splitWords(raw).length;
}

export function estimateReadingSeconds(raw: string, wordsPerMinute = 150): number {
  const words = wordCount(raw);
  return Math.max(5, Math.round((words / wordsPerMinute) * 60));
}

export function isTitleCaseLike(word: string): boolean {
  return /^[A-Z][a-z'.-]*$/.test(word);
}

export function isAcronym(word: string): boolean {
  return /^[A-Z]{2,6}$/.test(word);
}

export function stripTrailingPunctuation(input: string): string {
  return input.replace(/[.!?]+\s*$/, "").trim();
}

export function dedupeCaseInsensitive(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

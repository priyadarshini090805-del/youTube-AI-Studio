import { STOPWORDS } from "@/mock/data/stopwords";
import { splitWords } from "@/utils/text";

const MIN_SAMPLE_WORDS = 8;
const ENGLISH_STOPWORD_RATIO_THRESHOLD = 0.12;

/**
 * Lightweight heuristic language check — measures how densely the text is
 * populated with common English function words. Good enough to flag
 * non-English input for manual review; not a real language identifier.
 */
export function detectLanguage(body: string): string {
  const words = splitWords(body).map((word) => word.toLowerCase());
  if (words.length < MIN_SAMPLE_WORDS) return "Unknown";

  const stopwordHits = words.filter((word) => STOPWORDS.has(word)).length;
  const ratio = stopwordHits / words.length;

  return ratio >= ENGLISH_STOPWORD_RATIO_THRESHOLD ? "English" : "Unknown";
}

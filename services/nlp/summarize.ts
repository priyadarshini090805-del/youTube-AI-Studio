import { splitWords } from "@/utils/text";

/**
 * Produces a short extractive summary from the cleaned body's sentences.
 * This is for the structured Article.summary field only — generators must
 * paraphrase it into natural language rather than quoting it verbatim.
 */
export function summarizeBody(sentences: string[], maxSentences = 2): string {
  const substantive = sentences.filter((sentence) => splitWords(sentence).length >= 6);
  const source = substantive.length > 0 ? substantive : sentences;
  return source.slice(0, maxSentences).join(" ").trim();
}

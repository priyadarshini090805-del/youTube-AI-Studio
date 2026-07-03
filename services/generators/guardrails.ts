import type { ContentCategory } from "@/mock/data/categoryKeywords";
import { NEWSROOM_ONLY_PHRASES } from "@/mock/data/qualityLexicon";

export function findNewsroomClicheLeaks(category: ContentCategory, output: unknown): string[] {
  if (category === "news") return [];

  const serialized = JSON.stringify(output).toLowerCase();
  return NEWSROOM_ONLY_PHRASES.filter((phrase) => serialized.includes(phrase.toLowerCase()));
}

import { CATEGORY_KEYWORDS, type ContentCategory } from "@/mock/data/categoryKeywords";

const SCOREABLE_CATEGORIES = Object.keys(CATEGORY_KEYWORDS) as Exclude<ContentCategory, "general">[];

// A single matching keyword is weak evidence — common English words overlap
// with topical jargon (e.g. "over" is both a cricket term and an everyday
// preposition). Require at least two distinct topical terms before
// committing to a specific category; otherwise fall back to "general".
const MIN_DISTINCT_KEYWORD_MATCHES = 2;

export function classifyCategory(text: string): ContentCategory {
  const lower = text.toLowerCase();
  const scores: Record<Exclude<ContentCategory, "general">, number> = {
    sports: 0,
    news: 0,
    business: 0,
    technology: 0,
    educational: 0,
  };

  for (const category of SCOREABLE_CATEGORIES) {
    for (const keyword of CATEGORY_KEYWORDS[category]) {
      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(lower)) scores[category] += 1;
    }
  }

  let bestCategory: ContentCategory = "general";
  let bestScore = 0;
  for (const category of SCOREABLE_CATEGORIES) {
    if (scores[category] > bestScore) {
      bestScore = scores[category];
      bestCategory = category;
    }
  }

  return bestScore >= MIN_DISTINCT_KEYWORD_MATCHES ? bestCategory : "general";
}

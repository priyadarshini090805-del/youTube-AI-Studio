import { STOPWORDS, COMMON_SENTENCE_STARTERS, META_NOISE_WORDS } from "@/mock/data/stopwords";
import { LOCATION_LOOKUP, KNOWN_LOCATIONS } from "@/mock/data/locations";
import {
  HONORIFICS,
  HONORIFIC_PATTERN,
  ORG_SUFFIXES,
  KNOWN_ORG_ACRONYMS,
  VENUE_PATTERN,
  VENUE_SUFFIXES,
} from "@/mock/data/honorifics";
import { KNOWN_BRANDS } from "@/mock/data/brands";
import { CATEGORY_KEYWORDS, CATEGORY_LABELS, type ContentCategory } from "@/mock/data/categoryKeywords";
import { classifyCategory } from "./classifyCategory";
import { classifyContentType } from "./classifyContentType";
import { preprocessArticle } from "./preprocessArticle";
import { summarizeBody } from "./summarize";
import { detectLanguage } from "./detectLanguage";
import { splitSentences, splitParagraphs, splitWords, dedupeCaseInsensitive } from "@/utils/text";
import type { Article, ArticleAnalysis, ExtractedNumberFact, ExtractedQuote } from "@/types/article";

const DATE_PATTERNS: RegExp[] = [
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?\b/gi,
  /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+\d{4})?\b/gi,
  /\b\d{4}-\d{2}-\d{2}\b/g,
  /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
  /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/g,
  /\b(?:yesterday|today|tomorrow|last week|this week|next week|last month|this month|next month|last year|this year)\b/gi,
];

const NUMBER_UNIT_PATTERN =
  /\b(\d[\d,]*\.?\d*)\s*(wickets?|runs?|overs?|percent|per cent|%|crore|lakh|million|billion|goals?|points?|votes?|seats?|matches?|years?|days?|hours?|minutes?|balls?|centuries?)\b/gi;

const QUOTE_PATTERN = /["“]([^"”]{8,220})["”]/g;
const ATTRIBUTION_PATTERN =
  /\b([A-Z][a-zA-Z'-]*(?:\s+[A-Z][a-zA-Z'-]*){0,2})\s+(?:said|stated|told|added|claimed|explained|noted|announced)\b/;
const ATTRIBUTION_PATTERN_TRAILING =
  /(?:said|stated|told reporters|added|claimed|explained|noted|announced)\s+([A-Z][a-zA-Z'-]*(?:\s+[A-Z][a-zA-Z'-]*){0,2})/;

function extractKeywords(text: string, categoryHint: ContentCategory): string[] {
  const words = splitWords(text);
  const freq = new Map<string, number>();
  for (const word of words) {
    const lower = word.toLowerCase();
    if (lower.length < 4 || STOPWORDS.has(lower) || META_NOISE_WORDS.has(lower)) continue;
    freq.set(lower, (freq.get(lower) ?? 0) + 1);
  }

  const categoryBoost =
    categoryHint === "general"
      ? new Set<string>()
      : new Set(CATEGORY_KEYWORDS[categoryHint].map((k) => k.toLowerCase()));
  const scored = Array.from(freq.entries()).map(([word, count]) => {
    const boosted = categoryBoost.has(word) ? count + 3 : count;
    return { word, score: boosted };
  });

  scored.sort((a, b) => b.score - a.score);
  const ranked = scored.map((entry) => entry.word);
  return dedupeCaseInsensitive(ranked).slice(0, 12);
}

function extractPeople(text: string): string[] {
  const found: string[] = [];
  let match: RegExpExecArray | null;
  const pattern = new RegExp(HONORIFIC_PATTERN.source, "g");
  while ((match = pattern.exec(text)) !== null) {
    found.push(match[2].trim());
  }

  const honorificFirstWords = new Set(HONORIFICS.map((word) => word.split(" ")[0].replace(".", "")));
  const bigramPattern = /\b([A-Z][a-zA-Z'-]+\s[A-Z][a-zA-Z'-]+)\b/g;
  const bigramCounts = new Map<string, number>();
  let bigramMatch: RegExpExecArray | null;
  while ((bigramMatch = bigramPattern.exec(text)) !== null) {
    const phrase = bigramMatch[1];
    const firstWord = phrase.split(" ")[0];
    const lastWord = phrase.split(" ").at(-1) ?? "";
    if (LOCATION_LOOKUP.has(phrase.toLowerCase())) continue;
    if (COMMON_SENTENCE_STARTERS.has(firstWord)) continue;
    if (ORG_SUFFIXES.some((suffix) => phrase.endsWith(suffix))) continue;
    if (VENUE_SUFFIXES.includes(lastWord)) continue;
    if (honorificFirstWords.has(firstWord)) continue;
    bigramCounts.set(phrase, (bigramCounts.get(phrase) ?? 0) + 1);
  }
  for (const [phrase] of bigramCounts) {
    found.push(phrase);
  }

  return dedupeCaseInsensitive(found).slice(0, 8);
}

function extractLocations(text: string): string[] {
  const found: string[] = [];
  for (const location of KNOWN_LOCATIONS) {
    const pattern = new RegExp(`\\b${location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (pattern.test(text)) {
      found.push(location);
    }
  }

  const venuePattern = new RegExp(VENUE_PATTERN.source, "g");
  let venueMatch: RegExpExecArray | null;
  while ((venueMatch = venuePattern.exec(text)) !== null) {
    found.push(venueMatch[1].trim());
  }

  return dedupeCaseInsensitive(found).slice(0, 8);
}

function extractOrganizations(text: string): string[] {
  const found: string[] = [];

  const suffixPattern = new RegExp(
    `\\b([A-Z][a-zA-Z'-]*(?:\\s+[A-Z][a-zA-Z'-]*){0,3}\\s+(?:${ORG_SUFFIXES.join("|")}))\\b`,
    "g",
  );
  let match: RegExpExecArray | null;
  while ((match = suffixPattern.exec(text)) !== null) {
    found.push(match[1].trim());
  }

  const acronymPattern = /\b[A-Z]{2,6}\b/g;
  let acronymMatch: RegExpExecArray | null;
  while ((acronymMatch = acronymPattern.exec(text)) !== null) {
    if (KNOWN_ORG_ACRONYMS.has(acronymMatch[0])) {
      found.push(acronymMatch[0]);
    }
  }

  for (const brand of KNOWN_BRANDS) {
    const pattern = new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (pattern.test(text)) {
      found.push(brand);
    }
  }

  return dedupeCaseInsensitive(found).slice(0, 8);
}

function extractDates(text: string): string[] {
  const found: string[] = [];
  for (const pattern of DATE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) found.push(...matches);
  }
  return dedupeCaseInsensitive(found).slice(0, 8);
}

function extractNumbers(text: string): ExtractedNumberFact[] {
  const found: ExtractedNumberFact[] = [];
  let match: RegExpExecArray | null;
  const pattern = new RegExp(NUMBER_UNIT_PATTERN.source, "gi");
  while ((match = pattern.exec(text)) !== null) {
    const value = Number(match[1].replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    found.push({ raw: match[0].trim(), value, unit: match[2].toLowerCase() });
  }
  return found.slice(0, 10);
}

function extractQuotes(text: string): ExtractedQuote[] {
  const found: ExtractedQuote[] = [];
  let match: RegExpExecArray | null;
  const pattern = new RegExp(QUOTE_PATTERN.source, "g");
  while ((match = pattern.exec(text)) !== null) {
    const quoteText = match[1].trim();
    const windowStart = Math.max(0, match.index - 60);
    const windowEnd = Math.min(text.length, match.index + match[0].length + 60);
    const window = text.slice(windowStart, windowEnd);
    const attribution =
      window.match(ATTRIBUTION_PATTERN)?.[1] ?? window.match(ATTRIBUTION_PATTERN_TRAILING)?.[1] ?? null;
    found.push({ text: quoteText, attribution });
  }
  return found.slice(0, 6);
}

export function analyzeArticle(rawInput: string): ArticleAnalysis {
  const { title, body } = preprocessArticle(rawInput);

  const paragraphs = splitParagraphs(body);
  const sentences = splitSentences(body);
  const category = classifyCategory(body);
  const words = splitWords(body);
  const contentType = classifyContentType(body, category);

  const article: Article = {
    title,
    summary: summarizeBody(sentences),
    contentType,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    keywords: extractKeywords(body, category),
    entities: {
      people: extractPeople(body),
      locations: extractLocations(body),
      organizations: extractOrganizations(body),
      dates: extractDates(body),
      numbers: extractNumbers(body),
      quotes: extractQuotes(body),
    },
    readingTimeSeconds: Math.max(20, Math.round((words.length / 150) * 60)),
    language: detectLanguage(body),
  };

  return { article, body, sentences, paragraphs, wordCount: words.length };
}

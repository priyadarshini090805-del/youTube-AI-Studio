import type { ContentCategory } from "@/mock/data/categoryKeywords";

export type ContentType =
  | "news_report"
  | "research_summary"
  | "tutorial"
  | "review"
  | "analysis"
  | "explainer"
  | "narrative";

export interface ExtractedQuote {
  text: string;
  attribution: string | null;
}

export interface ExtractedNumberFact {
  raw: string;
  value: number;
  unit: string | null;
}

export interface ArticleEntities {
  people: string[];
  locations: string[];
  organizations: string[];
  dates: string[];
  numbers: ExtractedNumberFact[];
  quotes: ExtractedQuote[];
}

/**
 * The structured, cleaned representation of an article. This is the only
 * shape content generators (title, thumbnail, hook, scripts, description,
 * SEO, hashtags, chapters, community post, pinned comment) are allowed to
 * read from — never the raw pasted input or its sentence-level text.
 */
export interface Article {
  title: string;
  summary: string;
  contentType: ContentType;
  category: ContentCategory;
  categoryLabel: string;
  keywords: string[];
  entities: ArticleEntities;
  readingTimeSeconds: number;
  language: string;
}

/**
 * Internal working object produced by the preprocessing pipeline. Carries
 * the cleaned (noise-stripped) body and sentence breakdown needed for
 * prose-level editorial linting. Only the Quality Checker reads the raw
 * body/sentences directly — every other generator receives `.article`.
 */
export interface ArticleAnalysis {
  article: Article;
  body: string;
  sentences: string[];
  paragraphs: string[];
  wordCount: number;
}

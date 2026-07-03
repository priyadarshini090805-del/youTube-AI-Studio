import type { ContentCategory } from "@/mock/data/categoryKeywords";
import type { ContentType } from "@/types/article";

const TUTORIAL_PATTERN = /\bhow to\b|\bstep\s+\d|\btips? for\b|\bguide to\b/i;
const REVIEW_PATTERN = /\breview\b/i;
const REVIEW_CONFIRM_PATTERN = /\b(verdict|rating|pros and cons|hands-on|out of (five|ten|5|10))\b/i;
const RESEARCH_PATTERN = /\b(study|studies|research|researchers|published in|findings show|according to (a|the) study)\b/i;

export function classifyContentType(body: string, category: ContentCategory): ContentType {
  if (TUTORIAL_PATTERN.test(body)) return "tutorial";
  if (REVIEW_PATTERN.test(body) && REVIEW_CONFIRM_PATTERN.test(body)) return "review";
  if (RESEARCH_PATTERN.test(body)) return "research_summary";
  if (category === "business") return "analysis";
  if (category === "news" || category === "sports") return "news_report";
  if (category === "educational") return "explainer";
  return "narrative";
}

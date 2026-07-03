import type { Article, ContentType } from "@/types/article";
import type { ContentCategory } from "@/mock/data/categoryKeywords";
import type { Chapter, ChaptersResult } from "@/types/generation";
import { toTitleCase } from "@/utils/text";

function tutorialLabels(): string[] {
  return ["Introduction", "What You'll Need", "Step-by-Step Walkthrough", "Common Mistakes", "Pro Tips", "Recap"];
}

function researchLabels(): string[] {
  return ["Introduction", "The Core Concept", "How It Works", "The Evidence", "Real-World Example", "Key Takeaways"];
}

const CATEGORY_LABEL_BANKS: Record<Exclude<ContentCategory, "educational">, string[]> = {
  news: ["Introduction", "What Happened", "Key Details", "Reaction", "What's Next", "Closing Thoughts"],
  sports: ["Pre-Match Context", "Build-Up", "Key Moment", "Turning Point", "Final Scoreline", "Post-Match Reaction"],
  technology: ["Overview", "What's New", "Under the Hood", "Performance", "Should You Care", "Final Verdict"],
  business: ["Overview", "The Numbers", "Market Context", "Analyst Reaction", "Outlook"],
  general: ["Introduction", "Overview", "Key Details", "Context", "Closing Thoughts"],
};

function labelBankFor(category: ContentCategory, contentType: ContentType): string[] {
  if (category === "educational") {
    return contentType === "tutorial" ? tutorialLabels() : researchLabels();
  }
  return CATEGORY_LABEL_BANKS[category];
}

function formatTimestamp(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}:${String(remMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${remMinutes}:${String(seconds).padStart(2, "0")}`;
}

export function generateChapters(article: Article): ChaptersResult {
  const labels = labelBankFor(article.category, article.contentType);
  const totalSeconds = Math.max(180, article.readingTimeSeconds + 60);
  const count = Math.min(labels.length, Math.max(4, Math.round(totalSeconds / 55)));
  const selectedLabels = labels.slice(0, count);

  const keywordPool = article.keywords.slice(0, 3).map(toTitleCase);

  const chapters: Chapter[] = selectedLabels.map((label, index) => {
    const timeOffset = Math.round((index / selectedLabels.length) * totalSeconds);
    const isBookend = index === 0 || index === selectedLabels.length - 1;
    const keyword = !isBookend ? keywordPool[(index - 1) % Math.max(keywordPool.length, 1)] : undefined;
    const title = keyword ? `${label}: ${keyword}` : label;
    return { timestamp: formatTimestamp(timeOffset), title };
  });

  const deduped: Chapter[] = [];
  const seenTimestamps = new Set<string>();
  for (const chapter of chapters) {
    if (seenTimestamps.has(chapter.timestamp)) continue;
    seenTimestamps.add(chapter.timestamp);
    deduped.push(chapter);
  }

  return { chapters: deduped };
}

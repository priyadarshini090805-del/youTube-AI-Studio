import type { Article } from "@/types/article";
import type { HashtagsResult } from "@/types/generation";
import { buildHashtagPool, pickManyVariant, generateByCategory, type CategoryGeneratorMap } from "./shared";

const CATEGORY_BONUS_TAGS: CategoryGeneratorMap<string[]> = {
  educational: (article) =>
    article.contentType === "tutorial"
      ? ["#HowTo", "#Tutorial", "#StepByStep"]
      : ["#Explained", "#Learn", "#DidYouKnow"],
  news: () => ["#News", "#BreakingNews"],
  sports: () => ["#Sports", "#Highlights"],
  technology: () => ["#Tech", "#TechNews"],
  business: () => ["#Business", "#Markets"],
  general: () => ["#Trending"],
};

export function generateHashtags(article: Article, variant = 0): HashtagsResult {
  const pool = Array.from(
    new Set([...buildHashtagPool(article), ...generateByCategory(article, CATEGORY_BONUS_TAGS)]),
  );
  const count = Math.min(10, pool.length);
  return { hashtags: pickManyVariant(pool, count, article, "hashtags", variant) };
}

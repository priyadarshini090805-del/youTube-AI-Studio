import type { Article } from "@/types/article";
import type { CommunityPostResult } from "@/types/generation";
import {
  primarySubject,
  getMatchup,
  keyNumberFact,
  formatNumberFact,
  pickManyVariant,
  generateByCategory,
  type CategoryGeneratorMap,
} from "./shared";

function educationalPosts(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `New video breaking down ${subject} — link in bio. What part should we cover next?`,
    `Quick poll: did you already know how ${subject} works? Let us know below.`,
    `This ${article.categoryLabel.toLowerCase()} topic surprised us. Full explainer is live now.`,
  ];
}

function newsPosts(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `New video breaking down everything on ${subject} — link in bio. What questions do you have?`,
    `This developing story is moving fast. Drop your take below.`,
    `Full coverage of ${article.title} is live now. Let us know what stood out to you.`,
  ];
}

function sportsPosts(article: Article): string[] {
  const matchup = getMatchup(article);
  const fact = keyNumberFact(article);
  const candidates: string[] = [];
  if (matchup) candidates.push(`${matchup.teamA} or ${matchup.teamB} — who do you think came out on top? 👇`);
  if (fact) candidates.push(`${formatNumberFact(fact)}. That's the number of the day. Thoughts?`);
  candidates.push(`Full match recap is live. Who was your player of the match?`);
  return candidates;
}

function technologyPosts(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `Full review of ${subject} is live now. Are you getting one?`,
    `Quick poll: excited about ${subject}, or skeptical? Drop your take.`,
    `New breakdown of ${subject} is up — what should we test next?`,
  ];
}

function businessPosts(article: Article): string[] {
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const candidates = [`New analysis on ${subject} is live — what's your read on this move?`];
  if (fact) candidates.push(`${formatNumberFact(fact)}. Here's what that number actually means.`);
  candidates.push(`Full breakdown of ${subject}'s latest numbers is up now.`);
  return candidates;
}

function generalPosts(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `New video on ${subject} is live now. Let us know what you think.`,
    `This one surprised us. Full video linked in bio.`,
  ];
}

const COMMUNITY_GENERATORS: CategoryGeneratorMap<string[]> = {
  educational: educationalPosts,
  news: newsPosts,
  sports: sportsPosts,
  technology: technologyPosts,
  business: businessPosts,
  general: generalPosts,
};

export function generateCommunityPost(article: Article, variant = 0): CommunityPostResult {
  const pool = Array.from(new Set(generateByCategory(article, COMMUNITY_GENERATORS)));
  return { posts: pickManyVariant(pool, Math.min(3, pool.length), article, "community", variant) };
}

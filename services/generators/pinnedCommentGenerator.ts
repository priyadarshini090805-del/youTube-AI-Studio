import type { Article } from "@/types/article";
import type { PinnedCommentResult } from "@/types/generation";
import { stripTrailingPunctuation } from "@/utils/text";
import {
  primarySubject,
  getMatchup,
  pickManyVariant,
  generateByCategory,
  type CategoryGeneratorMap,
} from "./shared";

function educationalComments(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `📌 Sources and further reading on ${subject} are linked in the description. Questions? Drop them below.`,
    `📌 Some figures here come from the cited research — always worth checking the original source for full context.`,
    `📌 Which part of this explanation should we go deeper on next time?`,
  ];
}

function newsComments(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `📌 Thanks for watching! Sources for this story are linked in the description. Let us know your thoughts on ${subject} below.`,
    `📌 Some details in this story are still developing — we'll update this video and pin any corrections here.`,
    `📌 Questions about ${stripTrailingPunctuation(article.title)}? Drop them below and we'll answer the top ones in our next video.`,
  ];
}

function sportsComments(article: Article): string[] {
  const matchup = getMatchup(article);
  const candidates: string[] = [
    `📌 Thanks for watching! Full match sourcing is linked in the description.`,
  ];
  if (matchup) candidates.push(`📌 ${matchup.teamA} vs ${matchup.teamB} — full timestamps in the description. Who's your pick going forward?`);
  candidates.push(`📌 Who was your player of the match? Drop your pick below.`);
  return candidates;
}

function technologyComments(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `📌 Full specs and sourcing for ${subject} are linked in the description.`,
    `📌 Thinking about picking one up? Drop your questions below and we'll cover them next.`,
  ];
}

function businessComments(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `📌 Sourcing for every figure mentioned about ${subject} is linked in the description.`,
    `📌 Not financial advice — always verify figures independently before making decisions.`,
  ];
}

function generalComments(article: Article): string[] {
  const subject = primarySubject(article);
  return [`📌 Thanks for watching! More context on ${subject} is linked in the description.`];
}

const PINNED_COMMENT_GENERATORS: CategoryGeneratorMap<string[]> = {
  educational: educationalComments,
  news: newsComments,
  sports: sportsComments,
  technology: technologyComments,
  business: businessComments,
  general: generalComments,
};

export function generatePinnedComment(article: Article, variant = 0): PinnedCommentResult {
  const pool = Array.from(new Set(generateByCategory(article, PINNED_COMMENT_GENERATORS)));
  return { comments: pickManyVariant(pool, Math.min(3, pool.length), article, "pinned-comment", variant) };
}

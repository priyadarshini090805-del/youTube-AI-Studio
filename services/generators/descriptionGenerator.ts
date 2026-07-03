import type { Article } from "@/types/article";
import type { DescriptionResult } from "@/types/generation";
import { stripTrailingPunctuation } from "@/utils/text";
import {
  primarySubject,
  getMatchup,
  topKeywordPhrase,
  buildHashtagPool,
  generateByCategory,
  type CategoryGeneratorMap,
} from "./shared";

function buildBody(article: Article, intro: string, closingLine: string): string {
  const subject = primarySubject(article);
  const keywordPhrase = topKeywordPhrase(article, 4);
  const location = article.entities.locations[0];

  return [
    intro,
    "",
    article.summary || article.title,
    "",
    `In this video, we cover the key details around ${subject}${location ? ` in ${location}` : ""}, including ${keywordPhrase || "the latest updates"}.`,
    "",
    closingLine,
    "",
    "Subscribe for more content like this.",
    "",
    buildHashtagPool(article).slice(0, 6).join(" "),
  ].join("\n");
}

function educationalDescription(article: Article): DescriptionResult {
  const title = stripTrailingPunctuation(article.title);
  const isTutorial = article.contentType === "tutorial";
  return {
    short: isTutorial ? `${title} — a step-by-step walkthrough.` : `${title} — explained simply.`,
    full: buildBody(
      article,
      article.title,
      isTutorial
        ? "Timestamps for each step are in the pinned comment."
        : "Timestamps for each concept are in the pinned comment.",
    ),
  };
}

function newsDescription(article: Article): DescriptionResult {
  return {
    short: `${stripTrailingPunctuation(article.title)} — full coverage and analysis.`,
    full: buildBody(article, article.title, "Timestamps and full sourcing are in the pinned comment."),
  };
}

function sportsDescription(article: Article): DescriptionResult {
  const matchup = getMatchup(article);
  return {
    short: matchup ? `${matchup.teamA} vs ${matchup.teamB}: ${article.title}` : article.title,
    full: buildBody(article, article.title, "Full match timestamps are in the pinned comment."),
  };
}

function technologyDescription(article: Article): DescriptionResult {
  return {
    short: `${stripTrailingPunctuation(article.title)} — full breakdown.`,
    full: buildBody(article, article.title, "Spec and feature timestamps are in the pinned comment."),
  };
}

function businessDescription(article: Article): DescriptionResult {
  return {
    short: `${stripTrailingPunctuation(article.title)} — what the numbers mean.`,
    full: buildBody(article, article.title, "Sourcing for every figure mentioned is in the pinned comment."),
  };
}

function generalDescription(article: Article): DescriptionResult {
  return {
    short: article.title,
    full: buildBody(article, article.title, "More context is in the pinned comment."),
  };
}

const DESCRIPTION_GENERATORS: CategoryGeneratorMap<DescriptionResult> = {
  educational: educationalDescription,
  news: newsDescription,
  sports: sportsDescription,
  technology: technologyDescription,
  business: businessDescription,
  general: generalDescription,
};

export function generateDescription(article: Article): DescriptionResult {
  return generateByCategory(article, DESCRIPTION_GENERATORS);
}

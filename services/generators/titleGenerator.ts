import type { Article } from "@/types/article";
import type { TitleResult } from "@/types/generation";
import { truncate, stripTrailingPunctuation } from "@/utils/text";
import {
  primarySubject,
  secondarySubject,
  getMatchup,
  keyNumberFact,
  formatNumberFact,
  pickManyVariant,
  generateByCategory,
  type CategoryGeneratorMap,
} from "./shared";

function educationalTitles(article: Article): string[] {
  const subject = primarySubject(article);
  const title = stripTrailingPunctuation(article.title);
  const keyword = article.keywords[0];

  if (article.contentType === "tutorial") {
    return [
      `How ${subject} Actually Works`,
      `${title} — Step by Step`,
      `A Beginner's Guide to ${subject}`,
      keyword ? `${subject}: Mastering ${keyword}` : `${subject}: A Practical Guide`,
      `${title}, Explained in Under 10 Minutes`,
    ];
  }

  if (article.contentType === "research_summary") {
    return [
      `What the Research Actually Says About ${subject}`,
      `${title} — Here's What the Study Found`,
      `The Science Behind ${subject}`,
      `New Research on ${subject}: What You Didn't Know`,
      `${subject}: The Evidence Explained`,
    ];
  }

  return [
    `Understanding ${subject}: What the Research Shows`,
    `${title} — Explained Simply`,
    `The Science Behind ${subject}`,
    `${subject}: What You Didn't Know`,
    `A Beginner's Guide to ${subject}`,
  ];
}

function newsTitles(article: Article): string[] {
  const subject = primarySubject(article);
  const secondary = secondarySubject(article);
  const title = stripTrailingPunctuation(article.title);
  return [
    `${title}`,
    `${subject}: What This Means for ${secondary ?? "the Country"}`,
    `Inside ${subject}'s Next Move — ${article.categoryLabel} Update`,
    `${title} | Full Breakdown`,
    `Breaking Down ${title}`,
    `${title} — What Happens Next`,
  ];
}

function sportsTitles(article: Article): string[] {
  const matchup = getMatchup(article);
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const title = stripTrailingPunctuation(article.title);
  const candidates: string[] = [];

  if (matchup) {
    candidates.push(`${matchup.teamA} vs ${matchup.teamB}: ${title}`);
    candidates.push(`${matchup.teamA} STUN ${matchup.teamB} — Full Recap`);
    if (fact) candidates.push(`${matchup.teamA} Beat ${matchup.teamB} — ${formatNumberFact(fact)} Explained`);
  }
  candidates.push(`How ${subject} Sealed the Win`);
  candidates.push(`${title} — Match Highlights & Analysis`);
  candidates.push(`${subject} Delivers a Statement Performance`);
  return candidates;
}

function technologyTitles(article: Article): string[] {
  const subject = primarySubject(article);
  const title = stripTrailingPunctuation(article.title);
  return [
    `${subject}: Everything You Need to Know`,
    `Is ${subject} Worth the Hype?`,
    `${title} — Full Breakdown`,
    `Inside ${subject}: What's New`,
    `${subject} Just Changed the Game — Here's How`,
    `${title}: Specs, Features, and Verdict`,
  ];
}

function businessTitles(article: Article): string[] {
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const title = stripTrailingPunctuation(article.title);
  const candidates = [
    `${subject}: The Numbers Behind the Story`,
    `What ${subject}'s Latest Move Means for the Market`,
    `${title} — Business Breakdown`,
    `Inside ${subject}'s Strategy`,
    `${subject}: Winners and Losers`,
  ];
  if (fact) candidates.push(`${subject} Reports ${formatNumberFact(fact)} — Here's Why It Matters`);
  return candidates;
}

function generalTitles(article: Article): string[] {
  const subject = primarySubject(article);
  const title = stripTrailingPunctuation(article.title);
  return [
    `${title}`,
    `${subject}: What You Need to Know`,
    `Understanding ${title}`,
    `${subject}, Explained`,
    `The Story Behind ${title}`,
  ];
}

const TITLE_GENERATORS: CategoryGeneratorMap<string[]> = {
  educational: educationalTitles,
  news: newsTitles,
  sports: sportsTitles,
  technology: technologyTitles,
  business: businessTitles,
  general: generalTitles,
};

export function generateTitles(article: Article, variant = 0): TitleResult {
  const candidates = Array.from(
    new Set(generateByCategory(article, TITLE_GENERATORS).map((title) => truncate(title, 95))),
  );
  const count = Math.min(5, candidates.length);
  return { titles: pickManyVariant(candidates, count, article, "title", variant) };
}

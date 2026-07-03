import type { Article } from "@/types/article";
import type { ContentCategory } from "@/mock/data/categoryKeywords";
import type { ShortsScriptResult } from "@/types/generation";
import { estimateReadingSeconds, stripTrailingPunctuation } from "@/utils/text";
import { primarySubject, getMatchup, keyNumberFact, formatNumberFact, topKeywordPhrase, pickVariant } from "./shared";

interface ShortsPlan {
  hook: string;
  beats: string[];
  callToAction: string;
}

type ShortsFn = (article: Article, variant: number) => ShortsPlan;

function newsShorts(article: Article, variant: number): ShortsPlan {
  const fact = keyNumberFact(article);
  return {
    hook: pickVariant(
      ["You need to see this before it's everywhere.", "This just happened, and it's big.", "Wait for the number on this one."],
      article,
      "shorts-hook-news",
      variant,
    ),
    beats: [
      `${stripTrailingPunctuation(article.title)}.`,
      fact ? `The key number: ${formatNumberFact(fact)}.` : `Developing story — here's what we know.`,
    ],
    callToAction: pickVariant(
      ["Follow for full coverage.", "Full breakdown on our channel now.", "Comment what you think happens next."],
      article,
      "shorts-cta-news",
      variant,
    ),
  };
}

function sportsShorts(article: Article, variant: number): ShortsPlan {
  const matchup = getMatchup(article);
  const fact = keyNumberFact(article);
  return {
    hook: pickVariant(
      ["This finish was UNREAL.", "Nobody expected this.", "Wait for the stat on this one."],
      article,
      "shorts-hook-sports",
      variant,
    ),
    beats: [
      matchup ? `${matchup.teamA} vs ${matchup.teamB} — here's what happened.` : `${stripTrailingPunctuation(article.title)}.`,
      fact ? `The stat of the day: ${formatNumberFact(fact)}.` : `A performance worth watching twice.`,
    ],
    callToAction: pickVariant(
      ["Follow for match recaps daily.", "Full highlights on our channel.", "Comment your player of the match."],
      article,
      "shorts-cta-sports",
      variant,
    ),
  };
}

function educationalShorts(article: Article, variant: number): ShortsPlan {
  const subject = primarySubject(article);
  const keywords = topKeywordPhrase(article, 2);
  return {
    hook: pickVariant(
      [`You've been thinking about ${subject} wrong.`, "This will only take a minute to understand.", "Here's a concept worth knowing."],
      article,
      "shorts-hook-edu",
      variant,
    ),
    beats: [
      `Today's topic: ${subject}.`,
      keywords ? `The key idea: it comes down to ${keywords}.` : `Here's the part that matters most.`,
    ],
    callToAction: pickVariant(
      ["Follow for more explained simply.", "Full lesson on our channel.", "Comment if this made it click."],
      article,
      "shorts-cta-edu",
      variant,
    ),
  };
}

function technologyShorts(article: Article, variant: number): ShortsPlan {
  const subject = primarySubject(article);
  const keywords = topKeywordPhrase(article, 2);
  return {
    hook: pickVariant(
      [`${subject} just dropped, and here's what matters.`, "Is this actually worth the hype?", "Here's what nobody's talking about."],
      article,
      "shorts-hook-tech",
      variant,
    ),
    beats: [
      `${subject} — here's the quick take.`,
      keywords ? `What matters most: ${keywords}.` : `The details that actually matter.`,
    ],
    callToAction: pickVariant(
      ["Follow for the full breakdown.", "Full review on our channel.", "Comment if you're getting one."],
      article,
      "shorts-cta-tech",
      variant,
    ),
  };
}

function businessShorts(article: Article, variant: number): ShortsPlan {
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  return {
    hook: pickVariant(
      [`${subject} just made a big move.`, "Here's what the numbers actually mean.", "Wait for this stat."],
      article,
      "shorts-hook-biz",
      variant,
    ),
    beats: [
      `${subject} — here's the quick take.`,
      fact ? `The headline number: ${formatNumberFact(fact)}.` : `Here's what it means going forward.`,
    ],
    callToAction: pickVariant(
      ["Follow for daily market breakdowns.", "Full analysis on our channel.", "Comment your take on this one."],
      article,
      "shorts-cta-biz",
      variant,
    ),
  };
}

function generalShorts(article: Article): ShortsPlan {
  const subject = primarySubject(article);
  return {
    hook: `Here's what you need to know about ${subject}.`,
    beats: [`${stripTrailingPunctuation(article.title)}.`],
    callToAction: "Follow for more like this.",
  };
}

const SHORTS_GENERATORS: Record<ContentCategory, ShortsFn> = {
  news: newsShorts,
  sports: sportsShorts,
  educational: educationalShorts,
  technology: technologyShorts,
  business: businessShorts,
  general: (article) => generalShorts(article),
};

export function generateShortsScript(article: Article, variant = 0): ShortsScriptResult {
  const plan = SHORTS_GENERATORS[article.category](article, variant);
  const captionOverlay = [plan.hook.toUpperCase(), ...plan.beats.map((beat) => beat.toUpperCase()), plan.callToAction.toUpperCase()];
  const script = [plan.hook, ...plan.beats, plan.callToAction].join(" ");

  return {
    hook: plan.hook,
    beats: plan.beats,
    captionOverlay,
    callToAction: plan.callToAction,
    estimatedDurationSeconds: Math.min(59, estimateReadingSeconds(script, 170)),
  };
}

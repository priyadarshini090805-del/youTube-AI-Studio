import type { Article } from "@/types/article";
import type { ContentCategory } from "@/mock/data/categoryKeywords";
import type { VoiceoverScriptResult } from "@/types/generation";
import { estimateReadingSeconds, stripTrailingPunctuation } from "@/utils/text";
import { primarySubject, secondarySubject, getMatchup, keyNumberFact, formatNumberFact, topKeywordPhrase, pickVariant } from "./shared";

type ScriptFn = (article: Article, variant: number) => string;

function newsScript(article: Article, variant: number): string {
  const subject = primarySubject(article);
  const location = article.entities.locations[0];
  const fact = keyNumberFact(article);
  const keywords = topKeywordPhrase(article, 2);
  const opener = pickVariant(
    [
      "It's a developing story, and here's everything you need to know.",
      "Let's break down exactly what happened, step by step.",
      "Here's the full picture on the story everyone's talking about.",
    ],
    article,
    "vo-opener-news",
    variant,
  );
  const outro = pickVariant(
    [
      "We'll keep watching this story closely and bring you the next update as soon as it lands.",
      "That's where things stand for now — more updates as this story develops.",
      "As always, we'll be back with full coverage the moment there's more to report.",
    ],
    article,
    "vo-outro-news",
    variant,
  );

  return [
    `${opener} ${stripTrailingPunctuation(article.title)}.`,
    `${subject}${location ? ` in ${location}` : ""} is at the center of this developing story${keywords ? `, tied closely to ${keywords}` : ""}.`,
    fact
      ? `The number driving the conversation is ${formatNumberFact(fact)} — a figure that puts the story into context.`
      : "We're still confirming several details, and we'll flag anything that needs a second look.",
    outro,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function sportsScript(article: Article, variant: number): string {
  const matchup = getMatchup(article);
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const opener = pickVariant(
    [
      "It was that kind of contest — the one you don't want to look away from.",
      "Let's walk through exactly how this one played out.",
      "This was a performance that deserves a proper breakdown.",
    ],
    article,
    "vo-opener-sports",
    variant,
  );

  return [
    `${opener} ${matchup ? `${matchup.teamA} against ${matchup.teamB}.` : stripTrailingPunctuation(article.title) + "."}`,
    `${subject} set the tone early, and the contest built from there into something worth talking about.`,
    fact ? `The number that sums it up: ${formatNumberFact(fact)}.` : `${subject} was the story of the day.`,
    `That's the recap — a result that will be talked about for a while.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function educationalScript(article: Article, variant: number): string {
  const subject = primarySubject(article);
  const keywords = topKeywordPhrase(article, 3);
  const isTutorial = article.contentType === "tutorial";
  const opener = pickVariant(
    [
      "Let's take this one step at a time.",
      "Here's a topic that's simpler than it sounds once you break it down.",
      "By the end of this, the concept will click.",
    ],
    article,
    "vo-opener-edu",
    variant,
  );

  const middle = isTutorial
    ? `The process comes down to a short sequence of steps. Get the order right, and the rest follows naturally.`
    : `So what does that actually mean in practice? ${keywords ? `It comes back to ${keywords}` : "It comes back to a few core ideas"}, and once those click, the rest follows.`;

  return [
    `${opener} Today we're exploring ${subject}.`,
    middle,
    `Quick note: verify any dates, figures, or named sources here against the original source before treating them as confirmed.`,
    `That's the core idea behind ${subject} — hopefully a little clearer now than when we started.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function technologyScript(article: Article, variant: number): string {
  const subject = primarySubject(article);
  const keywords = topKeywordPhrase(article, 2);
  const opener = pickVariant(
    [
      "Let's get straight into what's new.",
      "There's a lot packed into this one, so let's break it down.",
      "Here's the rundown, no marketing fluff.",
    ],
    article,
    "vo-opener-tech",
    variant,
  );

  return [
    `${opener} We're looking at ${subject}.`,
    `Here's what actually stands out: the work on ${keywords || "the core experience"} is what separates this from the last version.`,
    `Bottom line on ${subject} — worth watching, and we'll keep tracking how it develops.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function businessScript(article: Article, variant: number): string {
  const subject = primarySubject(article);
  const secondary = secondarySubject(article);
  const fact = keyNumberFact(article);
  const opener = pickVariant(
    [
      "Let's get into the numbers.",
      "Here's what's actually moving behind this story.",
      "This is worth understanding beyond the headline.",
    ],
    article,
    "vo-opener-biz",
    variant,
  );

  return [
    `${opener} Today's focus is ${subject}.`,
    fact
      ? `The headline figure: ${formatNumberFact(fact)}. Here's the context behind it.`
      : `Here's the financial backdrop driving this story.`,
    `Analysts are still weighing in on what this means going forward${secondary ? `, particularly for ${secondary}` : ""}.`,
    `That's the read on ${subject} for now — worth verifying the exact figures before citing them elsewhere.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function generalScript(article: Article): string {
  const subject = primarySubject(article);
  const keywords = topKeywordPhrase(article, 2);
  return [
    `Here's what's worth knowing about ${subject}.`,
    `The short version: ${keywords ? `it comes down to ${keywords}` : "there's more here than the headline suggests"}.`,
    `That covers the key points on ${subject}.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

const VOICEOVER_GENERATORS: Record<ContentCategory, ScriptFn> = {
  news: newsScript,
  sports: sportsScript,
  educational: educationalScript,
  technology: technologyScript,
  business: businessScript,
  general: (article) => generalScript(article),
};

export function generateVoiceoverScript(article: Article, variant = 0): VoiceoverScriptResult {
  const script = VOICEOVER_GENERATORS[article.category](article, variant);
  return { script, estimatedDurationSeconds: estimateReadingSeconds(script, 145) };
}

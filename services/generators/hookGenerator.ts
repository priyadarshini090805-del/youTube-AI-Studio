import type { Article } from "@/types/article";
import type { HookResult } from "@/types/generation";
import { stripTrailingPunctuation } from "@/utils/text";
import {
  primarySubject,
  getMatchup,
  keyNumberFact,
  formatNumberFact,
  pickManyVariant,
  generateByCategory,
  type CategoryGeneratorMap,
} from "./shared";

function educationalHooks(article: Article): string[] {
  const subject = primarySubject(article);
  const isTutorial = article.contentType === "tutorial";
  return isTutorial
    ? [
        `By the end of this video, you'll be able to do this yourself.`,
        `This looks harder than it is — let me show you.`,
        `Here's the step everyone gets wrong with ${subject}.`,
      ]
    : [
        `Have you ever wondered how ${subject} actually works?`,
        `By the end of this video, you'll understand ${subject} better than most people ever will.`,
        `Here's a concept that trips almost everyone up — until now.`,
        `This is one of the most misunderstood ideas about ${subject}.`,
      ];
}

function newsHooks(article: Article): string[] {
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const candidates = [
    `Here's what really happened with ${subject}, and why it matters.`,
    `In the next few minutes, we break down exactly what's unfolding around ${subject}.`,
    `This is a developing story, and here's what we know so far.`,
    `Before you scroll past this, here's what you need to know about ${subject}.`,
  ];
  if (fact) candidates.push(`${formatNumberFact(fact)} — that's the number everyone is talking about right now.`);
  return candidates;
}

function sportsHooks(article: Article): string[] {
  const matchup = getMatchup(article);
  const fact = keyNumberFact(article);
  const candidates: string[] = [];
  if (matchup) candidates.push(`${matchup.teamA} and ${matchup.teamB} just delivered a moment nobody saw coming.`);
  if (fact) candidates.push(`${formatNumberFact(fact)} — that's the stat everyone's talking about today.`);
  candidates.push(`What a finish. Here's how it all went down.`);
  candidates.push(`This is the performance everyone will be replaying for weeks.`);
  return candidates;
}

function technologyHooks(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `${subject} just landed, and it changes a few things.`,
    `Here's everything that's actually new with ${subject} — no fluff.`,
    `Is ${subject} actually worth your attention? Let's find out.`,
    `This is what nobody's telling you about ${subject}.`,
  ];
}

function businessHooks(article: Article): string[] {
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const candidates = [
    `${subject} just made a move that's got the market talking.`,
    `Here's what these numbers actually mean for you.`,
    `This decision could reshape the next few quarters — here's how.`,
  ];
  if (fact) candidates.push(`${formatNumberFact(fact)} — here's the context nobody's giving you.`);
  return candidates;
}

function generalHooks(article: Article): string[] {
  const subject = primarySubject(article);
  return [
    `Here's what really happened with ${subject}, and why it's worth your time.`,
    `Stick with us for the next few minutes — this one's worth it.`,
    `${stripTrailingPunctuation(article.title)} — we unpack every detail, right here.`,
  ];
}

const HOOK_GENERATORS: CategoryGeneratorMap<string[]> = {
  educational: educationalHooks,
  news: newsHooks,
  sports: sportsHooks,
  technology: technologyHooks,
  business: businessHooks,
  general: generalHooks,
};

export function generateHooks(article: Article, variant = 0): HookResult {
  const pool = Array.from(new Set(generateByCategory(article, HOOK_GENERATORS)));
  return { hooks: pickManyVariant(pool, Math.min(4, pool.length), article, "hook", variant) };
}

import type { Article } from "@/types/article";
import type { AnchorScriptResult, ScriptSegment } from "@/types/generation";
import { estimateReadingSeconds, stripTrailingPunctuation } from "@/utils/text";
import type { ContentCategory } from "@/mock/data/categoryKeywords";
import {
  primarySubject,
  secondarySubject,
  getMatchup,
  keyNumberFact,
  formatNumberFact,
  topKeywordPhrase,
  pickVariant,
} from "./shared";

const NEWS_OPENERS = [
  "Good evening, and thank you for joining us.",
  "Welcome back — here's the story developing right now.",
  "We start tonight with a story that's drawing wide attention.",
];
const NEWS_CLOSERS = [
  "We'll continue to follow this developing story and bring you updates as they happen.",
  "Stay with us as this story continues to unfold.",
  "We'll be tracking every development on this story in the days ahead — full coverage as it lands.",
];

function newsScript(article: Article, variant: number): ScriptSegment[] {
  const subject = primarySubject(article);
  const secondary = secondarySubject(article);
  const fact = keyNumberFact(article);
  const location = article.entities.locations[0];
  const quote = article.entities.quotes[0];
  const keywords = topKeywordPhrase(article, 2);
  const opener = pickVariant(NEWS_OPENERS, article, "anchor-opener", variant);
  const closer = pickVariant(NEWS_CLOSERS, article, "anchor-closer", variant);

  return [
    { label: "Intro", content: `${opener} Tonight's headline: ${stripTrailingPunctuation(article.title)}.` },
    {
      label: "Context",
      content: `${location ? `This story centers on developments in ${location}. ` : ""}Here's what we know so far: it involves ${subject}${secondary ? ` and ${secondary}` : ""}${keywords ? `, with the focus squarely on ${keywords}` : ""}.`,
    },
    {
      label: "Key Details",
      content: fact
        ? `Officials confirmed the key figure at the center of this story — ${formatNumberFact(fact)}.`
        : "Details are still emerging, and our team is verifying every element of this story.",
    },
    {
      label: "Reaction",
      content: quote
        ? `${quote.attribution ? `${quote.attribution} said, ` : "In a statement, one source said, "}"${quote.text}"`
        : `Reaction from ${subject} and others involved is still coming in.`,
    },
    { label: "Closing", content: `That's the latest on this story. ${closer}` },
  ];
}

const SPORTS_OPENERS = [
  "What a contest we have for you today —",
  "Scenes here as the action reaches its peak —",
  "Fans will be talking about this one for a long time —",
];

function sportsScript(article: Article, variant: number): ScriptSegment[] {
  const matchup = getMatchup(article);
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const keywords = topKeywordPhrase(article, 2);
  const opener = pickVariant(SPORTS_OPENERS, article, "anchor-opener-sports", variant);

  return [
    {
      label: "Intro",
      content: `${opener} ${matchup ? `${matchup.teamA} taking on ${matchup.teamB}.` : stripTrailingPunctuation(article.title) + "."}`,
    },
    {
      label: "Build-Up",
      content: `Both sides came out with something to prove, and the early exchanges made that clear${keywords ? ` — all the talk was around ${keywords}` : ""}.`,
    },
    {
      label: "Turning Point",
      content: `${subject} produced the moment that swung this one, and the momentum never really shifted back after that.`,
    },
    {
      label: "Key Stats",
      content: fact
        ? `Let's talk numbers: ${formatNumberFact(fact)} — a stat that tells the whole story.`
        : `The stat sheet backs up exactly what we saw out there.`,
    },
    {
      label: "Closing",
      content: `That's how it played out. A performance from ${subject} that won't be forgotten anytime soon.`,
    },
  ];
}

const EDU_OPENERS = [
  "Let's start with the basics.",
  "Here's a question worth sitting with for a second.",
  "This is one of those topics that sounds complicated but really isn't.",
];

function educationalScript(article: Article, variant: number): ScriptSegment[] {
  const subject = primarySubject(article);
  const keywords = topKeywordPhrase(article, 3);
  const isTutorial = article.contentType === "tutorial";
  const opener = pickVariant(EDU_OPENERS, article, "anchor-opener-edu", variant);

  const coreConceptLine = isTutorial
    ? `The process breaks down into a few clear steps, and once you see them laid out, it stops feeling complicated.`
    : `At its core, this comes down to understanding ${keywords || subject}. Once you break it into pieces, the explanation is more intuitive than it first sounds.`;

  const howItWorksLine = isTutorial
    ? `Here's the sequence: get the fundamentals right first, then layer in the details — skipping ahead is where most people trip up.`
    : `Here's the mechanism: it centers on ${keywords || "a chain of cause and effect"}, and that connection is what makes the whole idea click.`;

  return [
    { label: "Intro", content: `${opener} Today we're looking at ${subject}.` },
    { label: "The Core Concept", content: coreConceptLine },
    { label: "How It Works", content: howItWorksLine },
    {
      label: "Example",
      content: article.entities.organizations[0]
        ? `${article.entities.organizations[0]}'s work is a useful real-world example of this in practice.`
        : `A simple real-world comparison makes this a lot easier to picture.`,
    },
    {
      label: "Key Takeaway",
      content: `The main thing to remember: understanding ${subject} changes how you see the bigger picture. Verify the finer details against the original source before citing them.`,
    },
  ];
}

const TECH_OPENERS = [
  "Alright, let's get into it.",
  "There's a lot to unpack here, so let's break it down.",
  "Here's the rundown on what just landed.",
];

function technologyScript(article: Article, variant: number): ScriptSegment[] {
  const subject = primarySubject(article);
  const keywords = topKeywordPhrase(article, 2);
  const opener = pickVariant(TECH_OPENERS, article, "anchor-opener-tech", variant);

  return [
    { label: "Intro", content: `${opener} We're talking about ${subject} today.` },
    {
      label: "What's New",
      content: `${subject} brings a handful of meaningful changes, particularly around ${keywords || "performance and design"}.`,
    },
    {
      label: "Under the Hood",
      content: `Here's what's actually driving that: ${keywords ? `the work on ${keywords}` : "a set of under-the-hood engineering changes"} is doing most of the heavy lifting.`,
    },
    {
      label: "Verdict",
      content: `So, is it worth your attention? Based on what we've covered, here's where things stand with ${subject}.`,
    },
  ];
}

const BIZ_OPENERS = [
  "Let's look at the numbers.",
  "Here's what's moving the market today.",
  "There's a lot to break down in this one.",
];

function businessScript(article: Article, variant: number): ScriptSegment[] {
  const subject = primarySubject(article);
  const secondary = secondarySubject(article);
  const fact = keyNumberFact(article);
  const opener = pickVariant(BIZ_OPENERS, article, "anchor-opener-biz", variant);

  return [
    { label: "Intro", content: `${opener} Today's focus: ${subject}.` },
    {
      label: "The Numbers",
      content: fact
        ? `The headline figure here is ${formatNumberFact(fact)} — and it's worth understanding what's behind it.`
        : `Here's the financial picture behind this story, and why it's drawing attention.`,
    },
    {
      label: "Market Context",
      content: `Analysts are weighing in on what this means for ${subject}${secondary ? `, especially with ${secondary} in the picture` : ""}.`,
    },
    {
      label: "Outlook",
      content: `Here's what to watch next when it comes to ${subject}. As always, verify the exact figures before reporting them further.`,
    },
  ];
}

function generalScript(article: Article): ScriptSegment[] {
  const subject = primarySubject(article);
  const secondary = secondarySubject(article);
  const keywords = topKeywordPhrase(article, 2);
  return [
    { label: "Intro", content: `Let's talk about ${subject}.` },
    {
      label: "Overview",
      content: `Here's the gist: this centers on ${subject}${keywords ? `, touching on ${keywords}` : ""}.`,
    },
    {
      label: "Details",
      content: `Beyond that, ${secondary ? `${secondary} plays a role too` : "there's more nuance worth understanding"}.`,
    },
    { label: "Closing", content: `That covers the essentials on ${subject}.` },
  ];
}

type ScriptCategoryGenerator = (article: Article, variant: number) => ScriptSegment[];

const ANCHOR_SCRIPT_GENERATORS: Record<ContentCategory, ScriptCategoryGenerator> = {
  news: newsScript,
  sports: sportsScript,
  educational: educationalScript,
  technology: technologyScript,
  business: businessScript,
  general: (article) => generalScript(article),
};

export function generateAnchorScript(article: Article, variant = 0): AnchorScriptResult {
  const segments = ANCHOR_SCRIPT_GENERATORS[article.category](article, variant);
  const fullText = segments.map((segment) => segment.content).join(" ");
  return { segments, estimatedDurationSeconds: estimateReadingSeconds(fullText, 140) };
}

import type { Article } from "@/types/article";
import type { ThumbnailResult } from "@/types/generation";
import {
  primarySubject,
  getMatchup,
  keyNumberFact,
  formatNumberFact,
  pickManyVariant,
  generateByCategory,
  type CategoryGeneratorMap,
} from "./shared";

interface ThumbnailPools {
  primary: string[];
  secondary: string[];
}

function educationalPools(article: Article): ThumbnailPools {
  const subject = primarySubject(article);
  const isTutorial = article.contentType === "tutorial";
  return {
    primary: [
      subject.toUpperCase(),
      isTutorial ? "STEP BY STEP" : "EXPLAINED",
      "HOW IT WORKS",
      isTutorial ? "TRY THIS" : "THE SCIENCE",
    ],
    secondary: [
      isTutorial ? "BEGINNER FRIENDLY" : "LEARN THIS",
      "WATCH TO UNDERSTAND",
      article.entities.locations[0]?.toUpperCase() ?? "DEEP DIVE",
    ],
  };
}

function newsPools(article: Article): ThumbnailPools {
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  return {
    primary: [subject.toUpperCase(), "BREAKING NEWS", fact ? formatNumberFact(fact).toUpperCase() : "WHAT WE KNOW"],
    secondary: [article.entities.locations[0]?.toUpperCase() ?? "FULL COVERAGE", "WATCH NOW"],
  };
}

function sportsPools(article: Article): ThumbnailPools {
  const matchup = getMatchup(article);
  const fact = keyNumberFact(article);
  const primary = matchup ? [`${matchup.teamA} vs ${matchup.teamB}`, `${matchup.teamA} WIN!`] : [primarySubject(article).toUpperCase()];
  if (fact) primary.push(formatNumberFact(fact).toUpperCase());
  primary.push("MATCH RECAP");
  return {
    primary,
    secondary: [article.entities.locations[0]?.toUpperCase() ?? "HIGHLIGHTS", "FULL RECAP"],
  };
}

function technologyPools(article: Article): ThumbnailPools {
  const subject = primarySubject(article);
  return {
    primary: [subject.toUpperCase(), "IS IT WORTH IT?", "FIRST LOOK", "WHAT'S NEW"],
    secondary: ["FULL REVIEW", "SPECS INSIDE"],
  };
}

function businessPools(article: Article): ThumbnailPools {
  const subject = primarySubject(article);
  const fact = keyNumberFact(article);
  const primary = [subject.toUpperCase(), "THE NUMBERS"];
  if (fact) primary.push(formatNumberFact(fact).toUpperCase());
  return {
    primary,
    secondary: ["MARKET REACTION", "WHAT IT MEANS"],
  };
}

function generalPools(article: Article): ThumbnailPools {
  const subject = primarySubject(article);
  return {
    primary: [subject.toUpperCase(), "WHAT YOU NEED TO KNOW"],
    secondary: [article.entities.locations[0]?.toUpperCase() ?? "FULL STORY", "WATCH NOW"],
  };
}

const THUMBNAIL_GENERATORS: CategoryGeneratorMap<ThumbnailPools> = {
  educational: educationalPools,
  news: newsPools,
  sports: sportsPools,
  technology: technologyPools,
  business: businessPools,
  general: generalPools,
};

export function generateThumbnailText(article: Article, variant = 0): ThumbnailResult {
  const pools = generateByCategory(article, THUMBNAIL_GENERATORS);
  const primaryPool = Array.from(new Set(pools.primary));
  const secondaryPool = Array.from(new Set(pools.secondary));
  return {
    primaryText: pickManyVariant(primaryPool, Math.min(4, primaryPool.length), article, "thumbnail-primary", variant),
    secondaryText: pickManyVariant(
      secondaryPool,
      Math.min(3, secondaryPool.length),
      article,
      "thumbnail-secondary",
      variant,
    ),
  };
}

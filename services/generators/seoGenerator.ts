import type { Article } from "@/types/article";
import type { SeoResult } from "@/types/generation";
import { toTitleCase } from "@/utils/text";
import { primarySubject, getMatchup, generateByCategory, type CategoryGeneratorMap } from "./shared";

function baseKeywords(article: Article): { primary: string[]; secondary: string[] } {
  const subject = primarySubject(article);
  const location = article.entities.locations[0];

  const primary = Array.from(
    new Set([subject.toLowerCase(), article.categoryLabel.toLowerCase(), ...article.keywords.slice(0, 4)].filter(Boolean)),
  );

  const secondary = Array.from(
    new Set(
      [
        location ? `${article.categoryLabel.toLowerCase()} ${location.toLowerCase()}` : null,
        ...article.keywords.slice(4, 9),
        ...article.entities.organizations.map((org) => org.toLowerCase()),
      ].filter((value): value is string => Boolean(value)),
    ),
  );

  return { primary, secondary };
}

function withQueries(article: Article, queries: string[]): SeoResult {
  const { primary, secondary } = baseKeywords(article);
  const subject = toTitleCase(primarySubject(article));
  const searchQueries = Array.from(
    new Set(
      [...queries, article.entities.dates[0] ? `${subject} ${article.entities.dates[0]}` : null].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  );
  return { primaryKeywords: primary, secondaryKeywords: secondary, searchQueries };
}

function educationalSeo(article: Article): SeoResult {
  const subject = toTitleCase(primarySubject(article));
  if (article.contentType === "tutorial") {
    return withQueries(article, [`how to ${subject.toLowerCase()}`, `${subject} tutorial`, `${subject} step by step`]);
  }
  return withQueries(article, [`${subject} explained`, `how does ${subject} work`, `${subject} for beginners`]);
}

function newsSeo(article: Article): SeoResult {
  const subject = toTitleCase(primarySubject(article));
  return withQueries(article, [`${subject} latest news`, `${subject} update today`]);
}

function sportsSeo(article: Article): SeoResult {
  const matchup = getMatchup(article);
  const subject = toTitleCase(primarySubject(article));
  return withQueries(
    article,
    matchup
      ? [`${matchup.teamA} vs ${matchup.teamB} highlights`, `${matchup.teamA} vs ${matchup.teamB} full recap`]
      : [`${subject} match highlights`, `${subject} full recap`],
  );
}

function technologySeo(article: Article): SeoResult {
  const subject = toTitleCase(primarySubject(article));
  return withQueries(article, [`${subject} review`, `${subject} specs and features`, `${subject} vs competitors`]);
}

function businessSeo(article: Article): SeoResult {
  const subject = toTitleCase(primarySubject(article));
  return withQueries(article, [`${subject} earnings analysis`, `${subject} stock news`, `${subject} market impact`]);
}

function generalSeo(article: Article): SeoResult {
  const subject = toTitleCase(primarySubject(article));
  return withQueries(article, [`${subject} explained`, `${subject} overview`]);
}

const SEO_GENERATORS: CategoryGeneratorMap<SeoResult> = {
  educational: educationalSeo,
  news: newsSeo,
  sports: sportsSeo,
  technology: technologySeo,
  business: businessSeo,
  general: generalSeo,
};

export function generateSeo(article: Article): SeoResult {
  return generateByCategory(article, SEO_GENERATORS);
}

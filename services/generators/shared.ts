import type { Article, ExtractedNumberFact } from "@/types/article";
import type { ContentCategory } from "@/mock/data/categoryKeywords";
import { seededPick, seededPickMany } from "@/utils/hash";
import { toTitleCase, truncate, slugifyHashtag } from "@/utils/text";

export type CategoryGeneratorMap<T> = Record<ContentCategory, (article: Article) => T>;

export function generateByCategory<T>(article: Article, generators: CategoryGeneratorMap<T>): T {
  return generators[article.category](article);
}

export function primarySubject(article: Article): string {
  const { people, organizations, locations } = article.entities;
  const namedEntity = people[0] ?? organizations[0] ?? locations[0];
  if (namedEntity) return namedEntity;
  return article.keywords[0] ? toTitleCase(article.keywords[0]) : "the story";
}

export function secondarySubject(article: Article): string | null {
  const primary = primarySubject(article);
  const { people, locations, organizations } = article.entities;
  const candidates = [...people, ...locations, ...organizations].filter(
    (item) => item.toLowerCase() !== primary.toLowerCase(),
  );
  return candidates[0] ?? null;
}

export function getMatchup(article: Article): { teamA: string; teamB: string } | null {
  const { locations } = article.entities;
  if (article.category === "sports" && locations.length >= 2) {
    return { teamA: locations[0], teamB: locations[1] };
  }
  return null;
}

export function keyNumberFact(article: Article): ExtractedNumberFact | null {
  return article.entities.numbers[0] ?? null;
}

export function formatNumberFact(fact: ExtractedNumberFact): string {
  return `${fact.value.toLocaleString("en-IN")} ${fact.unit ?? ""}`.trim();
}

export function topKeywordPhrase(article: Article, count = 3): string {
  return article.keywords.slice(0, count).map(toTitleCase).join(", ");
}

export function shortTitle(article: Article, maxLength = 70): string {
  return truncate(article.title, maxLength);
}

export function buildHashtagPool(article: Article): string[] {
  const base = [
    ...article.keywords.slice(0, 6),
    ...article.entities.locations.slice(0, 3),
    ...article.entities.organizations.slice(0, 2),
    article.categoryLabel,
  ];
  return base
    .filter(Boolean)
    .map((item) => item.replace(/\s+/g, ""))
    .filter((item) => item.length > 1)
    .map(slugifyHashtag);
}

export function pickVariant<T>(items: T[], article: Article, moduleName: string, variant: number): T {
  return seededPick(items, [article.title, moduleName, variant]);
}

export function pickManyVariant<T>(
  items: T[],
  count: number,
  article: Article,
  moduleName: string,
  variant: number,
): T[] {
  return seededPickMany(items, count, [article.title, moduleName, variant]);
}

export function subjectPossessive(subject: string): string {
  return subject.endsWith("s") ? `${subject}'` : `${subject}'s`;
}

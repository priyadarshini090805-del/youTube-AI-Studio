import type { ArticleAnalysis } from "@/types/article";
import type { QualityIssue, QualityResult, QualityVerificationItem } from "@/types/generation";
import { splitWords, truncate } from "@/utils/text";
import { SENSATIONAL_WORDS, BIAS_WORDS, HEDGE_PHRASES } from "@/mock/data/qualityLexicon";

function findPhraseMatches(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  return phrases.filter((phrase) => lower.includes(phrase.toLowerCase()));
}

export function checkQuality(analysis: ArticleAnalysis): QualityResult {
  const issues: QualityIssue[] = [];
  const { sentences, body, article } = analysis;
  const { entities } = article;

  for (const sentence of sentences) {
    const words = splitWords(sentence);
    if (words.length > 0 && words.length < 3) {
      issues.push({
        category: "Incomplete Sentence",
        severity: "warning",
        message: "This sentence looks fragmentary and may be missing a subject or verb.",
        excerpt: truncate(sentence, 90),
      });
    }
    if (words.length > 35) {
      issues.push({
        category: "Long Sentence",
        severity: "info",
        message: `This sentence runs ${words.length} words — consider splitting it for on-air readability.`,
        excerpt: truncate(sentence, 90),
      });
    }
  }

  const sentenceCounts = new Map<string, number>();
  for (const sentence of sentences) {
    const key = sentence.trim().toLowerCase();
    sentenceCounts.set(key, (sentenceCounts.get(key) ?? 0) + 1);
  }
  for (const [key, count] of sentenceCounts) {
    if (count > 1 && key.length > 12) {
      issues.push({
        category: "Duplicate Wording",
        severity: "warning",
        message: "This sentence appears more than once in the article.",
        excerpt: truncate(key, 90),
      });
    }
  }

  const doubledWordMatch = body.match(/\b(\w+)\s+\1\b/gi);
  if (doubledWordMatch) {
    for (const match of doubledWordMatch.slice(0, 5)) {
      issues.push({
        category: "Duplicate Wording",
        severity: "info",
        message: "A word appears to be repeated consecutively.",
        excerpt: match,
      });
    }
  }

  const sensationalHits = findPhraseMatches(body, SENSATIONAL_WORDS);
  for (const hit of sensationalHits) {
    issues.push({
      category: "Sensational Language",
      severity: "warning",
      message: `The phrase "${hit}" reads as sensational — consider a more neutral alternative for editorial tone.`,
    });
  }

  const biasHits = findPhraseMatches(body, BIAS_WORDS);
  for (const hit of biasHits) {
    issues.push({
      category: "Potential Bias",
      severity: "warning",
      message: `The phrase "${hit}" may introduce editorializing or bias — review for neutrality.`,
    });
  }

  const hedgeHits = findPhraseMatches(body, HEDGE_PHRASES);
  for (const hit of hedgeHits) {
    issues.push({
      category: "Unverified Claim Indicator",
      severity: "critical",
      message: `The phrase "${hit}" signals an unconfirmed claim — this must be verified against a primary source before publishing.`,
    });
  }

  const isEducational = article.category === "educational";
  if (!isEducational && entities.locations.length === 0 && entities.people.length === 0 && entities.organizations.length === 0) {
    issues.push({
      category: "Missing Context",
      severity: "critical",
      message: "No identifiable people, organizations, or locations were found. The story may be missing essential context for viewers.",
    });
  }

  if (!isEducational && entities.dates.length === 0) {
    issues.push({
      category: "Missing Context",
      severity: "info",
      message: "No explicit date reference was found. Consider confirming when this event took place.",
    });
  }

  const capsShoutMatch = body.match(/\b[A-Z]{4,}\b/g)?.filter((word) => !/^[IVXLC]+$/.test(word));
  if (capsShoutMatch && capsShoutMatch.length > 2) {
    issues.push({
      category: "Style",
      severity: "info",
      message: "Multiple all-caps words detected — verify these are intentional acronyms and not stylistic shouting.",
    });
  }

  const verificationRequired: QualityVerificationItem[] = [
    { category: "Dates", items: entities.dates.length > 0 ? entities.dates : ["No dates detected — confirm timeline manually."] },
    {
      category: "Statistics",
      items: entities.numbers.length > 0 ? entities.numbers.map((n) => n.raw) : ["No statistics detected — confirm any figures manually."],
    },
    {
      category: "Quotes",
      items: entities.quotes.length > 0 ? entities.quotes.map((q) => truncate(q.text, 80)) : ["No direct quotes detected."],
    },
    { category: "Names", items: entities.people.length > 0 ? entities.people : ["No named individuals detected."] },
    { category: "Locations", items: entities.locations.length > 0 ? entities.locations : ["No locations detected."] },
    {
      category: "Organizations",
      items: entities.organizations.length > 0 ? entities.organizations : ["No organizations detected."],
    },
  ];

  const penalty = issues.reduce((total, issue) => {
    if (issue.severity === "critical") return total + 15;
    if (issue.severity === "warning") return total + 7;
    return total + 2;
  }, 0);
  const score = Math.max(0, Math.min(100, 100 - penalty));

  const summary =
    score >= 85
      ? "This draft is in strong editorial shape. Verify flagged facts before publishing."
      : score >= 60
        ? "This draft needs a moderate editorial pass before it's publish-ready."
        : "This draft needs significant editorial review before publishing.";

  return { score, issues, verificationRequired, summary };
}

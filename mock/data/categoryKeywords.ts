export type ContentCategory =
  | "educational"
  | "news"
  | "sports"
  | "technology"
  | "business"
  | "general";

export const CATEGORY_KEYWORDS: Record<Exclude<ContentCategory, "general">, string[]> = {
  sports: [
    "cricket", "wicket", "wickets", "wicketkeeper", "innings", "overs",
    "run", "runs", "batsman", "batter", "batting", "bowler", "bowling", "bowled",
    "century", "half-century", "odi", "t20", "test match", "ipl", "world cup",
    "captain", "skipper", "boundary", "spinner", "pacer", "crease",
    "umpire", "toss", "innings chase", "partnership", "all-rounder", "bcci", "icc",
    "football", "soccer", "goal", "goals", "striker", "midfielder", "defender",
    "goalkeeper", "penalty", "referee", "fifa", "uefa", "premier league",
    "champions league", "fixture", "transfer", "kickoff", "offside", "hat-trick",
    "tournament", "athlete", "championship", "medal", "olympics", "coach",
    "match", "player", "stadium", "semi-final", "league",
    "playoffs", "victory margin", "rankings",
  ],
  news: [
    "election", "elections", "minister", "parliament", "government", "party",
    "vote", "votes", "voting", "policy", "bill", "president", "senate",
    "opposition", "coalition", "campaign", "constituency", "cabinet",
    "legislation", "lawmakers", "referendum", "poll", "polls", "manifesto",
    "assembly", "lok sabha", "rajya sabha", "governor", "diplomat", "summit",
    "sanctions", "treaty", "police", "court", "crime", "arrested", "investigation",
    "protest", "protesters", "disaster", "earthquake", "flood", "wildfire",
    "emergency", "officials", "authorities", "casualties", "victims", "attack",
    "explosion", "evacuated", "curfew", "unrest",
  ],
  business: [
    "revenue", "profit", "loss", "stocks", "shares", "market", "markets", "ipo",
    "merger", "acquisition", "startup", "funding", "investment", "investors",
    "quarterly", "earnings", "economy", "inflation", "gdp", "ceo", "company",
    "corporate", "shareholders", "valuation", "sector", "trade", "tariff",
    "bankruptcy", "layoffs",
  ],
  technology: [
    "technology", "software", "app", "ai", "artificial intelligence", "startup",
    "chip", "chips", "semiconductor", "smartphone", "launch", "update",
    "cybersecurity", "data", "cloud", "algorithm", "device", "gadget",
    "internet", "platform", "developer", "release", "feature", "hack", "breach",
  ],
  educational: [
    "study", "studies", "research", "researchers", "scientists", "university",
    "professor", "lesson", "lessons", "students", "learn", "learning", "learners",
    "tutorial", "explained", "guide", "understand", "discovery", "experiment",
    "findings", "published", "journal", "evidence", "theory", "curriculum",
    "textbook", "exercise", "vocabulary", "grammar", "quiz", "course", "education",
    "school", "academic", "concept", "definition", "history of", "how does",
    "explains", "beginner", "fundamentals", "principle", "hypothesis", "data shows",
  ],
};

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  educational: "Educational",
  news: "News",
  sports: "Sports",
  technology: "Technology",
  business: "Business",
  general: "General",
};

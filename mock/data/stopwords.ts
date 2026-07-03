export const STOPWORDS = new Set(
  [
    "a", "an", "the", "and", "or", "but", "if", "then", "else", "when", "at", "by",
    "for", "with", "about", "against", "between", "into", "through", "during",
    "before", "after", "above", "below", "to", "from", "up", "down", "in", "out",
    "on", "off", "over", "under", "again", "further", "once", "here", "there",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
    "t", "can", "will", "just", "don", "should", "now", "is", "are", "was", "were",
    "be", "been", "being", "have", "has", "had", "having", "do", "does", "did",
    "doing", "would", "could", "might", "must", "shall", "of", "as", "it", "its",
    "this", "that", "these", "those", "he", "she", "they", "them", "his", "her",
    "their", "we", "you", "i", "who", "whom", "which", "what", "said", "also",
    "according", "told", "while", "after", "amid", "amidst", "per", "via", "vs",
  ].map((word) => word.toLowerCase()),
);

export const COMMON_SENTENCE_STARTERS = new Set([
  "The", "This", "That", "These", "Those", "In", "On", "At", "It", "He", "She",
  "They", "According", "During", "After", "Before", "While", "As", "But",
  "However", "Meanwhile", "Officials", "Authorities", "Sources", "Reports",
]);

// Words that signal a category (e.g. "this is a study") but describe the
// piece itself rather than its subject matter — excluded from keyword
// ranking so substantive topic words surface instead.
export const META_NOISE_WORDS = new Set(
  [
    "study", "studies", "research", "researchers", "published", "journal",
    "findings", "report", "reports", "reported", "article", "news", "update",
    "coverage", "story", "video", "episode", "segment", "analysis", "review",
    "course", "lesson", "lessons", "curriculum", "textbook", "exercise",
  ].map((word) => word.toLowerCase()),
);

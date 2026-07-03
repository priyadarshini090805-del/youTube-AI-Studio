export const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*$/;

export const UI_LABEL_LINES = new Set(
  [
    "copy", "edit", "regenerate", "approve", "approved", "draft", "unlock",
    "generate", "generate all modules", "not generated yet.",
    "add article text to enable generation.",
    "paste the full article text here…", "paste the full article text here...",
    "article input", "article text", "preprocessing preview", "download",
  ].map((label) => label.toLowerCase()),
);

export const METADATA_LINE_PATTERNS: RegExp[] = [
  /^\d[\d,]*\s*characters?$/i,
  /^~?\d[\d,]*\s*(min|mins|minute|minutes)\s*read$/i,
  /^\d+\s*\/\s*\d+\s*(generated|approved)$/i,
  /^\d[\d,]*\s*words?$/i,
  /^~?\d[\d,]*\s*sec(onds)?$/i,
];

export const INSTRUCTIONAL_LINE_PATTERNS: RegExp[] = [
  /^paste\b.*article/i,
  /^enter\b.*article/i,
  /^instructions?:/i,
  /^note to editors?:/i,
  /^\[?editor'?s? note\]?:?/i,
  /^every module is generated from the entities detected here\.?$/i,
];

export function isNoiseLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();

  if (UI_LABEL_LINES.has(lower)) return true;
  if (METADATA_LINE_PATTERNS.some((pattern) => pattern.test(trimmed))) return true;
  if (INSTRUCTIONAL_LINE_PATTERNS.some((pattern) => pattern.test(trimmed))) return true;

  return false;
}

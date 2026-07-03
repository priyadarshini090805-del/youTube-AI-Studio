import { HEADING_PATTERN, isNoiseLine } from "@/mock/data/ingestionNoise";
import { splitParagraphs, splitSentences, splitWords } from "@/utils/text";

export interface PreprocessedArticle {
  title: string;
  body: string;
}

/**
 * Strips UI chrome, instructional copy, and metadata (character/word counts,
 * read-time badges, markdown heading markers) that can end up in the input
 * when an editor copy-pastes from a webpage or from this app itself, then
 * separates the real title from the article body.
 */
export function preprocessArticle(rawInput: string): PreprocessedArticle {
  const normalized = rawInput.replace(/\r\n/g, "\n");
  const rawLines = normalized.split("\n");

  let titleFromHeading: string | null = null;
  const keptLines: string[] = [];

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      keptLines.push("");
      continue;
    }

    const headingMatch = trimmed.match(HEADING_PATTERN);
    if (headingMatch) {
      const headingText = headingMatch[2].trim();
      if (!titleFromHeading) {
        titleFromHeading = headingText;
        continue;
      }
      keptLines.push(headingText);
      continue;
    }

    if (isNoiseLine(trimmed)) continue;

    keptLines.push(trimmed);
  }

  const bodyRaw = keptLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const paragraphs = splitParagraphs(bodyRaw);
  const sentences = splitSentences(bodyRaw);

  let title = titleFromHeading;
  let body = bodyRaw;

  if (!title) {
    const firstLine = paragraphs[0]?.split("\n")[0]?.trim() ?? "";
    const firstLineWordCount = splitWords(firstLine).length;
    const looksLikeTitleLine = firstLine.length > 0 && firstLineWordCount > 0 && firstLineWordCount <= 16 && !/[.!?]$/.test(firstLine);

    if (looksLikeTitleLine) {
      title = firstLine;
      body = bodyRaw.replace(firstLine, "").trim();
    } else {
      title = sentences[0]?.trim() ?? firstLine;
    }
  }

  return {
    title: title || "Untitled",
    body: body || bodyRaw,
  };
}

import type { ModuleId } from "@/types/generation";
import type {
  TitleResult,
  ThumbnailResult,
  HookResult,
  AnchorScriptResult,
  VoiceoverScriptResult,
  ShortsScriptResult,
  DescriptionResult,
  SeoResult,
  HashtagsResult,
  CommunityPostResult,
  PinnedCommentResult,
  ChaptersResult,
  QualityResult,
} from "@/types/generation";

function numbered(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function formatGenerationResult(moduleId: ModuleId, data: unknown): string {
  switch (moduleId) {
    case "title":
      return numbered((data as TitleResult).titles);
    case "thumbnail": {
      const result = data as ThumbnailResult;
      return [
        "Primary Text Options:",
        numbered(result.primaryText),
        "",
        "Secondary Text Options:",
        numbered(result.secondaryText),
      ].join("\n");
    }
    case "hook":
      return numbered((data as HookResult).hooks);
    case "anchorScript": {
      const result = data as AnchorScriptResult;
      return [
        ...result.segments.map((segment) => `[${segment.label}]\n${segment.content}`),
        "",
        `Estimated duration: ~${result.estimatedDurationSeconds}s`,
      ].join("\n\n");
    }
    case "voiceoverScript": {
      const result = data as VoiceoverScriptResult;
      return `${result.script}\n\nEstimated duration: ~${result.estimatedDurationSeconds}s`;
    }
    case "shortsScript": {
      const result = data as ShortsScriptResult;
      return [
        `Hook: ${result.hook}`,
        "",
        "Beats:",
        numbered(result.beats),
        "",
        "Caption Overlay:",
        numbered(result.captionOverlay),
        "",
        `CTA: ${result.callToAction}`,
        `Estimated duration: ~${result.estimatedDurationSeconds}s`,
      ].join("\n");
    }
    case "description": {
      const result = data as DescriptionResult;
      return [`Short:\n${result.short}`, "", `Full:\n${result.full}`].join("\n");
    }
    case "seo": {
      const result = data as SeoResult;
      return [
        "Primary Keywords:",
        result.primaryKeywords.join(", "),
        "",
        "Secondary Keywords:",
        result.secondaryKeywords.join(", "),
        "",
        "Search Queries Targeted:",
        numbered(result.searchQueries),
      ].join("\n");
    }
    case "hashtags":
      return (data as HashtagsResult).hashtags.join(" ");
    case "community":
      return numbered((data as CommunityPostResult).posts);
    case "pinnedComment":
      return numbered((data as PinnedCommentResult).comments);
    case "chapters": {
      const result = data as ChaptersResult;
      return result.chapters.map((chapter) => `${chapter.timestamp}  ${chapter.title}`).join("\n");
    }
    case "quality": {
      const result = data as QualityResult;
      const issueLines = result.issues.length
        ? result.issues.map(
            (issue) =>
              `[${issue.severity.toUpperCase()}] ${issue.category}: ${issue.message}${issue.excerpt ? ` ("${issue.excerpt}")` : ""}`,
          )
        : ["No issues detected."];
      const verificationLines = result.verificationRequired.map(
        (item) => `${item.category}: ${item.items.join("; ")}`,
      );
      return [
        `Quality Score: ${result.score}/100`,
        result.summary,
        "",
        "Issues:",
        issueLines.join("\n"),
        "",
        "Manual Verification Required:",
        verificationLines.join("\n"),
      ].join("\n");
    }
    default:
      return JSON.stringify(data, null, 2);
  }
}

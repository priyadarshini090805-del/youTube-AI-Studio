export type ModuleId =
  | "title"
  | "thumbnail"
  | "hook"
  | "anchorScript"
  | "voiceoverScript"
  | "shortsScript"
  | "description"
  | "seo"
  | "hashtags"
  | "community"
  | "pinnedComment"
  | "chapters"
  | "quality";

export interface GenerateRequestBody {
  article: string;
  variant?: number;
}

export interface TitleResult {
  titles: string[];
}

export interface ThumbnailResult {
  primaryText: string[];
  secondaryText: string[];
}

export interface HookResult {
  hooks: string[];
}

export interface ScriptSegment {
  label: string;
  content: string;
}

export interface AnchorScriptResult {
  segments: ScriptSegment[];
  estimatedDurationSeconds: number;
}

export interface VoiceoverScriptResult {
  script: string;
  estimatedDurationSeconds: number;
}

export interface ShortsScriptResult {
  hook: string;
  beats: string[];
  captionOverlay: string[];
  callToAction: string;
  estimatedDurationSeconds: number;
}

export interface DescriptionResult {
  short: string;
  full: string;
}

export interface SeoResult {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  searchQueries: string[];
}

export interface HashtagsResult {
  hashtags: string[];
}

export interface CommunityPostResult {
  posts: string[];
}

export interface PinnedCommentResult {
  comments: string[];
}

export interface Chapter {
  timestamp: string;
  title: string;
}

export interface ChaptersResult {
  chapters: Chapter[];
}

export type QualitySeverity = "info" | "warning" | "critical";

export interface QualityIssue {
  category: string;
  severity: QualitySeverity;
  message: string;
  excerpt?: string;
}

export interface QualityVerificationItem {
  category: string;
  items: string[];
}

export interface QualityResult {
  score: number;
  issues: QualityIssue[];
  verificationRequired: QualityVerificationItem[];
  summary: string;
}

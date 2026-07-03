import type { ModuleId } from "@/types/generation";

export interface ModuleConfig {
  id: ModuleId;
  label: string;
  endpoint: string;
  description: string;
  group: "core" | "scripts" | "distribution" | "quality";
}

export const MODULE_CONFIG: ModuleConfig[] = [
  {
    id: "title",
    label: "Title Suggestions",
    endpoint: "/api/generate/title",
    description: "YouTube-ready title options derived from the article's core subject and details.",
    group: "core",
  },
  {
    id: "thumbnail",
    label: "Thumbnail Text",
    endpoint: "/api/generate/thumbnail",
    description: "Short, high-impact text overlays for the video thumbnail.",
    group: "core",
  },
  {
    id: "hook",
    label: "Video Hook",
    endpoint: "/api/generate/hook",
    description: "Opening lines designed to keep viewers watching in the first five seconds.",
    group: "core",
  },
  {
    id: "anchorScript",
    label: "Anchor Script",
    endpoint: "/api/generate/anchor-script",
    description: "A segmented, on-air style script for a news anchor to deliver.",
    group: "scripts",
  },
  {
    id: "voiceoverScript",
    label: "Voice-over Script",
    endpoint: "/api/generate/voiceover-script",
    description: "A narration-style script for a voice-over artist.",
    group: "scripts",
  },
  {
    id: "shortsScript",
    label: "Shorts Script",
    endpoint: "/api/generate/shorts-script",
    description: "A fast-paced vertical-video script with captions and a call to action.",
    group: "scripts",
  },
  {
    id: "description",
    label: "Description",
    endpoint: "/api/generate/description",
    description: "Short and full YouTube description copy.",
    group: "distribution",
  },
  {
    id: "seo",
    label: "SEO Keywords",
    endpoint: "/api/generate/seo",
    description: "Primary and secondary keyword targets plus likely search queries.",
    group: "distribution",
  },
  {
    id: "hashtags",
    label: "Hashtags",
    endpoint: "/api/generate/hashtags",
    description: "Relevant hashtags for the video description and community posts.",
    group: "distribution",
  },
  {
    id: "community",
    label: "Community Post",
    endpoint: "/api/generate/community",
    description: "Draft posts for the YouTube Community tab to promote the video.",
    group: "distribution",
  },
  {
    id: "pinnedComment",
    label: "Pinned Comment",
    endpoint: "/api/generate/pinned-comment",
    description: "A pinned comment to add context, sourcing, or discussion prompts.",
    group: "distribution",
  },
  {
    id: "chapters",
    label: "Video Chapters",
    endpoint: "/api/generate/chapters",
    description: "Timestamped chapter markers for the video description.",
    group: "distribution",
  },
  {
    id: "quality",
    label: "Editorial Quality Checker",
    endpoint: "/api/generate/quality",
    description: "Automated review for tone, clarity, bias, and facts requiring manual verification.",
    group: "quality",
  },
];

"use client";

import * as React from "react";
import {
  FileSearch,
  Users,
  MapPin,
  Building2,
  CalendarDays,
  Hash,
  Clock,
  Languages,
  Layers,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Article, ContentType } from "@/types/article";

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  news_report: "News Report",
  research_summary: "Research Summary",
  tutorial: "Tutorial / How-To",
  review: "Review",
  analysis: "Analysis",
  explainer: "Explainer",
  narrative: "Narrative",
};

interface PreprocessingPreviewProps {
  article: Article;
}

export function PreprocessingPreview({ article }: PreprocessingPreviewProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="size-4" /> Preprocessing Preview
        </CardTitle>
        <CardDescription>
          The cleaned, structured article every module generates from. Metadata, UI text, and instructional
          lines have already been stripped out.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Detected Title</p>
          <p className="text-sm font-semibold">{article.title}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Summary</p>
          <p className="text-sm text-muted-foreground">{article.summary || "No summary available."}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{article.categoryLabel}</Badge>
          <Badge variant="outline" className="gap-1">
            <Layers className="size-3" /> {CONTENT_TYPE_LABELS[article.contentType]}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="size-3" /> ~{Math.max(1, Math.round(article.readingTimeSeconds / 60))} min read
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Languages className="size-3" /> {article.language}
          </Badge>
        </div>

        <Separator />

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Hash className="size-3.5" /> Keywords
          </p>
          {article.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {article.keywords.slice(0, 8).map((keyword) => (
                <span key={keyword} className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">None detected.</span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-secondary/40 p-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <EntityGroup icon={Users} label="People" items={article.entities.people} />
          <EntityGroup icon={MapPin} label="Locations" items={article.entities.locations} />
          <EntityGroup icon={Building2} label="Organizations" items={article.entities.organizations} />
          <EntityGroup icon={CalendarDays} label="Dates" items={article.entities.dates} />
        </div>
      </CardContent>
    </Card>
  );
}

function EntityGroup({
  icon: Icon,
  label,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <span key={item} className="rounded bg-card px-1.5 py-0.5 text-xs shadow-sm">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">None detected — verify manually.</span>
      )}
    </div>
  );
}

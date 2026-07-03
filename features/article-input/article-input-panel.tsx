"use client";

import { Sparkles, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MIN_ARTICLE_LENGTH = 40;

interface ArticleInputPanelProps {
  article: string;
  onArticleChange: (value: string) => void;
  onGenerateAll: () => void;
  isBusy: boolean;
  generatedCount: number;
  approvedCount: number;
  totalModules: number;
}

export function ArticleInputPanel({
  article,
  onArticleChange,
  onGenerateAll,
  isBusy,
  generatedCount,
  approvedCount,
  totalModules,
}: ArticleInputPanelProps) {
  const canGenerate = article.trim().length >= MIN_ARTICLE_LENGTH && !isBusy;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4" /> Article Input
        </CardTitle>
        <CardDescription>
          Paste the editor-approved article below. It is cleaned and structured before any module runs — see the
          Preprocessing Preview below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={article}
          onChange={(event) => onArticleChange(event.target.value)}
          placeholder="Paste the full article text here…"
          rows={12}
          className="text-sm leading-relaxed"
          aria-label="Article text"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{article.trim().length} characters</span>
            {article.trim().length > 0 && article.trim().length < MIN_ARTICLE_LENGTH && (
              <span className="text-warning">
                Add at least {MIN_ARTICLE_LENGTH - article.trim().length} more characters to enable generation.
              </span>
            )}
            {generatedCount > 0 && (
              <>
                <Badge variant="outline">
                  {generatedCount}/{totalModules} generated
                </Badge>
                <Badge variant={approvedCount === totalModules ? "success" : "outline"}>
                  {approvedCount}/{totalModules} approved
                </Badge>
              </>
            )}
          </div>
          <Button onClick={onGenerateAll} disabled={!canGenerate}>
            <Sparkles /> Generate All Modules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

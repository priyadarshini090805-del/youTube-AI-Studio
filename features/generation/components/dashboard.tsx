"use client";

import * as React from "react";
import { FileSearch } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ArticleInputPanel } from "@/features/article-input/article-input-panel";
import { PreprocessingPreview } from "@/features/article-input/preprocessing-preview";
import { GenerationCard } from "@/features/generation/components/generation-card";
import { MODULE_CONFIG, type ModuleConfig } from "@/features/generation/module-config";
import { useEditorialWorkspace } from "@/features/generation/hooks/use-editorial-workspace";
import { analyzeArticle } from "@/services/nlp/extractEntities";

const GROUP_LABELS: Record<ModuleConfig["group"], string> = {
  core: "Core Hooks",
  scripts: "Scripts",
  distribution: "Distribution & Discovery",
  quality: "Editorial Review",
};

const GROUP_ORDER: ModuleConfig["group"][] = ["core", "scripts", "distribution", "quality"];
const MIN_ARTICLE_LENGTH = 40;

export function Dashboard() {
  const workspace = useEditorialWorkspace();
  const hasArticle = workspace.article.trim().length >= MIN_ARTICLE_LENGTH;

  const analysis = React.useMemo(() => {
    if (!hasArticle) return null;
    return analyzeArticle(workspace.article);
  }, [hasArticle, workspace.article]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <ArticleInputPanel
        article={workspace.article}
        onArticleChange={workspace.setArticle}
        onGenerateAll={workspace.generateAll}
        isBusy={Object.values(workspace.modules).some((module) => module.status === "loading")}
        generatedCount={workspace.generatedCount}
        approvedCount={workspace.approvedCount}
        totalModules={MODULE_CONFIG.length}
      />

      {analysis ? (
        <PreprocessingPreview article={analysis.article} />
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex h-24 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <FileSearch className="size-4" />
            <span>Paste an article above to see the preprocessing breakdown.</span>
          </CardContent>
        </Card>
      )}

      {GROUP_ORDER.map((group) => {
        const modulesInGroup = MODULE_CONFIG.filter((module) => module.group === group);
        return (
          <section key={group} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {GROUP_LABELS[group]}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {modulesInGroup.map((config) => (
                <GenerationCard
                  key={config.id}
                  config={config}
                  state={workspace.modules[config.id]}
                  disabled={!hasArticle}
                  onGenerate={() => workspace.generateModule(config.id)}
                  onRegenerate={() => workspace.generateModule(config.id, { regenerate: true })}
                  onEditChange={(text) => workspace.updateEditedText(config.id, text)}
                  onApprove={() => workspace.approveModule(config.id)}
                  onUnapprove={() => workspace.unapproveModule(config.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

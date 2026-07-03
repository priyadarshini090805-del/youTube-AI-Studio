"use client";

import * as React from "react";
import { Copy, RefreshCw, Check, Lock, Unlock, Sparkles, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/feedback/toast-provider";
import type { ModuleConfig } from "@/features/generation/module-config";
import type { ModuleState } from "@/features/generation/types";

interface GenerationCardProps {
  config: ModuleConfig;
  state: ModuleState;
  disabled: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
  onEditChange: (text: string) => void;
  onApprove: () => void;
  onUnapprove: () => void;
}

export function GenerationCard({
  config,
  state,
  disabled,
  onGenerate,
  onRegenerate,
  onEditChange,
  onApprove,
  onUnapprove,
}: GenerationCardProps) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.editedText);
      showToast({ title: "Copied to clipboard", variant: "success" });
    } catch {
      showToast({ title: "Copy failed", description: "Your browser blocked clipboard access.", variant: "error" });
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            {config.label}
            {state.approved ? (
              <Badge variant="success" className="gap-1">
                <Check className="size-3" /> Approved
              </Badge>
            ) : state.status === "success" ? (
              <Badge variant="secondary">Draft</Badge>
            ) : null}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {state.status === "idle" && (
          <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border text-center text-sm text-muted-foreground">
            <Sparkles className="size-4" />
            <span>{disabled ? "Add article text to enable generation." : "Not generated yet."}</span>
          </div>
        )}

        {state.status === "loading" && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {state.status === "error" && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {state.status === "success" && (
          <Textarea
            value={state.editedText}
            onChange={(event) => onEditChange(event.target.value)}
            readOnly={state.approved}
            rows={config.group === "scripts" ? 12 : 6}
            className="font-mono text-sm"
            aria-label={`${config.label} output`}
          />
        )}
      </CardContent>

      <CardFooter className="flex-wrap gap-2">
        {state.status === "idle" && (
          <Button size="sm" onClick={onGenerate} disabled={disabled}>
            <Sparkles /> Generate
          </Button>
        )}

        {state.status === "error" && (
          <Button size="sm" onClick={onGenerate} disabled={disabled}>
            <RefreshCw /> Retry
          </Button>
        )}

        {(state.status === "success" || state.status === "loading") && (
          <>
            <Button size="sm" variant="outline" onClick={handleCopy} disabled={state.status !== "success"}>
              <Copy /> Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRegenerate}
              disabled={state.status === "loading"}
            >
              <RefreshCw className={state.status === "loading" ? "animate-spin" : ""} /> Regenerate
            </Button>
            {state.approved ? (
              <Button size="sm" variant="ghost" onClick={onUnapprove}>
                <Unlock /> Unlock
              </Button>
            ) : (
              <Button
                size="sm"
                variant="success"
                onClick={onApprove}
                disabled={state.status !== "success"}
              >
                <Lock /> Approve
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}

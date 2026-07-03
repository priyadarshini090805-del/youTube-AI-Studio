import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateRequestSchema } from "@/schemas/generate";
import { analyzeArticle } from "@/services/nlp/extractEntities";
import { findNewsroomClicheLeaks } from "@/services/generators/guardrails";
import { logger } from "@/lib/logger";
import type { ArticleAnalysis } from "@/types/article";

export function createGenerateHandler<TInput, TOutput>(
  moduleName: string,
  selectInput: (analysis: ArticleAnalysis) => TInput,
  generator: (input: TInput, variant: number) => TOutput,
) {
  return async function POST(request: Request) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const parsed = generateRequestSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = (parsed.error as ZodError).flatten().fieldErrors;
      return NextResponse.json({ error: "Invalid request.", fieldErrors }, { status: 422 });
    }

    try {
      const analysis = analyzeArticle(parsed.data.article);
      const result = generator(selectInput(analysis), parsed.data.variant);

      const clicheLeaks = findNewsroomClicheLeaks(analysis.article.category, result);
      if (clicheLeaks.length > 0) {
        logger.warn("generation.cliche_leak", {
          module: moduleName,
          category: analysis.article.category,
          phrases: clicheLeaks,
        });
      }

      logger.info("generation.success", { module: moduleName, category: analysis.article.category });
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      logger.error("generation.failure", {
        module: moduleName,
        error: error instanceof Error ? error.message : "unknown error",
      });
      return NextResponse.json(
        { error: "Generation failed. Please try again." },
        { status: 500 },
      );
    }
  };
}

export const selectArticle = (analysis: ArticleAnalysis) => analysis.article;
export const selectAnalysis = (analysis: ArticleAnalysis) => analysis;

import { z } from "zod";

export const generateRequestSchema = z.object({
  article: z
    .string()
    .trim()
    .min(40, "Article must be at least 40 characters so the analysis engine has enough context.")
    .max(20000, "Article is too long. Please keep it under 20,000 characters."),
  variant: z.number().int().min(0).max(1000).optional().default(0),
});

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;

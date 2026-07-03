import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateShortsScript } from "@/services/generators";

export const POST = createGenerateHandler("shortsScript", selectArticle, generateShortsScript);

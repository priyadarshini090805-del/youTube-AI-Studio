import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateHooks } from "@/services/generators";

export const POST = createGenerateHandler("hook", selectArticle, generateHooks);

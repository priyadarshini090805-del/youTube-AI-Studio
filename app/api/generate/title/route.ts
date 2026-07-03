import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateTitles } from "@/services/generators";

export const POST = createGenerateHandler("title", selectArticle, generateTitles);

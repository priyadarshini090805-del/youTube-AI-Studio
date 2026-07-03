import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateChapters } from "@/services/generators";

export const POST = createGenerateHandler("chapters", selectArticle, generateChapters);

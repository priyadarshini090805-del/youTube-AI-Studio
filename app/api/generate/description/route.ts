import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateDescription } from "@/services/generators";

export const POST = createGenerateHandler("description", selectArticle, generateDescription);

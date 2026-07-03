import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateSeo } from "@/services/generators";

export const POST = createGenerateHandler("seo", selectArticle, generateSeo);

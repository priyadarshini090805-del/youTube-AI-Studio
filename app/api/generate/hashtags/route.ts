import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateHashtags } from "@/services/generators";

export const POST = createGenerateHandler("hashtags", selectArticle, generateHashtags);

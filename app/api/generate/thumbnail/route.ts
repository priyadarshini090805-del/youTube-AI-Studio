import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateThumbnailText } from "@/services/generators";

export const POST = createGenerateHandler("thumbnail", selectArticle, generateThumbnailText);

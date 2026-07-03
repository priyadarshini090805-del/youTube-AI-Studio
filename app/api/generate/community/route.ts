import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateCommunityPost } from "@/services/generators";

export const POST = createGenerateHandler("community", selectArticle, generateCommunityPost);

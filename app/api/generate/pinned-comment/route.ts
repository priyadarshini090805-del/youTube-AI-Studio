import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generatePinnedComment } from "@/services/generators";

export const POST = createGenerateHandler("pinnedComment", selectArticle, generatePinnedComment);

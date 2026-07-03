import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateAnchorScript } from "@/services/generators";

export const POST = createGenerateHandler("anchorScript", selectArticle, generateAnchorScript);

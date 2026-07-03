import { createGenerateHandler, selectArticle } from "@/services/api/createGenerateHandler";
import { generateVoiceoverScript } from "@/services/generators";

export const POST = createGenerateHandler("voiceoverScript", selectArticle, generateVoiceoverScript);

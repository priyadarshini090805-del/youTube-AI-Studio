import { createGenerateHandler, selectAnalysis } from "@/services/api/createGenerateHandler";
import { checkQuality } from "@/services/generators";

export const POST = createGenerateHandler("quality", selectAnalysis, checkQuality);

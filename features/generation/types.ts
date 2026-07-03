import type { ModuleId } from "@/types/generation";

export type ModuleStatus = "idle" | "loading" | "success" | "error";

export interface ModuleState {
  status: ModuleStatus;
  data: unknown | null;
  editedText: string;
  approved: boolean;
  variant: number;
  error: string | null;
  generatedAt: string | null;
}

export type ModuleStateMap = Record<ModuleId, ModuleState>;

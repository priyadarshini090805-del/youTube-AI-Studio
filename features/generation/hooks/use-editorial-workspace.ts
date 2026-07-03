"use client";

import * as React from "react";

import type { ModuleId } from "@/types/generation";
import { MODULE_CONFIG } from "@/features/generation/module-config";
import type { ModuleState, ModuleStateMap } from "@/features/generation/types";
import { postJson, ApiError } from "@/lib/api-client";
import { formatGenerationResult } from "@/utils/formatGenerationResult";

function createIdleModuleState(): ModuleState {
  return {
    status: "idle",
    data: null,
    editedText: "",
    approved: false,
    variant: 0,
    error: null,
    generatedAt: null,
  };
}

function createInitialState(): ModuleStateMap {
  const entries = MODULE_CONFIG.map((module) => [module.id, createIdleModuleState()] as const);
  return Object.fromEntries(entries) as ModuleStateMap;
}

type Action =
  | { type: "START"; moduleId: ModuleId }
  | { type: "SUCCESS"; moduleId: ModuleId; data: unknown; variant: number }
  | { type: "ERROR"; moduleId: ModuleId; error: string }
  | { type: "UPDATE_EDITED"; moduleId: ModuleId; text: string }
  | { type: "APPROVE"; moduleId: ModuleId }
  | { type: "UNAPPROVE"; moduleId: ModuleId };

function reducer(state: ModuleStateMap, action: Action): ModuleStateMap {
  switch (action.type) {
    case "START":
      return {
        ...state,
        [action.moduleId]: { ...state[action.moduleId], status: "loading", error: null },
      };
    case "SUCCESS":
      return {
        ...state,
        [action.moduleId]: {
          ...state[action.moduleId],
          status: "success",
          data: action.data,
          editedText: formatGenerationResult(action.moduleId, action.data),
          approved: false,
          variant: action.variant,
          error: null,
          generatedAt: new Date().toISOString(),
        },
      };
    case "ERROR":
      return {
        ...state,
        [action.moduleId]: { ...state[action.moduleId], status: "error", error: action.error },
      };
    case "UPDATE_EDITED":
      return {
        ...state,
        [action.moduleId]: { ...state[action.moduleId], editedText: action.text, approved: false },
      };
    case "APPROVE":
      return {
        ...state,
        [action.moduleId]: { ...state[action.moduleId], approved: true },
      };
    case "UNAPPROVE":
      return {
        ...state,
        [action.moduleId]: { ...state[action.moduleId], approved: false },
      };
    default:
      return state;
  }
}

export function useEditorialWorkspace() {
  const [article, setArticle] = React.useState("");
  const [modules, dispatch] = React.useReducer(reducer, undefined, createInitialState);

  const generateModule = React.useCallback(
    async (moduleId: ModuleId, options?: { regenerate?: boolean }) => {
      const config = MODULE_CONFIG.find((module) => module.id === moduleId);
      if (!config) return;

      const nextVariant = options?.regenerate ? modules[moduleId].variant + 1 : 0;
      dispatch({ type: "START", moduleId });

      try {
        const result = await postJson(config.endpoint, { article, variant: nextVariant });
        dispatch({ type: "SUCCESS", moduleId, data: result, variant: nextVariant });
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Something went wrong while generating this section.";
        dispatch({ type: "ERROR", moduleId, error: message });
      }
    },
    [article, modules],
  );

  const generateAll = React.useCallback(async () => {
    await Promise.all(MODULE_CONFIG.map((module) => generateModule(module.id)));
  }, [generateModule]);

  const updateEditedText = React.useCallback((moduleId: ModuleId, text: string) => {
    dispatch({ type: "UPDATE_EDITED", moduleId, text });
  }, []);

  const approveModule = React.useCallback((moduleId: ModuleId) => {
    dispatch({ type: "APPROVE", moduleId });
  }, []);

  const unapproveModule = React.useCallback((moduleId: ModuleId) => {
    dispatch({ type: "UNAPPROVE", moduleId });
  }, []);

  const approvedCount = React.useMemo(
    () => Object.values(modules).filter((module) => module.approved).length,
    [modules],
  );

  const generatedCount = React.useMemo(
    () => Object.values(modules).filter((module) => module.status === "success").length,
    [modules],
  );

  return {
    article,
    setArticle,
    modules,
    generateModule,
    generateAll,
    updateEditedText,
    approveModule,
    unapproveModule,
    approvedCount,
    generatedCount,
  };
}

export type EditorialWorkspace = ReturnType<typeof useEditorialWorkspace>;

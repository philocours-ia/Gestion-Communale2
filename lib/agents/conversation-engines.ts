export type ThinkingLevel = "low" | "medium" | "high" | "xhigh";

export type ConversationEngineConfig = {
  id: string;
  assistantId: string;
  label: string;
  provider: "google";
  model: string;
  envOverrideKey: string;
  generationConfig: {
    temperature: number;
    max_output_tokens: number;
    thinking_level: ThinkingLevel;
  };
};

export const DEFAULT_HYDROGEN_MODEL = "gemini-4-hydrogen";

export const SUPPORTED_GEMINI_MODELS = new Set<string>([
  "gemini-4-hydrogen",
  "gemini-4-carbon",
]);

const BASE_ENGINES: Record<string, ConversationEngineConfig> = {
  workspace: {
    id: "engine-omnia-hydrogen",
    assistantId: "workspace",
    label: "OMNIA · Coordination",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_OMNIA",
    generationConfig: {
      temperature: 0.25,
      max_output_tokens: 1800,
      thinking_level: "medium",
    },
  },
  miora: {
    id: "engine-miora-hydrogen",
    assistantId: "miora",
    label: "MIORA · Gestion communale & CTD",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_MIORA",
    generationConfig: {
      temperature: 0.15,
      max_output_tokens: 2400,
      thinking_level: "high",
    },
  },
  maths: {
    id: "engine-miora-maths-hydrogen",
    assistantId: "maths",
    label: "MIORA · Mathématiques",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_MATHS",
    generationConfig: {
      temperature: 0.1,
      max_output_tokens: 2400,
      thinking_level: "high",
    },
  },
  felix: {
    id: "engine-felix-hydrogen",
    assistantId: "felix",
    label: "FELIX · Gestion pédagogique",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_FELIX",
    generationConfig: {
      temperature: 0.2,
      max_output_tokens: 2000,
      thinking_level: "medium",
    },
  },
  education: {
    id: "engine-education-hydrogen",
    assistantId: "education",
    label: "FELIX · Référentiel T12",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_FELIX",
    generationConfig: {
      temperature: 0.2,
      max_output_tokens: 2000,
      thinking_level: "medium",
    },
  },
  mia: {
    id: "engine-mia-hydrogen",
    assistantId: "mia",
    label: "MIA · Philosophie & Rédaction",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_MIA",
    generationConfig: {
      temperature: 0.35,
      max_output_tokens: 2400,
      thinking_level: "high",
    },
  },
  research: {
    id: "engine-research-hydrogen",
    assistantId: "research",
    label: "Recherche documentaire",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_RESEARCH",
    generationConfig: {
      temperature: 0.15,
      max_output_tokens: 2200,
      thinking_level: "medium",
    },
  },
  library: {
    id: "engine-library-hydrogen",
    assistantId: "library",
    label: "Bibliothèque",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_RESEARCH",
    generationConfig: {
      temperature: 0.15,
      max_output_tokens: 2000,
      thinking_level: "medium",
    },
  },
  documents: {
    id: "engine-documents-hydrogen",
    assistantId: "documents",
    label: "Rédaction administrative",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_DOCUMENTS",
    generationConfig: {
      temperature: 0.2,
      max_output_tokens: 2400,
      thinking_level: "medium",
    },
  },
  accounting: {
    id: "engine-accounting-hydrogen",
    assistantId: "accounting",
    label: "Comptabilité",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_ACCOUNTING",
    generationConfig: {
      temperature: 0.1,
      max_output_tokens: 2000,
      thinking_level: "high",
    },
  },
  history: {
    id: "engine-history-hydrogen",
    assistantId: "history",
    label: "Historique",
    provider: "google",
    model: DEFAULT_HYDROGEN_MODEL,
    envOverrideKey: "MIA_MODEL_HISTORY",
    generationConfig: {
      temperature: 0.2,
      max_output_tokens: 1600,
      thinking_level: "low",
    },
  },
};

export function resolveConversationEngine(
  assistantId: string = "workspace",
  assistantIntent?: string
): ConversationEngineConfig {
  const base = BASE_ENGINES[assistantId] ?? BASE_ENGINES.workspace;
  const globalDefault = process.env.MIA_MODEL || DEFAULT_HYDROGEN_MODEL;
  const perAssistantOverride = process.env[base.envOverrideKey];
  const resolvedModel = (perAssistantOverride || globalDefault).trim();

  const requestedGenerationConfig =
    assistantId === "mia" && assistantIntent === "civil"
      ? {
          temperature: 0.15,
          max_output_tokens: 2000,
          thinking_level: "medium" as ThinkingLevel,
        }
      : { ...base.generationConfig };

  // Gemini 4 Carbon does not support XHIGH; Hydrogen does.
  const generationConfig = {
    ...requestedGenerationConfig,
    thinking_level:
      resolvedModel === "gemini-4-carbon" &&
      requestedGenerationConfig.thinking_level === "xhigh"
        ? "high" as ThinkingLevel
        : requestedGenerationConfig.thinking_level,
  };

  return {
    ...base,
    model: resolvedModel,
    generationConfig,
  };
}

export function listConversationEngines(): Array<{
  assistantId: string;
  engineId: string;
  label: string;
  model: string;
  thinkingLevel: ThinkingLevel;
}> {
  return Object.keys(BASE_ENGINES).map((assistantId) => {
    const engine = resolveConversationEngine(assistantId);
    return {
      assistantId: engine.assistantId,
      engineId: engine.id,
      label: engine.label,
      model: engine.model,
      thinkingLevel: engine.generationConfig.thinking_level,
    };
  });
}

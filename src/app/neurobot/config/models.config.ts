import { ModelConfig } from "../types";

export const modelsConfig: ModelConfig[] = [
  {
    id: "gemini-3.5-flash",
    displayName: "Gemini 3.5 Flash",
    modelId: "gemini-3.5-flash",
    contextWindow: "1M",
    maxTokens: 8192,
    supportsReasoning: true,
    supportsVision: true,
    description: "Google's latest fast model — excellent balance of speed, high context, and task quality."
  },
  {
    id: "gemini-3.1-flash-lite",
    displayName: "Gemini 3.1 Flash Lite",
    modelId: "gemini-3.1-flash-lite",
    contextWindow: "1M",
    maxTokens: 8192,
    supportsReasoning: false,
    supportsVision: true,
    description: "Ultra-fast and cost-efficient for lightweight tasks and high-frequency conversation."
  },
  {
    id: "gemini-3.1-pro",
    displayName: "Gemini 3.1 Pro",
    modelId: "gemini-3.1-pro-preview",
    contextWindow: "1M",
    maxTokens: 8192,
    supportsReasoning: true,
    supportsVision: true,
    description: "Google's flagship reasoning model optimized for deep coding, math, and multi-step complex instructions."
  },
  {
    id: "gemini-2.5-flash",
    displayName: "Gemini 2.5 Flash",
    modelId: "gemini-2.5-flash",
    contextWindow: "1M",
    maxTokens: 8192,
    supportsReasoning: true,
    supportsVision: true,
    description: "Reliable production model with built-in thinking capability. Retires October 2026."
  }
];

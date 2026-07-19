import { ModelConfig } from "../types";

export const modelsConfig: ModelConfig[] = [
  {
    id: "gpt-oss-120b",
    displayName: "GPT OSS 120B",
    nvidiaModelId: "openai/gpt-oss-120b",
    contextWindow: "128K",
    maxTokens: 4096,
    supportsReasoning: false,
    supportsVision: true,
    description: "General-purpose high-capacity open-source model optimized for complex instructions and multi-turn chat."
  },
  {
    id: "gemma-4-31b",
    displayName: "Gemma 4 31B",
    nvidiaModelId: "google/gemma-4-31b-it",
    contextWindow: "64K",
    maxTokens: 4096,
    supportsReasoning: false,
    supportsVision: false,
    description: "Google's ultra-fast instruction-tuned model, exceptional at writing and structural formatting."
  },
  {
    id: "deepseek-v4-flash",
    displayName: "DeepSeek V4 Flash",
    nvidiaModelId: "deepseek-ai/deepseek-v4-flash",
    contextWindow: "128K",
    maxTokens: 8192,
    supportsReasoning: true,
    supportsVision: false,
    description: "Features deep chain-of-thought reasoning to solve logical, mathematical, and coding problems step-by-step."
  },
  {
    id: "minimax-m2.7",
    displayName: "Minimax M2.7",
    nvidiaModelId: "minimax/minimax-m2.7-chat",
    contextWindow: "200K",
    maxTokens: 4096,
    supportsReasoning: false,
    supportsVision: false,
    description: "Excellent for processing long context, document summarizing, and highly coherent multi-turn chats."
  },
  {
    id: "nemotron-120b",
    displayName: "Nemotron 120B",
    nvidiaModelId: "nvidia/nemotron-4-340b-instruct", // Mapping to high capacity Nemotron NIM
    contextWindow: "32K",
    maxTokens: 4096,
    supportsReasoning: true,
    supportsVision: true,
    description: "NVIDIA's flagship conversational model optimized for role-play, reasoning, and synthetic data generation."
  }
];

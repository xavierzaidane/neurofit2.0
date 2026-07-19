export interface Attachment {
  type: "image" | "file";
  name: string;
  dataUrl?: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;       // populated if model streamed chain-of-thought
  attachments?: Attachment[];
  model?: string;           // model used for this specific assistant message
  personalityId?: string;   // personality used for this specific assistant message
  thinkingTime?: number;    // seconds spent thinking
  scripted?: boolean;       // true = non-model message (no regenerate action)
  gymResults?: {            // populated for /findgym result messages
    location: { lat: number; lng: number; resolvedName: string };
    gyms: { name: string; lat: number; lng: number; address?: string; distanceMeters: number }[];
  };
  createdAt: string;        // ISO timestamp
}

export type PendingCommand =
  | { type: "none" }
  | { type: "findgym_awaiting_location" };

export interface ChatSession {
  id: string;
  title: string;            // auto-derived from first message, editable
  model: string;            // selected model ID
  personalityId: string;    // selected personality ID
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  version: 1;
}

export interface ModelConfig {
  id: string;
  displayName: string;
  modelId: string;
  contextWindow: string;
  maxTokens: number;
  supportsReasoning: boolean;
  supportsVision: boolean;
  description: string;
}

export interface PersonalityConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string; // Stored server-side normally, but client has access for local/frontend mode
}

export interface TemplateConfig {
  id: string;
  category: "Workouts" | "Nutrition" | "Recovery & Care" | "Coaching";
  title: string;
  icon: string;
  promptBody: string;
  placeholders?: string[];
}

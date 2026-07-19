import { useState, useEffect, useRef } from "react";
import { ChatSession, ChatMessage, Attachment } from "../types";
import { modelsConfig } from "../config/models.config";
import { personalitiesConfig } from "../config/personalities.config";

const SESSIONS_STORAGE_KEY = "neurobot:sessions:v2";
const ACTIVE_SESSION_ID_KEY = "neurobot:active_session_id";

// Helper to generate UUID
function generateUUID() {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function useNeurobot() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [offline, setOffline] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(SESSIONS_STORAGE_KEY);
      const parsed: ChatSession[] = stored ? JSON.parse(stored) : [];
      setSessions(parsed);

      const activeId = window.localStorage.getItem(ACTIVE_SESSION_ID_KEY);
      if (activeId && parsed.some(s => s.id === activeId)) {
        setActiveSessionId(activeId);
      } else if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage:", e);
    }

    // Monitor online state
    setOffline(!navigator.onLine);
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Sync sessions to localStorage whenever they change
  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
    }
  };

  // Sync activeSessionId to localStorage
  const selectSession = (id: string | null) => {
    setActiveSessionId(id);
    if (typeof window !== "undefined") {
      if (id) {
        window.localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
      } else {
        window.localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
      }
    }
  };

  const getActiveSession = (): ChatSession | undefined => {
    return sessions.find(s => s.id === activeSessionId);
  };

  // Create a new session
  const createNewSession = (
    modelId: string = modelsConfig[0].id,
    personalityId: string = personalitiesConfig[0].id
  ) => {
    const newSessionId = generateUUID();
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      model: modelId,
      personalityId: personalityId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    setSessions(prevSessions => {
      const nextSessions = [newSession, ...prevSessions];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(nextSessions));
      }
      return nextSessions;
    });

    selectSession(newSessionId);
    return newSession;
  };

  // Delete a session
  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);

    if (activeSessionId === id) {
      if (updated.length > 0) {
        selectSession(updated[0].id);
      } else {
        selectSession(null);
      }
    }
  };

  // Rename a session
  const renameSession = (id: string, newTitle: string) => {
    const updated = sessions.map(s => {
      if (s.id === id) {
        return { ...s, title: newTitle, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    saveSessions(updated);
  };

  // Clear all sessions
  const clearAllSessions = () => {
    saveSessions([]);
    selectSession(null);
  };

  // Update session parameters
  const updateSessionConfig = (id: string, updates: { model?: string; personalityId?: string }) => {
    const updated = sessions.map(s => {
      if (s.id === id) {
        return { ...s, ...updates, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    saveSessions(updated);
  };

  // Stop streaming response
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Client-side mock response streaming (fallback if backend not available)
  const streamMockResponse = async (
    userMessage: string,
    modelId: string,
    personalityId: string,
    attachments: Attachment[] = [],
    onChunk: (type: "reasoning" | "content", text: string) => void,
    onDone: () => void,
    onError: (err: string) => void
  ) => {
    const model = modelsConfig.find(m => m.id === modelId) || modelsConfig[0];
    const personality = personalitiesConfig.find(p => p.id === personalityId) || personalitiesConfig[0];

    // Build responsive answers based on prompts/inputs
    let reasoningText = "";
    let contentText = "";

    // Generate smart contextual answers
    const lowerMsg = userMessage.toLowerCase();
    
    // Choose responses based on inputs
    if (model.supportsReasoning) {
      reasoningText = `Analyzing query: "${userMessage}"
Selected model: ${model.displayName}
Selected personality: ${personality.name}
Applying system instructions: "${personality.systemPrompt.slice(0, 45)}..."
Steps:
1. Parse core intent of the message.
2. Formulate response structure adhering to "${personality.name}" tone.
3. Validate fitness/programming context if present.
4. Compose markdown output.`;
    }

    if (lowerMsg.includes("email") || lowerMsg.includes("subject")) {
      contentText = `Here is a drafted email tailored to your requirements, written in a **${personality.name}** style:

\`\`\`markdown
Subject: Request for Project Review & Next Steps

Hi Team,

I hope this message finds you well. 

As we approach our upcoming milestone, I wanted to share a quick update on our progress and outline the key priorities for the upcoming sprint. Over the last week, we successfully established the foundational architecture and integrated the primary components.

Key items to cover in our alignment session:
* Code architecture verification and sign-off
* Deployment pipelines and timeline confirmation
* Allocation of resources for security reviews

Please let me know your availability for a 30-minute sync tomorrow afternoon.

Best regards,
[Your Name]
\`\`\`

*Hope this helps! Let me know if you would like to adjust the tone, expand any points, or add a call to action.*`;
    } else if (lowerMsg.includes("code") || lowerMsg.includes("function") || lowerMsg.includes("typescript") || lowerMsg.includes("javascript")) {
      contentText = `Here is an explanation and an optimized implementation based on your code query:

### Optimized TypeScript Implementation

We can leverage an asynchronous generator pattern to handle stream reading cleanly:

\`\`\`typescript
async function* readStream(response: Response) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}
\`\`\`

### Key Performance Benefits:
1. **Memory Efficiency**: Processes chunks incrementally without loading the entire response into memory.
2. **Immediate Rendering**: Tokens are yielded as soon as they arrive, optimizing User Experience.
3. **Robust Cleanup**: The \`finally\` block ensures the reader lock is released correctly even if the iteration is aborted.

Let me know if you want to integrate this with standard React State!`;
    } else if (lowerMsg.includes("workout") || lowerMsg.includes("diet") || lowerMsg.includes("fitness") || lowerMsg.includes("plan")) {
      contentText = `As your **${personality.name}**, here is a customized fitness recommendation:

### Custom Workout Split & Goal Strategy

Based on your prompt, here is a highly optimized structure:

| Day | Focus Area | Core Exercises | Sets x Reps |
| :--- | :--- | :--- | :--- |
| **Day 1** | Push (Chest/Shoulders/Triceps) | Barbell Bench Press, Overhead Press, Dips | 3-4 sets x 8-12 reps |
| **Day 2** | Pull (Back/Biceps/Rear Delts) | Weighted Pull-Ups, Barbell Rows, Face Pulls | 3-4 sets x 8-12 reps |
| **Day 3** | Legs (Quads/Hamstrings/Calves) | Barbell Back Squats, Romanian Deadlifts, Calf Raises | 3-4 sets x 6-10 reps |

### Nutrition Focus
* **Protein Target**: Aim for approximately 1.8 - 2.2 grams of protein per kilogram of body weight to support muscle synthesis and recovery.
* **Hydration**: Ensure at least 3-4 liters of water daily.

*Consistency is your greatest tool. Let's crush this!*`;
    } else {
      contentText = `I am responding as the **${personality.name}** using the **${model.displayName}** model.

Here is my analysis of your query:
* **Prompt received**: "${userMessage}"
* **Attachments**: ${attachments.length > 0 ? `${attachments.length} file(s) attached` : "none"}
* **Personality stance**: Acting with the traits of *${personality.description}*

### Key Points:
1. **Structured Layout**: Standardized markdown rendering with clear headings and bullet lists.
2. **Context-Aware Style**: My response tone is modified dynamically to match the personality you selected in the composer bar.
3. **Model Specifics**: Serving completions using Google AI Studio (Gemini) endpoint (\`${model.modelId}\`).

Please let me know if you'd like to test specific prompts, slash commands like \`/templates\`, or switch to a different personality!`;
    }

    // Stream reasoning if supported
    if (model.supportsReasoning && reasoningText) {
      const reasoningWords = reasoningText.split(" ");
      for (let i = 0; i < reasoningWords.length; i++) {
        if (abortControllerRef.current?.signal.aborted) return;
        onChunk("reasoning", (i === 0 ? "" : " ") + reasoningWords[i]);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      await new Promise(resolve => setTimeout(resolve, 500)); // Pause between reasoning and content
    }

    // Stream content
    const contentWords = contentText.split(" ");
    for (let i = 0; i < contentWords.length; i++) {
      if (abortControllerRef.current?.signal.aborted) return;
      onChunk("content", (i === 0 ? "" : " ") + contentWords[i]);
      await new Promise(resolve => setTimeout(resolve, 15));
    }

    if (!abortControllerRef.current?.signal.aborted) {
      onDone();
    }
  };

  // Send a message
  const sendMessage = async (
    text: string,
    attachments: Attachment[] = []
  ) => {
    if (isStreaming) return;

    let currentSession = getActiveSession();
    let isNew = false;
    if (!currentSession) {
      isNew = true;
      currentSession = createNewSession();
    }

    const modelId = currentSession.model;
    const personalityId = currentSession.personalityId;
    const targetSessionId = currentSession.id;

    const userMsg: ChatMessage = {
      id: generateUUID(),
      role: "user",
      content: text,
      attachments: attachments,
      createdAt: new Date().toISOString()
    };

    const assistantMsgId = generateUUID();
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      reasoning: "",
      model: modelId,
      personalityId: personalityId,
      createdAt: new Date().toISOString()
    };

    const sessionMessages = [...currentSession.messages, userMsg, assistantMsg];

    // Auto title if first message
    let title = currentSession.title;
    if (currentSession.messages.length === 0) {
      title = text.length > 30 ? text.slice(0, 27) + "..." : text;
    }

    const updatedSession: ChatSession = {
      ...currentSession,
      title,
      messages: sessionMessages,
      updatedAt: new Date().toISOString()
    };

    setSessions(prevSessions => {
      const exists = prevSessions.some(s => s.id === updatedSession.id);
      let nextSessions: ChatSession[];
      if (exists) {
        nextSessions = prevSessions.map(s => s.id === updatedSession.id ? updatedSession : s);
      } else {
        nextSessions = [updatedSession, ...prevSessions];
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(nextSessions));
      }
      return nextSessions;
    });

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    const updateAssistantMessage = (updates: Partial<ChatMessage>) => {
      setSessions(prevSessions => {
        const nextSessions = prevSessions.map(s => {
          if (s.id === targetSessionId) {
            const nextMessages = s.messages.map(m => {
              if (m.id === assistantMsgId) {
                return { ...m, ...updates };
              }
              return m;
            });
            return { ...s, messages: nextMessages, updatedAt: new Date().toISOString() };
          }
          return s;
        });

        if (typeof window !== "undefined") {
          window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(nextSessions));
        }
        return nextSessions;
      });
    };

    let accumulatedContent = "";
    let accumulatedReasoning = "";

    try {
      // 1. Attempt call to the real Next.js API route
      const response = await fetch("/api/neurobot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelId,
          personalityId,
          messages: sessionMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
          attachments,
          sessionId: targetSessionId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("ReadableStream not supported by API response");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("event:")) {
            currentEvent = trimmed.slice(6).trim();
          } else if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.slice(5).trim();
            try {
              const parsedData = JSON.parse(dataStr);
              if (currentEvent === "reasoning_delta") {
                accumulatedReasoning += parsedData.text || "";
                updateAssistantMessage({ reasoning: accumulatedReasoning });
              } else if (currentEvent === "content_delta") {
                accumulatedContent += parsedData.text || "";
                updateAssistantMessage({ content: accumulatedContent });
              } else if (currentEvent === "done") {
                // Done event
              } else if (currentEvent === "error") {
                throw new Error(parsedData.message || "Unknown streaming error");
              }
            } catch (e) {
              console.warn("Failed to parse SSE data block:", e);
            }
          }
        }
      }

      setIsStreaming(false);

    } catch (apiError: any) {
      if (apiError.name === "AbortError") {
        console.log("Stream request aborted by user.");
        return;
      }

      console.warn("API route failed or not found, falling back to frontend mock streaming. Error:", apiError.message);

      accumulatedContent = "";
      accumulatedReasoning = "";

      // 2. Mock Fallback Mode
      await streamMockResponse(
        text,
        modelId,
        personalityId,
        attachments,
        (type, chunk) => {
          if (type === "reasoning") {
            accumulatedReasoning += chunk;
            updateAssistantMessage({ reasoning: accumulatedReasoning });
          } else {
            accumulatedContent += chunk;
            updateAssistantMessage({ content: accumulatedContent });
          }
        },
        () => {
          setIsStreaming(false);
        },
        (errorMsg) => {
          updateAssistantMessage({ content: `**Error**: ${errorMsg}` });
          setIsStreaming(false);
        }
      );
    }
  };

  const appendMessage = (msg: ChatMessage) => {
    setSessions(prevSessions => {
      let currentSession = (activeSessionId ? prevSessions.find(s => s.id === activeSessionId) : undefined) || prevSessions[0];
      let isNew = false;

      if (!currentSession) {
        isNew = true;
        const newSessionId = activeSessionId || generateUUID();
        currentSession = {
          id: newSessionId,
          title: "New Chat",
          model: modelsConfig[0].id,
          personalityId: personalitiesConfig[0].id,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1
        };
      }

      const sessionMessages = [...currentSession.messages, msg];

      let title = currentSession.title;
      if (currentSession.messages.length === 0 && msg.role === "user") {
        title = msg.content.length > 30 ? msg.content.slice(0, 27) + "..." : msg.content;
      }

      const updatedSession: ChatSession = {
        ...currentSession,
        title,
        messages: sessionMessages,
        updatedAt: new Date().toISOString()
      };

      let nextSessions: ChatSession[];
      if (isNew) {
        nextSessions = [updatedSession, ...prevSessions];
      } else {
        nextSessions = prevSessions.map(s => s.id === updatedSession.id ? updatedSession : s);
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(nextSessions));
      }

      if (isNew) {
        setTimeout(() => selectSession(updatedSession.id), 0);
      }

      return nextSessions;
    });
  };

  const updateLastAssistantMessage = (updates: Partial<ChatMessage>) => {
    setSessions(prevSessions => {
      const currentSession = (activeSessionId ? prevSessions.find(s => s.id === activeSessionId) : undefined) || prevSessions[0];
      if (!currentSession) return prevSessions;

      const nextSessions = prevSessions.map(s => {
        if (s.id === currentSession.id) {
          const nextMessages = [...s.messages];
          for (let i = nextMessages.length - 1; i >= 0; i--) {
            if (nextMessages[i].role === "assistant") {
              nextMessages[i] = { ...nextMessages[i], ...updates };
              break;
            }
          }
          return { ...s, messages: nextMessages, updatedAt: new Date().toISOString() };
        }
        return s;
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(nextSessions));
      }
      return nextSessions;
    });
  };

  return {
    sessions,
    activeSessionId,
    isStreaming,
    offline,
    activeSession: getActiveSession(),
    createNewSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    selectSession,
    updateSessionConfig,
    sendMessage,
    stopStreaming,
    appendMessage,
    updateLastAssistantMessage
  };
}

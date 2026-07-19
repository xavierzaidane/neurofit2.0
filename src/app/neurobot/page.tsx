"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNeurobot } from "./hooks/useNeurobot";
import { ChatSession, TemplateConfig, PendingCommand } from "./types";
import { CommandItem } from "../../components/neurobot/SlashCommandMenu";

// Components

import EmptyState from "../../components/neurobot/EmptyState";
import MessageList from "../../components/neurobot/MessageList";
import Composer from "../../components/neurobot/Composer";
import TemplatePickerModal from "../../components/neurobot/TemplatePickerModal";
import HistoryCommandMenu from "../../components/neurobot/HistoryCommandMenu";
import HistoryModal from "../../components/neurobot/HistoryModal";
import { Icon } from "../../components/neurobot/IconHelper";

// Styles are now in globals.css

export default function NeurobotPage() {
  const {
    sessions,
    activeSessionId,
    isStreaming,
    offline,
    activeSession,
    createNewSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    selectSession,
    updateSessionConfig,
    sendMessage,
    stopStreaming,
    appendMessage,
    updateLastAssistantMessage,
  } = useNeurobot();

  // Component UI states
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [composerInput, setComposerInput] = useState("");
  const [pendingCommand, setPendingCommand] = useState<PendingCommand>({ type: "none" });

  // UUID generator helper
  const generateUUID = () => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSelectTemplate = (template: TemplateConfig) => {
    setComposerInput(template.promptBody);
  };

  const handleSend = async (text: string, attachments: any[]) => {
    if (pendingCommand.type === "findgym_awaiting_location") {
      setPendingCommand({ type: "none" });
      const locationInput = text.trim();
      
      appendMessage({
        id: generateUUID(),
        role: "user",
        content: locationInput,
        createdAt: new Date().toISOString()
      });

      appendMessage({
        id: generateUUID(),
        role: "assistant",
        content: `Searching for gyms near ${locationInput}...`,
        scripted: true,
        createdAt: new Date().toISOString()
      });

      try {
        const res = await fetch(`/api/neurobot/findgym?location=${encodeURIComponent(locationInput)}`);
        if (!res.ok) {
          throw new Error("Failed to search for gyms.");
        }
        
        const data = await res.json();
        
        if (data.error === "location_not_found") {
          updateLastAssistantMessage({
            content: `I couldn't find that location — could you try a more specific address or nearby landmark?`,
            scripted: true
          });
          setPendingCommand({ type: "findgym_awaiting_location" });
        } else if (data.error === "no_gyms_found") {
          const resolvedName = data.searchedLocation?.resolvedName || locationInput;
          updateLastAssistantMessage({
            content: `I couldn't find any gyms within 15km of **${resolvedName}**. Try a different area?`,
            scripted: true
          });
          setPendingCommand({ type: "findgym_awaiting_location" });
        } else if (data.gyms && data.gyms.length > 0) {
          const resolvedName = data.location?.resolvedName || locationInput;
          updateLastAssistantMessage({
            content: `Here are the top 5 gyms near **${resolvedName}**:`,
            scripted: true,
            gymResults: data
          });
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        console.error("Gym search error:", err);
        updateLastAssistantMessage({
          content: "Something went wrong searching for gyms — please try again in a moment.",
          scripted: true
        });
      }
    } else {
      sendMessage(text, attachments);
    }
  };

  const handleRegenerate = (index: number) => {
    if (!activeSession || isStreaming) return;

    // Find preceding user message
    let userMsgText = "";
    let userAttachments: any[] = [];
    for (let i = index - 1; i >= 0; i--) {
      if (activeSession.messages[i].role === "user") {
        userMsgText = activeSession.messages[i].content;
        userAttachments = activeSession.messages[i].attachments || [];
        break;
      }
    }
    if (!userMsgText) return;

    // Delete assistant message and any messages after it
    const updatedMessages = activeSession.messages.slice(0, index);

    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("neurobot:sessions:v2");
        const list: ChatSession[] = stored ? JSON.parse(stored) : [];
        const sIdx = list.findIndex((s) => s.id === activeSession.id);
        if (sIdx !== -1) {
          list[sIdx].messages = updatedMessages;
          window.localStorage.setItem("neurobot:sessions:v2", JSON.stringify(list));
        }
      } catch (err) {
        console.error("Failed to update messages for regeneration:", err);
      }
    }

    // Trigger sending again to stream a new response
    sendMessage(userMsgText, userAttachments);
  };

  // Keyboard listener for Escape to clear /history search query
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (composerInput.startsWith("/history")) {
          setComposerInput("");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [composerInput]);

  // Cancel pending command when session changes
  useEffect(() => {
    setPendingCommand({ type: "none" });
  }, [activeSessionId]);

  const slashCommands: CommandItem[] = useMemo(() => [
    {
      command: "/new",
      description: "Start a new conversation thread",
      icon: "Plus",
      action: () => {
        setPendingCommand({ type: "none" });
        createNewSession();
      },
    },
    {
      command: "/history",
      description: "Browse and select from your past chat conversations",
      icon: "MessageSquare",
      action: () => {
        setPendingCommand({ type: "none" });
        setHistoryModalOpen(true);
      },
    },
    {
      command: "/templates",
      description: "Browse and select from 17 prompt templates",
      icon: "LayoutGrid",
      action: () => {
        setPendingCommand({ type: "none" });
        setTemplateModalOpen(true);
      },
    },
    {
      command: "/findgym",
      description: "Find gyms near a location",
      icon: "Dumbbell",
      action: () => {
        setPendingCommand({ type: "none" });

        appendMessage({
          id: generateUUID(),
          role: "user",
          content: "/findgym",
          createdAt: new Date().toISOString()
        });

        appendMessage({
          id: generateUUID(),
          role: "assistant",
          content: "Sure — what location or region should I search near? (e.g. a neighborhood, city, or address)",
          scripted: true,
          createdAt: new Date().toISOString()
        });

        setPendingCommand({ type: "findgym_awaiting_location" });
      },
    },
    {
      command: "/model",
      description: "Quick model selection selector",
      icon: "Cpu",
      action: () => {
        setPendingCommand({ type: "none" });
        const btn = document.querySelector('[data-ref="modelDropdownRef"]') as HTMLElement;
        btn?.click();
      },
    },
    {
      command: "/personality",
      description: "Quick personality selector",
      icon: "User",
      action: () => {
        setPendingCommand({ type: "none" });
        const btn = document.querySelector('[data-ref="personalityDropdownRef"]') as HTMLElement;
        btn?.click();
      },
    },
    {
      command: "/clear",
      description: "Delete current active chat",
      icon: "Trash2",
      action: () => {
        setPendingCommand({ type: "none" });
        if (activeSession) {
          deleteSession(activeSession.id);
        }
      },
    },
    {
      command: "/help",
      description: "Show information and instructions about Neurobot",
      icon: "HelpCircle",
      action: () => {
        setPendingCommand({ type: "none" });
        alert(
          "Neurobot Chat Commands:\n\n" +
            "/new - Start a new chat\n" +
            "/history - Search past chats\n" +
            "/templates - Open the templates picker\n" +
            "/findgym - Find gyms near a location\n" +
            "/clear - Delete current chat\n" +
            "Type '/' in the message field to see auto-complete dropdown."
        );
      },
    },
  ], [activeSession, deleteSession, createNewSession, appendMessage]);

  const currentSession = activeSession;
  const isHistoryActive = composerInput.startsWith("/history");
  const hasMessages = !!(currentSession && currentSession.messages.length > 0);

  // ---------------------------------------------------------------------------
  // composerBlock — renders the shared composer markup for both layout states.
  // This is a RENDER FUNCTION (called as `{composerBlock}`), NOT a component
  // (never `<ComposerBlock />`). Defining it as a component inside the render
  // body would create a new component type every render, causing React to
  // unmount/remount the textarea and drop keyboard focus after each keystroke.
  // ---------------------------------------------------------------------------
  const composerBlock = (
    <motion.div
      layoutId="composer-wrap"
      layout
      transition={{ duration: 0.27, ease: "easeOut" }}
      className="w-full"
    >
      {isHistoryActive && (
        <HistoryCommandMenu
          sessions={sessions}
          inputText={composerInput}
          onSelect={(id) => {
            selectSession(id);
            setComposerInput("");
          }}
          onClose={() => setComposerInput("")}
        />
      )}
      <Composer
        input={composerInput}
        setInput={setComposerInput}
        onSend={handleSend}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        selectedModel={activeSession?.model || ""}
        setSelectedModel={(modelId) =>
          activeSession && updateSessionConfig(activeSession.id, { model: modelId })
        }
        selectedPersonality={activeSession?.personalityId || ""}
        setSelectedPersonality={(personalityId) =>
          activeSession && updateSessionConfig(activeSession.id, { personalityId })
        }
        offline={offline}
        slashCommands={slashCommands}
      />
    </motion.div>
  );

  return (
    // Permanently dark-themed. No theme toggle, no runtime class switching.
    <div className="flex h-screen bg-black text-white relative">
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col h-full bg-neutral-950 relative min-w-0">

        {/* ── EMPTY STATE: composer centered with EmptyState ── */}
        {!hasMessages ? (
          <div className="flex-grow flex flex-col justify-center items-center overflow-hidden px-4 md:px-6 pb-4">
            <EmptyState
              onSelectTemplate={handleSelectTemplate}
              onOpenAllTemplates={() => setTemplateModalOpen(true)}
            />
            <div className="w-full max-w-4xl mt-4">
              {composerBlock}
            </div>
          </div>
        ) : (
          /* ── CHAT STATE: MessageList + bottom-docked composer ── */
          <>
            {/* Scrollable message list — overflow-hidden scoped here, not on root */}
            <div className="flex-grow overflow-hidden flex flex-col relative w-full">
              <MessageList
                messages={currentSession!.messages}
                isStreaming={isStreaming}
                onRegenerate={handleRegenerate}
              />
            </div>

            {/* Bottom Docked Composer */}
            <div className="px-4 md:px-6 pb-2 w-full max-w-4xl mx-auto flex-shrink-0 z-20">
              {composerBlock}
            </div>
          </>
        )}
      </div>

      {/* Modals & Dialogs */}
      <TemplatePickerModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelect={handleSelectTemplate}
      />

      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        sessions={sessions}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
      />
    </div>
  );
}
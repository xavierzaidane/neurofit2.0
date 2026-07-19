import React, { useState } from "react";
import { ChatMessage } from "../../app/neurobot/types";
import Markdown from "./Markdown";
import { Icon } from "./IconHelper";
import { ShiningText } from "@/components/ui/shining-text";
import GymResultsCard from "./GymResultsCard";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onRegenerate?: (index: number) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  onRegenerate,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThoughtIds, setExpandedThoughtIds] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThought = (id: string) => {
    setExpandedThoughtIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Simple helper to get a pseudo-random stable thinking time for the model
  const getThinkingTime = (msg: ChatMessage) => {
    if (msg.thinkingTime) return msg.thinkingTime.toFixed(1);
    // Stable pseudo-random time based on message ID length/chars
    const charSum = msg.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((charSum % 35) / 10 + 1.5).toFixed(1);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 select-text scrollbar-hide max-w-4xl mx-auto w-full pt-30">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const isLast = index === messages.length - 1;

        if (isUser) {
          return (
            <div key={msg.id} className="flex justify-end animate-fadeIn">
              <div className="max-w-[85%] sm:max-w-[75%] flex flex-col items-end gap-1.5">
                {/* User Message Bubble: Light/white rounded bubble, no avatar */}
                <div className="bg-white/90 text-black rounded-2xl rounded px-4 py-2.5 text-sm font-sans leading-relaxed selection:bg-[var(--foreground)]/30 select-text font-medium shadow-sm">
                  {msg.content}
                </div>

                {/* Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {msg.attachments.map((attach, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-center gap-1 px-2.5 py-0.5 bg-white/5 border border-white/15 rounded-full text-[10px] text-white/50"
                      >
                        <Icon
                          name={attach.type === "image" ? "Image" : "FileText"}
                          size={10}
                          className="text-[var(--foreground)]"
                        />
                        <span className="max-w-[150px] truncate">{attach.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Assistant Message Bubble
        const isThoughtExpanded = !!expandedThoughtIds[msg.id];
        const showThought = !!msg.reasoning;
        const isActivelyReasoning = isStreaming && isLast && !msg.content;

        return (
          <div key={msg.id} className="flex justify-start animate-fadeIn">
            <div className="max-w-[90%] sm:max-w-[85%] flex flex-col gap-1">
              
              {/* Collapsible line: "› Thought for {N.N}s" or "› Thinking..." */}
              {showThought && (
                <div className="px-1 flex flex-col items-start">
                  <button
                    type="button"
                    onClick={() => toggleThought(msg.id)}
                    className="flex items-center gap-1 text-xs font-mono text-white/40 hover:text-white/60 transition-colors py-1"
                  >
                    <span
                      className={`inline-block font-sans text-sm font-semibold transition-transform duration-200 ${
                        isThoughtExpanded ? "rotate-90" : ""
                      }`}
                    >
                      ›
                    </span>
                    {isActivelyReasoning ? (
                      <ShiningText text="Thinking..." className="text-xs" />
                    ) : (
                      <span>Thought for {getThinkingTime(msg)}s</span>
                    )}
                  </button>

                  {isThoughtExpanded && (
                    <div className="mt-1 mb-2 pl-3 border-l border-white/10 text-xs font-mono text-white/40 leading-relaxed whitespace-pre-wrap selection:bg-[var(--foreground)]/20 max-h-48 overflow-y-auto">
                      {msg.reasoning}
                    </div>
                  )}
                </div>
              )}

              {/* Assistant Bubble or ShiningText status indicator */}
              {msg.content ? (
                <div className="bg-neutral-900 border border-white/5 rounded-2xl rounded p-4 shadow-sm relative group overflow-hidden">
                  {msg.gymResults ? (
                    <GymResultsCard gymResults={msg.gymResults} />
                  ) : (
                    <Markdown content={msg.content} />
                  )}
                </div>
              ) : isStreaming && isLast ? (
                <div className="py-2 px-1 select-none">
                  <ShiningText text="Neurobot is thinking..." />
                </div>
              ) : (
                <div className="bg-neutral-900 border border-white/5 rounded-2xl rounded p-4 shadow-sm relative group overflow-hidden">
                  <div className="flex items-center gap-1.5 py-1 px-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)] animate-bounce" />
                  </div>
                </div>
              )}

              {/* Under-bubble Actions: left-aligned copy and regenerate */}
              {msg.content && !isStreaming && (
                <div className="flex items-center gap-2 px-1 py-1 select-none">
                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="p-1 text-white/30 hover:text-white/70 hover:bg-white/5 rounded transition-all duration-200"
                    title="Copy response"
                  >
                    <Icon name={copiedId === msg.id ? "Check" : "Copy"} size={13} className={copiedId === msg.id ? "text-green-500" : ""} />
                  </button>

                  {/* Regenerate button (only visible for user messages or if handler passed and not scripted) */}
                  {onRegenerate && !msg.scripted && (
                    <button
                      type="button"
                      onClick={() => onRegenerate(index)}
                      className="p-1 text-white/30 hover:text-white/70 hover:bg-white/5 rounded transition-all duration-200"
                      title="Regenerate response"
                    >
                      <Icon name="RotateCw" size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;

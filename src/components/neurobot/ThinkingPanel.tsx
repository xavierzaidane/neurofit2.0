import React, { useState } from "react";
import { Icon } from "./IconHelper";

interface ThinkingPanelProps {
  thinking: string;
  isStreaming?: boolean;
}

export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({ thinking, isStreaming = false }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!thinking) return null;

  return (
    <div className="mb-3 border border-white/5 bg-white/5 dark:bg-white/[0.02] rounded-xl overflow-hidden shadow-inner">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono text-white/50 hover:text-white/80 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <Icon
            name="BrainCircuit"
            className={`text-orange-400/80 ${isStreaming ? "animate-pulse" : ""}`}
            size={14}
          />
          <span>Reasoning process</span>
          {isStreaming && (
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping" />
          )}
        </div>
        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md text-[10px]">
          <span>{isOpen ? "Hide" : "Show"}</span>
          <Icon
            name="ChevronDown"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            size={12}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-3 pt-1 border-t border-white/5 text-xs font-mono text-white/40 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto selection:bg-orange-500/20">
          {thinking}
        </div>
      )}
    </div>
  );
};

export default ThinkingPanel;

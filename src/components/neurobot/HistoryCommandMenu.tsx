import React from "react";
import { ChatSession } from "../../app/neurobot/types";
import { modelsConfig } from "../../app/neurobot/config/models.config";
import { Icon } from "./IconHelper";
import { Command, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";

interface HistoryCommandMenuProps {
  sessions: ChatSession[];
  inputText: string;
  onSelect: (sessionId: string) => void;
  onClose: () => void;
}

export const HistoryCommandMenu: React.FC<HistoryCommandMenuProps> = ({
  sessions,
  inputText,
  onSelect,
  onClose,
}) => {
  // Extract query after "/history "
  const query = inputText.startsWith("/history ") ? inputText.slice(9).toLowerCase() : "";
  
  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(query)
  );

  const getModelLabel = (modelId: string) => {
    return modelsConfig.find((m) => m.id === modelId)?.displayName || modelId;
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <Command className="absolute bottom-full left-0 mb-2 w-80 max-h-60 overflow-y-auto bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] z-50 divide-y divide-white/5 animate-fadeIn">
      <div className="px-3.5 py-2 bg-white/[0.02] flex justify-between items-center text-[10px] text-white/40 font-mono">
        <span>Chat History ({filtered.length})</span>
        <button type="button" onClick={onClose} className="hover:text-white">
          esc to close
        </button>
      </div>
      
      <CommandList className="scrollbar-none">
        {filtered.length === 0 ? (
          <CommandEmpty className="py-6 text-center text-xs text-white/40">
            <Icon name="MessageSquareOff" size={20} className="mx-auto mb-2 opacity-50 text-[var(--foreground)]" />
            No past sessions found matching "{query}"
          </CommandEmpty>
        ) : (
          filtered.map((s) => (
            <CommandItem
              key={s.id}
              onSelect={() => onSelect(s.id)}
              className="w-full flex flex-col text-left px-3.5 py-2.5 hover:bg-white/5 text-white/60 hover:text-white transition-all duration-150 cursor-default"
            >
              <span className="font-semibold text-xs truncate text-[var(--foreground)]/90">{s.title}</span>
              <span className="text-[9px] text-white/30 mt-1 font-mono">
                {formatDate(s.updatedAt)} • {getModelLabel(s.model)}
              </span>
            </CommandItem>
          ))
        )}
      </CommandList>
    </Command>
  );
};

export default HistoryCommandMenu;

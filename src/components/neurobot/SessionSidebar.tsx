import React, { useState } from "react";
import { ChatSession } from "../../app/neurobot/types";
import { modelsConfig } from "../../app/neurobot/config/models.config";
import { Icon } from "./IconHelper";

interface SessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  onNewChat: () => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  onNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <button
        type="button"
        onClick={onClose}
        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-default animate-fadeIn"
      />

      {/* Sidebar Panel */}
      <aside className="fixed md:static inset-y-0 left-0 w-72 bg-neutral-900 border-r border-white/10 flex flex-col z-50 animate-fadeIn h-full">
        {/* Sidebar Header */}
        <div className="h-16 border-b border-white/10 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Bot" className="text-orange-400" size={18} />
            <span className="font-bold text-sm tracking-tight text-white uppercase font-mono">Chat History</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-lg"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Quick Search */}
        <div className="p-4 border-b border-white/5 bg-black/10">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={13} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all duration-200"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 select-none scrollbar-thin scrollbar-thumb-white/10 bg-black/10">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-white/20">
              <Icon name="MessageSquareOff" size={24} className="mb-2 opacity-50" />
              <p className="text-xs">No conversations found</p>
            </div>
          ) : (
            filteredSessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  className={`group relative flex items-center w-full rounded-xl transition-all duration-200 overflow-hidden ${
                    isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSession(s.id);
                      // Close sidebar on mobile
                      if (window.innerWidth < 768) onClose();
                    }}
                    className="flex-1 text-left px-3.5 py-3 pr-10 min-w-0"
                  >
                    <div className="font-semibold text-xs truncate leading-normal pr-4">
                      {s.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[9px] opacity-60 font-mono">
                      <span>{formatDate(s.updatedAt)}</span>
                      <span>•</span>
                      <span className="truncate max-w-[100px]">{getModelLabel(s.model)}</span>
                    </div>
                  </button>

                  {/* Actions (Delete icon) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this conversation?")) {
                        onDeleteSession(s.id);
                      }
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    title="Delete conversation"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        {sessions.length > 0 && (
          <div className="p-3 border-t border-white/10 bg-neutral-900/40">
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
                  onClearAll();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 hover:bg-red-500/10 text-white/30 hover:text-red-400 border border-transparent hover:border-red-500/10 rounded-xl transition-all duration-200 text-xs font-semibold font-mono"
            >
              <Icon name="Trash2" size={12} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default SessionSidebar;

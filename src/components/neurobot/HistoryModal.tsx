import React, { useState } from "react";
import { ChatSession } from "../../app/neurobot/types";
import { Icon } from "./IconHelper";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  if (!isOpen) return null;

  // Calculate relative time (e.g. "7h ago", "18h ago")
  const getRelativeTime = (isoString: string) => {
    try {
      const now = new Date();
      const date = new Date(isoString);
      const diffMs = now.getTime() - date.getTime();
      if (diffMs < 0) return "just now";

      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "1d ago";
      return `${diffDays}d ago`;
    } catch {
      return "some time ago";
    }
  };

  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (e: React.MouseEvent | React.FocusEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      handleSaveRename(e, id);
    }
    if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-default animate-fadeIn"
      />

      {/* Modal Card - matches UI reference */}
      <div className="relative w-full max-w-lg bg-[#161616] border border-white/10 rounded-[28px] shadow-[0_12px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col p-6 animate-fadeIn">
        {/* Header Title */}
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-lg font-bold text-white font-sans tracking-tight">Chat History</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white/90 bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all duration-200"
          >
            <Icon name="X" size={14} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-white/40 mb-6 font-sans">
          Browse your past conversations. Click to resume or delete to remove.
        </p>

        {/* Sessions List */}
        <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-white/30 font-sans">
              <Icon name="MessageSquare" size={24} className="mb-2 text-white/15" />
              <p className="text-xs">No conversation history yet.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
                className="group w-full flex items-center justify-between px-3.5 py-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-all duration-200"
              >
                {/* Left Side: Bubble Icon & Title */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <Icon name="MessageSquare" size={15} className="text-white/60 flex-shrink-0" />
                  
                  {editingId === session.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={(e) => handleSaveRename(e, session.id)}
                      onKeyDown={(e) => handleRenameKeyDown(e, session.id)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="bg-neutral-800 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-500/50 w-full max-w-[200px]"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-white/90 truncate font-sans">
                      {session.title}
                    </span>
                  )}
                </div>

                {/* Right Side: Timestamp & Hover Action Buttons */}
                <div className="flex items-center gap-3 ml-3 flex-shrink-0 select-none">
                  {/* Timestamp (hidden when hover actions are shown in list item hover on large screens) */}
                  <span className="text-[10px] text-white/30 font-sans group-hover:hidden transition-all duration-100">
                    {getRelativeTime(session.updatedAt)}
                  </span>

                  {/* Actions (visible on hover) */}
                  <div className="hidden group-hover:flex items-center gap-1.5 transition-all duration-100">
                    {/* Rename Button */}
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(e, session)}
                      className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                      title="Rename"
                    >
                      <Icon name="Edit3" size={13} />
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete conversation "${session.title}"?`)) {
                          onDeleteSession(session.id);
                        }
                      }}
                      className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Icon name="Trash2" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

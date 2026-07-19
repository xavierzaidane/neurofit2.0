import React, { useState, useRef, useEffect } from "react";
import { modelsConfig } from "../../app/neurobot/config/models.config";
import { personalitiesConfig } from "../../app/neurobot/config/personalities.config";
import { CommandItem, SlashCommandMenu } from "./SlashCommandMenu";
import { Icon } from "./IconHelper";
import { Attachment } from "../../app/neurobot/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ArrowUp } from "lucide-react";

interface ComposerProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (text: string, attachments: Attachment[]) => void;
  onStop: () => void;
  isStreaming: boolean;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  selectedPersonality: string;
  setSelectedPersonality: (personalityId: string) => void;
  offline: boolean;
  slashCommands: CommandItem[];
}

export const Composer: React.FC<ComposerProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  selectedModel,
  setSelectedModel,
  selectedPersonality,
  setSelectedPersonality,
  offline,
  slashCommands,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showPersonalityDropdown, setShowPersonalityDropdown] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 180)}px`;
  }, [input]);

  // Monitor '/' for slash commands autocomplete
  useEffect(() => {
    if (input.startsWith("/")) {
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }
  }, [input]);

  const activeModel = modelsConfig.find((m) => m.id === selectedModel) || modelsConfig[0];
  const activePersonality = personalitiesConfig.find((p) => p.id === selectedPersonality) || personalitiesConfig[0];

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || isStreaming || offline) return;
    onSend(input, attachments);
    setInput("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashMenu) {
      const query = input.slice(1).toLowerCase();
      const filtered = slashCommands.filter(
        (c) => c.command.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashSelectedIndex((prev) => (prev + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (filtered[slashSelectedIndex]) {
          handleSlashSelect(filtered[slashSelectedIndex].command);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSlashMenu(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSlashSelect = (command: string) => {
    const cmd = slashCommands.find((c) => c.command === command);
    if (cmd) {
      cmd.action();
    }
    setInput("");
    setShowSlashMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      const isImg = file.type.startsWith("image/");

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            type: isImg ? "image" : "file",
            name: file.name,
            dataUrl,
            size: file.size,
          },
        ]);
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-6xl mx-auto relative flex flex-col items-center select-none">
      {/* Autocomplete Menu */}
      {showSlashMenu && (
        <SlashCommandMenu
          searchText={input}
          onSelect={handleSlashSelect}
          commands={slashCommands}
          selectedIndex={slashSelectedIndex}
          setSelectedIndex={setSlashSelectedIndex}
        />
      )}

      {/* Main Composer Box - Seamless Rounded Card */}
      <div className="w-full bg-neutral-900/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-3 relative">
        
        {/* Attachments Preview Row */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pb-2 border-b border-white/5 max-h-32 overflow-y-auto mb-2">
            {attachments.map((attach, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/80 group"
              >
                <Icon name={attach.type === "image" ? "Image" : "FileText"} size={11} className="text-[var(--foreground)]" />
                <span className="max-w-[120px] truncate font-mono">{attach.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="text-white/20 hover:text-white/80 hover:bg-white/10 p-0.5 rounded transition-all duration-200"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* First Line: Text input area */}
        <div className="w-full px-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={offline}
            placeholder={offline ? "You are offline. Sending is disabled." : "Type a message..."}
            className="w-full bg-transparent border-0 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-0 resize-none py-1.5 px-0.5 max-h-[180px] overflow-y-auto leading-relaxed select-text disabled:opacity-50"
          />
        </div>

        {/* Second Line: Control Row (Plain, non-boxed elements) */}
        <div className="flex justify-between items-center px-1 pt-2 mb-2">
          <div className="flex items-center gap-4">
            {/* Attachment Button (+ icon) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              accept="image/*,text/*,.pdf,.md,.csv,.json"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={offline}
              className="flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none"
              title="Add attachment"
            >
              <Icon name="Plus" size={16} />
            </button>

            {/* Subtle Vertical Divider */}
            <div className="h-4 w-px bg-white/10" />

            {/* Personality Selector - Plain Inline text */}
            <DropdownMenu open={showPersonalityDropdown} onOpenChange={setShowPersonalityDropdown}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ref="personalityDropdownRef"
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors duration-200 font-sans"
                >
                  <Icon name={activePersonality.icon} size={13} className="text-[var(--foreground)]" />
                  <span>{activePersonality.name}</span>
                  <Icon name="ChevronDown" size={11} className="text-white/20" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                sideOffset={8}
                align="start"
                avoidCollisions={true}
                collisionPadding={12}
                className="w-60 bg-neutral-950 border border-white/10 rounded-xl shadow-2xl p-1 z-50 divide-y divide-white/5 overflow-y-auto max-h-[50vh]"
              >
                {personalitiesConfig.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onSelect={() => {
                      setSelectedPersonality(p.id);
                      setShowPersonalityDropdown(false);
                    }}
                    className={`w-full flex items-start gap-2 px-3 py-2 text-left transition-all duration-200 rounded-lg ${
                      selectedPersonality === p.id
                        ? "bg-white/10 text-white "
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon name={p.icon} size={13} className="text-[var(--foreground)] mt-0.5" />
                    <div>
                      <div className="font-normal text-xs">{p.name}</div>
                      <div className="text-[9px] text-white/30 leading-snug">{p.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Selector - Plain Inline text */}
            <DropdownMenu open={showModelDropdown} onOpenChange={setShowModelDropdown}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ref="modelDropdownRef"
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors duration-200 font-sans"
                >
                  <span>{activeModel.displayName}</span>
                  <Icon name="ChevronDown" size={11} className="text-white/20" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                sideOffset={8}
                align="end"
                avoidCollisions={true}
                collisionPadding={12}
                className="w-64 bg-neutral-950 border border-white/10 rounded-xl shadow-2xl p-1 z-50 divide-y divide-white/5 overflow-y-auto max-h-[50vh]"
              >
                {modelsConfig.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onSelect={() => {
                      setSelectedModel(m.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full flex items-start gap-2 px-3 py-2 text-left transition-all duration-200 rounded-lg ${
                      selectedModel === m.id
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span>{m.displayName}</span>
                        <span className="text-[8px] font-mono bg-white/5 border border-white/5 px-1 py-0.2 rounded text-white/30">
                          {m.contextWindow}
                        </span>
                      </div>
                      <div className="text-[9px] text-white/30 leading-snug">{m.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Send / Stop Action Button - Circular Blue Send Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center justify-center w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200"
              >
                <Icon name="Square" size={10} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0) || offline}
                className="flex items-center justify-center w-7 h-7 bg-[var(--foreground)] hover:opacity-90 text-black rounded-full transition-all duration-200 shadow-[0_0_10px_color-mix(in_srgb,var(--foreground)_30%,transparent)] disabled:opacity-20 disabled:pointer-events-none disabled:shadow-none"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center px-4 pt-2 pb-2 text-[15px] font-mono text-white/30 select-none">
        <span className="hidden sm:inline">↵ send  •  shift+↵ newline  •  / commands</span>
        <span className="sm:hidden">/ commands</span>
      </div>
    </div>
  );
};

export default Composer;

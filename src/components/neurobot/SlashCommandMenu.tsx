import React, { useEffect, useRef } from "react";
import { Icon } from "./IconHelper";
import { Command, CommandList, CommandItem } from "@/components/ui/command";

export interface CommandItem {
  command: string;
  description: string;
  icon: string;
  action: () => void;
}

interface SlashCommandMenuProps {
  searchText: string;
  onSelect: (command: string) => void;
  commands: CommandItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const getCommandMeta = (command: string, defaultIcon: string) => {
  const cleanCmd = command.toLowerCase().trim();
  switch (cleanCmd) {
    case "/new":
      return { title: "New Chat", icon: "Plus" };
    case "/templates":
      return { title: "Templates", icon: "Mail" };
    case "/theme":
      return { title: "Toggle Theme", icon: "Sun" };
    case "/history":
      return { title: "History", icon: "Clock" };
    case "/clear":
      return { title: "Clear Current Chat", icon: "Trash2" };
    case "/install":
      return { title: "Install App", icon: "Plus" };
    case "/personality":
      return { title: "Personality", icon: "User" };
    case "/model":
      return { title: "Model Selector", icon: "Cpu" };
    case "/share":
      return { title: "Share Conversation", icon: "Share2" };
    case "/help":
      return { title: "Help & Info", icon: "HelpCircle" };
    default:
      const raw = command.replace("/", "");
      const capitalized = raw.charAt(0).toUpperCase() + raw.slice(1);
      return { title: capitalized, icon: defaultIcon };
  }
};

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  searchText,
  onSelect,
  commands,
  selectedIndex,
  setSelectedIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const query = searchText.startsWith("/") ? searchText.slice(1).toLowerCase() : searchText.toLowerCase();
  const filteredCommands = commands.filter(
    (c) => c.command.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
  );

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1));
    }
  }, [filteredCommands.length, selectedIndex, setSelectedIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeElement = containerRef.current.children[selectedIndex] as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (filteredCommands.length === 0) return null;

  return (
    <Command
      className="absolute bottom-full left-0 mb-2 w-72 max-h-68 overflow-y-auto bg-[#131313] border border-white/5 rounded-[22px] shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden z-50 flex flex-col p-1.5 animate-fadeIn"
    >
      <div className="text-white/35 font-sans font-semibold text-[11px] tracking-wider px-4 pt-3 pb-1.5">
        Commands
      </div>
      <CommandList ref={containerRef} className="scrollbar-none flex flex-col gap-0.5">
        {filteredCommands.map((cmd, index) => {
          const isActive = index === selectedIndex;
          const meta = getCommandMeta(cmd.command, cmd.icon);
          return (
            <CommandItem
              key={cmd.command}
              onSelect={() => onSelect(cmd.command)}
              onMouseEnter={() => setSelectedIndex(index)}
              className="group w-full flex items-center gap-3.5 px-3.5 py-2.5 text-left transition-all duration-150 rounded-xl cursor-default text-white/70 hover:text-white data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white font-medium text-[13.5px] font-sans"
            >
              <div className="text-white/40 group-hover:text-white group-data-[selected=true]:text-white transition-colors duration-150">
                <Icon name={meta.icon} size={15} />
              </div>
              <span className="truncate flex-1 text-white/85 group-hover:text-white group-data-[selected=true]:text-white">
                {meta.title}
              </span>
            </CommandItem>
          );
        })}
      </CommandList>
    </Command>
  );
};

export default SlashCommandMenu;

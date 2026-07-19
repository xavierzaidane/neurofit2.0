import React from "react";
import { templatesConfig } from "../../app/neurobot/config/templates.config";
import { TemplateConfig } from "../../app/neurobot/types";
import { Icon } from "./IconHelper";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: TemplateConfig) => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const categories = ["Workouts", "Nutrition", "Recovery & Care", "Coaching"] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[440px] bg-[#131313] border border-white/5 rounded-[28px] p-0 overflow-hidden flex flex-col h-[530px] max-h-[85vh] shadow-2xl"
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[17px] font-semibold text-white tracking-tight font-normal">
              All Suggestions
            </DialogTitle>
            <DialogClose asChild>
              <button
                type="button"
                className="text-white/60 hover:text-white transition-all duration-200 w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center cursor-default bg-white/5"
              >
                <Icon name="X" size={14} />
              </button>
            </DialogClose>
          </div>
          <p className="text-xs text-white/40 font-medium font-sans">
            Browse and search all message templates
          </p>
        </div>

        {/* Command Search Container */}
        <Command className="flex-1 flex flex-col overflow-hidden bg-transparent border-0 h-full">
          <div className="px-8 pb-5 [&_[data-slot=command-input-wrapper]]:rounded-full [&_[data-slot=command-input-wrapper]]:border-b-0 [&_[data-slot=command-input-wrapper]]:border-0 [&_[data-slot=command-input-wrapper]]:bg-[#222222] [&_[data-slot=command-input-wrapper]]:px-4 [&_[data-slot=command-input-wrapper]]:h-11 [&_[data-slot=command-input-wrapper]]:focus-within:ring-1 [&_[data-slot=command-input-wrapper]]:focus-within:ring-white/15 [&_input]:placeholder:text-white/30 [&_input]:text-white [&_input]:font-sans [&_input]:text-sm transition-all">
            <CommandInput
              placeholder="Search suggestions..."
            />
          </div>

          <CommandList className="flex-1 overflow-y-auto px-8 pb-4 scrollbar-none bg-transparent">
            <CommandEmpty className="py-12 text-center text-xs text-white/30 font-sans">
              <Icon name="FileQuestion" size={28} className="mx-auto mb-2 opacity-30 text-white" />
              No suggestions found matching your search
            </CommandEmpty>

            {categories.map((cat) => {
              const catTemplates = templatesConfig.filter((t) => t.category === cat);
              if (catTemplates.length === 0) return null;

              return (
                <CommandGroup
                  key={cat}
                  heading={cat}
                  className="text-white/40 font-sans font-medium text-xs tracking-wide [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-white/40 [&_[cmdk-group-heading]]:font-semibold"
                >
                  <div className="flex flex-col gap-0.5 mt-1 mb-4">
                    {catTemplates.map((tmpl) => (
                      <CommandItem
                        key={tmpl.id}
                        value={`${tmpl.title} ${tmpl.promptBody}`}
                        onSelect={() => {
                          onSelect(tmpl);
                          onClose();
                        }}
                        className="group w-full flex items-center gap-3.5 px-2.5 py-2 text-left transition-all duration-150 rounded-xl cursor-default text-white/70 hover:text-white data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white font-medium text-[13px] font-sans"
                      >
                        <div className="text-white/40 group-hover:text-white group-data-[selected=true]:text-white transition-colors duration-150">
                          <Icon name={tmpl.icon} size={15} />
                        </div>
                        <span className="truncate flex-1 text-white/80 group-hover:text-white group-data-[selected=true]:text-white">
                          {tmpl.title}
                        </span>
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>

        {/* Footer */}
        <div className="px-8 py-3.5 border-t border-white/5 bg-[#131313] flex justify-center text-center">
          <span className="text-[11px] text-white/40 font-sans tracking-wide">
            Couldn't find what you're looking for?{" "}
            <a
              href="mailto:feedback@neurofit.com?subject=Neurobot%20Template%20Request"
              className="text-white/90 hover:text-white font-semibold transition-colors hover:underline"
            >
              Request here
            </a>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePickerModal;

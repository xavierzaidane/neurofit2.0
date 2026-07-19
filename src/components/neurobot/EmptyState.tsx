import React from "react";
import { templatesConfig } from "../../app/neurobot/config/templates.config";
import { TemplateConfig } from "../../app/neurobot/types";
import { Icon } from "./IconHelper";

interface EmptyStateProps {
  onSelectTemplate: (template: TemplateConfig) => void;
  onOpenAllTemplates: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectTemplate,
  onOpenAllTemplates,
}) => {
  // Select 3 featured templates to show as quick-start chips
  const featuredIds = ["workout-plan", "meal-planner", "macro-calc"];
  const featuredTemplates = templatesConfig.filter((t) => featuredIds.includes(t.id));

  return (
    <div className="flex flex-col items-center justify-center px-4 max-w-3xl mx-auto py-4 animate-fadeIn select-none">
      <div className="flex items-center justify-center gap-4 mb-3">
  {/* Logo */}
  <img
    className="w-16 h-16"
    src="/neuro.png"
    alt="Neurobot Logo"
  />

  {/* Heading */}
  <h1 className="text-2xl font-normal tracking-tight text-white selection:bg-[var(--foreground)]/30">
    How can i help you?
  </h1>
</div>

      {/* Subtext */}
      <p className="text-md text-white/50 text-center mb-8 max-w-md leading-relaxed selection:bg-[var(--foreground)]/20">
        I can help you with workouts, nutrition, recovery, and fitness goals. Try one of these:
      </p>

      {/* Quick start template chips - Horizontal single row */}
      <div className="w-full flex flex-wrap justify-center items-center gap-2 max-w-2xl">
        {featuredTemplates.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => onSelectTemplate(tmpl)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full text-xs text-white/80 transition-all duration-200 group text-left whitespace-nowrap"
          >
            <Icon name={tmpl.icon} size={13} className="text-[var(--foreground)] group-hover:opacity-80 transition-colors" />
            <span className="font-medium">{tmpl.title}</span>
          </button>
        ))}

        {/* More chip */}
        <button
          type="button"
          onClick={onOpenAllTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full text-xs text-white/40 hover:text-white/80 transition-all duration-200"
        >
          <span>More</span>
          <Icon name="ArrowRight" size={12} />
        </button>
      </div>
    </div>
  );
};

export default EmptyState;

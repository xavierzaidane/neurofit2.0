"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

type SkipToFormButtonProps = {
  onSkip: () => void;
};

export const SkipToFormButton = ({ onSkip }: SkipToFormButtonProps) => {
  return (
    <button
      type="button"
      onClick={onSkip}
      className="absolute top-10 right-6 z-20 px-3 py-1.5 text-xs font-mono text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-all duration-300"
    >
      Skip to form <ArrowRight className="h-3 w-3" />
    </button>
  );
};

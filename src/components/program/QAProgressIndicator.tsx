"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

type QAProgressIndicatorProps = {
  current: number;
  total: number;
  onSkip: () => void;
};

export const QAProgressIndicator = ({ current, total, onSkip }: QAProgressIndicatorProps) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="absolute top-0 left-0 w-full z-20">
      {/* Text Indicator */}
      <div 
        className="px-6 py-4 flex items-center justify-between text-[11px] font-mono tracking-wider text-white/40 uppercase"
        aria-live="polite"
      >
        <button
          type="button"
          onClick={onSkip}
          className="text-[11px] font-mono tracking-wider text-white/45 hover:text-white uppercase transition-colors flex"
        >
          Skip to form <ArrowRight className="h-3 w-3 ml-1" />
        </button>
        <span>Step {current}/{total} </span>
      </div>
    </div>
  );
};

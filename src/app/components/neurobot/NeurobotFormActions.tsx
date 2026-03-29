"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpRight, Brain, EyeIcon, MapPin, Search } from "lucide-react";


const previewRows = [
  { label: "Location Address", value: "-" },
  { label: "Gym Type", value: "-" },
  { label: "Price Range", value: "-" },
  { label: "Radius", value: "-" },
];

const NeurobotFormActions = () => (
  <TooltipProvider>
    <div className="flex items-center justify-between gap-3 mt-6 ">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            <EyeIcon className="h-4 w-4" />
            Preview
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="w-80 border border-white/15 bg-black/95 p-3 text-white"
        >
          <p className="mb-2 text-xs font-mono uppercase tracking-wide text-white/70">Form Preview</p>
          <div className="space-y-1.5">
            {previewRows.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 text-xs font-mono">
                <span className="text-white/70">{row.label}</span>
                <span className="max-w-[190px] text-right text-white">{row.value || "-"}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          className="flex items-center px-4 py-2 text-sm font-mono text-white/70 hover:text-white"
          disabled
        >
          Clear
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-white hover:text-white/70 bg-transparent  rounded-lg hover:bg-white/5 transition-colors"
          disabled
        >
          <MapPin className="h-4 w-4" />
          Generate Location
        </button>

        <button
          type="submit"
          disabled
          className="flex items-center  px-4 py-2 text-sm font-mono text-black hover:text-white bg-white rounded-lg hover:bg-foreground transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Search
          <Search className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  </TooltipProvider>
);

export default NeurobotFormActions;

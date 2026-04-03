"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeIcon, MapPin, Search } from "lucide-react";

type NeurobotFormActionsProps = {
  form: any;
  onSearch: () => void;
  onClear?: () => void;
  onGenerateLocation?: () => void;
};

const NeurobotFormActions = ({ form, onSearch, onClear, onGenerateLocation }: NeurobotFormActionsProps) => {
  const location = form.state.values.location || "";
  const gymType = form.state.values.gymType || "";
  const priceRange = form.state.values.priceRange || "";
  const radius = form.state.values.radius || "";

  const displayLocation = location.trim() || "-";
  const displayGymType = gymType.trim() || "-";
  const displayPriceRange = priceRange.trim() || "-";
  const displayRadius = radius.trim() || "-";

  const previewRows = [
    { label: "Location Address", value: displayLocation },
    { label: "Gym Type", value: displayGymType },
    { label: "Price Range", value: displayPriceRange },
    { label: "Radius", value: displayRadius },
  ];

  const isFormValid = Boolean(location.trim()) && Boolean(gymType.trim());

  return (
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
          onClick={onClear}
          className="flex items-center px-4 py-2 text-sm font-mono text-white/70 hover:text-white transition-colors"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onGenerateLocation}
          className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-white hover:text-white/70 bg-transparent rounded-lg hover:bg-white/5 transition-colors"
        >
          <MapPin className="h-4 w-4" />
          Generate Location
        </button>

        <button
          type="button"
          onClick={onSearch}
          className="flex items-center px-4 py-2 text-sm font-mono text-black bg-white rounded-lg hover:bg-white/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
          <Search className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  </TooltipProvider>
  );
};

export default NeurobotFormActions;

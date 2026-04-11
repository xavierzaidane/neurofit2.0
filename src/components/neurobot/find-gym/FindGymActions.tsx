"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeIcon, LocateFixed, MapPin, Search } from "lucide-react";

type NeurobotFormActionsProps = {
  form: any;
  onSearch: () => void;
  isLocating?: boolean;
  onClear?: () => void;
  onGenerateLocation?: () => void;
  onUseCurrentLocation?: () => void;
};

const NeurobotFormActions = ({
  form,
  onSearch,
  isLocating = false,
  onClear,
  onGenerateLocation,
  onUseCurrentLocation,
}: NeurobotFormActionsProps) => {
  return (
    <TooltipProvider>
      <form.Subscribe
        selector={(state: any) => state.values}
        children={(values: any) => {
          const location = values.location || "";
          const gymType = values.gymType || "";
          const priceRange = values.priceRange || "";
          const radius = values.radius || "";

          const displayLocation = location.trim() || "-";
          const displayGymTypeMap: Record<string, string> = {
            "big-box": "Big Box",
            "24-hour": "24-hour",
            crossfit: "CrossFit",
            powerlifting: "Powerlifting",
            yoga: "Yoga Studio",
            pilates: "Pilates Studio",
          };
          const displayGymType = displayGymTypeMap[gymType.trim()] || "-";
          const displayPriceRangeMap: Record<string, string> = {
            low: "Budget ($20-$60 / month)",
            medium: "Standard ($61-$100 / month)",
            high: "Premium ($101+ / month)",
          };
          const displayPriceRange = displayPriceRangeMap[priceRange.trim()] || "-";
          const displayRadius = radius.trim() ? `${radius.trim()} km` : "-";

          const previewRows = [
            { label: "Location Address", value: displayLocation },
            { label: "Gym Type", value: displayGymType },
            { label: "Price Range", value: displayPriceRange },
            { label: "Radius", value: displayRadius },
          ];

          const isFormValid = Boolean(location.trim()) && Boolean(gymType.trim());

          return (
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
                  onClick={onUseCurrentLocation}
                  disabled={isLocating}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-white/90 hover:text-white bg-transparent rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LocateFixed className="h-4 w-4" />
                  {isLocating ? "Locating..." : "Use My Location"}
                </button>

                <button
                  type="button"
                  onClick={onGenerateLocation}
                  disabled={isLocating}
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
          );
        }}
      />
    </TooltipProvider>
  );
};

export default NeurobotFormActions;

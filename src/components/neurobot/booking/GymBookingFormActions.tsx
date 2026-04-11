"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeIcon, Send, Smartphone, WandSparkles } from "lucide-react";
import type { Gym } from "@/types/gym";

type GymBookingFormActionsProps = {
  gym: Gym;
  form: any;
  activeTab: "manual" | "ai";
  onManualBooking: () => void;
  onAIBooking: () => void;
};

const GymBookingFormActions = ({
  gym,
  form,
  activeTab,
  onManualBooking,
  onAIBooking,
}: GymBookingFormActionsProps) => {
  const formValues = form.getFieldValue ? {
    name: form.getFieldValue('bookingName') || '',
    email: form.getFieldValue('bookingEmail') || '',
    membershipType: form.getFieldValue('membershipType') || '',
    duration: form.getFieldValue('duration') || '',
  } : form.state?.values || {};

  const previewRows = [
    { label: "Gym Name", value: gym.name || "-" },
    { label: "Membership Type", value: formValues.membershipType || "-" },
    { label: "Duration", value: formValues.duration || "-" },
  ];

  const isManualBookingValid = 
    formValues.name?.trim() &&
    formValues.email?.trim() &&
    form.getFieldValue('bookingPhone')?.trim() &&
    formValues.membershipType &&
    formValues.duration &&
    form.getFieldValue('startDate');

  const isAIBookingValid = true;

  const handleBooking = () => {
    if (activeTab === "manual") {
      onManualBooking();
    } else {
      onAIBooking();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between gap-3 mt-8 ">
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
            <p className="mb-2 text-xs font-mono uppercase tracking-wide text-white/70">
              Booking Preview
            </p>
            <div className="space-y-1.5">
              {previewRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 text-xs font-mono"
                >
                  <span className="text-white/70">{row.label}</span>
                  <span className="max-w-[190px] text-right text-white">
                    {row.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={handleBooking}
            disabled={
              activeTab === "manual" ? !isManualBookingValid : !isAIBookingValid
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-black hover:text-white bg-white rounded-lg hover:bg-foreground transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeTab === "manual" ? (
              <>
                <Smartphone className="h-4 w-4" />
                Book Manually
              </>
            ) : (
              <>
                <WandSparkles className="h-4 w-4" />
                Book with AI
              </>
            )}
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GymBookingFormActions;

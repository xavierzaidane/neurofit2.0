import React, { useState } from "react";
import { Icon } from "./IconHelper";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR Server URL using --foreground color (ccb094)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=cc-b0-94&bgcolor=23-23-23&data=${encodeURIComponent(
    shareUrl
  )}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="p-3 bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-full mb-3">
            <Icon name="Share2" size={24} />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight font-sans">Share Conversation</h2>
          <p className="text-xs text-white/40 mt-1 max-w-[280px]">
            Anyone with this link can view this chat history. No login required.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 rounded-xl mb-5">
          <div className="relative p-3 bg-neutral-900 rounded-xl border border-white/5 shadow-inner">
            {/* QR Code Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="Scan to view shared session"
              width={200}
              height={200}
              className="rounded-lg bg-neutral-900"
              loading="lazy"
            />
          </div>
          <span className="text-[10px] font-mono text-white/30 mt-3 flex items-center gap-1.5">
            <Icon name="QrCode" size={12} />
            Scan QR code to open on mobile
          </span>
        </div>

        {/* Copy Link Section */}
        <div className="flex gap-2">
          <div className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/70 truncate select-all font-mono leading-relaxed flex items-center">
            {shareUrl}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold font-mono transition-all duration-300 ${
              copied
                ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                : "bg-[var(--foreground)] hover:opacity-90 text-black shadow-[0_0_15px_color-mix(in_srgb,var(--foreground)_40%,transparent)]"
            }`}
          >
            <Icon name={copied ? "Check" : "Copy"} size={14} />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;

import React from "react";
import { Icon } from "./IconHelper";

interface GymInfo {
  name: string;
  lat: number;
  lng: number;
  address?: string;
  distanceMeters: number;
}

interface GymResultsCardProps {
  gymResults: {
    location: {
      lat: number;
      lng: number;
      resolvedName: string;
    };
    gyms: GymInfo[];
  };
}

export const GymResultsCard: React.FC<GymResultsCardProps> = ({ gymResults }) => {
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getMapLink = (lat: number, lng: number) => {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  };

  return (
    <div className="w-full space-y-3 font-sans mt-1">
      {/* Header info */}
      <div className="flex items-center gap-2 text-xs text-white/40 pb-1.5 border-b border-white/5">
        <Icon name="MapPin" size={13} className="text-[var(--foreground)]" />
        <span className="truncate max-w-full">
          Searched near: <span className="text-white/60 font-medium">{gymResults.location.resolvedName}</span>
        </span>
      </div>

      {/* Gym list */}
      <div className="space-y-2.5">
        {gymResults.gyms.map((gym, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-4 p-3 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/5 transition-all duration-200"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-white/90 truncate">{gym.name}</span>
                <span className="text-[10px] font-mono text-white/40 flex-shrink-0">
                  {formatDistance(gym.distanceMeters)} away
                </span>
              </div>
              {gym.address ? (
                <p className="text-[11px] text-white/50 leading-relaxed truncate">
                  {gym.address}
                </p>
              ) : (
                <p className="text-[11px] text-white/30 italic leading-relaxed">
                  No address details available
                </p>
              )}
            </div>

            <a
              href={getMapLink(gym.lat, gym.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-medium text-[var(--foreground)] hover:opacity-80 transition-opacity bg-[var(--foreground)]/10 px-2.5 py-1 rounded-full flex-shrink-0 self-center"
            >
              <span>Maps</span>
              <Icon name="ExternalLink" size={10} className="text-[var(--foreground)]" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymResultsCard;

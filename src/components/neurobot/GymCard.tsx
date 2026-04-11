'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Star, MapPin, Phone } from 'lucide-react';
import type { Gym } from '@/types/gym';

interface GymCardProps {
  gym: Gym;
  onContactClick: () => void;
  isCompared: boolean;
  onCompareToggle: () => void;
}

const GymCard = memo(function GymCard({
  gym,
  onContactClick,
  isCompared,
  onCompareToggle
}: GymCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageCount = gym.images?.length ?? 0;
    if (imageCount > 0) {
      setCurrentImage((prev) => (prev + 1) % imageCount);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageCount = gym.images?.length ?? 0;
    if (imageCount > 0) {
      setCurrentImage((prev) => (prev - 1 + imageCount) % imageCount);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3]  overflow-hidden mb-4">
        {gym.images && gym.images.length > 0 && (
          <Image
            src={gym.images[currentImage]}
            alt={gym.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={prevImage}
            type="button"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white text-zinc-900 shadow-sm transition-colors"
            aria-label="Previous image"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            type="button"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white text-zinc-900 shadow-sm transition-colors"
            aria-label="Next image"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {gym.images && gym.images.length > 0 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {gym.images.map((_, idx) => (
              <div
                key={`image-${gym.id}-${idx}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImage ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}


  
      </div>

      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium text-lg text-white">{gym.name}</h4>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 text-white/60 font-mono text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{gym.city}, {gym.country}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
          <span className="text-sm font-medium text-white font-mono">{gym.rating}</span>
          <span className="text-xs text-white/40 ml-1 font-mono">({gym.reviewCount})</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-white/60 mb-4">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          <span className="text-white/60 truncate font-mono">{gym.phone}</span>
        </div>
      </div>

      <p className="text-sm text-white/50 mb-4 line-clamp-2 font-mono">{gym.address}</p>

      <button
        onClick={(e) => { e.stopPropagation(); onContactClick(); }}
        type="button"
        className="w-full border border-white/20 text-black hover:text-white bg-white py-2 rounded-lg text-sm font-semibold hover:bg-foreground transition-colors font-mono"
      >
        View Details
      </button>
    </div>
  );
});

export { GymCard };

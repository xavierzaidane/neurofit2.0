'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Label } from '@/components/ui/label';
import type { Gym } from '@/types/gym';
import { Checkbox } from '@/components/ui/checkbox';
import { GymCard } from './GymCard';

interface GymGridProps {
  gyms: Gym[];
  onContactClick: (gym: Gym) => void;
}

const getPriceBucket = (price: number | undefined) => {
  if (typeof price !== 'number') return '';
  if (price <= 70) return 'low';
  if (price <= 95) return 'medium';
  return 'high';
};

const normalizePriceFilter = (value: string) => {
  if (value === 'budget') return 'low';
  if (value === 'standard') return 'medium';
  if (value === 'premium') return 'high';
  return value;
};

export function GymGrid({ gyms, onContactClick }: GymGridProps) {
  const [sortBy, setSortBy] = useState('default');
  const [comparedGyms, setComparedGyms] = useState<Set<string>>(new Set());
  const [selectedGymTypes, setSelectedGymTypes] = useState<Set<string>>(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Set<string>>(new Set());
  const [selectedRatings, setSelectedRatings] = useState<Set<string>>(new Set());
  const [appliedFilters, setAppliedFilters] = useState({
    gymTypes: new Set<string>(),
    priceRanges: new Set<string>(),
    ratings: new Set<string>(),
  });

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  const toggleCompare = (gymId: string) => {
    const newCompared = new Set(comparedGyms);
    if (newCompared.has(gymId)) {
      newCompared.delete(gymId);
    } else {
      newCompared.add(gymId);
    }
    setComparedGyms(newCompared);
  };

  const toggleGymType = (type: string) => {
    const newTypes = new Set(selectedGymTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedGymTypes(newTypes);
  };

  const togglePriceRange = (range: string) => {
    const newRanges = new Set(selectedPriceRanges);
    if (newRanges.has(range)) {
      newRanges.delete(range);
    } else {
      newRanges.add(range);
    }
    setSelectedPriceRanges(newRanges);
  };

  const toggleRating = (rating: string) => {
    const newRatings = new Set(selectedRatings);
    if (newRatings.has(rating)) {
      newRatings.delete(rating);
    } else {
      newRatings.add(rating);
    }
    setSelectedRatings(newRatings);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      gymTypes: selectedGymTypes,
      priceRanges: selectedPriceRanges,
      ratings: selectedRatings,
    });
  };

  const sortedAndFilteredGyms = [...gyms]
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews-desc':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    })
    .filter((gym) => {
      if (appliedFilters.gymTypes.size > 0) {
        const gymType = (gym.type || '').toLowerCase();
        const allowedTypes = Array.from(appliedFilters.gymTypes).map((type) =>
          type.toLowerCase()
        );
        if (!allowedTypes.includes(gymType)) return false;
      }

      if (appliedFilters.priceRanges.size > 0) {
        const gymPriceBucket = getPriceBucket(gym.price);
        const allowedPriceBuckets = Array.from(appliedFilters.priceRanges).map((range) =>
          normalizePriceFilter(range)
        );
        if (!allowedPriceBuckets.includes(gymPriceBucket)) return false;
      }

      if (appliedFilters.ratings.size > 0) {
        const minRating = Math.min(...Array.from(appliedFilters.ratings).map(Number));
        if ((gym.rating || 0) < minRating) return false;
      }

      return true;
    });

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
      <div className="flex flex-row justify-between items-start mb-12 gap-6">
        <div className="space-y-2">
          <h3 className="text-4xl font-semibold font-mono text-white">Available Gyms</h3>
          <p className="text-sm font-mono text-white/60 max-w-2xl">
            Browse and discover gyms in your area that match your preferences.
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-96 bg-black/95 border-white/10 flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-white font-mono text-2xl">Filter & Sort</SheetTitle>
              <SheetDescription className="text-white/60">
                Customize your gym search
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto space-y-6 py-6 ml-7 -mt-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-3">
                <h4 className="font-mono text-sm font-semibold text-white uppercase">Sort By</h4>
                <div className="space-y-2.5">
                  {[
                    { id: 'default', label: 'Default' },
                    { id: 'rating-desc', label: 'Highest Rating' },
                    { id: 'reviews-desc', label: 'Most Reviews' },
                    { id: 'name-asc', label: 'Name (A-Z)' },
                  ].map((option) => (
                    <div key={option.id} className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        id={option.id}
                        name="sort"
                        checked={sortBy === option.id}
                        onChange={() => handleSort(option.id)}
                        className="w-4 h-4 rounded border-white/30 text-white focus:ring-white/20"
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-sm text-white/80 cursor-pointer font-mono"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10 mr-7" />

              <div className="space-y-3">
                <h4 className="font-mono text-sm font-semibold text-white uppercase">Gym Type</h4>
                <div className="space-y-2.5">
                  {['Big Box', 'CrossFit', 'Yoga', 'Pilates'].map((type) => (
                    <div key={type} className="flex items-center gap-2.5">
                      <Checkbox
                        id={`gym-type-${type}`}
                        checked={selectedGymTypes.has(type)}
                        onCheckedChange={() => toggleGymType(type)}
                        className="border-white/30"
                      />
                      <Label
                        htmlFor={`gym-type-${type}`}
                        className="text-sm text-white/80 cursor-pointer font-mono"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10 mr-7" />

              <div className="space-y-3">
                <h4 className="font-mono text-sm font-semibold text-white uppercase">Price Range</h4>
                <div className="space-y-2.5">
                  {[
                    { id: 'budget', label: 'Budget ($)' },
                    { id: 'standard', label: 'Standard ($$)' },
                    { id: 'premium', label: 'Premium ($$$)' },
                  ].map((price) => (
                    <div key={price.id} className="flex items-center gap-2.5">
                      <Checkbox
                        id={`price-${price.id}`}
                        checked={selectedPriceRanges.has(price.id)}
                        onCheckedChange={() => togglePriceRange(price.id)}
                        className="border-white/30"
                      />
                      <Label
                        htmlFor={`price-${price.id}`}
                        className="text-sm text-white/80 cursor-pointer font-mono"
                      >
                        {price.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10 mr-7" />

              <div className="space-y-3">
                <h4 className="font-mono text-sm font-semibold text-white uppercase">Minimum Rating</h4>
                <div className="space-y-2.5">
                  {[
                    { id: '5', label: '5 Stars' },
                    { id: '4.5', label: '4.5+ Stars' },
                    { id: '4', label: '4+ Stars' },
                    { id: '3.5', label: '3.5+ Stars' },
                  ].map((rating) => (
                    <div key={rating.id} className="flex items-center gap-2.5">
                      <Checkbox
                        id={`rating-${rating.id}`}
                        checked={selectedRatings.has(rating.id)}
                        onCheckedChange={() => toggleRating(rating.id)}
                        className="border-white/30"
                      />
                      <Label
                        htmlFor={`rating-${rating.id}`}
                        className="text-sm text-white/80 cursor-pointer font-mono"
                      >
                        {rating.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 flex justify-end mb-5 mr-5">
              <button
                onClick={handleApplyFilters}
                className="px-3 py-2 bg-white text-black rounded-lg font-mono text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {sortedAndFilteredGyms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60">No gyms found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAndFilteredGyms.map((gym) => (
            <GymCard
              key={gym.id}
              gym={gym}
              onContactClick={() => onContactClick(gym)}
              isCompared={comparedGyms.has(gym.id)}
              onCompareToggle={() => toggleCompare(gym.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

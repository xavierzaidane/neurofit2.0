"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import NeurobotFormActions from "../../components/neurobot/find-gym/FindGymActions";
import { FindGymSkeleton } from "@/components/neurobot/find-gym/FindGymSkeleton";

const NeurobotFormTabs = dynamic(
  () => import("../../components/neurobot/find-gym/FindGymFormTabs"),
  {
    loading: () => <FindGymSkeleton />,
    ssr: false,
  }
);

const DEMO_LOCATIONS = [
  "New York, USA",
  "Los Angeles, USA",
  "London, UK",
  "Paris, France",
  "Dubai, UAE",
  "Singapore",
  "Tokyo, Japan",
  "Sydney, Australia",
];

export default function NeurobotClient() {
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      location: "",
      gymType: "",
      priceRange: "",
      radius: "",
    },
  });

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-mono text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20";

  const handleClear = () => {
    form.reset();
  };

  const handleGenerateLocation = () => {
    const randomLocation =
      DEMO_LOCATIONS[Math.floor(Math.random() * DEMO_LOCATIONS.length)];
    form.setFieldValue("location", randomLocation);
  };

  const handleSearch = () => {
    setAiError(null);
    router.push(`/neurobot/results`);
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setAiError("Geolocation is not supported by this browser.");
      return;
    }

    setAiError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
          );

          if (response.ok) {
            const data = await response.json();
            const address = data?.address || {};
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              "";
            const country = address.country || "";

            if (city || country) {
              form.setFieldValue(
                "location",
                [city, country].filter(Boolean).join(", ")
              );
              setIsLocating(false);
              return;
            }
          }
        } catch {
          // fallback to coordinates below if reverse geocoding fails
        }

        form.setFieldValue("location", `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        const locationErrorMap: Record<number, string> = {
          1: "Location permission denied. Please allow location access.",
          2: "Location unavailable. Try again in a few seconds.",
          3: "Location request timed out. Try again.",
        };
        setAiError(locationErrorMap[error.code] || "Failed to get current location.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <section className="relative z-10 pt-20 pb-32 flex-grow">
      <div className="max-w-5xl container mx-auto px-4 md:px-6 mb-12">
        <div className="text-left pt-10">
          <h1 className="text-3xl md:text-3xl font-mono font-semibold tracking-tight text-white">
            Find your nearby gyms
          </h1>
              <p className="text-sm font-mono text-white/60 mt-2 max-w-2xl">
            Discover gyms in your area. Simply enter your location and preferences.
          </p>
        </div>
        <NeurobotFormTabs
          form={form}
          inputClassName={inputClassName}
        />
        <NeurobotFormActions
          form={form}
          onClear={handleClear}
          onGenerateLocation={handleGenerateLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          onSearch={handleSearch}
          isLocating={isLocating}
        />
        {aiError && <p className="mt-4 text-sm font-mono text-red-300">{aiError}</p>}
      </div>
    </section>
  );
}
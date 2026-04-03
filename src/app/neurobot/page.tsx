"use client";

import dynamic from "next/dynamic";
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
    router.push(`/neurobot/results`);
  };

  return (
    <section className="relative z-10 pt-20 pb-32 flex-grow">
      <div className="max-w-5xl container mx-auto px-4 md:px-6 mb-12">
        <div className="text-left pt-10">
          <h1 className="text-3xl md:text-3xl font-mono font-semibold tracking-tight text-white">
            Find your nearby gyms
          </h1>
          <p className="text-sm font-mono text-white/60 mt-2 max-w-2xl">
            Discover gyms in your area with our AI-powered gym locator. Simply enter your location, and let our AI find and book the best gyms near you.
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
          onSearch={handleSearch}
        />
      </div>
    </section>
  );
}
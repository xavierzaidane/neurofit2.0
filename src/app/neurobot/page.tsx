// src/app/neurobot/NeurobotClient.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import NeurobotFormTabs from "../components/neurobot/NeurobotFormTabs";
import NeurobotFormActions from "../components/neurobot/NeurobotFormActions";

export default function NeurobotClient() {
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

  return (
    <section className="max-w-5xl relative z-10 pt-20 pb-32 flex-grow container mx-auto px-4 md:px-6">
      <div className="text-left pt-10">
        <h1 className="text-3xl md:text-3xl font-mono font-semibold tracking-tight text-white">
          Find your nearby gyms
        </h1>
        <p className="text-sm font-mono text-white/60 mt-2 max-w-2xl ">
          Discover gyms in your area with our AI-powered gym locator. Simply enter your location, and let our AI find and book the best gyms near you.
        </p>
      </div>
      <NeurobotFormTabs
        form={form} inputClassName={inputClassName}      />
        <NeurobotFormActions/>
    </section>
  );
}
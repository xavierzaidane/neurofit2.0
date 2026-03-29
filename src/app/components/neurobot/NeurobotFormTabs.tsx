"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { MapPin, Dumbbell } from "lucide-react";
import { motion } from "motion/react";

type NeurobotFormTabsProps = {
  form: any;
  inputClassName: string;
};

// helpers (reuse dari ProgramFormTabs)
const getStringValue = (value: unknown) =>
  typeof value === "string" ? value : "";

const toFieldErrors = (errors: Array<string | undefined> | undefined) =>
  errors?.map((message) => ({ message }));

const requiredValidator = (label: string) => ({
  onBlur: ({ value }: { value: unknown }) =>
    getStringValue(value).trim() ? undefined : `${label} is required`,
});

const NeurobotFormTabs = ({
  form,
  inputClassName,
}: NeurobotFormTabsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative backdrop-blur-md border border-white/10 bg-white/5 rounded-lg p-3 md:p-7 overflow-hidden mt-10"
    >
      <Tabs defaultValue="gym" className="w-full">
        {/* Tabs Header */}
        <div className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gym" className="font-mono text-sm">
              <Dumbbell className="size-4" />
              Gym
            </TabsTrigger>

            <TabsTrigger value="map" className="font-mono text-sm">
              <MapPin className="size-4" />
              Map
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= GYM TAB ================= */}
        
        <TabsContent value="gym" className="space-y-6">
          <div>
            <h2 className="text-lg font-mono font-semibold text-white">
              Fill your Location
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LOCATION */}
            <form.Field
              name="location"
              validators={requiredValidator("Location")}
              children={(field: any) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                    <FieldLabel className="text-xs font-mono uppercase text-white/70">
                      Location Address
                    </FieldLabel>
                    <input
                      className={inputClassName}
                      placeholder="e.g. Jakarta Selatan"
                      value={getStringValue(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                );
              }}
            />

            {/* GYM TYPE */}
            <form.Field
              name="gymType"
              validators={requiredValidator("Gym type")}
              children={(field: any) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid} className="space-y-2">
                    <FieldLabel className="text-xs font-mono uppercase text-white/70">
                      Gym Type
                    </FieldLabel>
                    <Select
                      value={getStringValue(field.state.value)}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className={inputClassName}>
                        <SelectValue placeholder="Select gym type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="big-box">Big Box</SelectItem>
                        <SelectItem value="24-hour">24-hour</SelectItem>
                        <SelectItem value="crossfit">CrossFit</SelectItem>
                        <SelectItem value="powerlifting">Powerlifting</SelectItem>
                        <SelectItem value="yoga">Yoga Studio</SelectItem>
                        <SelectItem value="pilates">Pilates Studio</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                );
              }}
            />

            {/* PRICE RANGE */}
            <form.Field
              name="priceRange"
              children={(field: any) => {
                return (
                  <Field className="space-y-2">
                    <FieldLabel className="text-xs font-mono uppercase text-white/70">
                      Price Range
                    </FieldLabel>
                    <Select
                      value={getStringValue(field.state.value)}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className={inputClassName}>
                        <SelectValue placeholder="Select price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">$</SelectItem>
                        <SelectItem value="medium">$$</SelectItem>
                        <SelectItem value="high">$$$</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />

            {/* RADIUS */}
            <form.Field
              name="radius"
              children={(field: any) => {
                return (
                  <Field className="space-y-2">
                    <FieldLabel className="text-xs font-mono uppercase text-white/70">
                      Search Radius (km)
                    </FieldLabel>
                    <Select
                      value={getStringValue(field.state.value)}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className={inputClassName}>
                        <SelectValue placeholder="Select radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 km</SelectItem>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="20">20 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />
          </div>
        </TabsContent>

        {/* ================= MAP TAB ================= */}
        <TabsContent value="map">
          <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-lg">
            <p className="text-white/50 text-sm font-mono">
              Map preview coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default NeurobotFormTabs;
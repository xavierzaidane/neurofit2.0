"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { MapPin, House } from "lucide-react";
import { GymMap } from "../GymMap";

type NeurobotFormTabsProps = {
  form: any;
  inputClassName: string;
};

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
  const [activeTab, setActiveTab] = useState("gym");

  const handleMapLocationSelect = (location: string) => {
    form.setFieldValue("location", location);
    setActiveTab("gym");
  };

  return (
    <div className="relative backdrop-blur-md border border-white/10 bg-white/5 rounded-lg p-3 md:p-7 overflow-hidden mt-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gym" className="font-mono text-sm">
              <House className="size-4" />
              Location
            </TabsTrigger>

            <TabsTrigger value="map" className="font-mono text-sm">
              <MapPin className="size-4" />
              Map
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="gym" className="space-y-6">
          <div>
            <h2 className="text-lg font-mono font-semibold text-white">
              Fill your Location
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="e.g. Jakarta Selatan, Indonesia"
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
                        <SelectValue placeholder="Select monthly budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Budget ($20-$60 / month)</SelectItem>
                        <SelectItem value="medium">Standard ($61-$100 / month)</SelectItem>
                        <SelectItem value="high">Premium ($101+ / month)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />

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
                        <SelectValue placeholder="Select search radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 km (walkable)</SelectItem>
                        <SelectItem value="2">2 km</SelectItem>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="15">15 km</SelectItem>
                        <SelectItem value="20">20 km</SelectItem>
                        <SelectItem value="30">30 km</SelectItem>
                        <SelectItem value="50">50 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="map" className="p-0 m-0">
          <p className="mb-3 text-xs font-mono text-white/70">
            Click anywhere on the map to select your location.
          </p>
          <div className="w-full h-screen">
            <GymMap onLocationSelect={handleMapLocationSelect} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NeurobotFormTabs;
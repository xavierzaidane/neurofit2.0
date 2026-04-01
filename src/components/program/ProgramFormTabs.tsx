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
import { Activity, Apple, Clock3, Target } from "lucide-react";

type ProgramFormTabsProps = {
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

const ProgramFormTabs = ({ form, inputClassName }: ProgramFormTabsProps) => (
  <Tabs defaultValue="basics" className="w-full">
    <div className="pb-7">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="basics" className="font-mono text-xs md:text-sm">
          <Activity className="size-4" />
          Basics
        </TabsTrigger>

        <TabsTrigger value="goals" className="font-mono text-xs md:text-sm">
          <Target className="size-4" />
          Goals
        </TabsTrigger>

        <TabsTrigger value="nutrition" className="font-mono text-xs md:text-sm">
          <Apple className="size-4" />
          Nutrition
        </TabsTrigger>

        <TabsTrigger value="lifestyle" className="font-mono text-xs md:text-sm">
          <Clock3 className="size-4" />
          Lifestyle
        </TabsTrigger>
      </TabsList>
    </div>

    <div className="relative border border-white/10 bg-white/5 rounded-lg p-6 md:p-8 overflow-hidden">
      <TabsContent value="basics" className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-white">Basics</h2>
        <h3 className="text-sm font-mono -mt-3 mb-6 text-white/80">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="age"
            validators={requiredValidator("Age")}
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Age
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 28"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="height"
            validators={requiredValidator("Height")}
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Height
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 175 cm"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="weight"
            validators={requiredValidator("Weight")}
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Weight
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 72 kg"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="status"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Status
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="working-parent">Working Parent</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
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
            name="gender"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Gender
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
            name="bodyFat"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Body fat % (optional)
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 18%"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="injuries"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Injuries / limitations
                  </FieldLabel>
                  <textarea
                    className={`${inputClassName} min-h-24 resize-none`}
                    placeholder="e.g. Lower back pain, avoid heavy deadlifts"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="countryRegion"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Country / region
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. Indonesia"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="cityRegion"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    City / region
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. DKI Jakarta"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="goals" className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-white">Goals</h2>
        <h3 className="text-sm font-mono -mt-3 mb-6 text-white/80">Fitness Objectives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="fitnessGoal"
            validators={requiredValidator("Fitness goal")}
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Fitness goal
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="improve-endurance">Improve endurance</SelectItem>
                      <SelectItem value="fat-loss">Fat loss</SelectItem>
                      <SelectItem value="lean-bulk">Lean bulk</SelectItem>
                      <SelectItem value="dirty-bulk">Dirty bulk</SelectItem>
                      <SelectItem value="cutting">Cutting</SelectItem>
                      <SelectItem value="recomposition">Body recomposition</SelectItem>
                      <SelectItem value="strength">Build strength</SelectItem>
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
            name="fitnessLevel"
            validators={requiredValidator("Fitness level")}
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Fitness level
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
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
            name="targetTimeline"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Target timeline
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-weeks">4 Weeks</SelectItem>
                      <SelectItem value="8-weeks">8 Weeks</SelectItem>
                      <SelectItem value="12-weeks">12 Weeks</SelectItem>
                      <SelectItem value="16-plus-weeks">16+ Weeks</SelectItem>
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
            name="workoutDays"
            validators={requiredValidator("Workout days")}
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Workout days per week
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
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
            name="trainingStyle"
            validators={requiredValidator("Training style")}
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Preferred training style
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                      <SelectItem value="cardio-conditioning">Cardio + Conditioning</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="nutrition" className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-white">Nutrition</h2>
        <h3 className="text-sm font-mono -mt-3 mb-6 text-white/80">Caloric and Nutritional Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="dailyCalories"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Daily calories target
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 2200 kcal"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="dietaryRestrictions"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Dietary restrictions
                  </FieldLabel>
                  <textarea
                    className={`${inputClassName} min-h-28 resize-none`}
                    placeholder="e.g. Lactose intolerant, no shellfish"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="foodAllergies"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Food allergies
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. Shellfish, peanuts"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="proteinTarget"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Protein target (g)
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 150"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="carbsTarget"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Carbs target (g)
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 220"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="fatTarget"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Fat target (g)
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 65"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="mealsPerDay"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Meals per day
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select meals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5-plus">5+</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="lifestyle" className="space-y-4">
        <h2 className="text-lg font-mono font-semibold text-white">Lifestyle</h2>
        <h3 className="text-sm font-mono -mt-3 mb-6 text-white/80">Daily Habits and Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="workingHours"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Working Hours
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 09:00 - 18:00"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="sleepHours"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Sleep hours
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. 7"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="stressLevel"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Stress level
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select stress level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
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
            name="workoutTime"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Preferred workout time
                  </FieldLabel>
                  <Select
                    value={getStringValue(field.state.value)}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className={inputClassName} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
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
            name="availableEquipment"
            children={(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/70">
                    Available equipment
                  </FieldLabel>
                  <input
                    className={inputClassName}
                    placeholder="e.g. Dumbbells, resistance bands, treadmill"
                    value={getStringValue(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          />
        </div>
      </TabsContent>
    </div>
  </Tabs>
);

export default ProgramFormTabs;

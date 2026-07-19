"use client";

import React, { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { type QAStep, type FieldConfig } from "./qaSteps";

type QuestionCardProps = {
  step: QAStep;
  form: any;
  inputClassName: string;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSkipSection?: () => void;
};

const getStringValue = (value: unknown) =>
  typeof value === "string" ? value : "";

const toFieldErrors = (errors: Array<string | undefined> | undefined) =>
  errors?.map((message) => ({ message }));

const requiredValidator = (label: string) => ({
  onChange: ({ value }: { value: unknown }) =>
    getStringValue(value).trim() ? undefined : `${label} is required`,
  onBlur: ({ value }: { value: unknown }) =>
    getStringValue(value).trim() ? undefined : `${label} is required`,
});

export const QuestionCard = ({
  step,
  form,
  inputClassName,
  onNext,
  onBack,
  isFirst,
  isLast,
  onSkipSection,
}: QuestionCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Autofocus first input on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const focusable = containerRef.current.querySelector(
      "input, textarea, button[role='combobox']"
    ) as HTMLElement;
    if (focusable) {
      setTimeout(() => focusable.focus(), 150);
    }
  }, [step]);

  // Handle Enter key to submit or go to next
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // If it's a textarea, let it line break normally unless they want to submit
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === "textarea") {
        return;
      }
      
      // If it is the last input of the group, trigger next
      if (index === step.fields.length - 1) {
        e.preventDefault();
        onNext();
      } else {
        // Move focus to next input
        e.preventDefault();
        const focusables = containerRef.current?.querySelectorAll(
          "input, textarea, button[role='combobox']"
        );
        if (focusables && focusables[index + 1]) {
          (focusables[index + 1] as HTMLElement).focus();
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto flex flex-col justify-center min-h-[50vh] px-4 mt-10">
      {/* Title */}
      <h2 className="text-2xl md:text-5xl font-normal tracking-tight text-white mb-8 text-left select-none">
        {step.title}
      </h2>

      {/* Fields */}
      <div className="space-y-6">
        {step.fields.map((fieldConfig, index) => (
          <form.Field
            key={fieldConfig.key}
            name={fieldConfig.key}
            validators={fieldConfig.required ? requiredValidator(fieldConfig.label) : undefined}
          >
            {(field: any) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              const value = getStringValue(field.state.value);

              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <FieldLabel className="text-xs font-mono uppercase tracking-wide text-white/50 flex items-center justify-between">
                    <span>
                      {fieldConfig.label}
                      {fieldConfig.required && <span className="text-red-400 ml-0.5">*</span>}
                    </span>
                    {fieldConfig.sublabel && (
                      <span className="text-[10px] text-white/30 lowercase italic">{fieldConfig.sublabel}</span>
                    )}
                  </FieldLabel>

                  {fieldConfig.type === "select" ? (
                    <Select
                      value={value}
                      onValueChange={(val) => {
                        field.handleChange(val);
                        // Trigger blur/validation check
                        field.handleBlur();
                      }}
                    >
                      <SelectTrigger 
                        className={`${inputClassName} h-10 border-white/10 bg-black/40 text-left`}
                        aria-invalid={isInvalid}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      >
                        <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-black border border-white/10 text-white">
                        {fieldConfig.options?.map((opt) => (
                          <SelectItem 
                            key={opt.value} 
                            value={opt.value}
                            className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : fieldConfig.type === "textarea" ? (
                    <textarea
                      className={`${inputClassName} min-h-24 resize-none border-white/10 bg-black/40 py-2.5`}
                      placeholder={fieldConfig.placeholder}
                      value={value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ) : (
                    <input
                      className={`${inputClassName} h-10 border-white/10 bg-black/40`}
                      placeholder={fieldConfig.placeholder}
                      value={value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  )}

                  {isInvalid && (
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  )}
                </Field>
              );
            }}
          </form.Field>
        ))}
      </div>

      {/* Navigation Actions */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <div>
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2 flex items-center gap-1 text-sm font-mono text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 ml-0.5" /> Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {step.skipWholeSection && onSkipSection && (
            <button
              type="button"
              onClick={onSkipSection}
              className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70 transition-colors"
            >
              Skip this section
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2 text-sm font-mono text-black bg-foreground hover:bg-white/80 rounded-lg transition-colors font-semibold shadow-sm"
          >
            {isLast ? (
              <span className="flex items-center gap-1">
                Review <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Next <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

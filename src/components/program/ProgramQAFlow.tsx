"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { qaSteps } from "./qaSteps";
import { QuestionCard } from "./QuestionCard";
import { QAProgressIndicator } from "./QAProgressIndicator";

type ProgramQAFlowProps = {
  form: any;
  onComplete: () => void;
  onSkip: () => void;
};

export const ProgramQAFlow = ({ form, onComplete, onSkip }: ProgramQAFlowProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = qaSteps[currentStepIndex];

  const handleNext = async () => {
    let isStepValid = true;

    // Validate each field in the current step
    currentStep.fields.forEach((fieldConfig) => {
      if (fieldConfig.required) {
        const val = form.getFieldValue(fieldConfig.key);
        if (!val || (typeof val === "string" && !val.trim())) {
          isStepValid = false;
          // Mark field as touched and trigger validation
          if (typeof form.validateField === "function") {
            form.validateField(fieldConfig.key, "blur");
          }
          if (typeof form.setFieldMeta === "function") {
            form.setFieldMeta(fieldConfig.key, (meta: any) => ({
              ...meta,
              isTouched: true,
            }));
          }
        }
      }
    });

    if (!isStepValid) return;

    if (currentStepIndex < qaSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkipSection = () => {
    // Clear any optional inputs in this step so they use fallback defaults
    currentStep.fields.forEach((fieldConfig) => {
      form.setFieldValue(fieldConfig.key, "");
    });
    
    if (currentStepIndex < qaSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col justify-center items-center bg-background  overflow-hidden py-12 md:py-16">
      {/* Progress Indicator */}
      <QAProgressIndicator current={currentStepIndex + 1} total={qaSteps.length} onSkip={onSkip} />

      {/* Slide / Fade Screen Transition */}
      <div className="w-full relative z-10 flex-grow flex items-center justify-center pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <QuestionCard
              step={currentStep}
              form={form}
              inputClassName="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-mono text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentStepIndex === 0}
              isLast={currentStepIndex === qaSteps.length - 1}
              onSkipSection={handleSkipSection}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ProgramQAFlow;

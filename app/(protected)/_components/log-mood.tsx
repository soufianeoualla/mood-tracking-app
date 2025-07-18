import Button from "@/components/ui/button";

import { cn } from "@/lib/utils";

import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import MoodStep from "./steps/mood-step";
import FeelingsStep from "./steps/feeling-step";
import JournalStep from "./steps/journal-step";
import SleepStep from "./steps/sleep-step";
import logMoodService from "../_services/log-mood.service";

import toast from "react-hot-toast";
import { useLogMoodContext } from "../_context/log-mood-context";
import { useMutation } from "@tanstack/react-query";

interface MoodData {
  mood: number;
  feelings: string[];
  comment: string;
  sleepHours: number;
}

interface ValidationErrors {
  mood?: string;
  feelings?: string;
  comment?: string;
  sleepHours?: string;
}

export const MIN_JOURNAL_LENGTH = 10;

const validateStep = (step: number, data: MoodData): ValidationErrors => {
  const errors: ValidationErrors = {};

  switch (step) {
    case 1:
      if (!data.mood) {
        errors.mood = "Please select a mood before continuing.";
      }
      break;
    case 2:
      if (data.feelings.length === 0) {
        errors.feelings = "Please select at least one feeling";
      }
      break;
    case 3:
      if (data.comment.trim().length < MIN_JOURNAL_LENGTH) {
        errors.comment = `Please write a few words about your day before continuing. Minimum ${MIN_JOURNAL_LENGTH} characters required.`;
      }
      break;
    case 4:
      if (!data.sleepHours) {
        errors.sleepHours = "Please select your sleep duration";
      }
      break;
  }

  return errors;
};

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div
    className="flex justify-between items-center w-full mt-8 gap-x-4 mb-8"
    role="progressbar"
    aria-valuenow={currentStep}
    aria-valuemax={totalSteps}
  >
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i + 1}
        className={cn(
          "w-full h-1.5 bg-blue-200 rounded-full transition-colors",
          currentStep >= i + 1 && "bg-blue-600"
        )}
      />
    ))}
  </div>
);

// Main component
const LogMood = ({ hide }: { hide: () => void }) => {
  const [step, setStep] = useState(1);
  const { data, setErrors, resetData } = useLogMoodContext();

  const { mutate, isPending } = useMutation({
    mutationFn: logMoodService,
    onSuccess: () => {
      toast.success("Mood logged successfully!");
      resetData();
      hide();
    },
    onError: (error) => {
      console.error("Error submitting mood data:", error);
      toast.error("Failed to log mood. Please try again.");
    },
  });

  const handleNext = useCallback(async () => {
    const stepErrors = validateStep(step, data);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});

    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      mutate(data);
      return;
    }
  }, [step, data, setErrors, mutate]);

  const currentStepComponent = useMemo(() => {
    switch (step) {
      case 1:
        return <MoodStep />;
      case 2:
        return <FeelingsStep />;
      case 3:
        return <JournalStep />;
      case 4:
        return <SleepStep />;
      default:
        return null;
    }
  }, [step]);

  const canGoBack = step > 1;
  const buttonText = step === 4 ? "Submit" : "Continue";

  return (
    <div className="md:px-10 md:py-12 px-5 py-8 custom-linear-gradiant rounded-2xl w-[95%] md:w-[600px] ">
      <h2 className="text-preset-2 text-neutral-900">Log your mood</h2>

      <ProgressBar currentStep={step} totalSteps={4} />

      {currentStepComponent}

      <div className="flex gap-4">
        {canGoBack && (
          <Button
            onClick={() => setStep((prev) => prev - 1)}
            variant="secondary"
            disabled={isPending}
          >
            <ChevronLeft width={30} height={30} />
          </Button>
        )}
        <Button
          onClick={handleNext}
          className={canGoBack ? "flex-1" : "w-full"}
          disabled={isPending}
        >
          {isPending ? "Submitting..." : buttonText}
        </Button>
      </div>
    </div>
  );
};

export default LogMood;

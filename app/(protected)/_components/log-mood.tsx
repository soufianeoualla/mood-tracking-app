import Button from "@/components/ui/button";

import { cn } from "@/utils";

import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import MoodStep from "./steps/mood-step";
import FeelingsStep, { MAX_FEELINGS } from "./steps/feeling-step";
import JournalStep from "./steps/journal-step";
import SleepStep from "./steps/sleep-step";

// Types
interface MoodData {
  mood: number;
  feelings: string[];
  journalEntry: string;
  sleepHours: number;
}

interface ValidationErrors {
  mood?: string;
  feelings?: string;
  journalEntry?: string;
  sleepHours?: string;
}

const MIN_JOURNAL_LENGTH = 10;

// Validation functions
const validateStep = (step: number, data: MoodData): ValidationErrors => {
  const errors: ValidationErrors = {};

  switch (step) {
    case 1:
      if (data.mood < 0) {
        errors.mood = "Please select a mood before continuing.";
      }
      break;
    case 2:
      if (data.feelings.length === 0) {
        errors.feelings = "Please select at least one feeling";
      }
      break;
    case 3:
      if (data.journalEntry.trim().length < MIN_JOURNAL_LENGTH) {
        errors.journalEntry = `Please write a few words about your day before continuing. Minimum ${MIN_JOURNAL_LENGTH} characters required.`;
      }
      break;
    case 4:
      if (data.sleepHours < 0) {
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
const LogMood = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<MoodData>({
    mood: -1,
    feelings: [],
    journalEntry: "",
    sleepHours: -1,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodChange = useCallback((index: number) => {
    setData((prev) => ({ ...prev, mood: index }));
    setErrors((prev) => ({ ...prev, mood: undefined }));
  }, []);

  const handleFeelingsChange = useCallback((feeling: string) => {
    setData((prev) => ({
      ...prev,
      feelings: prev.feelings.includes(feeling)
        ? prev.feelings.filter((f) => f !== feeling)
        : prev.feelings.length < MAX_FEELINGS
        ? [...prev.feelings, feeling]
        : prev.feelings,
    }));
    setErrors((prev) => ({ ...prev, feelings: undefined }));
  }, []);

  const handleJournalChange = useCallback((text: string) => {
    setData((prev) => ({ ...prev, journalEntry: text }));
    setErrors((prev) => ({ ...prev, journalEntry: undefined }));
  }, []);

  const handleSleepChange = useCallback((index: number) => {
    setData((prev) => ({ ...prev, sleepHours: index }));
    setErrors((prev) => ({ ...prev, sleepHours: undefined }));
  }, []);

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
      // Handle form submission
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form submitted:", data);
        // Reset form or show success message
        alert("Mood logged successfully!");
      } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [step, data]);

  const currentStepComponent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <MoodStep
            mood={data.mood}
            onMoodChange={handleMoodChange}
            error={errors.mood}
          />
        );
      case 2:
        return (
          <FeelingsStep
            feelings={data.feelings}
            onFeelingsChange={handleFeelingsChange}
            error={errors.feelings}
          />
        );
      case 3:
        return (
          <JournalStep
            text={data.journalEntry}
            onTextChange={handleJournalChange}
            error={errors.journalEntry}
          />
        );
      case 4:
        return (
          <SleepStep
            selectedOption={data.sleepHours}
            onOptionChange={handleSleepChange}
            error={errors.sleepHours}
          />
        );
      default:
        return null;
    }
  }, [
    step,
    data,
    errors,
    handleMoodChange,
    handleFeelingsChange,
    handleJournalChange,
    handleSleepChange,
  ]);

  const canGoBack = step > 1;
  const buttonText = step === 4 ? "Submit" : "Continue";

  return (
    <div className="px-10 py-12 custom-linear-gradiant rounded-2xl w-[600px] max-w-full">
      <h2 className="text-preset-2 text-neutral-900">Log your mood</h2>

      <ProgressBar currentStep={step} totalSteps={4} />

      {currentStepComponent}

      <div className="flex gap-4">
        {canGoBack && (
          <Button
            onClick={() => setStep((prev) => prev - 1)}
            variant="secondary"
            disabled={isSubmitting}
          >
            <ChevronLeft width={30} height={30} />
          </Button>
        )}
        <Button
          onClick={handleNext}
          className={canGoBack ? "flex-1" : "w-full"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : buttonText}
        </Button>
      </div>
    </div>
  );
};

export default LogMood;

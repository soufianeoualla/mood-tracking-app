import { Happy, Neutral, Sad, VeryHappy, VerySad } from "@/components/icons";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Radio from "@/components/ui/radio";
import { cn } from "@/utils";
import feelingsOptions from "@/data/feelings-tags.json";
import sleepOptions from "@/data/sleep-options.json";

import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import info_circle from "@/assets/info-circle.svg";
import Image from "next/image";

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

interface MoodOption {
  mood: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface SleepOption {
  label: string;
  min: number;
  max: number | null;
}

// Constants
const MOODS: MoodOption[] = [
  { mood: "Very Happy", Icon: VeryHappy },
  { mood: "Happy", Icon: Happy },
  { mood: "Neutral", Icon: Neutral },
  { mood: "Sad", Icon: Sad },
  { mood: "Very Sad", Icon: VerySad },
];

const MAX_FEELINGS = 3;
const MAX_JOURNAL_LENGTH = 150;
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

// Reusable components
const Tag = React.memo(
  ({
    text,
    isChecked,
    onChange,
    disabled = false,
  }: {
    text: string;
    isChecked: boolean;
    onChange: () => void;
    disabled?: boolean;
  }) => (
    <div
      onClick={disabled ? undefined : onChange}
      className={cn(
        "flex items-center gap-x-2 py-3 px-4 bg-neutral-0 rounded-[10px] border-2 border-blue-200 transition-colors",
        !disabled && "cursor-pointer hover:border-blue-400",
        isChecked && "border-blue-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Checkbox isChecked={isChecked} onChange={onChange} />
      <span className="text-preset-6 text-neutral-900">{text}</span>
    </div>
  )
);
Tag.displayName = "Tag";

const Mood = React.memo(
  ({
    mood,
    Icon,
    isChecked,
    onChange,
  }: {
    mood: string;
    Icon: React.ComponentType<{ className?: string }>;
    isChecked: boolean;
    onChange: () => void;
  }) => (
    <div
      onClick={onChange}
      className={cn(
        "flex justify-between items-center w-full py-3 px-5 bg-neutral-0 rounded-[10px] border-2 border-blue-200 cursor-pointer transition-colors hover:border-blue-400",
        isChecked && "border-blue-600"
      )}
    >
      <div className="flex items-center gap-x-3">
        <Radio isChecked={isChecked} onChange={onChange} />
        <span className="text-preset-5 text-neutral-900">{mood}</span>
      </div>
      <Icon className="w-9 h-9" />
    </div>
  )
);
Mood.displayName = "Mood";

const SleepOption = React.memo(
  ({
    sleepOption,
    isChecked,
    onChange,
  }: {
    sleepOption: SleepOption;
    isChecked: boolean;
    onChange: () => void;
  }) => (
    <div
      onClick={onChange}
      className={cn(
        "flex items-center gap-x-3 w-full py-3 px-5 bg-neutral-0 rounded-[10px] border-2 border-blue-200 cursor-pointer transition-colors hover:border-blue-400",
        isChecked && "border-blue-600"
      )}
    >
      <Radio isChecked={isChecked} onChange={onChange} />
      <span className="text-neutral-900 text-preset-5">
        {sleepOption.label}
      </span>
    </div>
  )
);

SleepOption.displayName = "SleepOption";

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div
      className="text-red-700 text-preset-7 flex items-center mb-4"
      role="alert"
    >
      <Image
        src={info_circle}
        alt="Error icon"
        className="inline-block mr-2 w-4 h-4"
      />
      {message}
    </div>
  );
};

// Step components
const MoodStep = ({
  mood,
  onMoodChange,
  error,
}: {
  mood: number;
  onMoodChange: (index: number) => void;
  error?: string;
}) => (
  <div>
    <h3 className="text-preset-3 text-neutral-900">How was your mood today?</h3>
    <div className="grid gap-3 mt-8">
      {MOODS.map(({ mood: moodText, Icon }, index) => (
        <Mood
          key={index}
          mood={moodText}
          Icon={Icon}
          isChecked={mood === index}
          onChange={() => onMoodChange(index)}
        />
      ))}
    </div>
    <div className="mt-8">
      <ErrorMessage message={error} />
    </div>
  </div>
);

const FeelingsStep = ({
  feelings,
  onFeelingsChange,
  error,
}: {
  feelings: string[];
  onFeelingsChange: (feeling: string) => void;
  error?: string;
}) => {
  const canAddMore = feelings.length < MAX_FEELINGS;

  return (
    <div>
      <h3 className="text-preset-3 text-neutral-900 mb-1.5">
        How did you feel?
      </h3>
      <p className="text-neutral-600 text-preset-6">
        Select up to {MAX_FEELINGS} tags ({feelings.length}/{MAX_FEELINGS}{" "}
        selected):
      </p>
      <div className="flex flex-wrap gap-3 mt-8">
        {feelingsOptions.map((feeling) => (
          <Tag
            key={feeling}
            text={feeling}
            isChecked={feelings.includes(feeling)}
            onChange={() => onFeelingsChange(feeling)}
            disabled={!feelings.includes(feeling) && !canAddMore}
          />
        ))}
      </div>

      <div className="mt-8">
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};

const JournalStep = ({
  text,
  onTextChange,
  error,
}: {
  text: string;
  onTextChange: (text: string) => void;
  error?: string;
}) => (
  <div>
    <h3 className="text-preset-3 text-neutral-900">Write about your day...</h3>
    <textarea
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
      className={cn(
        "h-[150px] w-full mt-8 resize-none border border-neutral-300 rounded-[10px] focus:outline-none focus:border focus:border-blue-600 px-4 py-3 placeholder:text-neutral-600 placeholder:italic transition-colors",
        error && "border-red-500"
      )}
      placeholder="Today, I felt…"
      maxLength={MAX_JOURNAL_LENGTH}
      aria-describedby="char-count"
    />

    <div className="flex justify-end items-center mt-2">
      <p id="char-count" className="text-neutral-600 text-preset-8">
        {text.length} / {MAX_JOURNAL_LENGTH}
      </p>
    </div>
    <div className="mt-8">
      <ErrorMessage message={error} />
    </div>
  </div>
);

const SleepStep = ({
  selectedOption,
  onOptionChange,
  error,
}: {
  selectedOption: number;
  onOptionChange: (index: number) => void;
  error?: string;
}) => (
  <div>
    <h3 className="text-preset-3 text-neutral-900">
      How many hours did you sleep last night?
    </h3>
    <div className="grid gap-3 mt-8">
      {sleepOptions.map((option, index) => (
        <SleepOption
          key={index}
          sleepOption={option}
          isChecked={selectedOption === index}
          onChange={() => onOptionChange(index)}
        />
      ))}
    </div>

    <div className="mt-8">
      <ErrorMessage message={error} />
    </div>
  </div>
);

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

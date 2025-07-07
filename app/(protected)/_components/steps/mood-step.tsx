import ErrorMessage from "@/components/ui/error-message";

import Radio from "@/components/ui/radio";
import { cn } from "@/lib/utils";
import React, { memo } from "react";

import { useLogMoodContext } from "../../_context/log-mood-context";
import { MOODS_CONFIG } from "../../utils";

const Mood = memo(
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

const MoodStep = () => {
  const { setMood, data, errors } = useLogMoodContext();
  const { mood } = data;
  const error = errors.mood;

  return (
    <div>
      <h3 className="text-preset-3 text-neutral-900">
        How was your mood today?
      </h3>
      <div className="grid gap-3 mt-8">
        {MOODS_CONFIG.map(({ moodText, Icon, value }, index) => (
          <Mood
            key={index}
            mood={moodText}
            Icon={Icon}
            isChecked={mood === value}
            onChange={() => setMood(value)}
          />
        ))}
      </div>
      <div className="mt-8">
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};

export default MoodStep;

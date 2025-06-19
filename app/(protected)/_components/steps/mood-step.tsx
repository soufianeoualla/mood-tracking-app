import ErrorMessage from "@/components/error-message";
import { Happy, VeryHappy, Neutral, Sad, VerySad } from "@/components/icons";
import Radio from "@/components/ui/radio";
import { cn } from "@/utils";
import React from "react";

interface MoodOption {
  mood: string;
  Icon: React.ComponentType<{ className?: string }>;
}
const MOODS: MoodOption[] = [
  { mood: "Very Happy", Icon: VeryHappy },
  { mood: "Happy", Icon: Happy },
  { mood: "Neutral", Icon: Neutral },
  { mood: "Sad", Icon: Sad },
  { mood: "Very Sad", Icon: VerySad },
];

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

export default MoodStep;

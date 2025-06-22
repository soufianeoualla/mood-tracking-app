import ErrorMessage from "@/components/error-message";
import { Happy, VeryHappy, Neutral, Sad, VerySad } from "@/components/icons";
import Radio from "@/components/ui/radio";
import { cn } from "@/lib/utils";
import React from "react";
import { useMood } from "../../_context/mood-context";
import { MoodEntrySchemaType } from "@/schemas/mood.entry";

interface MoodOption {
  mood: string;
  Icon: React.ComponentType<{ className?: string }>;
  value: MoodEntrySchemaType["mood"];
}
export const MOODS: MoodOption[] = [
  { mood: "Very Happy", Icon: VeryHappy, value: 2 },
  { mood: "Happy", Icon: Happy, value: 1 },
  { mood: "Neutral", Icon: Neutral, value: 0 },
  { mood: "Sad", Icon: Sad, value: -1 },
  { mood: "Very Sad", Icon: VerySad, value: -2 },
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

const MoodStep = () => {
  const { setMood, data, errors } = useMood();
  const { mood } = data;
  const error = errors.mood;

  return (
    <div>
      <h3 className="text-preset-3 text-neutral-900">
        How was your mood today?
      </h3>
      <div className="grid gap-3 mt-8">
        {MOODS.map(({ mood: moodText, Icon, value }, index) => (
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

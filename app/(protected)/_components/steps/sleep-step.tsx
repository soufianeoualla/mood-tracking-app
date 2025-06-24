import ErrorMessage from "@/components/error-message";
import Radio from "@/components/ui/radio";


import { cn } from "@/lib/utils";

import { memo } from "react";

import { MoodEntrySchemaType } from "@/schemas/mood.entry";
import { useLogMoodContext } from "../../_context/log-mood-context";
import { sleepOptions } from "../../utils";

interface SleepOption {
  label: string;
  value: MoodEntrySchemaType['sleepHours'];
}

const SleepOption = memo(
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

const SleepStep = () => {
  const { data, setSleepHours, errors } = useLogMoodContext();
  const { sleepHours } = data;
  const error = errors.sleepHours;
  return (
    <div>
      <h3 className="text-preset-3 text-neutral-900">
        How many hours did you sleep last night?
      </h3>
      <div className="grid gap-3 mt-8">
        {sleepOptions.map((option, index) => (
          <SleepOption
            key={index}
            sleepOption={option}
            isChecked={sleepHours === option.value}
            onChange={() => setSleepHours(option.value)}
          />
        ))}
      </div>

      <div className="mt-8">
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};

export default SleepStep;

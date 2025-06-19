import ErrorMessage from "@/components/error-message";
import Radio from "@/components/ui/radio";
import sleepOptions from "@/data/sleep-options.json";
import { cn } from "@/utils";

import { memo } from "react";

interface SleepOption {
  label: string;
  value: number;
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

export default SleepStep;

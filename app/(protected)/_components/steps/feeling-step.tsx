import ErrorMessage from "@/components/error-message";
import Checkbox from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import { memo } from "react";


import { MoodEntrySchemaType } from "@/schemas/mood.entry";
import { useLogMoodContext } from "../../_context/log-mood-context";
import { feelingsTags } from "../../utils";

export const MAX_FEELINGS = 3;

const Tag = memo(
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

const FeelingsStep = () => {
  const { data, setFeelings, errors } = useLogMoodContext();
  const { feelings } = data;
  const error = errors.feelings;
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
        {feelingsTags.map((feeling) => (
          <Tag
            key={feeling}
            text={feeling}
            isChecked={feelings.includes(
              feeling.toUpperCase() as MoodEntrySchemaType["feelings"][number]
            )}
            onChange={() =>
              setFeelings(
                feeling.toUpperCase() as MoodEntrySchemaType["feelings"][number]
              )
            }
            disabled={
              !feelings.includes(
                feeling.toUpperCase() as MoodEntrySchemaType["feelings"][number]
              ) && !canAddMore
            }
          />
        ))}
      </div>

      <div className="mt-8">
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};

export default FeelingsStep;

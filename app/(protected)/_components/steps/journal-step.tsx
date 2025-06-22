import ErrorMessage from "@/components/error-message";
import { cn } from "@/lib/utils";
import { useMood } from "../../_context/mood-context";

const MAX_JOURNAL_LENGTH = 150;

const JournalStep = () => {
  const { data, errors, setComment } = useMood();
  const { comment } = data;
  const error = errors.comment;
  return (
    <div>
      <h3 className="text-preset-3 text-neutral-900">
        Write about your day...
      </h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
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
          {comment.length} / {MAX_JOURNAL_LENGTH}
        </p>
      </div>
      <div className="mt-8">
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};

export default JournalStep;

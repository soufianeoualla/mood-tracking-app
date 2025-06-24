import React from "react";

import quoteIcon from "@/assets/quote.svg";
import Image from "next/image";
import sleep from "@/assets/sleep.svg";
import commentIcon from "@/assets/commentIcon.svg";
import { Feeling, MoodEntry } from "@prisma/client";

import { getMoodConfig, getSleepHours, MoodLevel } from "../utils";



const MoodConatainer = ({
  moodText,
  Icon,
}: {
  moodText: string;
  Icon: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <div className="bg-neutral-0 border border-blue-100 rounded-2xl p-8  flex items-start justify-between h-[340px] overflow-hidden">
      <div className="flex flex-col justify-between items-start h-full">
        <h3 className="text-neutral-600 text-preset-3">
          I’m feeling <br />
          <span className="text-preset-2 text-neutral-900">{moodText}</span>
        </h3>

        <div className="grid gap-y-3">
          <Image src={quoteIcon} alt="Quote Icon" className="w-6 h-6" />
          <p className="text-neutral-600 text-preset-6-italic">
            “When your heart is full, share your light with the world.”
          </p>
        </div>
      </div>

      <Icon className="w-full h-[320px] translate-y-6 " />
    </div>
  );
};

const SleepConatiner = ({ sleepHours }: { sleepHours: number }) => {
  return (
    <div className="flex flex-col gap-y-4 bg-neutral-0 rounded-2xl p-5 border border-blue-100">
      <div className="flex items-center gap-x-3 text-preset-6 text-neutral-600">
        <Image src={sleep} alt="Sleep Icon" width={22} height={22} />
        Sleep
      </div>
      <span className="text-neutral-900 text-preset-3">
        {getSleepHours(sleepHours)
          ? getSleepHours(sleepHours)?.label
          : "No data"}
      </span>
    </div>
  );
};

const CommentContainer = ({
  comment,
  feelings,
}: {
  comment: string;
  feelings: Feeling[];
}) => {
  return (
    <div className="bg-neutral-0 border border-blue-100 rounded-2xl p-5 flex flex-col justify-between items-start h-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-3 text-preset-6 text-neutral-600">
          <Image src={commentIcon} alt="comment icon" width={22} height={22} />
          Sleep
        </div>

        <p className="text-neutral-900 text-preset-6">{comment}</p>
      </div>
      <div className="flex flex-wrap gap-x-3">
        {feelings.map((feeling, index) => (
          <span key={index} className="text-neutral-600 text-preset-6-italic">
            #{feeling}
          </span>
        ))}
      </div>
    </div>
  );
};

const LoggedMood = ({ moodEntry }: { moodEntry: MoodEntry }) => {
  const loggedMood = getMoodConfig(moodEntry.mood as MoodLevel);
  if (!loggedMood) {
    return <div className="text-red-500">Mood not found</div>;
  }
  return (
    <div className="grid grid-cols-[670px_1fr] gap-x-8 mt-16 mb-8 w-full">
      <MoodConatainer Icon={loggedMood.Icon} moodText={loggedMood.moodText} />
      <div className="flex flex-col gap-y-5 w-full">
        <SleepConatiner sleepHours={moodEntry.sleepHours} />
        <CommentContainer
          comment={moodEntry.comment || "No comment provided"}
          feelings={moodEntry.feelings || []}
        />
      </div>
    </div>
  );
};

export default LoggedMood;

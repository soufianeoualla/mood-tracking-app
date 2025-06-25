import React from "react";

import quoteIcon from "@/assets/quote.svg";
import Image from "next/image";
import sleep from "@/assets/sleep.svg";
import commentIcon from "@/assets/commentIcon.svg";

import { getMoodConfig, getSleepHours, MoodLevel } from "../utils";
import { useMoodContext } from "../_context/use-mood";

const MoodConatainer = () => {
  const { currentMoodEntry } = useMoodContext();
  if (!currentMoodEntry) {
    return (
      <div className="bg-neutral-0 border border-blue-100 rounded-2xl p-8 h-[340px] flex items-center justify-center">
        <p className="text-neutral-600 text-preset-6">No mood entry found</p>
      </div>
    );
  }
  const { Icon, moodText } = getMoodConfig(currentMoodEntry.mood as MoodLevel);
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
            “ {currentMoodEntry.generatedQuote}”
          </p>
        </div>
      </div>

      <Icon className="w-full h-[320px] translate-y-6 " />
    </div>
  );
};

const SleepConatiner = () => {
  const { currentMoodEntry } = useMoodContext();
  if (!currentMoodEntry || !currentMoodEntry.sleepHours) {
    return (
      <div className="bg-neutral-0 border border-blue-100 rounded-2xl p-5 h-[340px] flex items-center justify-center">
        <p className="text-neutral-600 text-preset-6">No sleep data found</p>
      </div>
    );
  }
  const sleepHours = currentMoodEntry.sleepHours;
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

const CommentContainer = () => {
  const { currentMoodEntry } = useMoodContext();
  if (!currentMoodEntry) {
    return (
      <div className="bg-neutral-0 border border-blue-100 rounded-2xl p-5 h-[340px] flex items-center justify-center">
        <p className="text-neutral-600 text-preset-6">
          No reflection for today
        </p>
      </div>
    );
  }
  const comment = currentMoodEntry.comment || "No comment provided";
  const feelings = currentMoodEntry.feelings || [];
  return (
    <div className="bg-neutral-0 border border-blue-100 rounded-2xl p-5 flex flex-col justify-between items-start h-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-3 text-preset-6 text-neutral-600">
          <Image src={commentIcon} alt="comment icon" width={22} height={22} />
          Reflection of the day
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

const LoggedMood = () => {
  return (
    <div className="grid grid-cols-[670px_1fr] gap-x-8 mt-16 mb-8 w-full">
      <MoodConatainer />
      <div className="flex flex-col gap-y-5 w-full">
        <SleepConatiner />
        <CommentContainer />
      </div>
    </div>
  );
};

export default LoggedMood;

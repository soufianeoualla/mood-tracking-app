"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

import pattern from "@/assets/pattern.svg";
import Image from "next/image";

import { useMoodContext } from "../_context/use-mood";
import { getMoodConfig, getSleepHours, MoodLevel } from "../utils";

const AverageMoodCard = () => {
  const { averageData } = useMoodContext();
  const mood = averageData?.averageMood;

  if (!mood)
    return (
      <div className="p-5 rounded-[20px] flex flex-col gap-y-3 bg-blue-100 justify-center items-start h-full relative ">
        <Image
          src={pattern}
          alt="Pattern"
          className="absolute top-0 right-0 w-auto h-full "
        />

        <div className="flex flex-col items-start gap-y-3">
          <h4 className="text-neutral-900 text-preset-4">Keep tracking! </h4>
          <p className="text-neutral-600 text-preset-7">
            Log 5 check-ins to see your average mood.
          </p>
        </div>
      </div>
    );

  const status = averageData?.moodStatus ?? null;

  const { Icon, color: moodColor, moodText } = getMoodConfig(mood as MoodLevel);

  return (
    <div
      className={cn(
        "p-5 rounded-[20px] flex flex-col gap-y-3 justify-center items-start h-full relative ",
        averageData?.averageMood ? moodColor : "bg-blue-100"
      )}
    >
      <Image
        src={pattern}
        alt="Pattern"
        className="absolute top-0 right-0 w-auto h-full "
      />

      <div className="flex items-center gap-x-4">
        <Icon isWhite width={24} height={24} />
        <h4 className="text-preset-4 text-neutral-900">{moodText}</h4>
      </div>
      <div className="flex items-center gap-x-2 text-neutral-900 text-preset-7">
        <ArrowRight
          className={cn(
            status === "up" && "-rotate-45",
            status === "down" && "rotate-45"
          )}
        />
        <span>
          {status === "same" && "Same as the previous 5 check-ins"}
          {status === "up" && "Better than the previous 5 check-ins"}
          {status === "down" && "Worse than the previous 5 check-ins"}
          {status === null && "No data"}
        </span>
      </div>
    </div>
  );
};

const AverageSleepCard = () => {
  const { averageData } = useMoodContext();

  if (!averageData?.averageSleepHours)
    return (
      <div className="p-5 rounded-[20px] text-white  flex bg-blue-100 flex-col gap-y-3 justify-center items-start h-full relative">
        <Image
          src={pattern}
          alt="Pattern"
          className="absolute top-0 right-0 w-auto h-full "
        />

        <div className="flex flex-col items-start gap-y-3">
          <h4 className="text-neutral-900 text-preset-4">
            Not enough data yet!{" "}
          </h4>
          <p className="text-neutral-600 text-preset-7">
            Track 5 nights to view average sleep.
          </p>
        </div>
      </div>
    );

  const sleepHours = getSleepHours(averageData?.averageSleepHours);
  const status = averageData?.sleepStatus ?? null;
  return (
    <div className="p-5 rounded-[20px] text-white bg-blue-600  flex flex-col gap-y-3 justify-center items-start h-full relative">
      <Image
        src={pattern}
        alt="Pattern"
        className="absolute top-0 right-0 w-auto h-full "
      />

      <div className="flex items-center gap-x-4">
        <h4 className="text-preset-4">
          {sleepHours?.label ? `${sleepHours.label}` : "No data"}
        </h4>
      </div>
      <div className="flex items-center gap-x-2 text-neutral-0 text-preset-7">
        <ArrowRight
          className={cn(
            status === "up" && "-rotate-45",
            status === "down" && "rotate-45"
          )}
        />
        <span>
          {status === "same" && "Same as the previous 5 check-ins"}
          {status === "up" && "Better than the previous 5 check-ins"}
          {status === "down" && "Worse than the previous 5 check-ins"}
          {status === null && "No data of the previous 5 check-ins"}
        </span>
      </div>
    </div>
  );
};

const AverageMoodSleep = () => {
  return (
    <div className="bg-neutral-0 rounded-2xl p-6 border border-blue-100  space-y-6 h-full flex flex-col relative">
      {" "}
      <div className="space-y-3 flex flex-col h-full ">
        <h5 className="text-preset-5 text-neutral-900">
          Average Mood{" "}
          <span className="text-neutral-600 text-preset-7">
            (Last 5 Check-ins)
          </span>
        </h5>
        <AverageMoodCard />
      </div>
      <div className="space-y-3 flex flex-col h-full">
        <h5 className="text-preset-5 text-neutral-900">
          Average Sleep{" "}
          <span className="text-neutral-600 text-preset-7">
            (Last 5 Check-ins)
          </span>
        </h5>
        <AverageSleepCard />
      </div>
    </div>
  );
};

export default AverageMoodSleep;

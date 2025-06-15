import { Mood } from "@/types";
import { cn } from "@/utils";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Happy, Neutral, Sad, VeryHappy, VerySad } from "@/components/icons";
import pattern from "@/assets/pattern.svg";
import Image from "next/image";

const AverageMoodCard = ({ mood }: { mood?: Mood }) => {
  let moodColor = "bg-neutral-200";
  let Icon = Neutral;
  let moodText = "";
  switch (mood) {
    case "happy":
      moodColor = "bg-green-300";
      Icon = Happy;
      moodText = "Happy";
      break;
    case "very happy":
      moodColor = "bg-amber-300";
      Icon = VeryHappy;
      moodText = "Very Happy";
      break;
    case "sad":
      moodColor = "bg-indigo-200";
      Icon = Sad;
      moodText = "Sad";
      break;
    case "neutral":
      moodColor = "bg-blue-300";
      Icon = Neutral;
      moodText = "Neutral";
      break;
    case "very sad":
      moodColor = "bg-red-300";
      Icon = VerySad;
      moodText = "Very Sad";
      break;
  }

  return (
    <div
      className={cn(
        "p-5 rounded-[20px] flex flex-col gap-y-3 justify-center items-start h-full relative ",
        moodColor
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
        <ArrowRight />
        <span>Same as the previous 5 check-ins</span>
      </div>
    </div>
  );
};

const AverageSleepCard = ({ sleepHours }: { sleepHours?: string }) => {
  return (
    <div className="p-5 rounded-[20px] text-white bg-blue-600 flex flex-col gap-y-3 justify-center items-start h-full relative">
      <Image
        src={pattern}
        alt="Pattern"
        className="absolute top-0 right-0 w-auto h-full "
      />
      <div className="flex items-center gap-x-4">
        <h4 className="text-preset-4">
          {sleepHours ? `${sleepHours} hours` : "No data"}
        </h4>
      </div>
      <div className="flex items-center gap-x-2  text-preset-7">
        <ArrowRight />
        <span>Same as the previous 5 check-ins</span>
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
        <AverageMoodCard mood={Mood.Happy} />
      </div>
      <div className="space-y-3 flex flex-col h-full">
        <h5 className="text-preset-5 text-neutral-900">
          Average Sleep{" "}
          <span className="text-neutral-600 text-preset-7">
            (Last 5 Check-ins)
          </span>
        </h5>
        <AverageSleepCard sleepHours={"5-6"} />
      </div>
    </div>
  );
};

export default AverageMoodSleep;

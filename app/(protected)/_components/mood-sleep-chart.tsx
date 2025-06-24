"use client";
import React, { useEffect, useRef, useState } from "react";
import sleep from "@/assets/sleep.svg";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { useMoodContext } from "../_context/use-mood";
import { MoodEntry } from "@prisma/client";

import {
  getMoodConfig,
  getSleepHours,
  MoodLevel,
  sleepOptions,
} from "../utils";

interface SleepOption {
  label: string;
  value?: number;
}

type SleepHours = 1 | 3.5 | 5.5 | 7.5 | 9;

const LEVEL = 53;
const BASE_HEIGHT = 50;

const SLEEP_HEIGHT_MAP: Record<SleepHours, number> = {
  1: 0,
  3.5: LEVEL,
  5.5: LEVEL * 2,
  7.5: LEVEL * 3,
  9: LEVEL * 4,
};

const getBarHeight = (sleepHours: SleepHours): number => {
  return SLEEP_HEIGHT_MAP[sleepHours] || 0;
};

const Popover = ({ entry, bottom }: { entry: MoodEntry; bottom: boolean }) => {
  const { Icon, moodText } = getMoodConfig(entry.mood as MoodLevel);
  const sleepHours = getSleepHours(entry.sleepHours as SleepHours);
  const feelings = entry.feelings.map((feeling) => feeling.toLowerCase());

  return (
    <div
      className={cn(
        "bg-neutral-0 rounded-[10px] p-3 border border-blue-100 shadow-lg absolute -left-45 w-[175px] ",
        bottom ? "bottom-0" : "top-0"
      )}
    >
      <div className="flex flex-col gap-y-2 mb-3">
        <span className="text-neutral-600 text-preset-8">Mood</span>
        <div className="flex items-center gap-1.5">
          <Icon width={16} height={16} />
          <span className="text-neutral-900 text-preset-7">{moodText}</span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 mb-3">
        <span className="text-neutral-600 text-preset-8">Sleep</span>
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-900 text-preset-7">
            {sleepHours?.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 mb-3">
        <span className="text-neutral-600 text-preset-8">Reflection</span>
        <p className="text-neutral-900 text-preset-9">{entry.comment}</p>
      </div>

      <div className="flex flex-col gap-y-2 ">
        <span className="text-neutral-600 text-preset-8">Tags</span>
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-900 text-preset-9 capitalize">
            {feelings.join(", ") || "No tags selected"}
          </span>
        </div>
      </div>
    </div>
  );
};

const Bar = ({ entry }: { entry: MoodEntry }) => {
  const [showPopover, setShowPopover] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);
  if (!entry) return null;
  const { color, Icon } = getMoodConfig(entry.mood as MoodLevel);
  const barHeight = getBarHeight(entry.sleepHours as SleepHours);

  return (
    <div className="w-full absolute bottom-[50px]">
      {showPopover && <Popover entry={entry} bottom={barHeight === 0} />}

      <div
        ref={dropdownRef}
        onClick={() => setShowPopover((prev) => !prev)}
        style={{
          height: `${BASE_HEIGHT + barHeight}px`,
        }}
        className={cn(
          "w-full rounded-full flex items-start py-[5px] justify-center",
          color
        )}
      >
        <Icon isWhite width={30} height={30} />
      </div>
    </div>
  );
};

const SleepOption = ({
  option,
  index,
}: {
  option: SleepOption;
  index: number;
}) => (
  <div key={index} className="flex items-center gap-x-5.5">
    <div className="flex items-center gap-1.5 text-preset-9 text-neutral-600">
      <Image src={sleep} alt="Sleep Icon" width={10} />
      {option.label}
    </div>
    <hr className="text-blue-100 h-[1px] flex-1" />
  </div>
);

const ChartEntry = ({
  entry,
  date,
  index,
}: {
  entry: MoodEntry;
  date: string;
  index: number;
}) => {
  const [month, day] = new Date(date)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .split(" ");
  return (
    <div key={index} className="relative">
      <div className="flex flex-col items-center gap-y-1.5 text-neutral-900 text-preset-8 w-11">
        <span className="text-preset-9 text-neutral-600">{month}</span>
        {day}
      </div>
      <Bar entry={entry} />
    </div>
  );
};

const MoodSleepChart = () => {
  const { moodEntries } = useMoodContext();
  return (
    <div className="bg-neutral-0 rounded-[10px] p-8 border border-blue-100">
      <h3 className="text-preset-3 text-neutral-900">Mood and sleep trends</h3>

      <div className="flex flex-col gap-y-10 w-full mt-8" role="list">
        {sleepOptions.map((option, index) => (
          <SleepOption key={index} option={option} index={index} />
        ))}
      </div>

      <div
        className="pl-21 flex items-center gap-x-4 mt-[61px]"
        role="img"
        aria-label="Mood and sleep chart showing recent 10 entries"
      >
        {moodEntries?.map((item, idx) => (
          <ChartEntry
            key={`${item.date}-${idx}`}
            entry={item.entry}
            index={idx}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSleepChart;

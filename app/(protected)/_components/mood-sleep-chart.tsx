"use client";
import React, { memo, useMemo } from "react";
import sleep from "@/assets/sleep.svg";

import Image from "next/image";
import { Happy, Neutral, Sad, VeryHappy, VerySad } from "@/components/icons";
import { cn } from "@/lib/utils";
import { sleepOptions } from "@/data/sleep-options";

interface MoodEntry {
  createdAt: string;
  mood: MoodLevel;
  feelings: string[];
  journalEntry: string;
  sleepHours: SleepHours;
}

interface ProcessedEntry {
  day: string;
  month: string;
  sleepHours: SleepHours;
  mood: MoodLevel;
}

interface SleepOption {
  label: string;
  value?: number;
}

interface MoodConfig {
  color: string;
  Icon: React.ComponentType<IconProps>;
}

interface IconProps {
  isWhite?: boolean;
  width?: number;
  height?: number;
}

interface BarProps {
  entry: ProcessedEntry;
}

interface SleepOptionProps {
  option: SleepOption;
  index: number;
}

interface ChartEntryProps {
  entry: ProcessedEntry;
  index: number;
}

type MoodLevel = -2 | -1 | 0 | 1 | 2;
type SleepHours = 1 | 3.5 | 5.5 | 7.5 | 9;

const moodEntries: MoodEntry[] = [
  {
    createdAt: "2025-03-20T09:00:00Z",
    mood: 2,
    feelings: ["Joyful", "Motivated", "Hopeful"],
    journalEntry: "Had an amazing morning run and feel full of energy!",
    sleepHours: 7.5,
  },
  {
    createdAt: "2025-03-24T10:30:00Z",
    mood: 1,
    feelings: ["Grateful", "Calm"],
    journalEntry: "Spent time with family, feeling relaxed and thankful.",
    sleepHours: 7.5,
  },
  {
    createdAt: "2025-03-26T08:15:00Z",
    mood: 0,
    feelings: ["Peaceful"],
    journalEntry: "Routine day at work, nothing too exciting or stressful.",
    sleepHours: 5.5,
  },
  {
    createdAt: "2025-03-28T07:50:00Z",
    mood: -1,
    feelings: ["Down", "Tired"],
    journalEntry: "Tough day. Didn't sleep well and felt drained at work.",
    sleepHours: 3.5,
  },
  {
    createdAt: "2025-03-31T11:00:00Z",
    mood: -1,
    feelings: ["Disappointed", "Frustrated"],
    journalEntry: "Got some bad news. Trying to process my emotions.",
    sleepHours: 5.5,
  },
  {
    createdAt: "2025-04-02T12:05:00Z",
    mood: 1,
    feelings: ["Excited", "Content"],
    journalEntry: "A good friend visited, which lifted my spirits a lot.",
    sleepHours: 7.5,
  },
  {
    createdAt: "2025-04-04T09:15:00Z",
    mood: -2,
    feelings: ["Overwhelmed", "Lonely"],
    journalEntry: "Feeling isolated. Need to talk to someone soon.",
    sleepHours: 3.5,
  },
  {
    createdAt: "2025-04-06T19:45:00Z",
    mood: 0,
    feelings: ["Irritable"],
    journalEntry: "Woke up in a grouchy mood but it got better by evening.",
    sleepHours: 5.5,
  },
  {
    createdAt: "2025-04-07T10:55:00Z",
    mood: 1,
    feelings: ["Optimistic", "Confident"],
    journalEntry: "Good progress on personal goals today, feeling proud.",
    sleepHours: 7.5,
  },
  {
    createdAt: "2025-04-09T07:30:00Z",
    mood: 2,
    feelings: ["Joyful", "Excited", "Grateful"],
    journalEntry: "Slept well and woke up ready to tackle new challenges.",
    sleepHours: 9,
  },
];

const LEVEL = 53;
const BASE_HEIGHT = 50;

const MOOD_CONFIG: Record<MoodLevel, MoodConfig> = {
  2: { color: "bg-green-300", Icon: VeryHappy },
  1: { color: "bg-blue-300", Icon: Happy },
  0: { color: "bg-indigo-200", Icon: Neutral },
  [-1]: { color: "bg-red-300", Icon: Sad },
  [-2]: { color: "bg-amber-300", Icon: VerySad },
};

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

const getMoodConfig = (mood: MoodLevel): MoodConfig => {
  return MOOD_CONFIG[mood] || { color: "bg-indigo-200", Icon: Neutral };
};

const getRecent10Entries = (entries: MoodEntry[]): ProcessedEntry[] => {
  return [...entries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)
    .map((entry) => {
      const date = new Date(entry.createdAt);
      return {
        day: String(date.getDate()).padStart(2, "0"),
        month: date.toLocaleString("default", { month: "short" }),
        sleepHours: entry.sleepHours,
        mood: entry.mood,
      };
    })
    .reverse();
};

const Bar: React.FC<BarProps> = memo(({ entry }) => {
  const { color, Icon } = getMoodConfig(entry.mood);
  const barHeight = getBarHeight(entry.sleepHours);

  return (
    <div
      style={{
        height: `${BASE_HEIGHT + barHeight}px`,
      }}
      className={cn(
        "w-full rounded-full absolute bottom-[50px] flex items-start py-[5px] justify-center",
        color
      )}
      role="img"
      aria-label={`Mood: ${entry.mood}, Sleep: ${entry.sleepHours} hours`}
    >
      <Icon isWhite width={30} height={30} />
    </div>
  );
});

Bar.displayName = "Bar";

const SleepOption: React.FC<SleepOptionProps> = memo(({ option, index }) => (
  <div key={index} className="flex items-center gap-x-5.5">
    <div className="flex items-center gap-1.5 text-preset-9 text-neutral-600">
      <Image src={sleep} alt="Sleep Icon" width={10} height={10} />
      {option.label}
    </div>
    <hr className="text-blue-100 h-[1px] flex-1" />
  </div>
));

SleepOption.displayName = "SleepOption";

const ChartEntry: React.FC<ChartEntryProps> = memo(({ entry, index }) => (
  <div key={index} className="relative">
    <div className="flex flex-col items-center gap-y-1.5 text-neutral-900 text-preset-8 w-11">
      <span className="text-preset-9 text-neutral-600">{entry.month}</span>
      {entry.day}
    </div>
    <Bar entry={entry} />
  </div>
));

ChartEntry.displayName = "ChartEntry";

const MoodSleepChart: React.FC = () => {
  const recentEntries = useMemo(() => getRecent10Entries(moodEntries), []);

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
        {recentEntries.map((entry, idx) => (
          <ChartEntry
            key={`${entry.day}-${entry.month}`}
            entry={entry}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSleepChart;

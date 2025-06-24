"use client";
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoodEntry } from "@prisma/client";
import getCurrentMoodService from "../_services/get-current-mood.service";
import getChartDataService from "../_services/get-chart-data.service";
import getAverageMoodAndSleepService from "../_services/get-average-mood-and-sleep.service";
import Loader from "@/components/ui/loader";

export type Status = "up" | "down" | "same" | null;

type AverageData = {
  averageMood: number | null;
  averageSleepHours: number | null;
  moodStatus: Status;
  sleepStatus: Status;
};

type MoodContextType = {
  averageData: AverageData | undefined;
  averageError: unknown;
  currentMoodEntry: MoodEntry | null | undefined;
  currentMoodError: unknown;
  moodEntries:
    | {
        date: string;
        entry: MoodEntry;
      }[]
    | undefined;
  moodEntriesError: unknown;
  refetch: () => void;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: averageData,
    isLoading: averageLoading,
    error: averageError,
    refetch: refetchAverageData,
  } = useQuery({
    queryKey: ["averageMoodAndSleep"],
    queryFn: getAverageMoodAndSleepService,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: currentMoodEntry,
    refetch: refetchCurrentMoodEntry,
    isLoading: currentMoodLoading,
    error: currentMoodError,
  } = useQuery({
    queryKey: ["currentMood"],
    queryFn: async () => {
      const res = await getCurrentMoodService();
      return res?.moodEntry || null;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const {
    data: moodEntries,
    isLoading: moodEntriesLoading,
    refetch: refetchMoodEntries,
    error: moodEntriesError,
  } = useQuery({
    queryKey: ["moodEntries"],
    queryFn: getChartDataService,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const refetch = () => {
    refetchCurrentMoodEntry();

    refetchAverageData();
    refetchMoodEntries();
  };

  const value: MoodContextType = {
    averageData,
    averageError,
    currentMoodEntry,
    refetch,
    currentMoodError,
    moodEntries,
    moodEntriesError,
  };

  if (averageLoading || currentMoodLoading || moodEntriesLoading)
    return <Loader />;

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMoodContext must be used within a MoodProvider");
  }
  return context;
};

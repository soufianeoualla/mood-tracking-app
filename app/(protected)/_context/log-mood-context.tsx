'use client'
import { MoodEntrySchemaType } from "@/schemas/mood.entry";
import { Feeling } from "@prisma/client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { MAX_FEELINGS } from "../_components/steps/feeling-step";

interface ValidationErrors {
  mood?: string;
  feelings?: string;
  comment?: string;
  sleepHours?: string;
}
interface MoodData {
  mood: MoodEntrySchemaType["mood"];
  feelings: MoodEntrySchemaType["feelings"];
  comment: string;
  sleepHours: MoodEntrySchemaType['sleepHours'];
}

interface LogMoodContextType {
  data: MoodData;
  setMood: (mood: MoodEntrySchemaType["mood"]) => void;
  errors: ValidationErrors;
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  setFeelings: (feeling: Feeling) => void;
  setComment: (comment: string) => void;
  setSleepHours: (hours: MoodEntrySchemaType["sleepHours"]) => void;
  resetData: () => void;
}

const LogMoodContext = createContext<LogMoodContextType | undefined>(undefined);

const LogMoodProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<MoodEntrySchemaType>({
    mood: 0,
    feelings: [],
    comment: "",
    sleepHours: 7.5,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const setMood = useCallback((mood: MoodEntrySchemaType["mood"]) => {
    setData((prev) => ({ ...prev, mood }));
    setErrors((prev) => ({ ...prev, mood: undefined }));
  }, []);

  const setFeelings = useCallback((feeling: Feeling) => {

    const normalizedFeeling = feeling.toUpperCase() as MoodEntrySchemaType["feelings"][number];
    
    setData((prev) => ({
      ...prev,
      feelings: prev.feelings.includes(normalizedFeeling)
        ? prev.feelings.filter((f) => f !== normalizedFeeling)
        : prev.feelings.length < MAX_FEELINGS
        ? [...prev.feelings, normalizedFeeling]
        : prev.feelings,
    }));
    setErrors((prev) => ({ ...prev, feelings: undefined }));
  }, []);

  const setComment = useCallback((comment: string) => {
    setData((prev) => ({ ...prev, comment }));
    setErrors((prev) => ({ ...prev, comment: undefined }));
  }, []);

  const setSleepHours = useCallback(
    (hours: MoodEntrySchemaType["sleepHours"]) => {
      setData((prev) => ({ ...prev, sleepHours: hours }));
      setErrors((prev) => ({ ...prev, sleepHours: undefined }));
    },
    []
  );

  const resetData = useCallback(() => {
    setData({
      mood: -1,
      feelings: [],
      comment: "",
      sleepHours: 1,
    });
  }, []);




  return (
    <LogMoodContext.Provider
      value={{
        data,
        setMood,
        setFeelings,
        setComment,
        setSleepHours,
        resetData,
        errors,
        setErrors,
      }}
    >
      {children}
    </LogMoodContext.Provider>
  );
};

const useLogMoodContext = () => {
  const context = useContext(LogMoodContext);
  if (!context) {
    throw new Error("useLogMood must be used within a LogMoodProvider");
  }
  return context;
};

export { LogMoodProvider, useLogMoodContext };

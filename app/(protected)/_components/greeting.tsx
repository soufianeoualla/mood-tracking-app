"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import LogMood from "./log-mood";
import useAuthStore from "@/store/useAuthStore";
import { format } from "date-fns";
import { MoodProvider } from "../_context/mood-context";
import getCurrentMoodService from "../_services/get-current-mood.service";
import LoggedMood from "./logged-mood";
import { MoodEntry } from "@prisma/client";
import { Loader2 } from "lucide-react";
const Greeting = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [moodEntry, setMoodEntry] = useState<MoodEntry | null>(null);
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0];
  const today = new Date();
  const formattedDay = format(today, "EEEE, MMMM do, yyyy");

  const fetchCurrentMood = async () => {
    setIsLoading(true);
    try {
      const data = await getCurrentMoodService();
      setIsLoading(false);
      if (!data) return;
      setMoodEntry(data.moodEntry);
    } catch (error) {
      console.error("Error fetching current mood:", error);
      setMoodEntry(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentMood();
  }, []);

  if (isLoading)
    return (
      <div className="h-[340px] mt-16 mb-8 flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );

  const renderMoodContent = () => {
    if (!!moodEntry) {
      return <LoggedMood moodEntry={moodEntry} />;
    } else {
      return (
        <>
          <Button onClick={() => setShowModal(true)} className="my-16">
            Log today&apos;s mood
          </Button>
          <MoodProvider>
            <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
              <LogMood
                hide={() => {
                  setShowModal(false);
                  fetchCurrentMood();
                }}
              />
            </Modal>
          </MoodProvider>
        </>
      );
    }
  };

  return (
    <div className="flex justify-center items-center mt-16 flex-col gap-y-2.5">
      <h3 className="text-preset-3 text-blue-600 capitalize">
        Hello, {firstName}!
      </h3>
      <h1 className="text-preset-1 text-neutral-900">
        How are you feeling today?
      </h1>
      <span className="text-neutral-600 text-preset-6">{formattedDay}</span>

      {renderMoodContent()}
    </div>
  );
};

export default Greeting;

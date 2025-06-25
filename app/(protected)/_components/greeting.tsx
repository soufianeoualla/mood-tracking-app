"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import LogMood from "./log-mood";
import useAuthStore from "@/store/useAuthStore";
import { format } from "date-fns";
import LoggedMood from "./logged-mood";
import { LogMoodProvider } from "../_context/log-mood-context";
import { useMoodContext } from "../_context/use-mood";

const Greeting = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentMoodEntry, refetch } = useMoodContext();
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0];
  const today = new Date();
  const formattedDay = format(today, "EEEE, MMMM do, yyyy");

  const renderMoodContent = () => {
    if (!!currentMoodEntry) {
      return <LoggedMood />;
    } else {
      return (
        <>
          <Button onClick={() => setShowModal(true)} className="my-16">
            Log today&apos;s mood
          </Button>
          <LogMoodProvider>
            <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
              <LogMood
                hide={() => {
                  setShowModal(false);
                  refetch();
                }}
              />
            </Modal>
          </LogMoodProvider>
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

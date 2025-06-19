"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import React, { useState } from "react";
import LogMood from "./log-mood";

const Greeting = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex justify-center items-center mt-16 flex-col gap-y-2.5">
      <h3 className="text-preset-3 text-blue-600">Hello, Lisa!</h3>
      <h1 className="text-preset-1 text-neutral-900">
        How are you feeling today?
      </h1>
      <span className="text-neutral-600 text-preset-6">
        Wednesday, April 16th, 2025
      </span>
      <Button onClick={() => setShowModal(true)} className="my-16">
        Log today&apos;s mood
      </Button>
      {showModal && (
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <LogMood />
        </Modal>
      )}
    </div>
  );
};

export default Greeting;

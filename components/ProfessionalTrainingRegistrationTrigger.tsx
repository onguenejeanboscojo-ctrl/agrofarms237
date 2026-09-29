"use client";

import { useState } from "react";
import ProfessionalTrainingRegistrationModal from "./ProfessionalTrainingRegistrationModal";

export default function ProfessionalTrainingRegistrationTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-[12px] font-bold text-paper transition hover:-translate-y-0.5 hover:opacity-90"
      >
        Je souhaite m’inscrire
        <span className="ml-2 text-base">→</span>
      </button>

      <ProfessionalTrainingRegistrationModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

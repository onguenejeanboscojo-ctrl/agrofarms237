"use client";

import { useState } from "react";
import ProfessionalTrainingRegistrationModal from "./ProfessionalTrainingRegistrationModal";

type SessionInfo = {
  id: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  capacity: number | null;
  remainingSeats: number | null;
};

export default function ProfessionalTrainingRegistrationTrigger() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] =
    useState<SessionInfo | null>(null);

  async function handleOpen() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/public/professional-training",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de récupérer la prochaine session."
        );
      }

      if (!data.session) {
        throw new Error(
          "Aucune session de formation n'est actuellement disponible."
        );
      }

      setSession({
        id: data.session.id,
        startDate:
          data.session.start_date ?? null,
        endDate:
          data.session.end_date ?? null,
        location:
          data.session.location ?? null,
        capacity:
          data.session.capacity ?? null,
        remainingSeats:
          data.session.remaining_seats ?? null,
      });

      setOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={handleOpen}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-[12px] font-bold text-paper transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
              Chargement…
            </>
          ) : (
            <>
              Je souhaite m’inscrire
              <span className="ml-2 text-base">
                →
              </span>
            </>
          )}
        </button>

        {error && (
          <p className="max-w-sm text-sm leading-5 text-red-600">
            {error}
          </p>
        )}
      </div>

      <ProfessionalTrainingRegistrationModal
        open={open}
        onClose={() => setOpen(false)}
        session={session}
      />
    </>
  );
}

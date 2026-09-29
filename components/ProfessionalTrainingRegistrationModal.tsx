"use client";

import { FormEvent, useEffect, useState } from "react";

type SessionInfo = {
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  capacity?: number | null;
  remainingSeats?: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  session?: SessionInfo | null;
};

export default function ProfessionalTrainingRegistrationModal({
  open,
  onClose,
  session,
}: Props) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const formatDate = (date?: string | null) => {
    if (!date) return "À confirmer";

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Pour cette première étape :
    // on teste uniquement l'interface.
    // L'API d'inscription sera branchée à l'étape suivante.
    setSubmitted(true);
  };

  const closeModal = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-modal-title"
        className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[28px] bg-[#f7f3ea] shadow-2xl sm:max-w-2xl sm:rounded-[28px]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-[#173d2d]/10 bg-[#f7f3ea]/95 px-5 py-5 backdrop-blur sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a5823a]">
                Formation professionnelle
              </p>

              <h2
                id="registration-modal-title"
                className="font-serif text-2xl font-semibold leading-tight text-[#173d2d] sm:text-3xl"
              >
                Inscrivez-vous à la prochaine session
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#173d2d]/65">
                Remplissez vos informations. Notre équipe vous contactera
                ensuite pour confirmer votre inscription et vous communiquer
                les modalités de règlement.
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              aria-label="Fermer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#173d2d]/10 text-xl text-[#173d2d]/70 transition hover:bg-[#173d2d] hover:text-white"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7">
          {submitted ? (
            <div className="rounded-3xl border border-[#173d2d]/10 bg-white p-7 text-center sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#173d2d] text-2xl text-white">
                ✓
              </div>

              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#173d2d]">
                Demande enregistrée
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#173d2d]/65">
                Merci pour votre intérêt. Votre demande sera traitée par notre
                équipe, qui vous contactera pour la suite de votre inscription.
              </p>

              <button
                type="button"
                onClick={closeModal}
                className="mt-7 rounded-full bg-[#173d2d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#24563f]"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              {/* Session */}
              <div className="mb-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#173d2d] p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                    Durée
                  </p>
                  <p className="mt-1 font-semibold">3 jours</p>
                </div>

                <div className="rounded-2xl border border-[#173d2d]/10 bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#173d2d]/45">
                    Tarif
                  </p>
                  <p className="mt-1 font-semibold text-[#173d2d]">
                    60 000 FCFA
                  </p>
                </div>

                <div className="rounded-2xl border border-[#173d2d]/10 bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#173d2d]/45">
                    Places
                  </p>
                  <p className="mt-1 font-semibold text-[#173d2d]">
                    {session?.remainingSeats
                      ? `${session.remainingSeats} restante${
                          session.remainingSeats > 1 ? "s" : ""
                        }`
                      : "Places limitées"}
                  </p>
                </div>
              </div>

              {session && (
                <div className="mb-7 rounded-2xl border border-[#a5823a]/20 bg-[#a5823a]/5 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5823a]">
                    Prochaine session
                  </p>

                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <span className="block text-xs text-[#173d2d]/45">
                        Dates
                      </span>
                      <span className="font-medium text-[#173d2d]">
                        {formatDate(session.startDate)}
                        {session.endDate &&
                          ` → ${formatDate(session.endDate)}`}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs text-[#173d2d]/45">
                        Lieu
                      </span>
                      <span className="font-medium text-[#173d2d]">
                        {session.location || "À confirmer"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs text-[#173d2d]/45">
                        Format
                      </span>
                      <span className="font-medium text-[#173d2d]">
                        Présentiel
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-semibold text-[#173d2d]"
                  >
                    Nom et prénom *
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    placeholder="Votre nom complet"
                    className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-[#173d2d]"
                    >
                      Téléphone / WhatsApp *
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+237 6XX XXX XXX"
                      className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-[#173d2d]"
                    >
                      Adresse e-mail
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="mb-2 block text-sm font-semibold text-[#173d2d]"
                  >
                    Organisation / activité
                  </label>

                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    placeholder="Ex. Exploitation agricole, entreprise, projet personnel..."
                    className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project"
                    className="mb-2 block text-sm font-semibold text-[#173d2d]"
                  >
                    Parlez-nous brièvement de votre projet
                  </label>

                  <textarea
                    id="project"
                    name="project"
                    rows={4}
                    placeholder="Quel type de projet agricole souhaitez-vous développer ?"
                    className="w-full resize-none rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10"
                  />
                </div>

                <div className="rounded-2xl bg-[#173d2d]/5 p-4 text-xs leading-5 text-[#173d2d]/60">
                  <strong className="text-[#173d2d]">
                    À savoir :
                  </strong>{" "}
                  l’inscription ne constitue pas encore un paiement en ligne.
                  Après réception de votre demande, AgroFarms237 vous
                  contactera pour confirmer votre participation et vous
                  communiquer les modalités.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#173d2d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#24563f] active:scale-[0.99]"
                >
                  Envoyer ma demande d’inscription
                </button>

                <p className="text-center text-xs text-[#173d2d]/45">
                  Vos informations sont utilisées uniquement pour traiter
                  votre demande d’inscription.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

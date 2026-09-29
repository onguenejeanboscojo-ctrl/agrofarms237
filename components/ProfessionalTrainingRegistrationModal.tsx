"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type SessionInfo = {
  id?: string | null;
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

type FormData = {
  full_name: string;
  phone: string;
  email: string;
  organization: string;
  project: string;
};

export default function ProfessionalTrainingRegistrationModal({
  open,
  onClose,
  session,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationId, setRegistrationId] =
    useState("");

  const [formData, setFormData] =
    useState<FormData>({
      full_name: "",
      phone: "",
      email: "",
      organization: "",
      project: "",
    });

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setLoading(false);
      setError("");
      setRegistrationId("");

      setFormData({
        full_name: "",
        phone: "",
        email: "",
        organization: "",
        project: "",
      });
    }
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

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!session?.id) {
      setError(
        "Aucune session de formation n'est actuellement sélectionnée."
      );
      return;
    }

    if (!formData.full_name.trim()) {
      setError(
        "Veuillez renseigner votre nom complet."
      );
      return;
    }

    if (!formData.phone.trim()) {
      setError(
        "Veuillez renseigner votre numéro de téléphone."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/professional-training-registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: session.id,
            full_name:
              formData.full_name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            organization:
              formData.organization.trim(),
            project:
              formData.project.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'envoyer votre demande."
        );
      }

      setRegistrationId(
        data.registration?.id || ""
      );

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  }

  function openWhatsApp() {
    const phoneNumber = "237697983119";

    const message = [
      "Bonjour AgroFarms237,",
      "",
      "Je viens de soumettre une demande d'inscription à la formation professionnelle.",
      "",
      `Nom : ${formData.full_name}`,
      `Téléphone : ${formData.phone}`,
      `Formation : Formation professionnelle AgroFarms237`,
      `Session : ${formatDate(
        session?.startDate
      )}${
        session?.endDate
          ? ` → ${formatDate(
              session.endDate
            )}`
          : ""
      }`,
      "",
      "Je souhaite échanger avec votre équipe concernant la suite de mon inscription.",
    ].join("\n");

    const url =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function closeModal() {
    if (loading) return;

    setSubmitted(false);
    setError("");
    setRegistrationId("");

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
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
        {/* HEADER */}
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
                {submitted
                  ? "Demande reçue"
                  : "Inscrivez-vous à la prochaine session"}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#173d2d]/65">
                {submitted
                  ? "Votre demande a bien été enregistrée. Vous pouvez maintenant échanger directement avec notre équipe sur WhatsApp."
                  : "Remplissez vos informations. Votre demande sera enregistrée et notre équipe vous contactera pour confirmer votre participation et vous communiquer les modalités de règlement."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              aria-label="Fermer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#173d2d]/10 text-xl text-[#173d2d]/70 transition hover:bg-[#173d2d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7">
          {submitted ? (
            /* CONFIRMATION */
            <div className="rounded-3xl border border-[#173d2d]/10 bg-white p-7 text-center sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#173d2d] text-2xl text-white">
                ✓
              </div>

              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#173d2d]">
                Votre demande a bien été reçue
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#173d2d]/65">
                Merci pour votre intérêt
                pour la formation
                professionnelle AgroFarms237.
                Notre équipe va vérifier
                votre demande afin de
                confirmer votre
                participation.
              </p>

              <div className="mt-6 rounded-2xl bg-[#173d2d]/5 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a5823a]">
                  Votre demande
                </p>

                <div className="mt-3 space-y-2 text-sm text-[#173d2d]/70">
                  <p>
                    <strong className="text-[#173d2d]">
                      Nom :
                    </strong>{" "}
                    {formData.full_name}
                  </p>

                  <p>
                    <strong className="text-[#173d2d]">
                      Session :
                    </strong>{" "}
                    {formatDate(
                      session?.startDate
                    )}
                    {session?.endDate &&
                      ` → ${formatDate(
                        session.endDate
                      )}`}
                  </p>

                  <p>
                    <strong className="text-[#173d2d]">
                      Tarif :
                    </strong>{" "}
                    60 000 FCFA
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-[#a5823a]/20 bg-[#a5823a]/5 p-4 text-sm leading-6 text-[#173d2d]/70">
                <strong className="text-[#173d2d]">
                  Prochaine étape :
                </strong>{" "}
                vous pouvez maintenant
                discuter directement avec
                notre équipe sur WhatsApp.
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#173d2d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#24563f] active:scale-[0.99]"
              >
                <span className="mr-2 text-lg">
                  💬
                </span>

                Discuter avec nous sur WhatsApp
              </button>

              {registrationId && (
                <p className="mt-4 text-[11px] text-[#173d2d]/35">
                  Référence de votre demande :{" "}
                  {registrationId.slice(0, 8)}
                </p>
              )}

              <button
                type="button"
                onClick={closeModal}
                className="mt-4 rounded-full px-6 py-3 text-sm font-semibold text-[#173d2d]/60 transition hover:bg-[#173d2d]/5 hover:text-[#173d2d]"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              {/* SESSION */}
              <div className="mb-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#173d2d] p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                    Durée
                  </p>

                  <p className="mt-1 font-semibold">
                    3 jours
                  </p>
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
                          session.remainingSeats >
                          1
                            ? "s"
                            : ""
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
                        {formatDate(
                          session.startDate
                        )}

                        {session.endDate &&
                          ` → ${formatDate(
                            session.endDate
                          )}`}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs text-[#173d2d]/45">
                        Lieu
                      </span>

                      <span className="font-medium text-[#173d2d]">
                        {session.location ||
                          "À confirmer"}
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

              {/* ERREUR */}
              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              {/* FORMULAIRE */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
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
                    value={formData.full_name}
                    onChange={(event) =>
                      updateField(
                        "full_name",
                        event.target.value
                      )
                    }
                    placeholder="Votre nom complet"
                    disabled={loading}
                    className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                      value={formData.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value
                        )
                      }
                      placeholder="+237 6XX XXX XXX"
                      disabled={loading}
                      className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                      value={formData.email}
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value
                        )
                      }
                      placeholder="vous@exemple.com"
                      disabled={loading}
                      className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                    value={
                      formData.organization
                    }
                    onChange={(event) =>
                      updateField(
                        "organization",
                        event.target.value
                      )
                    }
                    placeholder="Ex. Exploitation agricole, entreprise, projet personnel..."
                    disabled={loading}
                    className="w-full rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                    value={formData.project}
                    onChange={(event) =>
                      updateField(
                        "project",
                        event.target.value
                      )
                    }
                    placeholder="Quel type de projet agricole souhaitez-vous développer ?"
                    disabled={loading}
                    className="w-full resize-none rounded-2xl border border-[#173d2d]/10 bg-white px-4 py-3.5 text-sm text-[#173d2d] outline-none transition placeholder:text-[#173d2d]/35 focus:border-[#a5823a] focus:ring-2 focus:ring-[#a5823a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="rounded-2xl bg-[#173d2d]/5 p-4 text-xs leading-5 text-[#173d2d]/60">
                  <strong className="text-[#173d2d]">
                    À savoir :
                  </strong>{" "}
                  l’inscription ne constitue
                  pas encore un paiement en ligne.
                  Après réception de votre
                  demande, AgroFarms237 vous
                  contactera pour confirmer votre
                  participation et vous
                  communiquer les modalités.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#173d2d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#24563f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Envoi de votre demande…
                    </span>
                  ) : (
                    "Envoyer ma demande d’inscription"
                  )}
                </button>

                <p className="text-center text-xs text-[#173d2d]/45">
                  Vos informations sont
                  utilisées uniquement pour
                  traiter votre demande
                  d’inscription.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

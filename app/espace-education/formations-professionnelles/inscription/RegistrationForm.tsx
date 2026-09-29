"use client";

import { FormEvent, useState } from "react";

type Training = {
  id: string;
  title: string;
  price_xaf: number;
  duration_days: number;
  format: string | null;
};

type TrainingSession = {
  id: string;
  start_date: string;
  end_date: string | null;
  capacity: number;
  status: string;
  location: string | null;
  format: string | null;
};

type Props = {
  training: Training;
  sessions: TrainingSession[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price);
}

export default function RegistrationForm({
  training,
  sessions,
}: Props) {
  const openSessions = sessions.filter(
    (session) => session.status === "open"
  );

  const [sessionId, setSessionId] = useState(
    openSessions[0]?.id || ""
  );

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    id: string;
    fullName: string;
    amount: number;
    session: TrainingSession | undefined;
    placesRemaining: number;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(null);

    if (!sessionId) {
      setError("Veuillez sélectionner une session.");
      return;
    }

    if (!fullName.trim()) {
      setError("Veuillez renseigner votre nom complet.");
      return;
    }

    if (!phone.trim()) {
      setError("Veuillez renseigner votre numéro de téléphone.");
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
            session_id: sessionId,
            full_name: fullName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            organization: organization.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Impossible d'enregistrer votre inscription."
        );
      }

      const selectedSession = sessions.find(
        (session) => session.id === sessionId
      );

      setSuccess({
        id: data.registration.id,
        fullName: data.registration.full_name,
        amount: data.registration.amount_xaf,
        session: selectedSession,
        placesRemaining:
          data.session.places_remaining,
      });

      setFullName("");
      setPhone("");
      setEmail("");
      setOrganization("");

      if (data.session.places_remaining === 0) {
        setSessionId("");
      }
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

  if (success) {
    return (
      <div className="rounded-[28px] border border-[#245044]/15 bg-[#F4F8F4] p-7 md:p-10">

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#245044] text-xl text-white">
          ✓
        </div>

        <span className="mt-7 block text-[11px] font-bold uppercase tracking-[0.16em] text-goldDeep">
          Inscription enregistrée
        </span>

        <h2 className="mt-3 font-serif text-[32px] font-semibold leading-tight md:text-[40px]">
          Merci {success.fullName}.
        </h2>

        <p className="mt-4 max-w-[650px] text-[15px] leading-7 text-inkSoft">
          Votre demande d'inscription à la formation
          professionnelle AgroFarms237 a bien été enregistrée.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-2">

          <div className="rounded-[18px] border border-ink/10 bg-white p-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-inkSoft">
              Référence
            </span>

            <p className="mt-2 break-all font-mono text-sm font-semibold">
              {success.id}
            </p>
          </div>

          <div className="rounded-[18px] border border-ink/10 bg-white p-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-inkSoft">
              Tarif
            </span>

            <p className="mt-2 font-serif text-xl font-semibold">
              {formatPrice(success.amount)} FCFA
            </p>
          </div>

        </div>

        {success.session && (
          <div className="mt-3 rounded-[18px] border border-ink/10 bg-white p-5">

            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-inkSoft">
              Session
            </span>

            <p className="mt-2 font-semibold">
              {formatDate(success.session.start_date)}
              {success.session.end_date
                ? ` → ${formatDate(success.session.end_date)}`
                : ""}
            </p>

            <p className="mt-1 text-sm text-inkSoft">
              {success.session.location ||
                "Lieu communiqué après inscription"}
              {" • "}
              {success.session.format ||
                training.format ||
                "Présentiel"}
            </p>

          </div>
        )}

        <div className="mt-7 rounded-[20px] border border-goldDeep/20 bg-white p-5">

          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-goldDeep">
            Prochaine étape
          </span>

          <p className="mt-2 text-sm leading-6 text-inkSoft">
            Notre équipe vous contactera pour confirmer votre
            participation et vous communiquer les modalités de
            paiement ainsi que les informations pratiques de la
            session.
          </p>

        </div>

        {success.placesRemaining > 0 && (
          <p className="mt-5 text-xs font-semibold text-inkSoft">
            Il reste actuellement{" "}
            {success.placesRemaining}{" "}
            {success.placesRemaining > 1
              ? "places"
              : "place"}{" "}
            sur cette session.
          </p>
        )}

      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* SESSION */}

      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-goldDeep">
          01 — Votre session
        </span>

        <h2 className="mt-3 font-serif text-3xl font-semibold">
          Choisissez votre session
        </h2>

        <p className="mt-3 text-sm leading-6 text-inkSoft">
          Sélectionnez la date qui vous convient.
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {openSessions.map((session) => (
          <label
            key={session.id}
            className={`flex cursor-pointer items-start gap-4 rounded-[20px] border p-5 transition ${
              sessionId === session.id
                ? "border-goldDeep bg-bgAlt"
                : "border-ink/10 hover:border-goldDeep/50"
            }`}
          >
            <input
              type="radio"
              name="session"
              value={session.id}
              checked={sessionId === session.id}
              onChange={(event) =>
                setSessionId(event.target.value)
              }
              className="mt-1 h-4 w-4 accent-[#B18A45]"
            />

            <span className="min-w-0 flex-1">

              <span className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                <span className="font-semibold">
                  Session du{" "}
                  {formatDate(session.start_date)}
                </span>

                <span className="inline-flex w-fit rounded-full bg-[#E8F0EA] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#245044]">
                  Ouverte
                </span>

              </span>

              {session.end_date && (
                <span className="mt-2 block text-sm text-inkSoft">
                  Jusqu'au{" "}
                  {formatDate(session.end_date)}
                </span>
              )}

              <span className="mt-1 block text-sm text-inkSoft">
                {session.location ||
                  "Lieu communiqué après inscription"}
                {" • "}
                {session.format ||
                  training.format ||
                  "Présentiel"}
              </span>

              <span className="mt-3 block text-xs font-semibold text-inkSoft">
                Capacité : {session.capacity} participants maximum
              </span>

            </span>
          </label>
        ))}
      </div>

      {/* COORDONNÉES */}

      <div className="mt-10 border-t border-ink/10 pt-8">

        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-goldDeep">
          02 — Vos coordonnées
        </span>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-sm font-semibold"
            >
              Nom complet *
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Votre nom et prénom"
              className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none transition focus:border-goldDeep"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold"
            >
              Téléphone *
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="+237 6XX XXX XXX"
              className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none transition focus:border-goldDeep"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="vous@exemple.com"
              className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none transition focus:border-goldDeep"
            />
          </div>

          <div>
            <label
              htmlFor="organization"
              className="mb-2 block text-sm font-semibold"
            >
              Organisation / activité
            </label>

            <input
              id="organization"
              name="organization"
              type="text"
              value={organization}
              onChange={(event) =>
                setOrganization(event.target.value)
              }
              placeholder="Entreprise, exploitation, projet..."
              className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none transition focus:border-goldDeep"
            />
          </div>

        </div>

      </div>

      {/* ERREUR */}

      {error && (
        <div className="mt-7 rounded-[16px] border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      {/* TARIF + CTA */}

      <div className="mt-8 border-t border-ink/10 pt-7">

        <div className="rounded-[18px] bg-bgAlt p-5">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-inkSoft">
                Tarif de la formation
              </span>

              <p className="mt-1 font-serif text-2xl font-semibold">
                {formatPrice(training.price_xaf)} FCFA
              </p>
            </div>

            <span className="text-sm text-inkSoft">
              {training.duration_days} jours •{" "}
              {training.format || "Présentiel"}
            </span>

          </div>

        </div>

        <button
          type="submit"
          disabled={loading || !sessionId}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-4 text-[12px] font-bold text-paper transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Enregistrement en cours..."
            : "Confirmer mon inscription"}
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-inkSoft">
          Votre demande sera enregistrée. Les modalités de
          confirmation et de paiement vous seront communiquées
          ensuite par notre équipe.
        </p>

      </div>

    </form>
  );
}

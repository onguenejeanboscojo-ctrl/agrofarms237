"use client";

import { useState } from "react";

type FormState = {
  full_name: string;
  organization: string;
  phone: string;
  email: string;
  profile_type: string;
  areas_of_interest: string[];
  contribution_type: string[];
  investment_range: string;
  investment_horizon: string;
  city: string;
  country: string;
  message: string;
};

const PROFILE_OPTIONS = [
  "Investisseur",
  "Entrepreneur",
  "Entreprise",
  "Institution",
  "Partenaire technique",
  "Partenaire commercial",
  "Autre",
];

const INTEREST_OPTIONS = [
  "Pisciculture",
  "Élevage porcin",
  "Aviculture",
  "Transformation",
  "Conditionnement",
  "Distribution",
  "Plusieurs activités",
];

const CONTRIBUTION_OPTIONS = [
  "Apport financier",
  "Équipements / infrastructures",
  "Expertise technique",
  "Réseau commercial",
  "Distribution",
  "Accompagnement stratégique",
  "Autre",
];

const INVESTMENT_RANGES = [
  "Moins de 1 M FCFA",
  "1–5 M FCFA",
  "5–10 M FCFA",
  "+10 M FCFA",
  "Je souhaite en discuter",
];

const HORIZON_OPTIONS = [
  "Court terme",
  "6–12 mois",
  "1–3 ans",
  "À définir",
];

export default function PartenairesForm() {
  const [form, setForm] = useState<FormState>({
    full_name: "",
    organization: "",
    phone: "",
    email: "",
    profile_type: "",
    areas_of_interest: [],
    contribution_type: [],
    investment_range: "",
    investment_horizon: "",
    city: "",
    country: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleMultiSelect(
    field: "areas_of_interest" | "contribution_type",
    value: string
  ) {
    setForm((current) => {
      const currentValues = current[field];

      const alreadySelected = currentValues.includes(value);

      return {
        ...current,
        [field]: alreadySelected
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.full_name,
          organization: form.organization,
          phone: form.phone,
          email: form.email,

          profile_type: form.profile_type,
          areas_of_interest: form.areas_of_interest.join(", "),
          contribution_type: form.contribution_type.join(", "),
          investment_range: form.investment_range,
          investment_horizon: form.investment_horizon,
          city: form.city,
          country: form.country,

          message: form.message,

          // Compatibilité avec les champs existants
          partnership_type: form.profile_type || "Autre",
          amount_interest: form.investment_range || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de l'envoi."
        );
      }

      setSent(true);
    } catch (err: any) {
      setError(
        err.message ||
          "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-11 max-w-[760px] rounded-l border border-paper/15 bg-waterDeep p-9 md:p-11">
        <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-gold">
          Demande enregistrée
        </p>

        <h3 className="mt-3 font-display text-2xl text-paper md:text-3xl">
          Merci pour votre intérêt.
        </h3>

        <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-paper/75">
          Votre demande a bien été enregistrée. Nous reviendrons
          vers vous au{" "}
          <span className="font-semibold text-paper">
            {form.phone}
          </span>{" "}
          ou à l’adresse{" "}
          <span className="font-semibold text-paper">
            {form.email}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-11 max-w-[760px] rounded-l border border-paper/15 bg-waterDeep p-7 md:p-10"
    >
      {/* INTRO */}
      <div className="mb-9 border-b border-paper/10 pb-7">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-gold">
          Questionnaire partenaire
        </p>

        <h3 className="mt-2 font-display text-2xl text-paper md:text-3xl">
          Parlons de votre projet
        </h3>

        <p className="mt-3 max-w-[620px] text-[14px] leading-6 text-paper/65">
          Quelques informations nous permettront de mieux
          comprendre votre profil, vos intérêts et la manière dont
          nous pourrions envisager une collaboration.
        </p>
      </div>

      {/* 1 — PROFIL */}
      <section>
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            01
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Votre profil
          </h4>

          <p className="mt-1 text-[13px] text-paper/55">
            Quel type de partenaire êtes-vous ?
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {PROFILE_OPTIONS.map((option) => {
            const selected = form.profile_type === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  updateField("profile_type", option)
                }
                className={`rounded-s border px-4 py-3 text-left text-[14px] transition ${
                  selected
                    ? "border-gold bg-gold text-waterDeep"
                    : "border-paper/15 bg-paper/5 text-paper hover:border-paper/35 hover:bg-paper/10"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2 — INTÉRÊTS */}
      <section className="mt-10 border-t border-paper/10 pt-9">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            02
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Ce qui vous intéresse
          </h4>

          <p className="mt-1 text-[13px] text-paper/55">
            Vous pouvez sélectionner plusieurs domaines.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {INTEREST_OPTIONS.map((option) => {
            const selected =
              form.areas_of_interest.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  toggleMultiSelect(
                    "areas_of_interest",
                    option
                  )
                }
                className={`rounded-s border px-4 py-2.5 text-[13.5px] transition ${
                  selected
                    ? "border-gold bg-gold text-waterDeep"
                    : "border-paper/15 bg-paper/5 text-paper hover:border-paper/35 hover:bg-paper/10"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3 — CONTRIBUTION */}
      <section className="mt-10 border-t border-paper/10 pt-9">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            03
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Comment souhaitez-vous contribuer ?
          </h4>

          <p className="mt-1 text-[13px] text-paper/55">
            Plusieurs réponses sont possibles.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {CONTRIBUTION_OPTIONS.map((option) => {
            const selected =
              form.contribution_type.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  toggleMultiSelect(
                    "contribution_type",
                    option
                  )
                }
                className={`rounded-s border px-4 py-2.5 text-[13.5px] transition ${
                  selected
                    ? "border-gold bg-gold text-waterDeep"
                    : "border-paper/15 bg-paper/5 text-paper hover:border-paper/35 hover:bg-paper/10"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4 — MONTANT */}
      <section className="mt-10 border-t border-paper/10 pt-9">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            04
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Ordre de grandeur envisagé
          </h4>

          <p className="mt-1 text-[13px] text-paper/55">
            Cette information reste indicative.
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {INVESTMENT_RANGES.map((option) => {
            const selected =
              form.investment_range === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  updateField("investment_range", option)
                }
                className={`rounded-s border px-4 py-3 text-left text-[14px] transition ${
                  selected
                    ? "border-gold bg-gold text-waterDeep"
                    : "border-paper/15 bg-paper/5 text-paper hover:border-paper/35 hover:bg-paper/10"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5 — HORIZON */}
      <section className="mt-10 border-t border-paper/10 pt-9">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            05
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Horizon du projet
          </h4>

          <p className="mt-1 text-[13px] text-paper/55">
            Quand envisagez-vous cette collaboration ?
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {HORIZON_OPTIONS.map((option) => {
            const selected =
              form.investment_horizon === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  updateField(
                    "investment_horizon",
                    option
                  )
                }
                className={`rounded-s border px-4 py-3 text-left text-[14px] transition ${
                  selected
                    ? "border-gold bg-gold text-waterDeep"
                    : "border-paper/15 bg-paper/5 text-paper hover:border-paper/35 hover:bg-paper/10"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      {/* 6 — LOCALISATION */}
      <section className="mt-10 border-t border-paper/10 pt-9">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            06
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Votre localisation
          </h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label className="!text-paper/75">
              Ville
            </label>

            <input
              value={form.city}
              onChange={(e) =>
                updateField("city", e.target.value)
              }
              placeholder="Ex. Yaoundé"
              className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
            />
          </div>

          <div className="field">
            <label className="!text-paper/75">
              Pays
            </label>

            <input
              value={form.country}
              onChange={(e) =>
                updateField("country", e.target.value)
              }
              placeholder="Ex. Cameroun"
              className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
            />
          </div>
        </div>
      </section>

      {/* 7 — PROJET */}
      <section className="mt-10 border-t border-paper/10 pt-9">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            07
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Votre projet et votre motivation
          </h4>

          <p className="mt-1 text-[13px] text-paper/55">
            Présentez-nous brièvement votre projet, votre intérêt ou
            ce que vous recherchez.
          </p>
        </div>

        <textarea
          rows={6}
          value={form.message}
          onChange={(e) =>
            updateField("message", e.target.value)
          }
          placeholder="Décrivez votre projet ou votre motivation..."
          className="w-full rounded-s border border-paper/15 bg-paper/5 px-3.5 py-3 text-[15px] leading-6 text-paper outline-none placeholder:text-paper/35 focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </section>

      {/* COORDONNÉES */}
      <section className="mt-10 border-t border-paper/10 pt-9">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            Vos coordonnées
          </p>

          <h4 className="mt-1 font-display text-xl text-paper">
            Comment pouvons-nous vous joindre ?
          </h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label className="!text-paper/75">
              Nom et prénom
            </label>

            <input
              required
              value={form.full_name}
              onChange={(e) =>
                updateField("full_name", e.target.value)
              }
              className="!border-paper/20 !bg-paper/5 !text-paper"
            />
          </div>

          <div className="field">
            <label className="!text-paper/75">
              Entreprise / organisation
            </label>

            <input
              value={form.organization}
              onChange={(e) =>
                updateField(
                  "organization",
                  e.target.value
                )
              }
              className="!border-paper/20 !bg-paper/5 !text-paper"
            />
          </div>

          <div className="field">
            <label className="!text-paper/75">
              Téléphone
            </label>

            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
              className="!border-paper/20 !bg-paper/5 !text-paper"
            />
          </div>

          <div className="field">
            <label className="!text-paper/75">
              E-mail
            </label>

            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              className="!border-paper/20 !bg-paper/5 !text-paper"
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="mt-5 text-[14px] font-semibold text-alert">
          {error}
        </p>
      )}

      <div className="mt-8 border-t border-paper/10 pt-7">
        <p className="mb-5 text-[12.5px] leading-5 text-paper/50">
          Les informations transmises servent uniquement à
          comprendre votre projet et à préparer un premier échange.
          Les modalités de chaque partenariat sont étudiées au cas
          par cas.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-gold"
        >
          {loading ? "Envoi..." : "Envoyer ma demande"}
        </button>
      </div>
    </form>
  );
}

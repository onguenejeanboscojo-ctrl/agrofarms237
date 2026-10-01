"use client";

import { useState } from "react";

const BUSINESS_TYPES = [
  "Grande surface",
  "Poissonnerie",
  "Restaurant",
  "Hôtel",
  "Traiteur",
  "Revendeur",
  "Distributeur",
  "Autre",
];

const PRODUCTS = [
  "Silure",
  "Porc",
  "Poulet de chair",
  "Œufs",
  "Plusieurs produits",
];

const FREQUENCIES = [
  "Ponctuelle",
  "Hebdomadaire",
  "Plusieurs fois par mois",
  "Régulière",
];

type FormState = {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  city: string;
  business_type: string;
  products: string;
  estimated_volume: string;
  frequency: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  company_name: "",
  contact_name: "",
  phone: "",
  email: "",
  city: "",
  business_type: "Restaurant",
  products: "Silure",
  estimated_volume: "",
  frequency: "Ponctuelle",
  message: "",
};

export default function ProfessionnelsForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/professionals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Une erreur est survenue lors de l'envoi."
        );
      }

      setSent(true);
    } catch (err) {
      console.error(
        "Erreur demande professionnelle :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-11 max-w-[720px] rounded-l border border-paper/15 bg-waterDeep p-8 md:p-11">
        <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gold">
          Demande envoyée
        </span>

        <h3 className="mt-2 font-serif text-[26px] font-semibold text-paper">
          Merci pour votre demande.
        </h3>

        <p className="mt-3 max-w-[58ch] text-paper/70">
          Votre demande professionnelle a bien été enregistrée.
          Notre équipe reviendra vers vous au{" "}
          <strong className="font-semibold text-paper">
            {form.phone}
          </strong>{" "}
          afin d&apos;échanger sur votre besoin.
        </p>

        <button
          type="button"
          onClick={() => {
            setForm(INITIAL_FORM);
            setSent(false);
            setError("");
          }}
          className="btn btn-outline mt-6"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-11 max-w-[720px] rounded-l border border-paper/15 bg-waterDeep p-8 md:p-11"
    >
      <div className="mb-8">
        <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-gold">
          Demande professionnelle
        </span>

        <h2 className="mt-2 font-serif text-[26px] font-semibold text-paper">
          Parlons de votre besoin
        </h2>

        <p className="mt-2 text-[14px] leading-6 text-paper/65">
          Présentez-nous votre activité et vos besoins
          d&apos;approvisionnement. Nous étudierons votre demande
          afin d&apos;échanger avec vous sur les conditions adaptées.
        </p>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="field">
          <label className="!text-paper/75">
            Entreprise / établissement
          </label>

          <input
            required
            value={form.company_name}
            onChange={(e) =>
              update("company_name", e.target.value)
            }
            placeholder="Nom de votre structure"
            className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Nom du responsable / contact
          </label>

          <input
            required
            value={form.contact_name}
            onChange={(e) =>
              update("contact_name", e.target.value)
            }
            placeholder="Nom et prénom"
            className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Téléphone / WhatsApp
          </label>

          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) =>
              update("phone", e.target.value)
            }
            placeholder="+237 ..."
            className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            E-mail
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              update("email", e.target.value)
            }
            placeholder="contact@entreprise.com"
            className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Ville / zone
          </label>

          <input
            value={form.city}
            onChange={(e) =>
              update("city", e.target.value)
            }
            placeholder="Ex. Yaoundé"
            className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Type d&apos;activité
          </label>

          <select
            required
            value={form.business_type}
            onChange={(e) =>
              update("business_type", e.target.value)
            }
            className="!border-paper/20 !bg-ink !text-paper"
          >
            {BUSINESS_TYPES.map((type) => (
              <option
                key={type}
                value={type}
                className="bg-ink text-paper"
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Produits recherchés
          </label>

          <select
            required
            value={form.products}
            onChange={(e) =>
              update("products", e.target.value)
            }
            className="!border-paper/20 !bg-ink !text-paper"
          >
            {PRODUCTS.map((product) => (
              <option
                key={product}
                value={product}
                className="bg-ink text-paper"
              >
                {product}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Volume estimatif
          </label>

          <input
            value={form.estimated_volume}
            onChange={(e) =>
              update("estimated_volume", e.target.value)
            }
            placeholder="Ex. 50 kg / semaine"
            className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
          />
        </div>

        <div className="field sm:col-span-2">
          <label className="!text-paper/75">
            Fréquence d&apos;approvisionnement
          </label>

          <select
            value={form.frequency}
            onChange={(e) =>
              update("frequency", e.target.value)
            }
            className="!border-paper/20 !bg-ink !text-paper"
          >
            {FREQUENCIES.map((frequency) => (
              <option
                key={frequency}
                value={frequency}
                className="bg-ink text-paper"
              >
                {frequency}
              </option>
            ))}
          </select>
        </div>

        <div className="field sm:col-span-2">
          <label className="!text-paper/75">
            Décrivez votre besoin
          </label>

          <textarea
            rows={5}
            value={form.message}
            onChange={(e) =>
              update("message", e.target.value)
            }
            placeholder="Présentez-nous votre activité, vos besoins ou les conditions que vous recherchez."
            className="!border-paper/20 !bg-paper/5 !text-paper placeholder:!text-paper/35"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded border border-alert/20 bg-alert/10 px-4 py-3 text-[14px] font-semibold text-alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-gold mt-6 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}

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

export default function ProfessionnelsForm() {
  const [form, setForm] = useState({
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
  });

  const [sent, setSent] = useState(false);

  function update(key: string, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (sent) {
    return (
      <div className="mt-11 max-w-[720px] rounded-l border border-ink/10 bg-waterDeep p-8 md:p-11">
        <p className="text-paper">
          Merci ! Votre demande professionnelle a bien été prise en compte.
          Notre équipe reviendra vers vous au{" "}
          {form.phone || "numéro indiqué"} pour échanger sur votre besoin.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="mt-11 max-w-[720px] rounded-l border border-ink/10 bg-waterDeep p-8 md:p-11"
    >
      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="field">
          <label className="!text-paper/75">
            Entreprise / établissement
          </label>
          <input
            required
            value={form.company_name}
            onChange={(e) => update("company_name", e.target.value)}
            className="!border-paper/20 !bg-paper/5 !text-paper"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Nom du responsable / contact
          </label>
          <input
            required
            value={form.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
            className="!border-paper/20 !bg-paper/5 !text-paper"
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
            onChange={(e) => update("phone", e.target.value)}
            className="!border-paper/20 !bg-paper/5 !text-paper"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            E-mail
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="!border-paper/20 !bg-paper/5 !text-paper"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Ville / zone
          </label>
          <input
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Ex. Yaoundé"
            className="!border-paper/20 !bg-paper/5 !text-paper"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Type d&apos;activité
          </label>
          <select
            required
            value={form.business_type}
            onChange={(e) => update("business_type", e.target.value)}
            className="!border-paper/20 !bg-paper/5 !text-paper"
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type}>{type}</option>
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
            onChange={(e) => update("products", e.target.value)}
            className="!border-paper/20 !bg-paper/5 !text-paper"
          >
            {PRODUCTS.map((product) => (
              <option key={product}>{product}</option>
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
            className="!border-paper/20 !bg-paper/5 !text-paper"
          />
        </div>

        <div className="field sm:col-span-2">
          <label className="!text-paper/75">
            Fréquence d&apos;approvisionnement
          </label>
          <select
            value={form.frequency}
            onChange={(e) => update("frequency", e.target.value)}
            className="!border-paper/20 !bg-paper/5 !text-paper"
          >
            {FREQUENCIES.map((frequency) => (
              <option key={frequency}>{frequency}</option>
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
            onChange={(e) => update("message", e.target.value)}
            placeholder="Présentez-nous votre activité, vos besoins ou les conditions que vous recherchez."
            className="!border-paper/20 !bg-paper/5 !text-paper"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-gold mt-6">
        Envoyer ma demande
      </button>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export default function PartenairesForm() {
  const [form, setForm] = useState({
    full_name: "",
    organization: "",
    phone: "",
    email: "",
    partnership_type: "Investissement",
    amount_interest: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [partnershipOpen, setPartnershipOpen] = useState(false);

  const partnershipRef = useRef<HTMLDivElement>(null);

  const partnershipOptions = [
    "Investissement",
    "Distribution",
    "Restaurant / acheteur professionnel",
    "Fournisseur",
    "Autre",
  ];

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        partnershipRef.current &&
        !partnershipRef.current.contains(event.target as Node)
      ) {
        setPartnershipOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi.");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue, réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-11 max-w-[720px] rounded-l border border-paper/15 bg-waterDeep p-9">
        <p className="text-paper">
          Merci ! Votre demande a bien été enregistrée. Nous revenons vers
          vous rapidement au {form.phone || "numéro indiqué"}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-11 max-w-[720px] rounded-l border border-paper/15 bg-waterDeep p-8 md:p-11"
    >
      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="field">
          <label className="!text-paper/75">Nom et prénom</label>
          <input
            required
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Entreprise / organisation
          </label>
          <input
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">Téléphone</label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper"
          />
        </div>

        <div className="field">
          <label className="!text-paper/75">E-mail</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper"
          />
        </div>

        {/* Type de partenariat */}
        <div className="field" ref={partnershipRef}>
          <label className="!text-paper/75">
            Type de partenariat
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setPartnershipOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-s border border-paper/20 bg-paper/5 px-3.5 py-3 text-left text-[15.5px] text-paper outline-none transition hover:border-paper/40 focus:border-gold focus:ring-2 focus:ring-gold/30"
              aria-haspopup="listbox"
              aria-expanded={partnershipOpen}
            >
              <span>{form.partnership_type}</span>

              <svg
                className={`h-4 w-4 shrink-0 transition-transform ${
                  partnershipOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {partnershipOpen && (
              <div
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-s border border-ink/10 bg-paper shadow-xl"
                role="listbox"
              >
                {partnershipOptions.map((option) => {
                  const selected =
                    form.partnership_type === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        update("partnership_type", option);
                        setPartnershipOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left text-[15px] transition ${
                        selected
                          ? "bg-ink text-paper"
                          : "text-ink hover:bg-ink/5"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="!text-paper/75">
            Niveau d&apos;intérêt / montant éventuel
          </label>
          <input
            value={form.amount_interest}
            onChange={(e) => update("amount_interest", e.target.value)}
            placeholder="Optionnel"
            className="!bg-paper/5 !border-paper/20 !text-paper"
          />
        </div>

        <div className="field sm:col-span-2">
          <label className="!text-paper/75">Message</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-[14px] font-semibold text-alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-gold mt-6"
      >
        {loading ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}

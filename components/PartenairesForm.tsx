"use client";
import { useState } from "react";

export default function PartenairesForm() {
  const [form, setForm] = useState({
    full_name: "", organization: "", phone: "", email: "",
    partnership_type: "Investissement", amount_interest: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

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
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
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
          Merci ! Votre demande a bien été enregistrée. Nous revenons vers vous rapidement au {form.phone || "numéro indiqué"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-11 max-w-[720px] rounded-l border border-paper/15 bg-waterDeep p-8 md:p-11">
      <div className="grid gap-4.5 sm:grid-cols-2">
        <div className="field">
          <label className="!text-paper/75">Nom et prénom</label>
          <input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper" />
        </div>
        <div className="field">
          <label className="!text-paper/75">Entreprise / organisation</label>
          <input value={form.organization} onChange={(e) => update("organization", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper" />
        </div>
        <div className="field">
          <label className="!text-paper/75">Téléphone</label>
          <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper" />
        </div>
        <div className="field">
          <label className="!text-paper/75">E-mail</label>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper" />
        </div>
        <div className="field">
          <label className="!text-paper/75">Type de partenariat</label>
          <select value={form.partnership_type} onChange={(e) => update("partnership_type", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper">
            <option>Investissement</option>
            <option>Distribution</option>
            <option>Restaurant / acheteur professionnel</option>
            <option>Fournisseur</option>
            <option>Autre</option>
          </select>
        </div>
        <div className="field">
          <label className="!text-paper/75">Niveau d&apos;intérêt / montant éventuel</label>
          <input value={form.amount_interest} onChange={(e) => update("amount_interest", e.target.value)}
            placeholder="Optionnel" className="!bg-paper/5 !border-paper/20 !text-paper" />
        </div>
        <div className="field sm:col-span-2">
          <label className="!text-paper/75">Message</label>
          <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)}
            className="!bg-paper/5 !border-paper/20 !text-paper" />
        </div>
      </div>
      {error && <p className="mt-3 text-[14px] font-semibold text-alert">{error}</p>}
      <button type="submit" disabled={loading} className="btn btn-gold mt-6">
        {loading ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}

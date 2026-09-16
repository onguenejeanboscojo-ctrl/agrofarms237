"use client";
import { useState } from "react";
import { formatFCFA } from "@/lib/whatsapp";

const PRICE_STD = 2500;
const PRICE_BULK = 2400;
const BULK_MIN = 30;

export default function CommanderPage() {
  const [qte, setQte] = useState(5);
  const [type, setType] = useState("Particulier / Famille");
  const [nom, setNom] = useState("");
  const [mode, setMode] = useState("Livraison");
  const [lieu, setLieu] = useState("");
  const [tel, setTel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const unitPrice = qte >= BULK_MIN ? PRICE_BULK : PRICE_STD;
  const total = qte * unitPrice;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nom || !tel) {
      setError("Merci de renseigner ton nom et ton numéro de téléphone.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity_kg: qte,
          client_type: type,
          client_name: nom,
          delivery_mode: mode,
          delivery_location: lieu,
          phone: tel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement.");
      window.open(data.whatsapp_url, "_blank");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue, réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Commande</span>
        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
          Choisir, commander, confirmer sur WhatsApp.
        </h1>
        <p className="mt-2 max-w-[62ch] text-inkSoft">
          Le prix est calculé automatiquement. La commande est enregistrée, puis tu confirmes directement avec nous
          sur WhatsApp — aucun paiement en ligne.
        </p>

        <form onSubmit={handleSubmit} className="mt-11 max-w-[720px] rounded-l border border-ink/10 bg-paper p-8 md:p-11">
          <div className="grid gap-4.5 sm:grid-cols-2">
            <div className="field">
              <label>Quantité (kg)</label>
              <input type="number" min={1} value={qte} onChange={(e) => setQte(Math.max(1, Number(e.target.value)))} />
            </div>
            <div className="field">
              <label>Type de client</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Particulier / Famille</option>
                <option>Restaurant</option>
                <option>Poissonnerie</option>
              </select>
            </div>
            <div className="field">
              <label>Nom</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" />
            </div>
            <div className="field">
              <label>Numéro à appeler</label>
              <input type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="6XX XXX XXX" />
            </div>
            <div className="field sm:col-span-2">
              <label>Mode de récupération</label>
              <div className="flex gap-2.5">
                {["Livraison", "Retrait à la ferme"].map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-s border px-3 py-3 text-center text-[14.5px] font-bold ${
                      mode === m ? "border-water bg-water text-paper" : "border-ink/15 bg-bg"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {mode === "Livraison" && (
              <div className="field sm:col-span-2">
                <label>Lieu de livraison</label>
                <input value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Quartier, ville" />
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3.5 rounded-m bg-water p-5 text-paper">
            <div>
              <div className="font-serif text-3xl font-semibold">{formatFCFA(total)}</div>
              <div className="text-[13px] text-paper/65">
                {qte} kg × {formatFCFA(unitPrice)}/kg — hors livraison
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-wa">
              {loading ? "Envoi..." : "Confirmer sur WhatsApp"}
            </button>
          </div>
          {error && <p className="mt-3 text-[14px] font-semibold text-alert">{error}</p>}
        </form>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DeliveryZone = {
  id: string;
  name: string;
  zone: number;
  fee: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

const ZONE_LABELS: Record<number, string> = {
  1: "Zone 1 — Proche",
  2: "Zone 2 — Éloignée",
  3: "Zone 3 — Très éloignée",
};

const ZONE_FEES: Record<number, number> = {
  1: 1500,
  2: 2000,
  3: 3000,
};

export default function AdminLivraisonsPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterZone, setFilterZone] = useState("toutes");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editZone, setEditZone] = useState(1);
  const [editFee, setEditFee] = useState(1500);
  const [editPublished, setEditPublished] = useState(true);

  const [newName, setNewName] = useState("");
  const [newZone, setNewZone] = useState(1);
  const [newFee, setNewFee] = useState(1500);
  const [newPublished, setNewPublished] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  async function loadZones() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/delivery-zones", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de charger les quartiers.");
      }

      setZones(data.zones || []);
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

  useEffect(() => {
    loadZones();
  }, []);

  function showMessage(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 2500);
  }

  function startEditing(zone: DeliveryZone) {
    setEditingId(zone.id);
    setEditName(zone.name);
    setEditZone(zone.zone);
    setEditFee(zone.fee);
    setEditPublished(zone.published);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
  }

  function handleNewZoneChange(value: number) {
    setNewZone(value);
    setNewFee(ZONE_FEES[value] || 0);
  }

  function handleEditZoneChange(value: number) {
    setEditZone(value);
    setEditFee(ZONE_FEES[value] || 0);
  }

  async function addZone() {
    if (!newName.trim()) {
      setError("Veuillez renseigner le nom du quartier.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/delivery-zones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          zone: newZone,
          fee: newFee,
          published: newPublished,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Impossible d'ajouter le quartier."
        );
      }

      setNewName("");
      setNewZone(1);
      setNewFee(1500);
      setNewPublished(true);
      setShowAddForm(false);

      await loadZones();
      showMessage("Quartier ajouté avec succès.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveZone() {
    if (!editingId) return;

    if (!editName.trim()) {
      setError("Le nom du quartier est obligatoire.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/delivery-zones", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: editName.trim(),
          zone: editZone,
          fee: editFee,
          published: editPublished,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Impossible de modifier le quartier."
        );
      }

      setEditingId(null);

      await loadZones();
      showMessage("Quartier modifié avec succès.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(zone: DeliveryZone) {
    try {
      setError("");

      const res = await fetch("/api/delivery-zones", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: zone.id,
          published: !zone.published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Impossible de modifier la publication."
        );
      }

      await loadZones();

      showMessage(
        zone.published
          ? "Quartier masqué du site."
          : "Quartier publié sur le site."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    }
  }

  async function deleteZone(zone: DeliveryZone) {
    const confirmed = window.confirm(
      `Supprimer le quartier « ${zone.name} » ?\n\nCette action supprimera définitivement ce quartier de la liste.`
    );

    if (!confirmed) return;

    try {
      setError("");

      const res = await fetch("/api/delivery-zones", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: zone.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Impossible de supprimer le quartier."
        );
      }

      await loadZones();
      showMessage("Quartier supprimé.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    }
  }

  const filteredZones = useMemo(() => {
    const query = search.trim().toLowerCase();

    return zones.filter((zone) => {
      const matchesSearch =
        !query || zone.name.toLowerCase().includes(query);

      const matchesZone =
        filterZone === "toutes" ||
        String(zone.zone) === filterZone;

      return matchesSearch && matchesZone;
    });
  }, [zones, search, filterZone]);

  const zoneCounts = useMemo(() => {
    return {
      total: zones.length,
      zone1: zones.filter((z) => z.zone === 1).length,
      zone2: zones.filter((z) => z.zone === 2).length,
      zone3: zones.filter((z) => z.zone === 3).length,
      published: zones.filter((z) => z.published).length,
    };
  }, [zones]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-block text-sm font-semibold text-inkSoft hover:text-ink"
            >
              ← Administration
            </Link>

            <h1 className="font-serif text-3xl font-semibold text-ink">
              Livraisons
            </h1>

            <p className="mt-1 text-sm text-inkSoft">
              Gérez les quartiers desservis et les frais de livraison.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm((value) => !value)}
            className="btn btn-ink"
          >
            {showAddForm ? "Fermer" : "+ Ajouter un quartier"}
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-[1180px] px-5 py-8">
        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Quartiers</p>
            <p className="mt-1 font-serif text-3xl font-semibold">
              {zoneCounts.total}
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Zone 1</p>
            <p className="mt-1 font-serif text-3xl font-semibold">
              {zoneCounts.zone1}
            </p>
            <p className="mt-1 text-xs text-inkSoft">
              1 500 FCFA
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Zone 2</p>
            <p className="mt-1 font-serif text-3xl font-semibold">
              {zoneCounts.zone2}
            </p>
            <p className="mt-1 text-xs text-inkSoft">
              2 000 FCFA
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Zone 3</p>
            <p className="mt-1 font-serif text-3xl font-semibold">
              {zoneCounts.zone3}
            </p>
            <p className="mt-1 text-xs text-inkSoft">
              3 000 FCFA
            </p>
          </div>
        </div>

        {showAddForm && (
          <section className="mb-7 rounded-2xl border border-ink/10 bg-paper p-6">
            <div className="mb-5">
              <h2 className="font-serif text-xl font-semibold">
                Ajouter un quartier
              </h2>
              <p className="mt-1 text-sm text-inkSoft">
                Le quartier pourra ensuite apparaître dans le menu de livraison du site.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="field">
                <label>Nom du quartier</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex : Mimboman"
                />
              </div>

              <div className="field">
                <label>Zone</label>
                <select
                  value={newZone}
                  onChange={(e) =>
                    handleNewZoneChange(Number(e.target.value))
                  }
                >
                  <option value={1}>Zone 1 — 1 500 FCFA</option>
                  <option value={2}>Zone 2 — 2 000 FCFA</option>
                  <option value={3}>Zone 3 — 3 000 FCFA</option>
                </select>
              </div>

              <div className="field">
                <label>Frais de livraison</label>
                <input
                  type="number"
                  value={newFee}
                  onChange={(e) =>
                    setNewFee(Number(e.target.value))
                  }
                />
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={newPublished}
                onChange={(e) =>
                  setNewPublished(e.target.checked)
                }
              />
              Publier ce quartier sur le site
            </label>

            <button
              type="button"
              onClick={addZone}
              disabled={saving}
              className="btn btn-ink mt-5"
            >
              {saving ? "Enregistrement..." : "Ajouter le quartier"}
            </button>
          </section>
        )}

        <section className="rounded-2xl border border-ink/10 bg-paper">
          <div className="border-b border-ink/10 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-xl font-semibold">
                  Quartiers desservis
                </h2>
                <p className="mt-1 text-sm text-inkSoft">
                  {zoneCounts.published} quartier(s) actuellement publié(s).
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un quartier..."
                  className="min-w-[220px]"
                />

                <select
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                >
                  <option value="toutes">Toutes les zones</option>
                  <option value="1">Zone 1 — 1 500 FCFA</option>
                  <option value="2">Zone 2 — 2 000 FCFA</option>
                  <option value="3">Zone 3 — 3 000 FCFA</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-inkSoft">
              Chargement des quartiers...
            </div>
          ) : filteredZones.length === 0 ? (
            <div className="p-8 text-center text-sm text-inkSoft">
              Aucun quartier trouvé.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-inkSoft">
                    <th className="px-5 py-4">Quartier</th>
                    <th className="px-5 py-4">Zone</th>
                    <th className="px-5 py-4">Frais</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredZones.map((zone) => {
                    const editing = editingId === zone.id;

                    return (
                      <tr
                        key={zone.id}
                        className="border-b border-ink/10 last:border-none"
                      >
                        <td className="px-5 py-4">
                          {editing ? (
                            <input
                              value={editName}
                              onChange={(e) =>
                                setEditName(e.target.value)
                              }
                              className="w-full"
                            />
                          ) : (
                            <span className="font-semibold text-ink">
                              {zone.name}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {editing ? (
                            <select
                              value={editZone}
                              onChange={(e) =>
                                handleEditZoneChange(
                                  Number(e.target.value)
                                )
                              }
                            >
                              <option value={1}>Zone 1</option>
                              <option value={2}>Zone 2</option>
                              <option value={3}>Zone 3</option>
                            </select>
                          ) : (
                            <span>
                              {ZONE_LABELS[zone.zone] ||
                                `Zone ${zone.zone}`}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {editing ? (
                            <input
                              type="number"
                              value={editFee}
                              onChange={(e) =>
                                setEditFee(Number(e.target.value))
                              }
                            />
                          ) : (
                            <span className="font-semibold">
                              {zone.fee.toLocaleString("fr-FR")} FCFA
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {editing ? (
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editPublished}
                                onChange={(e) =>
                                  setEditPublished(
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="text-sm">
                                Publié
                              </span>
                            </label>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                togglePublished(zone)
                              }
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                zone.published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-ink/10 text-inkSoft"
                              }`}
                            >
                              {zone.published
                                ? "Publié"
                                : "Masqué"}
                            </button>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {editing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={saveZone}
                                  disabled={saving}
                                  className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white"
                                >
                                  Enregistrer
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelEditing}
                                  className="rounded-lg border border-ink/10 px-3 py-2 text-xs font-semibold"
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditing(zone)
                                  }
                                  className="rounded-lg border border-ink/10 px-3 py-2 text-xs font-semibold hover:bg-bgAlt"
                                >
                                  Modifier
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteZone(zone)
                                  }
                                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                                >
                                  Supprimer
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6 rounded-2xl border border-ink/10 bg-bgAlt p-5">
          <h3 className="font-semibold text-ink">
            Quartiers non listés
          </h3>

          <p className="mt-1 text-sm leading-6 text-inkSoft">
            Si un client ne trouve pas son quartier, il pourra le préciser
            directement. Le service clientèle déterminera alors les frais
            de livraison avec lui via WhatsApp.
          </p>
        </div>
      </main>
    </div>
  );
}

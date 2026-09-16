"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) { setError("Mot de passe incorrect."); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px] rounded-l border border-ink/10 bg-paper p-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">Espace admin</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">Agrofarms237 — accès réservé</p>
        <div className="field">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        {error && <p className="mt-3 text-[14px] font-semibold text-alert">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-ink mt-5 w-full justify-center">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </section>
  );
}

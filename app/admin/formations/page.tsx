import AdminNav from "@/components/AdminNav";

export default function AdminFormationsPage() {
  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-5 py-9">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-inkSoft">
            AgroFarms237
          </p>

          <h1 className="font-serif text-3xl font-semibold text-ink">
            Formations professionnelles
          </h1>

          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-inkSoft">
            Gérez les formations professionnelles, leurs programmes,
            leurs sessions et les inscriptions.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Formations</p>
            <p className="mt-2 text-3xl font-semibold text-ink">0</p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Sessions</p>
            <p className="mt-2 text-3xl font-semibold text-ink">0</p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Inscriptions</p>
            <p className="mt-2 text-3xl font-semibold text-ink">0</p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">Places disponibles</p>
            <p className="mt-2 text-3xl font-semibold text-ink">0</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-ink/10 bg-paper p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">
                Catalogue des formations
              </h2>

              <p className="mt-1 text-sm leading-6 text-inkSoft">
                Les formations professionnelles créées apparaîtront ici.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Nouvelle formation
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-ink/15 px-6 py-12 text-center">
            <p className="font-medium text-ink">
              Aucune formation professionnelle
            </p>

            <p className="mt-2 text-sm text-inkSoft">
              Créez votre première formation pour commencer.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

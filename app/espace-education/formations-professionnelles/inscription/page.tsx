import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 30;

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

async function getRegistrationData() {
  try {
    const supabase = supabaseAdmin();

    const { data: training } = await supabase
      .from("professional_trainings")
      .select(
        "id, title, price_xaf, duration_days, format"
      )
      .eq("published", true)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!training) {
      return {
        training: null,
        sessions: [],
      };
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: sessions } = await supabase
      .from("professional_training_sessions")
      .select(
        "id, start_date, end_date, capacity, status, location, format"
      )
      .eq("training_id", training.id)
      .in("status", ["open", "full"])
      .gte("start_date", today)
      .order("start_date", { ascending: true });

    return {
      training: training as Training,
      sessions: (sessions || []) as TrainingSession[],
    };
  } catch {
    return {
      training: null,
      sessions: [],
    };
  }
}

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

export default async function ProfessionalTrainingRegistrationPage() {
  const { training, sessions } = await getRegistrationData();

  const openSessions = sessions.filter(
    (session) => session.status === "open"
  );

  const fullSessions = sessions.filter(
    (session) => session.status === "full"
  );

  return (
    <main className="bg-paper text-ink">

      {/* ===================================================== */}
      {/* HERO                                                  */}
      {/* ===================================================== */}

      <section className="border-b border-ink/10 bg-bgAlt px-5 py-12 md:py-16">
        <div className="mx-auto max-w-[1100px]">

          <Link
            href="/espace-education/formations-professionnelles"
            className="inline-flex items-center text-[12px] font-bold uppercase tracking-[0.12em] text-inkSoft transition hover:text-ink"
          >
            ← Retour à la formation
          </Link>

          <div className="mt-10 max-w-[800px]">

            <span className="inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-goldDeep">
              <span className="h-px w-8 bg-goldDeep" />
              Inscription
            </span>

            <h1 className="mt-5 font-serif text-[clamp(40px,6vw,68px)] font-semibold leading-[1] tracking-[-0.03em]">
              Réservez votre place pour la prochaine session.
            </h1>

            <p className="mt-6 max-w-[680px] text-[16px] leading-7 text-inkSoft md:text-[17px]">
              Remplissez le formulaire ci-dessous pour manifester votre
              intérêt et réserver votre place à notre prochaine formation
              professionnelle.
            </p>

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTENU                                                */}
      {/* ===================================================== */}

      <section className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">

          {!training ? (
            <div className="rounded-[28px] border border-ink/10 bg-bgAlt px-6 py-16 text-center">

              <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-goldDeep">
                AgroFarms237
              </span>

              <h2 className="mt-4 font-serif text-3xl font-semibold">
                Les inscriptions ne sont pas encore ouvertes.
              </h2>

              <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-inkSoft">
                Aucune formation professionnelle publiée n’est actuellement
                disponible à l’inscription. Revenez prochainement pour
                découvrir les prochaines sessions.
              </p>

              <div className="mt-8">
                <Link
                  href="/espace-education/formations-professionnelles"
                  className="inline-flex rounded-full bg-ink px-7 py-3.5 text-[12px] font-bold text-paper transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Voir la formation
                </Link>
              </div>

            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

              {/* ================================================= */}
              {/* RÉSUMÉ FORMATION                                  */}
              {/* ================================================= */}

              <aside className="h-fit rounded-[28px] border border-ink/10 bg-bgAlt p-7 md:p-8">

                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-goldDeep">
                  Votre formation
                </span>

                <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight">
                  {training.title}
                </h2>

                <div className="mt-7 space-y-4">

                  <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
                    <span className="text-sm text-inkSoft">
                      Durée
                    </span>

                    <span className="text-sm font-bold">
                      {training.duration_days} jours
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
                    <span className="text-sm text-inkSoft">
                      Format
                    </span>

                    <span className="text-sm font-bold">
                      {training.format || "Présentiel"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
                    <span className="text-sm text-inkSoft">
                      Tarif
                    </span>

                    <span className="font-serif text-xl font-semibold">
                      {formatPrice(training.price_xaf)} FCFA
                    </span>
                  </div>

                </div>

                <div className="mt-7 rounded-[20px] border border-goldDeep/20 bg-paper p-5">

                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-goldDeep">
                    À savoir
                  </span>

                  <p className="mt-2 text-sm leading-6 text-inkSoft">
                    Votre inscription sera enregistrée comme une demande.
                    Les modalités de confirmation et de paiement vous seront
                    communiquées après votre inscription.
                  </p>

                </div>

              </aside>

              {/* ================================================= */}
              {/* FORMULAIRE                                        */}
              {/* ================================================= */}

              <div className="rounded-[28px] border border-ink/10 bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.05)] md:p-10">

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-goldDeep">
                    01 — Vos informations
                  </span>

                  <h2 className="mt-3 font-serif text-3xl font-semibold">
                    Choisissez votre session
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-inkSoft">
                    Sélectionnez une session ouverte puis renseignez vos
                    coordonnées.
                  </p>
                </div>

                {/* =============================================== */}
                {/* SESSIONS                                         */}
                {/* =============================================== */}

                {openSessions.length > 0 ? (
                  <div className="mt-8 space-y-3">

                    {openSessions.map((session) => (
                      <label
                        key={session.id}
                        className="flex cursor-pointer items-start gap-4 rounded-[20px] border border-ink/10 p-5 transition hover:border-goldDeep/50 hover:bg-bgAlt"
                      >
                        <input
                          type="radio"
                          name="session"
                          value={session.id}
                          className="mt-1 h-4 w-4 accent-[#B18A45]"
                          disabled
                        />

                        <span className="min-w-0 flex-1">

                          <span className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                            <span className="font-semibold">
                              Session du {formatDate(session.start_date)}
                            </span>

                            <span className="inline-flex w-fit rounded-full bg-[#E8F0EA] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#245044]">
                              Ouverte
                            </span>

                          </span>

                          <span className="mt-2 block text-sm text-inkSoft">
                            {session.end_date
                              ? `${formatDate(session.start_date)} → ${formatDate(session.end_date)}`
                              : formatDate(session.start_date)}
                          </span>

                          <span className="mt-1 block text-sm text-inkSoft">
                            {session.location || "Lieu communiqué après inscription"}
                            {" • "}
                            {session.format || training.format || "Présentiel"}
                          </span>

                          <span className="mt-3 block text-xs font-semibold text-inkSoft">
                            Capacité : {session.capacity} participants maximum
                          </span>

                        </span>
                      </label>
                    ))}

                  </div>
                ) : (
                  <div className="mt-8 rounded-[20px] border border-goldDeep/20 bg-bgAlt p-6">

                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-goldDeep">
                      Prochaine session
                    </span>

                    <h3 className="mt-2 font-serif text-2xl font-semibold">
                      Aucune session ouverte actuellement.
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-inkSoft">
                      Une nouvelle session sera annoncée prochainement.
                      Revenez régulièrement pour connaître les prochaines
                      dates.
                    </p>

                  </div>
                )}

                {/* =============================================== */}
                {/* INFORMATIONS                                     */}
                {/* =============================================== */}

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
                        placeholder="Votre nom et prénom"
                        disabled
                        className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none"
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
                        placeholder="+237 6XX XXX XXX"
                        disabled
                        className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none"
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
                        placeholder="vous@exemple.com"
                        disabled
                        className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none"
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
                        placeholder="Entreprise, exploitation, projet..."
                        disabled
                        className="w-full rounded-[14px] border border-ink/15 bg-bgAlt px-4 py-3.5 text-sm outline-none"
                      />
                    </div>

                  </div>

                </div>

                {/* =============================================== */}
                {/* CTA                                               */}
                {/* =============================================== */}

                <div className="mt-8 border-t border-ink/10 pt-7">

                  <div className="rounded-[18px] bg-bgAlt p-4 text-sm leading-6 text-inkSoft">
                    <strong className="text-ink">
                      Tarif : {formatPrice(training.price_xaf)} FCFA
                    </strong>
                    <br />
                    Après votre demande d’inscription, notre équipe vous
                    contactera pour les modalités de confirmation.
                  </div>

                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-4 text-[12px] font-bold text-paper opacity-50"
                  >
                    Confirmer mon inscription
                  </button>

                  <p className="mt-3 text-center text-xs text-inkSoft">
                    Le formulaire sera activé à l’étape suivante.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ===================================================== */}
          {/* SESSIONS COMPLÈTES                                   */}
          {/* ===================================================== */}

          {training && fullSessions.length > 0 && (
            <div className="mt-10 rounded-[24px] border border-ink/10 bg-bgAlt p-6 md:p-8">

              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-goldDeep">
                Sessions complètes
              </span>

              <div className="mt-4 space-y-3">

                {fullSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col gap-2 rounded-[18px] border border-ink/10 bg-paper p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        Session du {formatDate(session.start_date)}
                      </p>

                      <p className="mt-1 text-sm text-inkSoft">
                        Cette session est actuellement complète.
                      </p>
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-ink/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-inkSoft">
                      Complet
                    </span>
                  </div>
                ))}

              </div>

            </div>
          )}

        </div>
      </section>

    </main>
  );
}

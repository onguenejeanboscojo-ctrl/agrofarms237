
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Handshake,
  House,
  Images,
  Newspaper,
  Package,
  ShoppingCart,
  Sprout,
  Users,
  Fish,
  XCircle,
} from "lucide-react";

import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

const ADMIN_MODULES = [
  {
    href: "/admin/commandes",
    title: "Commandes",
    description: "Consulter et suivre les commandes reçues.",
    icon: ShoppingCart,
  },
  {
    href: "/admin/produits",
    title: "Produits",
    description: "Gérer les prix, disponibilités et options.",
    icon: Package,
  },
  {
    href: "/admin/stocks",
    title: "Stocks",
    description: "Gérer les quantités disponibles et les seuils.",
    icon: Sprout,
  },
  {
    href: "/admin/accueil",
    title: "Accueil",
    description: "Modifier les contenus de la page d'accueil.",
    icon: House,
  },
  {
    href: "/admin/notre-elevage",
    title: "Notre élevage",
    description: "Gérer les informations relatives à l'élevage.",
    icon: Fish,
  },
  {
    href: "/admin/partenaires",
    title: "Partenaires",
    description: "Gérer les partenaires présentés sur le site.",
    icon: Handshake,
  },
  {
    href: "/admin/actus",
    title: "Actualités",
    description: "Gérer les actualités et publications.",
    icon: Newspaper,
  },
  {
    href: "/admin/galerie",
    title: "Galerie",
    description: "Gérer les images de la galerie.",
    icon: Images,
  },
  {
    href: "/admin/equipe",
    title: "Équipe",
    description: "Gérer les membres de l'équipe.",
    icon: Users,
  },
];

const STATUS_LABEL: Record<string, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  confirme: "Confirmé",
  livre: "Livré",
  annule: "Annulé",
};

const STATUS_STYLE: Record<string, string> = {
  nouveau: "bg-amber-50 text-amber-800 ring-amber-200",
  contacte: "bg-blue-50 text-blue-800 ring-blue-200",
  confirme: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  livre: "bg-green-50 text-green-800 ring-green-200",
  annule: "bg-red-50 text-red-800 ring-red-200",
};

type Order = {
  id: string;
  created_at: string;
  client_name: string | null;
  product_name: string | null;
  quantity_kg: number | null;
  total_price: number | null;
  status: string | null;
};

type ActivityDay = {
  key: string;
  label: string;
  count: number;
};

function dateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Douala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Douala",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function getActivityDays(
  rows: { created_at: string }[]
): ActivityDay[] {
  const now = new Date();
  const days: ActivityDay[] = [];

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(now);
    date.setDate(date.getDate() - offset);

    const key = dateKey(date);
    const label = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Africa/Douala",
      weekday: "short",
      day: "2-digit",
    })
      .format(date)
      .replace(".", "");

    days.push({
      key,
      label,
      count: rows.filter(
        (row) => dateKey(new Date(row.created_at)) === key
      ).length,
    });
  }

  return days;
}

export default async function AdminDashboardPage() {
  if (!isAdminAuthed()) {
    redirect("/admin/login");
  }

  let totalOrders = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;
  let recentOrders: Order[] = [];
  let activityDays: ActivityDay[] = [];
  let loadError = false;

  try {
    const supabase = supabaseAdmin();

    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const [
      totalResult,
      pendingResult,
      deliveredResult,
      cancelledResult,
      recentResult,
      activityResult,
    ] = await Promise.all([
      supabase.from("orders").select("id", {
        count: "exact",
        head: true,
      }),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ["nouveau", "contacte", "confirme"]),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "livre"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "annule"),
      supabase
        .from("orders")
        .select(
          "id, created_at, client_name, product_name, quantity_kg, total_price, status"
        )
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("orders")
        .select("created_at")
        .gte("created_at", start.toISOString())
        .order("created_at", { ascending: true }),
    ]);

    const results = [
      totalResult,
      pendingResult,
      deliveredResult,
      cancelledResult,
      recentResult,
      activityResult,
    ];

    if (results.some((result) => result.error)) {
      throw new Error("Impossible de récupérer toutes les données.");
    }

    totalOrders = totalResult.count ?? 0;
    pendingOrders = pendingResult.count ?? 0;
    deliveredOrders = deliveredResult.count ?? 0;
    cancelledOrders = cancelledResult.count ?? 0;
    recentOrders = (recentResult.data ?? []) as Order[];
    activityDays = getActivityDays(activityResult.data ?? []);
  } catch (error) {
    console.error(
      "Erreur du tableau de bord AgroFarms237 :",
      error
    );
    loadError = true;
  }

  const maxActivity = Math.max(
    1,
    ...activityDays.map((day) => day.count)
  );

  const kpis = [
    {
      title: "Commandes totales",
      value: totalOrders,
      description: "Depuis le lancement",
      icon: ShoppingCart,
      accent: "border-l-emerald-800",
    },
    {
      title: "À traiter",
      value: pendingOrders,
      description: "Nouvelles, contactées ou confirmées",
      icon: Clock3,
      accent: "border-l-amber-500",
    },
    {
      title: "Commandes livrées",
      value: deliveredOrders,
      description: "Statut livré",
      icon: CheckCircle2,
      accent: "border-l-green-600",
    },
    {
      title: "Commandes annulées",
      value: cancelledOrders,
      description: "Statut annulé",
      icon: XCircle,
      accent: "border-l-red-500",
    },
  ];

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 lg:ml-[250px] lg:px-8 lg:py-10 xl:ml-[270px]">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
              AGROFARMS237 · ADMINISTRATION
            </p>
            <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Tableau de bord
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-inkSoft sm:text-base">
              Pilotez votre activité et retrouvez les informations
              essentielles de votre exploitation.
            </p>
          </div>

          <Link
            href="/admin/commandes"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#173F2A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24583B]"
          >
            Voir les commandes
            <ArrowRight size={16} strokeWidth={1.8} />
          </Link>
        </header>

        {loadError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            Les indicateurs n’ont pas pu être chargés. Vérifie la
            connexion Supabase et la table orders, puis actualise la page.
          </div>
        )}

        <section aria-labelledby="kpi-heading" className="mb-10">
          <div className="mb-4">
            <h2
              id="kpi-heading"
              className="font-serif text-xl font-semibold text-ink"
            >
              Vue d’ensemble
            </h2>
            <p className="mt-1 text-sm text-inkSoft">
              Indicateurs calculés à partir des commandes enregistrées.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <article
                  key={kpi.title}
                  className={`rounded-xl border border-ink/10 border-l-4 ${kpi.accent} bg-paper p-5 shadow-sm transition hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-inkSoft">
                      {kpi.title}
                    </p>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2EFE5] text-[#24583B]">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold tabular-nums text-ink">
                    {loadError ? "—" : formatNumber(kpi.value)}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-inkSoft">
                    {kpi.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mb-10 grid gap-6 xl:grid-cols-[1.05fr_1.4fr]">
          <section className="rounded-xl border border-ink/10 bg-paper p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="font-serif text-xl font-semibold text-ink">
                Activité des commandes
              </h2>
              <p className="mt-1 text-sm text-inkSoft">
                Commandes créées au cours des sept derniers jours.
              </p>
            </div>

            {loadError ? (
              <p className="py-10 text-center text-sm text-inkSoft">
                Graphique indisponible.
              </p>
            ) : (
              <>
                <div className="flex h-48 items-end gap-2 border-b border-ink/10 pb-2 sm:gap-3">
                  {activityDays.map((day) => {
                    const height =
                      day.count === 0
                        ? 0
                        : Math.max(
                            6,
                            (day.count / maxActivity) * 100
                          );

                    return (
                      <div
                        key={day.key}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-xs font-semibold tabular-nums text-inkSoft">
                          {day.count}
                        </span>
                        <div className="flex h-full w-full items-end justify-center">
                          <div
                            title={`${day.label} : ${day.count} commande(s)`}
                            className="w-full max-w-10 rounded-t-md bg-[#24583B] transition-all"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex gap-2">
                  {activityDays.map((day) => (
                    <div
                      key={day.key}
                      className="min-w-0 flex-1 text-center text-[10px] text-inkSoft sm:text-xs"
                    >
                      {day.label}
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg bg-[#F5F0E5] p-4">
                  <p className="text-sm text-inkSoft">
                    Total sur la période
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#173F2A]">
                    {formatNumber(
                      activityDays.reduce(
                        (sum, day) => sum + day.count,
                        0
                      )
                    )}
                    <span className="ml-2 text-sm font-normal text-inkSoft">
                      commande(s)
                    </span>
                  </p>
                </div>
              </>
            )}
          </section>

          <section className="min-w-0 rounded-xl border border-ink/10 bg-paper p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-semibold text-ink">
                  Dernières commandes
                </h2>
                <p className="mt-1 text-sm text-inkSoft">
                  Les cinq commandes les plus récentes.
                </p>
              </div>
              <Link
                href="/admin/commandes"
                className="shrink-0 text-sm font-semibold text-emerald-800 hover:underline"
              >
                Tout voir
                <ArrowUpRight
                  className="ml-1 inline-block"
                  size={15}
                  strokeWidth={1.8}
                />
              </Link>
            </div>

            {loadError ? (
              <p className="py-10 text-center text-sm text-inkSoft">
                Les commandes sont indisponibles.
              </p>
            ) : recentOrders.length === 0 ? (
              <div className="rounded-lg bg-[#F5F0E5] px-4 py-10 text-center">
                <ShoppingCart
                  className="mx-auto mb-3 text-[#24583B]"
                  size={28}
                  strokeWidth={1.5}
                />
                <p className="font-medium text-ink">
                  Aucune commande pour le moment
                </p>
                <p className="mt-2 text-sm text-inkSoft">
                  Les nouvelles commandes apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-ink/10">
                {recentOrders.map((order) => (
                  <article
                    key={order.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        {order.client_name || "Client sans nom"}
                      </p>
                      <p className="mt-1 truncate text-sm text-inkSoft">
                        {order.product_name || "Produit non précisé"}
                        {order.quantity_kg != null
                          ? ` · ${order.quantity_kg} kg`
                          : ""}
                      </p>
                      <p className="mt-1 text-xs text-inkSoft">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          STATUS_STYLE[order.status ?? ""] ??
                          "bg-gray-50 text-gray-700 ring-gray-200"
                        }`}
                      >
                        {STATUS_LABEL[order.status ?? ""] ??
                          order.status ??
                          "Sans statut"}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-ink">
                        {order.total_price == null
                          ? "—"
                          : `${formatNumber(
                              Number(order.total_price)
                            )} FCFA`}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-5 text-inkSoft">
              Les montants affichés correspondent aux montants enregistrés
              des commandes, pas nécessairement à des paiements encaissés.
            </p>
          </section>
        </div>

        <section aria-labelledby="modules-heading">
          <div className="mb-4">
            <h2
              id="modules-heading"
              className="font-serif text-xl font-semibold text-ink"
            >
              Gestion rapide
            </h2>
            <p className="mt-1 text-sm text-inkSoft">
              Accédez directement aux modules de votre administration.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_MODULES.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-xl border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:border-emerald-800/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F5F0E5] text-[#24583B] transition group-hover:bg-[#173F2A] group-hover:text-[#E8D8AC]">
                      <Icon size={21} strokeWidth={1.6} />
                    </span>
                    <ArrowUpRight
                      className="text-inkSoft transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-800"
                      size={18}
                      strokeWidth={1.6}
                    />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-ink">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-inkSoft">
                    {module.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

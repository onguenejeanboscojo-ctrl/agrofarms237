import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

/**
 * GET
 * Récupère tous les produits de l'accueil.
 */
export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("home_products")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Erreur récupération produits Accueil :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible de récupérer les produits.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error(
      "Erreur inattendue récupération produits Accueil :",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur serveur.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Crée un nouveau produit.
 */
export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          error: "Le nom du produit est obligatoire.",
        },
        { status: 400 }
      );
    }

    const status =
      body.status === "disponible" ||
      body.status === "bientot" ||
      body.status === "rupture"
        ? body.status
        : "bientot";

    const position =
      Number.isFinite(Number(body.position))
        ? Number(body.position)
        : 0;

    const price =
      body.price === null ||
      body.price === undefined ||
      body.price === ""
        ? null
        : Number(body.price);

    const price1 =
      body.price_1 === null ||
      body.price_1 === undefined ||
      body.price_1 === ""
        ? null
        : Number(body.price_1);

    const price2 =
      body.price_2 === null ||
      body.price_2 === undefined ||
      body.price_2 === ""
        ? null
        : Number(body.price_2);

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("home_products")
      .insert({
        name,
        description:
          typeof body.description === "string"
            ? body.description.trim()
            : null,

        status,

        price: Number.isFinite(price)
          ? price
          : null,

        price_unit:
          typeof body.price_unit === "string"
            ? body.price_unit.trim()
            : null,

        price_1_label:
          typeof body.price_1_label === "string"
            ? body.price_1_label.trim()
            : null,

        price_1:
          Number.isFinite(price1)
            ? price1
            : null,

        price_2_label:
          typeof body.price_2_label === "string"
            ? body.price_2_label.trim()
            : null,

        price_2:
          Number.isFinite(price2)
            ? price2
            : null,

        order_enabled:
          Boolean(body.order_enabled),

        position,

        published:
          body.published === undefined
            ? true
            : Boolean(body.published),

        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Erreur création produit Accueil :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible de créer le produit.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(
      "Erreur inattendue création produit Accueil :",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur serveur.",
      },
      { status: 500 }
    );
  }
}

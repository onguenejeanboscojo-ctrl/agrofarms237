
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

    // Options de commande
    const orderOptions =
      body.order_options === undefined
        ? []
        : body.order_options;

    if (!Array.isArray(orderOptions)) {
      return NextResponse.json(
        {
          error: "Options de commande invalides.",
        },
        { status: 400 }
      );
    }

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

        price:
          Number.isFinite(price)
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

        // Enregistre les options de commande dans Supabase
        order_options: orderOptions,

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

/**
 * PATCH
 * Modifie un produit existant.
 */
export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "L'identifiant du produit est obligatoire.",
        },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) {
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

      updates.name = name;
    }

    if (body.description !== undefined) {
      updates.description =
        typeof body.description === "string"
          ? body.description.trim()
          : null;
    }

    if (body.status !== undefined) {
      if (
        body.status !== "disponible" &&
        body.status !== "bientot" &&
        body.status !== "rupture"
      ) {
        return NextResponse.json(
          {
            error: "Statut du produit invalide.",
          },
          { status: 400 }
        );
      }

      updates.status = body.status;
    }

    if (body.price !== undefined) {
      if (
        body.price === null ||
        body.price === ""
      ) {
        updates.price = null;
      } else {
        const price = Number(body.price);

        updates.price = Number.isFinite(price)
          ? price
          : null;
      }
    }

    if (body.price_unit !== undefined) {
      updates.price_unit =
        typeof body.price_unit === "string"
          ? body.price_unit.trim()
          : null;
    }

    if (body.price_1_label !== undefined) {
      updates.price_1_label =
        typeof body.price_1_label === "string"
          ? body.price_1_label.trim()
          : null;
    }

    if (body.price_1 !== undefined) {
      if (
        body.price_1 === null ||
        body.price_1 === ""
      ) {
        updates.price_1 = null;
      } else {
        const price1 = Number(body.price_1);

        updates.price_1 = Number.isFinite(price1)
          ? price1
          : null;
      }
    }

    if (body.price_2_label !== undefined) {
      updates.price_2_label =
        typeof body.price_2_label === "string"
          ? body.price_2_label.trim()
          : null;
    }

    if (body.price_2 !== undefined) {
      if (
        body.price_2 === null ||
        body.price_2 === ""
      ) {
        updates.price_2 = null;
      } else {
        const price2 = Number(body.price_2);

        updates.price_2 = Number.isFinite(price2)
          ? price2
          : null;
      }
    }

    if (body.order_enabled !== undefined) {
      updates.order_enabled =
        Boolean(body.order_enabled);
    }

    // Met à jour les options de commande uniquement
    // si elles sont présentes dans la requête.
    if (body.order_options !== undefined) {
      if (!Array.isArray(body.order_options)) {
        return NextResponse.json(
          {
            error: "Options de commande invalides.",
          },
          { status: 400 }
        );
      }

      updates.order_options = body.order_options;
    }

    if (body.position !== undefined) {
      const position = Number(body.position);

      updates.position = Number.isFinite(position)
        ? position
        : 0;
    }

    if (body.published !== undefined) {
      updates.published =
        Boolean(body.published);
    }

    updates.updated_at = new Date().toISOString();

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("home_products")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Erreur modification produit Accueil :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible de modifier le produit.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Erreur inattendue modification produit Accueil :",
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
 * DELETE
 * Supprime un produit existant.
 */
export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "L'identifiant du produit est obligatoire.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("home_products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Erreur suppression produit Accueil :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible de supprimer le produit.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Erreur inattendue suppression produit Accueil :",
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

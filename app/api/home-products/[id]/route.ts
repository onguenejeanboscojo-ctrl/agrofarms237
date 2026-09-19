
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * PATCH
 * Modifie un produit de l'accueil.
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID du produit manquant." },
        { status: 400 }
      );
    }

    const body = await request.json();

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
          { error: "Statut invalide." },
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

        if (!Number.isFinite(price)) {
          return NextResponse.json(
            { error: "Prix invalide." },
            { status: 400 }
          );
        }

        updates.price = price;
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

        if (!Number.isFinite(price1)) {
          return NextResponse.json(
            { error: "Prix 1 invalide." },
            { status: 400 }
          );
        }

        updates.price_1 = price1;
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

        if (!Number.isFinite(price2)) {
          return NextResponse.json(
            { error: "Prix 2 invalide." },
            { status: 400 }
          );
        }

        updates.price_2 = price2;
      }
    }

    if (body.order_enabled !== undefined) {
      updates.order_enabled =
        Boolean(body.order_enabled);
    }

    // Options de commande
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

      if (!Number.isFinite(position)) {
        return NextResponse.json(
          { error: "Position invalide." },
          { status: 400 }
        );
      }

      updates.position = position;
    }

    if (body.published !== undefined) {
      updates.published =
        Boolean(body.published);
    }

    updates.updated_at =
      new Date().toISOString();

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
          error:
            "Impossible de modifier le produit.",
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
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

/**
 * DELETE
 * Supprime un produit de l'accueil.
 *
 * Les photos associées seront également supprimées
 * automatiquement de la base grâce à ON DELETE CASCADE.
 */
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID du produit manquant." },
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
          error:
            "Impossible de supprimer le produit.",
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
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

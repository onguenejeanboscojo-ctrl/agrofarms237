
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("products")
      .select(
        [
          "id",
          "name",
          "price_standard",
          "price_bulk",
          "bulk_min_kg",
          "stock_status",
          "unit",
          "category",
          "product_group",
          "variant",
        ].join(",")
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "Erreur récupération catalogue public :",
        error
      );

      return NextResponse.json(
        { error: "Impossible de charger les produits." },
        { status: 500 }
      );
    }

    const products = (data ?? []).map((product) => {
      const name = (product.name ?? "").trim().toLowerCase();
      const group = (
        product.product_group ?? ""
      ).trim().toLowerCase();

      const isPorcelet =
        group === "porcelet" || name.includes("porcelet");

      if (isPorcelet) {
        return {
          ...product,
          unit: "piece",
          product_group: "porcelet",
          variant: "Vente à la pièce",
        };
      }

      return product;
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(
      "Erreur API catalogue public :",
      error
    );

    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}

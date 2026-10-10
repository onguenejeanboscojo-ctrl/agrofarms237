
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type CatalogProductRow = {
  id: string;
  name: string | null;
  price_standard: number | null;
  price_bulk: number | null;
  bulk_min_kg: number | null;
  stock_status: string | null;
  unit: string | null;
  category: string | null;
  product_group: string | null;
  variant: string | null;
};

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,price_standard,price_bulk,bulk_min_kg,stock_status,unit,category,product_group,variant"
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "Erreur récupération catalogue public :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible de charger les produits.",
        },
        { status: 500 }
      );
    }

    const rows = (data ?? []) as unknown as CatalogProductRow[];

    const products = rows.map((product) => {
      const name = (product.name ?? "").trim().toLowerCase();

      const group = (
        product.product_group ?? ""
      )
        .trim()
        .toLowerCase();

      // Le porcelet est vendu exclusivement à la pièce.
      const isPorcelet =
        group === "porcelet" ||
        name.includes("porcelet");

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
      {
        error: "Une erreur est survenue.",
      },
      { status: 500 }
    );
  }
}

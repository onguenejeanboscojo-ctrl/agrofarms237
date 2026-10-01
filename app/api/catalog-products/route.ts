import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
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

    return NextResponse.json({
      products: data ?? [],
    });
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

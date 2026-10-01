import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.company_name ||
      !body.contact_name ||
      !body.phone ||
      !body.business_type ||
      !body.products
    ) {
      return NextResponse.json(
        {
          error:
            "Entreprise, contact, téléphone, type d'activité et produits sont requis.",
        },
        { status: 400 }
      );
    }

    const record = {
      company_name: body.company_name,
      contact_name: body.contact_name,
      phone: body.phone,
      email: body.email || null,
      city: body.city || null,
      business_type: body.business_type,
      products: body.products,
      estimated_volume: body.estimated_volume || null,
      frequency: body.frequency || null,
      message: body.message || null,
      status: "nouvelle",
    };

    const { data, error } = await supabaseAdmin()
      .from("professional_inquiries")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error(
        "Erreur enregistrement demande professionnelle :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible d'enregistrer votre demande.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      request: data,
    });
  } catch (error) {
    console.error(
      "Erreur API demandes professionnelles :",
      error
    );

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de l'envoi.",
      },
      { status: 500 }
    );
  }
}

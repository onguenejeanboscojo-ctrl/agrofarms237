import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { waLink, formatFCFA } from "@/lib/whatsapp";
import { isAdminAuthed } from "@/lib/adminAuth";

const PRICE_STD = 2500;
const PRICE_BULK = 2400;
const BULK_MIN = 30;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const quantity = Math.max(1, parseInt(body.quantity_kg, 10) || 1);
  const unitPrice = quantity >= BULK_MIN ? PRICE_BULK : PRICE_STD;
  const total = quantity * unitPrice;

  if (!body.client_name || !body.phone) {
    return NextResponse.json({ error: "Nom et numéro de téléphone requis." }, { status: 400 });
  }

  const record = {
    product_name: "Silure frais",
    quantity_kg: quantity,
    unit_price: unitPrice,
    total_price: total,
    client_type: body.client_type || "Particulier / Famille",
    client_name: body.client_name,
    delivery_mode: body.delivery_mode || "Livraison",
    delivery_location: body.delivery_location || null,
    phone: body.phone,
    status: "nouveau",
  };

  const { data, error } = await supabaseAdmin().from("orders").insert(record).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const message = [
    `Bonjour Agrofarms237, je souhaite commander ${quantity} kg de silure frais à ${formatFCFA(unitPrice)}/kg.`,
    "",
    `Nom : ${body.client_name}`,
    `Type de client : ${record.client_type}`,
    `Lieu de livraison : ${record.delivery_location || "—"}`,
    `Mode : ${record.delivery_mode}`,
    `Numéro à appeler : ${body.phone}`,
  ].join("\n");

  return NextResponse.json({ order: data, whatsapp_url: waLink(message) });
}

// Utilisé par le tableau de bord admin pour lister les commandes
export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { data, error } = await supabaseAdmin().from("orders").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

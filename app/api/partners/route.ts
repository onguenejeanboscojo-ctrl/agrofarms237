import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.full_name || !body.phone || !body.email) {
    return NextResponse.json({ error: "Nom, téléphone et e-mail sont requis." }, { status: 400 });
  }
  const record = {
    full_name: body.full_name,
    organization: body.organization || null,
    phone: body.phone,
    email: body.email,
    partnership_type: body.partnership_type || "Autre",
    amount_interest: body.amount_interest || null,
    message: body.message || null,
    status: "nouveau",
  };
  const { data, error } = await supabaseAdmin().from("partner_requests").insert(record).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data });
}

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { data, error } = await supabaseAdmin().from("partner_requests").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data });
}

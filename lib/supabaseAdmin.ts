// Client Supabase côté serveur uniquement (service_role key).
// Ne jamais importer ce fichier dans un composant client ("use client").
import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Variables Supabase manquantes : vérifie NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local"
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

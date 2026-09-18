import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const BUCKET = "media";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getExtension(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

/**
 * GET
 * Récupère toutes les photos du Hero de l'Accueil.
 */
export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("home_hero_media")
      .select(
        "id,url,storage_path,position,published,created_at"
      )
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Erreur récupération photos Hero Accueil :",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les photos du Hero.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error(
      "Erreur inattendue récupération photos Hero Accueil :",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Ajoute une photo au Hero de l'Accueil.
 */
export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Aucune photo fournie.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format invalide. Utilisez JPG, PNG ou WebP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "La photo ne doit pas dépasser 25 Mo.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /*
     * Détermine automatiquement la prochaine position.
     */
    const { data: lastMedia } = await supabase
      .from("home_hero_media")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition =
      lastMedia?.position !== undefined &&
      lastMedia?.position !== null
        ? Number(lastMedia.position) + 1
        : 0;

    const extension = getExtension(file.type);

    const randomPart = Math.random()
      .toString(36)
      .slice(2, 10);

    const storagePath =
      `home-hero/${Date.now()}-${randomPart}.${extension}`;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    /*
     * Upload dans Supabase Storage.
     */
    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Erreur upload photo Hero Accueil :",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'envoyer la photo.",
        },
        { status: 500 }
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const url =
      publicUrlData?.publicUrl;

    if (!url) {
      await supabase.storage
        .from(BUCKET)
        .remove([storagePath]);

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer l'URL de la photo.",
        },
        { status: 500 }
      );
    }

    /*
     * Enregistre la photo en base.
     */
    const { data, error } = await supabase
      .from("home_hero_media")
      .insert({
        url,
        storage_path: storagePath,
        position: nextPosition,
        published: true,
      })
      .select(
        "id,url,storage_path,position,published,created_at"
      )
      .single();

    if (error) {
      console.error(
        "Erreur enregistrement photo Hero Accueil :",
        error
      );

      await supabase.storage
        .from(BUCKET)
        .remove([storagePath]);

      return NextResponse.json(
        {
          error:
            "Impossible d'enregistrer la photo.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Erreur inattendue upload photo Hero Accueil :",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

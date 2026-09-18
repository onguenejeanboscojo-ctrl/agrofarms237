import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getExtension(file: File) {
  const name = file.name.toLowerCase();

  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";

  return "jpg";
}

/**
 * GET
 * Récupère toutes les photos d'un élevage.
 *
 * Exemple :
 * /api/farm-breeding-media?farm_breeding_id=UUID
 */
export async function GET(req: NextRequest) {
  const farmBreedingId = req.nextUrl.searchParams.get(
    "farm_breeding_id"
  );

  if (!farmBreedingId) {
    return NextResponse.json(
      { error: "farm_breeding_id est obligatoire." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("farm_breeding_media")
    .select("*")
    .eq("farm_breeding_id", farmBreedingId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    media: data || [],
  });
}

/**
 * POST
 * Ajoute une photo à un élevage.
 */
export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    const farmBreedingId = String(
      formData.get("farm_breeding_id") || ""
    ).trim();

    const file = formData.get("file");

    if (!farmBreedingId) {
      return NextResponse.json(
        { error: "farm_breeding_id est obligatoire." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucune photo n'a été fournie." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format non autorisé. Utilisez JPG, PNG ou WEBP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "La photo est trop lourde. Taille maximale : 25 Mo.",
        },
        { status: 400 }
      );
    }

    // Vérifier que l'élevage existe
    const { data: farm, error: farmError } =
      await supabaseAdmin()
        .from("farm_breeding")
        .select("id")
        .eq("id", farmBreedingId)
        .single();

    if (farmError || !farm) {
      return NextResponse.json(
        { error: "Élevage introuvable." },
        { status: 404 }
      );
    }

    const sb = supabaseAdmin();

    // Récupérer la prochaine position
    const { data: lastMedia } = await sb
      .from("farm_breeding_media")
      .select("position")
      .eq("farm_breeding_id", farmBreedingId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const position =
      lastMedia?.position !== undefined
        ? Number(lastMedia.position) + 1
        : 0;

    const extension = getExtension(file);

    const storagePath =
      `farm-breeding/${farmBreedingId}/` +
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;

    const bytes = await file.arrayBuffer();

    // Upload dans Supabase Storage
    const { error: uploadError } = await sb.storage
      .from("media")
      .upload(storagePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // URL publique
    const { data: publicUrlData } = sb.storage
      .from("media")
      .getPublicUrl(storagePath);

    const url = publicUrlData.publicUrl;

    // Enregistrer la photo dans la base
    const { data, error } = await sb
      .from("farm_breeding_media")
      .insert({
        farm_breeding_id: farmBreedingId,
        url,
        storage_path: storagePath,
        position,
      })
      .select()
      .single();

    if (error) {
      // Si l'insertion DB échoue, on tente de supprimer
      // le fichier déjà envoyé dans Storage.
      await sb.storage
        .from("media")
        .remove([storagePath]);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        media: data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Une erreur est survenue lors de l'ajout de la photo.",
      },
      { status: 500 }
    );
  }
}

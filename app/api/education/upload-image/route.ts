import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const BUCKET = "education-media";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function cleanFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

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
    const kind = formData.get("kind");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucune image reçue." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format non autorisé. Utilisez JPG, PNG ou WebP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "L'image est trop lourde. Maximum : 10 Mo.",
        },
        { status: 400 }
      );
    }

    const folder =
      kind === "module"
        ? "modules"
        : "cours";

    const safeName = cleanFileName(file.name);

    const uniqueName =
      `${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const storagePath = `${folder}/${uniqueName}`;

    const supabase = supabaseAdmin();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "Erreur upload image éducation :",
        uploadError
      );

      return NextResponse.json(
        {
          error: "Impossible d'envoyer l'image.",
        },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      path: storagePath,
      url: data.publicUrl,
    });
  } catch (error) {
    console.error(
      "Erreur API upload image éducation :",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur serveur.",
      },
      { status: 500 }
    );
  }
}

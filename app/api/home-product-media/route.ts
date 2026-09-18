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
 * Récupère toutes les photos d'un produit.
 *
 * Exemple :
 * /api/home-product-media?home_product_id=xxxx
 */
export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const homeProductId =
      searchParams.get("home_product_id");

    if (!homeProductId) {
      return NextResponse.json(
        {
          error:
            "Identifiant du produit obligatoire.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("home_product_media")
      .select(
        "id,home_product_id,url,storage_path,position,created_at"
      )
      .eq(
        "home_product_id",
        homeProductId
      )
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur récupération photos produit :",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les photos.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error(
      "Erreur inattendue récupération photos produit :",
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
 * Ajoute une nouvelle photo à un produit.
 *
 * multipart/form-data :
 * file = image
 * home_product_id = identifiant du produit
 */
export async function POST(
  request: Request
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const formData =
      await request.formData();

    const file = formData.get("file");

    const homeProductId =
      formData.get("home_product_id");

    if (
      typeof homeProductId !== "string" ||
      !homeProductId
    ) {
      return NextResponse.json(
        {
          error:
            "Identifiant du produit obligatoire.",
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Aucune photo fournie.",
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
     * Vérifie que le produit existe.
     */
    const { data: product, error: productError } =
      await supabase
        .from("home_products")
        .select("id")
        .eq("id", homeProductId)
        .maybeSingle();

    if (productError) {
      console.error(
        "Erreur vérification produit :",
        productError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de vérifier le produit.",
        },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Produit introuvable.",
        },
        { status: 404 }
      );
    }

    /*
     * Récupère la prochaine position.
     */
    const { data: lastPhoto } =
      await supabase
        .from("home_product_media")
        .select("position")
        .eq(
          "home_product_id",
          homeProductId
        )
        .order("position", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    const nextPosition =
      lastPhoto?.position !== undefined &&
      lastPhoto?.position !== null
        ? lastPhoto.position + 1
        : 0;

    /*
     * Extension du fichier.
     */
    const extension = getExtension(
      file.type
    );

    const randomPart = Math.random()
      .toString(36)
      .slice(2, 10);

    /*
     * Chemin dans Supabase Storage.
     */
    const storagePath =
      `home-products/${homeProductId}/` +
      `${Date.now()}-${randomPart}.${extension}`;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    /*
     * Upload Storage.
     */
    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(
          storagePath,
          buffer,
          {
            contentType: file.type,
            upsert: false,
          }
        );

    if (uploadError) {
      console.error(
        "Erreur upload photo produit :",
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

    /*
     * URL publique.
     */
    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(
        storagePath
      );

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
     * Création de l'entrée en base.
     */
    const {
      data: media,
      error: insertError,
    } = await supabase
      .from("home_product_media")
      .insert({
        home_product_id:
          homeProductId,
        url,
        storage_path:
          storagePath,
        position:
          nextPosition,
      })
      .select(
        "id,home_product_id,url,storage_path,position,created_at"
      )
      .single();

    if (insertError) {
      console.error(
        "Erreur création photo produit :",
        insertError
      );

      /*
       * Nettoyage Storage si la base échoue.
       */
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

    return NextResponse.json(
      media,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Erreur inattendue ajout photo produit :",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

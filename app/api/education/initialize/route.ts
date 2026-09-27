import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { educationDefaults } from "@/lib/educationDefaults";

export const runtime = "nodejs";

const BUCKET = "education-media";

function publicUrl(supabase: ReturnType<typeof supabaseAdmin>, path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function baseName(value: string) {
  const clean = value.split("?")[0].split("#")[0];
  return clean.split("/").pop() || "";
}

async function findStorageImage(
  supabase: ReturnType<typeof supabaseAdmin>,
  kind: "module" | "course",
  moduleSlug: string,
  itemSlug: string,
  currentUrl: string | null,
  aliases: string[] = []
) {
  const currentFile = baseName(currentUrl || "");
  const currentStem = normalize(currentFile.replace(/\.[^.]+$/, ""));

  const wantedStems = new Set(
    [
      normalize(itemSlug),
      currentStem,
      ...aliases.map(normalize),
      kind === "module" ? normalize(moduleSlug) : "",
    ].filter(Boolean)
  );

  const folders =
    kind === "module"
      ? [`modules/${moduleSlug}`, "modules"]
      : [`cours/${moduleSlug}/${itemSlug}`, `cours/${moduleSlug}`, "cours"];

  for (const folder of folders) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error || !data) continue;

    const files = data.filter((item) => item.id && item.name);

    // Prefer an exact filename match based on the lesson/module slug.
    const exact = files.find((file) => {
      const stem = normalize(file.name.replace(/\.[^.]+$/, ""));
      return wantedStems.has(stem);
    });

    if (exact) {
      return publicUrl(
        supabase,
        folder ? `${folder}/${exact.name}` : exact.name
      );
    }

    // For a module folder, allow cover.jpg / cover.png / cover.webp.
    if (kind === "module") {
      const cover = files.find((file) =>
        /^cover\.(jpg|jpeg|png|webp)$/i.test(file.name)
      );

      if (cover) {
        return publicUrl(
          supabase,
          `${folder}/${cover.name}`
        );
      }
    }
  }

  return null;
}

export async function POST() {
  try {
    if (!isAdminAuthed()) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin();

    let modulesCreated = 0;
    let modulesUpdated = 0;
    let modulesSkipped = 0;
    let lessonsCreated = 0;
    let lessonsUpdated = 0;
    let lessonsSkipped = 0;
    let imagesLinked = 0;

    for (const moduleDefault of educationDefaults) {
      const storageModuleImage = await findStorageImage(
        supabase,
        "module",
        moduleDefault.slug,
        moduleDefault.slug,
        moduleDefault.image_url
      );

      const moduleImageUrl =
        storageModuleImage || moduleDefault.image_url;

      const { data: existingModule, error: moduleFindError } =
        await supabase
          .from("education_modules")
          .select(
            "id, title, description, image_url, position, published"
          )
          .eq("slug", moduleDefault.slug)
          .maybeSingle();

      if (moduleFindError) throw moduleFindError;

      let moduleId: string;

      if (existingModule) {
        moduleId = existingModule.id;

        const moduleUpdates: Record<string, unknown> = {};

        if (!existingModule.title?.trim()) {
          moduleUpdates.title = moduleDefault.title;
        }

        if (!existingModule.description?.trim()) {
          moduleUpdates.description = moduleDefault.description;
        }

        // Replace old broken /images/education/... paths with Storage URLs.
        if (
          storageModuleImage &&
          (
            !existingModule.image_url ||
            existingModule.image_url.startsWith("/images/education/")
          )
        ) {
          moduleUpdates.image_url = moduleImageUrl;
          imagesLinked++;
        } else if (!existingModule.image_url?.trim()) {
          moduleUpdates.image_url = moduleImageUrl;
        }

        if (existingModule.position === null) {
          moduleUpdates.position = moduleDefault.position;
        }

        if (existingModule.published === null) {
          moduleUpdates.published = moduleDefault.published;
        }

        if (Object.keys(moduleUpdates).length > 0) {
          const { error: moduleUpdateError } =
            await supabase
              .from("education_modules")
              .update({
                ...moduleUpdates,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingModule.id);

          if (moduleUpdateError) throw moduleUpdateError;
          modulesUpdated++;
        } else {
          modulesSkipped++;
        }
      } else {
        const { data: newModule, error: moduleInsertError } =
          await supabase
            .from("education_modules")
            .insert({
              title: moduleDefault.title,
              slug: moduleDefault.slug,
              description: moduleDefault.description,
              image_url: moduleImageUrl,
              position: moduleDefault.position,
              published: moduleDefault.published,
            })
            .select("id")
            .single();

        if (moduleInsertError) throw moduleInsertError;

        moduleId = newModule.id;
        modulesCreated++;

        if (storageModuleImage) {
          imagesLinked++;
        }
      }

      for (const lessonDefault of moduleDefault.lessons) {
        const storageLessonImage = await findStorageImage(
          supabase,
          "course",
          moduleDefault.slug,
          lessonDefault.slug,
          lessonDefault.image_url,
          [
            lessonDefault.title.split(" à ")[0],
            lessonDefault.title.split(" et ")[0],
            lessonDefault.title.split(" ")[0],
          ]
        );

        const lessonImageUrl =
          storageLessonImage || lessonDefault.image_url;

        const { data: existingLesson, error: lessonFindError } =
          await supabase
            .from("education_lessons")
            .select(
              "id, title, introduction, content, image_url, video_url, position, published"
            )
            .eq("module_id", moduleId)
            .eq("slug", lessonDefault.slug)
            .maybeSingle();

        if (lessonFindError) throw lessonFindError;

        if (existingLesson) {
          const lessonUpdates: Record<string, unknown> = {};

          if (!existingLesson.title?.trim()) {
            lessonUpdates.title = lessonDefault.title;
          }

          if (!existingLesson.introduction?.trim()) {
            lessonUpdates.introduction = lessonDefault.introduction;
          }

          if (!existingLesson.content?.trim()) {
            lessonUpdates.content = lessonDefault.content;
          }

          // Replace old broken /images/education/... paths with Storage URLs.
          if (
            storageLessonImage &&
            (
              !existingLesson.image_url ||
              existingLesson.image_url.startsWith("/images/education/")
            )
          ) {
            lessonUpdates.image_url = lessonImageUrl;
            imagesLinked++;
          } else if (!existingLesson.image_url?.trim()) {
            lessonUpdates.image_url = lessonImageUrl;
          }

          if (existingLesson.position === null) {
            lessonUpdates.position = lessonDefault.position;
          }

          if (existingLesson.published === null) {
            lessonUpdates.published = lessonDefault.published;
          }

          if (Object.keys(lessonUpdates).length > 0) {
            const { error: lessonUpdateError } =
              await supabase
                .from("education_lessons")
                .update({
                  ...lessonUpdates,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existingLesson.id);

            if (lessonUpdateError) throw lessonUpdateError;
            lessonsUpdated++;
          } else {
            lessonsSkipped++;
          }

          continue;
        }

        const { error: lessonInsertError } =
          await supabase
            .from("education_lessons")
            .insert({
              module_id: moduleId,
              title: lessonDefault.title,
              slug: lessonDefault.slug,
              introduction: lessonDefault.introduction,
              content: lessonDefault.content,
              image_url: lessonImageUrl,
              position: lessonDefault.position,
              published: lessonDefault.published,
            });

        if (lessonInsertError) throw lessonInsertError;

        lessonsCreated++;

        if (storageLessonImage) {
          imagesLinked++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Le contenu éducatif a été initialisé. Les contenus existants ont été préservés et les anciennes adresses d’images ont été remplacées lorsqu’une image correspondante a été trouvée dans Supabase Storage.",
      modulesCreated,
      modulesUpdated,
      modulesSkipped,
      lessonsCreated,
      lessonsUpdated,
      lessonsSkipped,
      imagesLinked,
      totalModules: educationDefaults.length,
      totalLessons: educationDefaults.reduce(
        (total, module) => total + module.lessons.length,
        0
      ),
    });
  } catch (error) {
    console.error("Education initialization error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'initialisation du contenu éducatif.",
      },
      { status: 500 }
    );
  }
}

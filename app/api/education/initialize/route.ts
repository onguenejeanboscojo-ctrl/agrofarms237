import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { educationDefaults } from "@/lib/educationDefaults";

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

    for (const moduleDefault of educationDefaults) {
      /*
       * ---------------------------------------------------------
       * MODULE
       * ---------------------------------------------------------
       */

      const { data: existingModule, error: moduleFindError } =
        await supabase
          .from("education_modules")
          .select(
            "id, title, description, image_url, position, published"
          )
          .eq("slug", moduleDefault.slug)
          .maybeSingle();

      if (moduleFindError) {
        throw moduleFindError;
      }

      let moduleId: string;

      if (existingModule) {
        moduleId = existingModule.id;

        /*
         * Le module existe déjà.
         * On complète uniquement les champs vides.
         * Les personnalisations existantes sont conservées.
         */

        const moduleUpdates: Record<string, unknown> = {};

        if (
          !existingModule.title ||
          existingModule.title.trim() === ""
        ) {
          moduleUpdates.title = moduleDefault.title;
        }

        if (
          !existingModule.description ||
          existingModule.description.trim() === ""
        ) {
          moduleUpdates.description =
            moduleDefault.description;
        }

        if (
          !existingModule.image_url ||
          existingModule.image_url.trim() === ""
        ) {
          moduleUpdates.image_url =
            moduleDefault.image_url;
        }

        if (existingModule.position === null) {
          moduleUpdates.position =
            moduleDefault.position;
        }

        if (existingModule.published === null) {
          moduleUpdates.published =
            moduleDefault.published;
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

          if (moduleUpdateError) {
            throw moduleUpdateError;
          }

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
              image_url: moduleDefault.image_url,
              position: moduleDefault.position,
              published: moduleDefault.published,
            })
            .select("id")
            .single();

        if (moduleInsertError) {
          throw moduleInsertError;
        }

        moduleId = newModule.id;
        modulesCreated++;
      }

      /*
       * ---------------------------------------------------------
       * COURS DU MODULE
       * ---------------------------------------------------------
       */

      for (const lessonDefault of moduleDefault.lessons) {
        const { data: existingLesson, error: lessonFindError } =
          await supabase
            .from("education_lessons")
            .select(
              `
                id,
                title,
                introduction,
                content,
                image_url,
                video_url,
                position,
                published
              `
            )
            .eq("module_id", moduleId)
            .eq("slug", lessonDefault.slug)
            .maybeSingle();

        if (lessonFindError) {
          throw lessonFindError;
        }

        /*
         * -------------------------------------------------------
         * COURS EXISTANT
         * -------------------------------------------------------
         */

        if (existingLesson) {
          /*
           * Le cours existe déjà.
           *
           * On complète uniquement les champs vides.
           * Un contenu personnalisé ne sera jamais écrasé.
           */

          const lessonUpdates: Record<string, unknown> = {};

          if (
            !existingLesson.title ||
            existingLesson.title.trim() === ""
          ) {
            lessonUpdates.title = lessonDefault.title;
          }

          if (
            !existingLesson.introduction ||
            existingLesson.introduction.trim() === ""
          ) {
            lessonUpdates.introduction =
              lessonDefault.introduction;
          }

          /*
           * C'EST LE POINT IMPORTANT :
           * Si le contenu est vide, on remet le contenu
           * pédagogique présent dans educationDefaults.
           */
          if (
            !existingLesson.content ||
            existingLesson.content.trim() === ""
          ) {
            lessonUpdates.content =
              lessonDefault.content;
          }

          if (
            !existingLesson.image_url ||
            existingLesson.image_url.trim() === ""
          ) {
            lessonUpdates.image_url =
              lessonDefault.image_url;
          }

          if (existingLesson.position === null) {
            lessonUpdates.position =
              lessonDefault.position;
          }

          if (existingLesson.published === null) {
            lessonUpdates.published =
              lessonDefault.published;
          }

          /*
           * video_url existe dans la base de données,
           * mais n'est pas défini dans educationDefaults.
           *
           * On ne le modifie donc pas ici.
           */

          if (Object.keys(lessonUpdates).length > 0) {
            const { error: lessonUpdateError } =
              await supabase
                .from("education_lessons")
                .update({
                  ...lessonUpdates,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existingLesson.id);

            if (lessonUpdateError) {
              throw lessonUpdateError;
            }

            lessonsUpdated++;
          } else {
            lessonsSkipped++;
          }

          continue;
        }

        /*
         * -------------------------------------------------------
         * NOUVEAU COURS
         * -------------------------------------------------------
         */

        const { error: lessonInsertError } =
          await supabase
            .from("education_lessons")
            .insert({
              module_id: moduleId,
              title: lessonDefault.title,
              slug: lessonDefault.slug,
              introduction: lessonDefault.introduction,
              content: lessonDefault.content,
              image_url: lessonDefault.image_url,
              position: lessonDefault.position,
              published: lessonDefault.published,
            });

        if (lessonInsertError) {
          throw lessonInsertError;
        }

        lessonsCreated++;
      }
    }

    return NextResponse.json({
      success: true,

      message:
        "Le contenu éducatif a été initialisé. Les contenus existants ont été préservés et les champs vides ont été complétés.",

      modulesCreated,
      modulesUpdated,
      modulesSkipped,

      lessonsCreated,
      lessonsUpdated,
      lessonsSkipped,

      totalModules: educationDefaults.length,

      totalLessons: educationDefaults.reduce(
        (total, module) =>
          total + module.lessons.length,
        0
      ),
    });
  } catch (error) {
    console.error(
      "Education initialization error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'initialisation du contenu éducatif.",
      },
      {
        status: 500,
      }
    );
  }
}

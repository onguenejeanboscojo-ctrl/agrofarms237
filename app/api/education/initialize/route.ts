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
    let modulesSkipped = 0;
    let lessonsCreated = 0;
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
          .select("id")
          .eq("slug", moduleDefault.slug)
          .maybeSingle();

      if (moduleFindError) {
        throw moduleFindError;
      }

      let moduleId: string;

      if (existingModule) {
        /*
         * Le module existe déjà.
         *
         * IMPORTANT :
         * On ne modifie rien afin de préserver les éventuelles
         * personnalisations faites depuis l'administration.
         */
        moduleId = existingModule.id;
        modulesSkipped++;
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
            .select("id")
            .eq("module_id", moduleId)
            .eq("slug", lessonDefault.slug)
            .maybeSingle();

        if (lessonFindError) {
          throw lessonFindError;
        }

        if (existingLesson) {
          /*
           * Le cours existe déjà.
           *
           * On ne le modifie surtout pas.
           * Cela protège les contenus personnalisés depuis l'Admin.
           */
          lessonsSkipped++;
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
        "Le contenu éducatif a été initialisé sans écraser les contenus existants.",

      modulesCreated,
      modulesSkipped,

      lessonsCreated,
      lessonsSkipped,

      totalModules: educationDefaults.length,

      totalLessons: educationDefaults.reduce(
        (total, module) => total + module.lessons.length,
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

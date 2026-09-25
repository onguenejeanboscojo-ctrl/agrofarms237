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

    let modulesCreated = 0;
    let modulesUpdated = 0;
    let lessonsCreated = 0;
    let lessonsUpdated = 0;

    for (const moduleDefault of educationDefaults) {
      const { data: existingModule, error: moduleFindError } =
        await supabaseAdmin
          .from("education_modules")
          .select("id")
          .eq("slug", moduleDefault.slug)
          .maybeSingle();

      if (moduleFindError) {
        throw moduleFindError;
      }

      let moduleId: string;

      if (existingModule) {
        const { data: updatedModule, error: moduleUpdateError } =
          await supabaseAdmin
            .from("education_modules")
            .update({
              title: moduleDefault.title,
              description: moduleDefault.description,
              image_url: moduleDefault.image_url,
              position: moduleDefault.position,
            })
            .eq("id", existingModule.id)
            .select("id")
            .single();

        if (moduleUpdateError) {
          throw moduleUpdateError;
        }

        moduleId = updatedModule.id;
        modulesUpdated++;
      } else {
        const { data: newModule, error: moduleInsertError } =
          await supabaseAdmin
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

      for (const lessonDefault of moduleDefault.lessons) {
        const { data: existingLesson, error: lessonFindError } =
          await supabaseAdmin
            .from("education_lessons")
            .select("id")
            .eq("module_id", moduleId)
            .eq("slug", lessonDefault.slug)
            .maybeSingle();

        if (lessonFindError) {
          throw lessonFindError;
        }

        if (existingLesson) {
          const { error: lessonUpdateError } =
            await supabaseAdmin
              .from("education_lessons")
              .update({
                title: lessonDefault.title,
                introduction: lessonDefault.introduction,
                content: lessonDefault.content,
                image_url: lessonDefault.image_url,
                position: lessonDefault.position,
              })
              .eq("id", existingLesson.id);

          if (lessonUpdateError) {
            throw lessonUpdateError;
          }

          lessonsUpdated++;
        } else {
          const { error: lessonInsertError } =
            await supabaseAdmin
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
    }

    return NextResponse.json({
      success: true,
      message: "Contenu éducatif initialisé avec succès.",
      modulesCreated,
      modulesUpdated,
      lessonsCreated,
      lessonsUpdated,
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

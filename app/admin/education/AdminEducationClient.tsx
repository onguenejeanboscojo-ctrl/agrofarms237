"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/AdminNav";

type EducationModule = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
  position: number;
};

type EducationLesson = {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  introduction: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  published: boolean;
  position: number;
};

type InitializationResult = {
  success?: boolean;
  message?: string;
  modulesCreated?: number;
  modulesSkipped?: number;
  lessonsCreated?: number;
  lessonsSkipped?: number;
  totalModules?: number;
  totalLessons?: number;
  error?: string;
};

export default function AdminEducationClient() {
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [lessons, setLessons] = useState<EducationLesson[]>([]);

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState("");
  const [initializationMessage, setInitializationMessage] = useState("");

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleImageUrl, setModuleImageUrl] = useState("");
  const [modulePublished, setModulePublished] = useState(true);

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");
  const [lessonIntroduction, setLessonIntroduction] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonImageUrl, setLessonImageUrl] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonPublished, setLessonPublished] = useState(true);

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const [modulesRes, lessonsRes] = await Promise.all([
        fetch("/api/education/modules"),
        fetch("/api/education/lessons"),
      ]);

      const modulesData = await modulesRes.json();
      const lessonsData = await lessonsRes.json();

      if (!modulesRes.ok) {
        throw new Error(
          modulesData.error || "Impossible de charger les modules."
        );
      }

      if (!lessonsRes.ok) {
        throw new Error(
          lessonsData.error || "Impossible de charger les cours."
        );
      }

      setModules(modulesData.modules || []);
      setLessons(lessonsData.lessons || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de charger les données."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedModule = useMemo(
    () =>
      modules.find((module) => module.id === selectedModuleId) || null,
    [modules, selectedModuleId]
  );

  const selectedLessons = useMemo(
    () =>
      lessons
        .filter((lesson) => lesson.module_id === selectedModuleId)
        .sort((a, b) => a.position - b.position),
    [lessons, selectedModuleId]
  );

  /*
   * ---------------------------------------------------------
   * INITIALISATION AUTOMATIQUE
   * ---------------------------------------------------------
   */

  async function initializeEducation() {
    const confirmed = window.confirm(
      "Initialiser le contenu AgroFarms237 ?\n\n" +
        "Les modules et cours manquants seront créés automatiquement.\n\n" +
        "Les modules et cours qui existent déjà ne seront PAS écrasés."
    );

    if (!confirmed) return;

    setInitializing(true);
    setInitializationMessage("");
    setMessage("");

    try {
      const response = await fetch("/api/education/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: InitializationResult = await response.json();

      if (!response.ok) {
        setInitializationMessage(
          data.error || "Impossible d'initialiser le contenu éducatif."
        );
        return;
      }

      setInitializationMessage(
        [
          data.message || "Initialisation terminée.",
          "",
          `Modules créés : ${data.modulesCreated ?? 0}`,
          `Modules déjà présents : ${data.modulesSkipped ?? 0}`,
          `Cours créés : ${data.lessonsCreated ?? 0}`,
          `Cours déjà présents : ${data.lessonsSkipped ?? 0}`,
        ].join("\n")
      );

      await loadData();
    } catch {
      setInitializationMessage(
        "Une erreur est survenue pendant l'initialisation."
      );
    } finally {
      setInitializing(false);
    }
  }

  function openModule(module: EducationModule) {
    setSelectedModuleId(module.id);
    setModuleTitle(module.title);
    setModuleDescription(module.description || "");
    setModuleImageUrl(module.image_url || "");
    setModulePublished(module.published);
    setShowLessonForm(false);
    setEditingLessonId(null);
    setMessage("");
    setInitializationMessage("");
  }

  function closeModule() {
    setSelectedModuleId(null);
    setShowLessonForm(false);
    setEditingLessonId(null);
    setMessage("");
  }

  async function saveModule() {
    if (!selectedModule) return;

    if (!moduleTitle.trim()) {
      setMessage("Le nom du module est obligatoire.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/education/modules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedModule.id,
          title: moduleTitle.trim(),
          description: moduleDescription.trim(),
          image_url: moduleImageUrl.trim() || null,
          published: modulePublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Erreur lors de l'enregistrement du module."
        );
        return;
      }

      setModules((current) =>
        current.map((module) =>
          module.id === selectedModule.id ? data.module : module
        )
      );

      setMessage("Module enregistré avec succès.");
    } catch {
      setMessage("Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function startNewLesson() {
    setEditingLessonId(null);
    setLessonTitle("");
    setLessonSlug("");
    setLessonIntroduction("");
    setLessonContent("");
    setLessonImageUrl("");
    setLessonVideoUrl("");
    setLessonPublished(true);
    setShowLessonForm(true);
    setMessage("");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  function editLesson(lesson: EducationLesson) {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonSlug(lesson.slug);
    setLessonIntroduction(lesson.introduction || "");
    setLessonContent(lesson.content || "");
    setLessonImageUrl(lesson.image_url || "");
    setLessonVideoUrl(lesson.video_url || "");
    setLessonPublished(lesson.published);
    setShowLessonForm(true);
    setMessage("");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  function cancelLessonForm() {
    setShowLessonForm(false);
    setEditingLessonId(null);
    setLessonTitle("");
    setLessonSlug("");
    setLessonIntroduction("");
    setLessonContent("");
    setLessonImageUrl("");
    setLessonVideoUrl("");
    setLessonPublished(true);
    setMessage("");
  }

  async function saveLesson() {
    if (!selectedModule) return;

    if (!lessonTitle.trim()) {
      setMessage("Le titre du cours est obligatoire.");
      return;
    }

    const slug = lessonSlug.trim() || createSlug(lessonTitle);

    if (!slug) {
      setMessage("Le slug du cours est obligatoire.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const existingLesson = selectedLessons.find(
        (lesson) => lesson.id === editingLessonId
      );

      const response = await fetch("/api/education/lessons", {
        method: existingLesson ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          existingLesson
            ? {
                id: existingLesson.id,
                module_id: selectedModule.id,
                title: lessonTitle.trim(),
                slug,
                introduction: lessonIntroduction.trim(),
                content: lessonContent,
                image_url: lessonImageUrl.trim() || null,
                video_url: lessonVideoUrl.trim() || null,
                published: lessonPublished,
              }
            : {
                module_id: selectedModule.id,
                title: lessonTitle.trim(),
                slug,
                introduction: lessonIntroduction.trim(),
                content: lessonContent,
                image_url: lessonImageUrl.trim() || null,
                video_url: lessonVideoUrl.trim() || null,
                published: lessonPublished,
                position: selectedLessons.length + 1,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Erreur lors de l'enregistrement du cours."
        );
        return;
      }

      if (existingLesson) {
        setLessons((current) =>
          current.map((lesson) =>
            lesson.id === existingLesson.id ? data.lesson : lesson
          )
        );
      } else {
        setLessons((current) => [...current, data.lesson]);
      }

      setMessage(
        existingLesson
          ? "Cours modifié avec succès."
          : "Cours ajouté avec succès."
      );

      setEditingLessonId(null);
      setShowLessonForm(false);
    } catch {
      setMessage("Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleLesson(lesson: EducationLesson) {
    setMessage("");

    try {
      const response = await fetch("/api/education/lessons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lesson.id,
          published: !lesson.published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Impossible de modifier le statut."
        );
        return;
      }

      setLessons((current) =>
        current.map((item) =>
          item.id === lesson.id ? data.lesson : item
        )
      );

      setMessage(
        data.lesson.published
          ? "Cours publié."
          : "Cours dépublié."
      );
    } catch {
      setMessage("Une erreur est survenue.");
    }
  }

  async function deleteLesson(lesson: EducationLesson) {
    const confirmed = window.confirm(
      `Supprimer le cours « ${lesson.title} » ?`
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch("/api/education/lessons", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lesson.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Impossible de supprimer le cours."
        );
        return;
      }

      setLessons((current) =>
        current.filter((item) => item.id !== lesson.id)
      );

      if (editingLessonId === lesson.id) {
        cancelLessonForm();
      }

      setMessage("Cours supprimé.");
    } catch {
      setMessage("Une erreur est survenue.");
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav />

        <main className="mx-auto max-w-[1180px] px-5 py-9">
          <p className="text-inkSoft">
            Chargement de l'éducation...
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-5 py-9">
        <div className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-inkSoft">
                AgroFarms237
              </p>

              <h1 className="font-serif text-3xl font-semibold">
                Éducation
              </h1>

              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-inkSoft">
                Gérez les modules éducatifs et les cours proposés aux
                visiteurs du site.
              </p>
            </div>

            {!selectedModule && (
              <button
                type="button"
                onClick={initializeEducation}
                disabled={initializing}
                className="inline-flex items-center justify-center rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {initializing
                  ? "Initialisation..."
                  : "⚡ Initialiser le contenu AgroFarms237"}
              </button>
            )}
          </div>
        </div>

        {initializationMessage && (
          <div className="mb-6 whitespace-pre-line rounded-xl border border-ink/10 bg-paper px-5 py-4 text-sm leading-6 text-ink">
            {initializationMessage}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-ink/10 bg-paper px-5 py-4 text-sm text-ink">
            {message}
          </div>
        )}

        {!selectedModule ? (
          <section>
            <div className="mb-4">
              <h2 className="font-serif text-xl font-semibold">
                Modules éducatifs
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                Sélectionnez un module pour gérer ses cours.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {modules.map((module) => {
                const moduleLessons = lessons.filter(
                  (lesson) => lesson.module_id === module.id
                );

                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => openModule(module)}
                    className="overflow-hidden rounded-2xl border border-ink/10 bg-paper text-left transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-sm"
                  >
                    <div className="relative h-44 bg-bgAlt">
                      {module.image_url ? (
                        <img
                          src={module.image_url}
                          alt={module.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-inkSoft">
                          Aucune image de module
                        </div>
                      )}

                      <span
                        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                          module.published
                            ? "bg-ink text-white"
                            : "bg-white/90 text-inkSoft"
                        }`}
                      >
                        {module.published ? "Publié" : "Brouillon"}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold">
                        {module.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-inkSoft">
                        {module.description ||
                          "Aucune description pour le moment."}
                      </p>

                      <div className="mt-5 border-t border-ink/10 pt-4 text-sm font-semibold text-ink">
                        {moduleLessons.length} cours
                        <span className="ml-2">→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <section>
            <button
              type="button"
              onClick={closeModule}
              className="mb-6 text-sm font-semibold text-inkSoft hover:text-ink"
            >
              ← Retour aux modules
            </button>

            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="rounded-m border border-ink/10 bg-paper p-6">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                      Module
                    </p>

                    <h2 className="mt-2 font-serif text-2xl font-semibold">
                      {selectedModule.title}
                    </h2>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Nom du module
                      </label>

                      <input
                        value={moduleTitle}
                        onChange={(event) =>
                          setModuleTitle(event.target.value)
                        }
                        className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Description
                      </label>

                      <textarea
                        value={moduleDescription}
                        onChange={(event) =>
                          setModuleDescription(event.target.value)
                        }
                        rows={5}
                        className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Image du module
                      </label>

                      <input
                        value={moduleImageUrl}
                        onChange={(event) => setModuleImageUrl(event.target.value)}
                        className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                        placeholder="/images/education/modules/pisciculture.jpg"
                      />

                      {moduleImageUrl && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-ink/10 bg-bgAlt">
                          <img
                            src={moduleImageUrl}
                            alt={moduleTitle}
                            className="h-40 w-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <label className="flex items-center gap-3 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={modulePublished}
                        onChange={(event) =>
                          setModulePublished(event.target.checked)
                        }
                      />

                      Module publié sur le site
                    </label>

                    <button
                      type="button"
                      onClick={saveModule}
                      disabled={saving}
                      className="btn btn-ink"
                    >
                      {saving
                        ? "Enregistrement..."
                        : "Enregistrer le module"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl font-semibold">
                      Cours du module
                    </h2>

                    <p className="mt-1 text-sm text-inkSoft">
                      {selectedLessons.length} cours dans ce module.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={startNewLesson}
                    className="btn btn-ink"
                  >
                    + Ajouter un cours
                  </button>
                </div>

                <div className="grid gap-4">
                  {selectedLessons.length === 0 ? (
                    <div className="rounded-m border border-dashed border-ink/20 bg-paper p-8 text-center">
                      <p className="text-sm text-inkSoft">
                        Aucun cours dans ce module.
                      </p>
                    </div>
                  ) : (
                    selectedLessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="rounded-m border border-ink/10 bg-paper p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bgAlt text-sm font-semibold">
                              {index + 1}
                            </div>                            <div className="min-w-0 flex-1">
                              <h3 className="font-serif text-lg font-semibold">
                                {lesson.title}
                              </h3>

                              <p className="mt-1 text-sm leading-6 text-inkSoft">
                                {lesson.introduction ||
                                  "Aucune introduction renseignée."}
                              </p>

                              <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
                                <div className="overflow-hidden rounded-xl border border-ink/10 bg-bgAlt">
                                  {lesson.image_url ? (
                                    <img
                                      src={lesson.image_url}
                                      alt={lesson.title}
                                      className="h-28 w-full object-cover"
                                      loading="lazy"
                                      onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="flex h-28 items-center justify-center px-3 text-center text-xs text-inkSoft">
                                      Aucune image définie
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-inkSoft">
                                      Contenu du cours
                                    </p>
                                    <span className="text-xs text-inkSoft">
                                      {(lesson.content || "").length} caractères
                                    </span>
                                  </div>

                                  <p className="whitespace-pre-line text-sm leading-6 text-inkSoft">
                                    {lesson.content
                                      ? lesson.content.length > 420
                                        ? `${lesson.content.slice(0, 420).trim()}…`
                                        : lesson.content
                                      : "Aucun contenu renseigné."}
                                  </p>

                                  {lesson.image_url && (
                                    <p className="mt-3 break-all text-xs text-inkSoft">
                                      Image : {lesson.image_url}
                                    </p>
                                  )}

                                  {lesson.video_url && (
                                    <p className="mt-1 break-all text-xs text-inkSoft">
                                      Vidéo : {lesson.video_url}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                              lesson.published
                                ? "bg-ink text-white"
                                : "bg-bgAlt text-inkSoft"
                            }`}
                          >
                            {lesson.published
                              ? "Publié"
                              : "Brouillon"}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
                          <button
                            type="button"
                            onClick={() => editLesson(lesson)}
                            className="rounded-lg border border-ink/10 px-4 py-2 text-sm font-semibold hover:bg-bgAlt"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleLesson(lesson)}
                            className="rounded-lg border border-ink/10 px-4 py-2 text-sm font-semibold hover:bg-bgAlt"
                          >
                            {lesson.published
                              ? "Dépublier"
                              : "Publier"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteLesson(lesson)}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {showLessonForm && (
              <div className="mt-8 rounded-m border border-ink/10 bg-paper p-6">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                    Éditeur
                  </p>

                  <h2 className="mt-2 font-serif text-xl font-semibold">
                    {editingLessonId
                      ? "Modifier le cours"
                      : "Nouveau cours"}
                  </h2>
                </div>

                <div className="grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Titre du cours
                    </label>

                    <input
                      value={lessonTitle}
                      onChange={(event) => {
                        const value = event.target.value;

                        setLessonTitle(value);

                        if (!editingLessonId && !lessonSlug) {
                          setLessonSlug(createSlug(value));
                        }
                      }}
                      className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                      placeholder="Ex : Introduction à la pisciculture"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Slug
                    </label>

                    <input
                      value={lessonSlug}
                      onChange={(event) =>
                        setLessonSlug(event.target.value)
                      }
                      className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                      placeholder="introduction-pisciculture"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Introduction
                    </label>

                    <textarea
                      value={lessonIntroduction}
                      onChange={(event) =>
                        setLessonIntroduction(event.target.value)
                      }
                      rows={4}
                      className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                      placeholder="Courte présentation du cours..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Image du cours
                    </label>

                    <input
                      value={lessonImageUrl}
                      onChange={(event) =>
                        setLessonImageUrl(event.target.value)
                      }
                      className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                      placeholder="/images/education/cours/introduction-pisciculture.jpg"
                    />

                    <p className="mt-2 text-xs leading-5 text-inkSoft">
                      Chemin ou URL de l'image utilisée pour illustrer le
                      cours.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Vidéo du cours
                    </label>

                    <input
                      value={lessonVideoUrl}
                      onChange={(event) =>
                        setLessonVideoUrl(event.target.value)
                      }
                      className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm outline-none focus:border-ink/30"
                      placeholder="https://..."
                    />

                    <p className="mt-2 text-xs leading-5 text-inkSoft">
                      Facultatif.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Contenu du cours
                    </label>

                    <textarea
                      value={lessonContent}
                      onChange={(event) =>
                        setLessonContent(event.target.value)
                      }
                      rows={20}
                      className="w-full rounded-lg border border-ink/10 bg-bg px-4 py-3 text-sm leading-6 outline-none focus:border-ink/30"
                      placeholder="Rédigez ici le contenu complet du cours..."
                    />
                  </div>

                  <label className="flex items-center gap-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={lessonPublished}
                      onChange={(event) =>
                        setLessonPublished(event.target.checked)
                      }
                    />

                    Cours publié sur le site
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={saveLesson}
                      disabled={saving}
                      className="btn btn-ink"
                    >
                      {saving
                        ? "Enregistrement..."
                        : editingLessonId
                          ? "Enregistrer les modifications"
                          : "Enregistrer le cours"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelLessonForm}
                      className="rounded-lg border border-ink/10 px-5 py-2.5 text-sm font-semibold hover:bg-bgAlt"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}

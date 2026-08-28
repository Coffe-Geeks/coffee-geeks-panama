"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCourse, updateCourse, addOrUpdateLesson, deleteLesson } from "@/app/actions/elearning";
import ModalAlert from "@/app/components/ui/ModalAlert";

export default function CourseFormClient({ initialData, isNew }: { initialData: any, isNew: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "lessons">("details");
  const [modal, setModal] = useState<{isOpen: boolean, message: string, type: "success" | "error" | "info"}>({ isOpen: false, message: "", type: "info" });

  const showAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    setModal({ isOpen: true, message, type });
  };

  // Lessons Form State
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    order: "0",
    duration: "",
    isVideoUploaded: false,
    videoUrl: "",
    videoFile: null as File | null,
  });

  async function handleCourseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (isNew) {
        const newCourse = await createCourse(formData);
        router.push(`/admin/elearning/course-form/${newCourse._id}`);
      } else {
        await updateCourse(initialData._id, formData);
        showAlert("Curso actualizado con éxito", "success");
      }
    } catch (err: any) {
      showAlert("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLessonSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", lessonForm.title);
    formData.append("description", lessonForm.description);
    formData.append("order", lessonForm.order);
    formData.append("duration", lessonForm.duration);
    formData.append("isVideoUploaded", lessonForm.isVideoUploaded.toString());
    
    if (lessonForm.isVideoUploaded && lessonForm.videoFile) {
      formData.append("videoFile", lessonForm.videoFile);
    } else {
      formData.append("videoUrl", lessonForm.videoUrl);
    }

    try {
      await addOrUpdateLesson(initialData._id, formData, editingLessonId || undefined);
      setEditingLessonId(null);
      setLessonForm({
        title: "", description: "", order: "0", duration: "", isVideoUploaded: false, videoUrl: "", videoFile: null
      });
      // Force refresh data somehow? The server action does revalidatePath, so router.refresh() will get new data
      router.refresh();
      showAlert("Lección guardada", "success");
    } catch (err: any) {
      showAlert("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!confirm("¿Seguro que deseas eliminar esta lección?")) return;
    setLoading(true);
    try {
      await deleteLesson(initialData._id, lessonId);
      router.refresh();
      showAlert("Lección eliminada", "success");
    } catch (err: any) {
      showAlert("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function editLesson(lesson: any) {
    setEditingLessonId(lesson._id);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      order: lesson.order.toString(),
      duration: lesson.duration || "",
      isVideoUploaded: lesson.isVideoUploaded || false,
      videoUrl: lesson.videoUrl || "",
      videoFile: null,
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#cddbf2]">
            {isNew ? "Crear Nuevo Curso" : `Editar: ${initialData.title}`}
          </h1>
          <Link href="/admin/elearning" className="text-[#cddbf2]/60 hover:text-[#cddbf2] text-sm flex items-center gap-2 mt-2">
            ← Volver a Cursos
          </Link>
        </div>
      </div>

      {!isNew && (
        <div className="flex gap-4 border-b border-[#cddbf2]/10 mb-6 pb-2">
          <button
            className={`px-4 py-2 text-sm font-bold ${activeTab === "details" ? "text-[#cddbf2] border-b-2 border-[#cddbf2]" : "text-[#cddbf2]/50"}`}
            onClick={() => setActiveTab("details")}
          >
            Detalles del Curso
          </button>
          <button
            className={`px-4 py-2 text-sm font-bold ${activeTab === "lessons" ? "text-[#cddbf2] border-b-2 border-[#cddbf2]" : "text-[#cddbf2]/50"}`}
            onClick={() => setActiveTab("lessons")}
          >
            Lecciones ({initialData?.lessons?.length || 0})
          </button>
        </div>
      )}

      {activeTab === "details" && (
        <form onSubmit={handleCourseSubmit} className="bg-white/5 border border-[#cddbf2]/10 p-6 rounded-2xl space-y-6">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-[#cddbf2]/70 mb-2">Título del Curso</label>
              <input
                type="text"
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full bg-black/40 border border-[#cddbf2]/20 rounded-xl px-4 py-3 text-[#cddbf2] focus:outline-none focus:border-[#cddbf2]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cddbf2]/70 mb-2">Descripción</label>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                required
                rows={4}
                className="w-full bg-black/40 border border-[#cddbf2]/20 rounded-xl px-4 py-3 text-[#cddbf2] focus:outline-none focus:border-[#cddbf2]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cddbf2]/70 mb-2">Imagen Principal (Cover)</label>
              <input
                type="file"
                name="mainImage"
                accept="image/*"
                required={isNew}
                className="w-full text-[#cddbf2] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#cddbf2]/10 file:text-[#cddbf2] hover:file:bg-[#cddbf2]/20"
              />
              {initialData?.mainImage && (
                <img src={initialData.mainImage} alt="Cover" className="mt-4 h-32 rounded-xl object-cover" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={isNew ? true : initialData?.isActive}
                id="isActive"
                className="w-5 h-5 accent-[#cddbf2]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[#cddbf2]/70">
                Curso Activo (Visible al público)
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-bold disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Curso"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "lessons" && !isNew && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulario de Lección */}
          <div className="bg-white/5 border border-[#cddbf2]/10 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold text-[#cddbf2] mb-6">
              {editingLessonId ? "Editar Lección" : "Nueva Lección"}
            </h2>
            <form onSubmit={handleLessonSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#cddbf2]/70 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title || ""}
                  onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full bg-black/40 border border-[#cddbf2]/20 rounded-lg px-3 py-2 text-[#cddbf2]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#cddbf2]/70 mb-1">Descripción</label>
                <textarea
                  required
                  rows={2}
                  value={lessonForm.description || ""}
                  onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full bg-black/40 border border-[#cddbf2]/20 rounded-lg px-3 py-2 text-[#cddbf2]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#cddbf2]/70 mb-1">Orden (#)</label>
                  <input
                    type="number"
                    required
                    value={lessonForm.order || "0"}
                    onChange={e => setLessonForm({ ...lessonForm, order: e.target.value })}
                    className="w-full bg-black/40 border border-[#cddbf2]/20 rounded-lg px-3 py-2 text-[#cddbf2]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#cddbf2]/70 mb-1">Duración (ej. 10:30)</label>
                  <input
                    type="text"
                    value={lessonForm.duration || ""}
                    onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full bg-black/40 border border-[#cddbf2]/20 rounded-lg px-3 py-2 text-[#cddbf2]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#cddbf2]/10">
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm text-[#cddbf2]/80 cursor-pointer">
                    <input
                      type="radio"
                      name="videoType"
                      checked={!lessonForm.isVideoUploaded}
                      onChange={() => setLessonForm({ ...lessonForm, isVideoUploaded: false })}
                      className="accent-[#cddbf2]"
                    />
                    Enlace Externo (YouTube/Vimeo)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#cddbf2]/80 cursor-pointer">
                    <input
                      type="radio"
                      name="videoType"
                      checked={lessonForm.isVideoUploaded}
                      onChange={() => setLessonForm({ ...lessonForm, isVideoUploaded: true })}
                      className="accent-[#cddbf2]"
                    />
                    Subir Archivo
                  </label>
                </div>

                {!lessonForm.isVideoUploaded ? (
                  <div key="video-url-container">
                    <label className="block text-sm text-[#cddbf2]/70 mb-1">URL del Video</label>
                    <input
                      key="video-url-input"
                      type="url"
                      required={!lessonForm.isVideoUploaded}
                      value={lessonForm.videoUrl || ""}
                      onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-black/40 border border-[#cddbf2]/20 rounded-lg px-3 py-2 text-[#cddbf2]"
                    />
                  </div>
                ) : (
                  <div key="video-file-container">
                    <label className="block text-sm text-[#cddbf2]/70 mb-1">Archivo de Video (MP4)</label>
                    <input
                      key="video-file-input"
                      type="file"
                      accept="video/*"
                      required={lessonForm.isVideoUploaded && !editingLessonId}
                      onChange={e => setLessonForm({ ...lessonForm, videoFile: e.target.files?.[0] || null })}
                      className="w-full text-sm text-[#cddbf2]"
                    />
                    {editingLessonId && lessonForm.videoUrl && (
                      <p className="text-xs text-[#cddbf2]/50 mt-2 break-all">
                        Video actual: {lessonForm.videoUrl}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-bold text-sm"
                >
                  {loading ? "Guardando..." : "Guardar Lección"}
                </button>
                {editingLessonId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLessonId(null);
                      setLessonForm({ title: "", description: "", order: "0", duration: "", isVideoUploaded: false, videoUrl: "", videoFile: null });
                    }}
                    className="px-4 py-2 bg-transparent text-[#cddbf2]/70 border border-[#cddbf2]/20 rounded-xl hover:bg-white/5 transition-all text-sm"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de Lecciones */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#cddbf2] mb-4">Lecciones Creadas</h2>
            {initialData?.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any) => (
              <div key={lesson._id} className="bg-black/40 border border-[#cddbf2]/10 p-4 rounded-xl flex justify-between items-center group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#cddbf2]/20 text-[#cddbf2] text-xs px-2 py-0.5 rounded font-bold">
                      #{lesson.order}
                    </span>
                    <h3 className="font-bold text-[#cddbf2]">{lesson.title}</h3>
                  </div>
                  <p className="text-[#cddbf2]/60 text-xs line-clamp-1">{lesson.description}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editLesson(lesson)} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteLesson(lesson._id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                    Borrar
                  </button>
                </div>
              </div>
            ))}
            {(!initialData?.lessons || initialData.lessons.length === 0) && (
              <div className="text-center p-6 border border-dashed border-[#cddbf2]/20 rounded-xl text-[#cddbf2]/50 text-sm">
                No hay lecciones agregadas.
              </div>
            )}
          </div>
        </div>
      )}
      
      <ModalAlert 
        isOpen={modal.isOpen} 
        message={modal.message} 
        type={modal.type} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
      />
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "./BlogEditor";
import { saveBlogPost } from "@/app/actions/blog";
import Image from "next/image";

interface BlogFormProps {
  initialData?: any;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [content, setContent] = useState(initialData?.content || "");
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.mainImage || null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    // Validación de tamaño para evitar error de 1MB en Server Actions
    if (content.length > 800000) { // ~800KB para dejar margen
      setMessage({ type: "error", text: "El contenido es demasiado largo. Por favor, reduce el texto o elimina imágenes pegadas." });
      return;
    }

    formData.append("content", content);
    if (initialData?._id) formData.append("id", initialData._id);

    startTransition(async () => {
      const result = await saveBlogPost(formData);
      if (result.success) {
        setMessage({ type: "success", text: result.success });
        setTimeout(() => router.push("/admin/blogs"), 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Error desconocido" });
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-black/40 p-8 rounded-3xl border border-[#cddbf2]/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Título del Post</label>
            <input
              name="title"
              type="text"
              defaultValue={initialData?.title}
              required
              className="w-full bg-black/50 border border-[#cddbf2]/20 rounded-xl px-4 py-3 text-lg font-bold focus:border-[#cddbf2] transition-all outline-none"
              placeholder="Ej: Guía de preparación de café..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Descripción Corta</label>
            <textarea
              name="shortDescription"
              defaultValue={initialData?.shortDescription}
              rows={3}
              className="w-full bg-black/50 border border-[#cddbf2]/20 rounded-xl px-4 py-3 focus:border-[#cddbf2] transition-all outline-none resize-none"
              placeholder="Un resumen breve para las tarjetas del blog..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Imagen Principal</label>
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-[#cddbf2]/20 hover:border-[#cddbf2]/40 transition-colors group cursor-pointer bg-black/20">
              {previewImage ? (
                <Image src={previewImage} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-50">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Subir Imagen</span>
                </div>
              )}
              <input
                name="mainImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#cddbf2]/5 p-4 rounded-xl border border-[#cddbf2]/10">
            <div className="flex-1">
              <div className="font-bold text-sm">Estado</div>
              <div className="text-xs opacity-60">¿Publicar ahora?</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                name="isPublished" 
                type="checkbox" 
                defaultChecked={initialData?.isPublished ?? true} 
                className="sr-only peer"
                value="true"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cddbf2]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Contenido del Post</label>
        <BlogEditor initialContent={content} onChange={setContent} />
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-center font-bold animate-pulse ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-10 py-3 rounded-xl bg-[#cddbf2] text-[#38050e] font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar Post"}
        </button>
      </div>
    </form>
  );
}

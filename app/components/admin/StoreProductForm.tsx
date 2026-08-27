"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import StoreProductEditor from "./StoreProductEditor";
import { saveStoreProduct } from "@/app/actions/storeProduct";
import Image from "next/image";

interface StoreProductFormProps {
  initialData?: any;
}

export default function StoreProductForm({ initialData }: StoreProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [content, setContent] = useState(initialData?.description || "");
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    // Limit length to avoid payload errors (leave ~200KB safety margin)
    if (content.length > 800000) {
      setMessage({
        type: "error",
        text: "El contenido es demasiado largo. Por favor, reduce el texto o elimina imágenes incrustadas muy pesadas.",
      });
      return;
    }

    formData.append("description", content);
    if (initialData?._id) {
      formData.append("id", initialData._id);
    }
    
    const isActive = formData.get("isActive") === "true";
    formData.set("isActive", isActive ? "true" : "false");

    startTransition(async () => {
      const result = await saveStoreProduct(formData);
      if (result.success) {
        setMessage({ type: "success", text: result.success });
        setTimeout(() => router.push("/admin/productos"), 1500);
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Nombre del Producto</label>
              <input
                name="name"
                type="text"
                defaultValue={initialData?.name}
                required
                className="w-full bg-black/50 border border-[#cddbf2]/20 rounded-xl px-4 py-3 text-lg font-bold focus:border-[#cddbf2] transition-all outline-none text-white"
                placeholder="Ej: Camiseta oficial Coffee Geeks..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Precio (USD)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.price ?? 0}
                required
                className="w-full bg-black/50 border border-[#cddbf2]/20 rounded-xl px-4 py-3 text-lg font-bold focus:border-[#cddbf2] transition-all outline-none text-white"
                placeholder="Ej: 15.50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Descripción Corta</label>
            <textarea
              name="shortDescription"
              defaultValue={initialData?.shortDescription}
              rows={3}
              className="w-full bg-black/50 border border-[#cddbf2]/20 rounded-xl px-4 py-3 focus:border-[#cddbf2] transition-all outline-none resize-none text-white"
              placeholder="Un resumen rápido para el catálogo..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Webhook de Redirección (Opcional)</label>
            <input
              name="webhook"
              type="url"
              defaultValue={initialData?.webhook}
              className="w-full bg-black/50 border border-[#cddbf2]/20 rounded-xl px-4 py-3 focus:border-[#cddbf2] transition-all outline-none text-white"
              placeholder="https://tudominio.com/webhook-compra"
            />
            <p className="text-xs text-[#cddbf2]/40">URL a la que se redireccionará al usuario después de completar el pago simulado.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Imagen Principal (Portada)</label>
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-[#cddbf2]/20 hover:border-[#cddbf2]/40 transition-colors group cursor-pointer bg-black/20">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-50 text-[#cddbf2]">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Subir Portada</span>
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

          <div className="flex items-center gap-4 bg-[#cddbf2]/5 p-4 rounded-xl border border-[#cddbf2]/10 text-white">
            <div className="flex-1">
              <div className="font-bold text-sm">Estado</div>
              <div className="text-xs opacity-60">¿Producto activo en catálogo?</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                name="isActive" 
                type="checkbox" 
                defaultChecked={initialData?.isActive ?? true} 
                className="sr-only peer"
                value="true"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cddbf2]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-wider text-[#cddbf2]/60">Descripción Completa (HTML)</label>
        <StoreProductEditor initialContent={content} onChange={setContent} />
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
          className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors text-white"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-10 py-3 rounded-xl bg-[#cddbf2] text-[#38050e] font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}

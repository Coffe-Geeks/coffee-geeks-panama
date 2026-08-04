"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAlly, updateAlly, deleteAlly } from "@/app/actions/ally";

const inputCls =
  "w-full bg-white/5 border border-[#cddbf2]/20 rounded-xl px-4 py-2.5 text-[#cddbf2] placeholder-[#cddbf2]/30 outline-none focus:border-[#cddbf2]/60 transition-colors";
const labelCls = "block text-sm font-medium text-[#cddbf2]/80 mb-1.5";

export default function AlliesAdminClient({ allies }: { allies: any[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (editing?._id) await updateAlly(editing._id, formData);
      else await createAlly(formData);
      setEditing(null);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || "No se pudo guardar el aliado");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a ${name}?`)) return;
    try {
      await deleteAlly(id);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || "No se pudo eliminar");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#cddbf2]">Aliados</h1>
          <p className="text-[#cddbf2]/70 mt-1">
            Logos del carrusel que aparece en la portada, debajo del mapa.
          </p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="px-4 py-2 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-medium"
        >
          + Nuevo Aliado
        </button>
      </div>

      <div className="bg-[#cddbf2]/5 border border-[#cddbf2]/15 rounded-2xl p-5">
        <p className="text-[#cddbf2]/70 text-sm leading-relaxed">
          <strong className="text-[#cddbf2]">Para que se vean parejos:</strong> sube los
          logos en PNG o WebP <strong className="text-[#cddbf2]">con fondo transparente</strong> y
          sin márgenes de sobra alrededor. En la portada se muestran en escala de grises
          y toman color al pasar el mouse, así conviven logos de marcas muy distintas.
          Si un logo es blanco o muy claro, marca la casilla correspondiente o
          desaparecerá sobre el fondo de la sección.
        </p>
      </div>

      {allies.length === 0 && (
        <div className="bg-white/5 border border-[#cddbf2]/10 rounded-2xl p-10 text-center">
          <p className="text-[#cddbf2]/60">Todavía no hay aliados cargados.</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {allies.map((ally: any) => (
          <div
            key={ally._id}
            className="bg-white/5 border border-[#cddbf2]/10 rounded-2xl overflow-hidden hover:border-[#cddbf2]/30 transition-all"
          >
            {/* Fondo claro: así se ve el logo tal como saldrá en la portada */}
            <div className="h-28 bg-white flex items-center justify-center p-4 relative">
              {ally.logo ? (
                <img
                  src={ally.logo}
                  alt={ally.name}
                  className="max-w-full max-h-full object-contain"
                  style={ally.isLightLogo ? { filter: "invert(1)" } : undefined}
                />
              ) : (
                <span className="text-gray-400 text-sm">Sin logo</span>
              )}
              {!ally.isActive && (
                <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Oculto
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#cddbf2] truncate">{ally.name}</h3>
              <p className="text-[#cddbf2]/50 text-xs mb-3 truncate">
                Orden {ally.order}
                {ally.isLightLogo ? " · logo claro" : ""}
                {ally.url ? " · con enlace" : ""}
              </p>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => setEditing(ally)}
                  className="text-[#cddbf2]/80 hover:text-white transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(ally._id, ally.name)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-[#22191A] border border-white/10 rounded-2xl max-w-lg w-full p-6 my-8 space-y-5"
          >
            <h3 className="text-2xl font-bold text-[#cddbf2]">
              {editing._id ? "Editar aliado" : "Nuevo aliado"}
            </h3>

            <div>
              <label className={labelCls}>Nombre *</label>
              <input name="name" required defaultValue={editing.name || ""} className={inputCls} placeholder="Copa Airlines" />
            </div>

            <div>
              <label className={labelCls}>
                Logo {editing._id ? <span className="opacity-50">(dejar vacío conserva el actual)</span> : "*"}
              </label>
              {editing.logo && (
                <div className="bg-white rounded-xl p-3 mb-2 h-24 flex items-center justify-center">
                  <img
                    src={editing.logo}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    style={editing.isLightLogo ? { filter: "invert(1)" } : undefined}
                  />
                </div>
              )}
              <input name="logo" type="file" accept="image/*" required={!editing._id} className={inputCls} />
              <p className="text-[#cddbf2]/45 text-xs mt-1.5">
                PNG o WebP con fondo transparente, sin márgenes de sobra.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Sitio web <span className="opacity-50">(opcional)</span></label>
                <input name="url" defaultValue={editing.url || ""} className={inputCls} placeholder="https://" />
              </div>
              <div>
                <label className={labelCls}>Orden</label>
                <input name="order" type="number" defaultValue={editing.order ?? 0} className={inputCls} />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isLightLogo"
                value="true"
                defaultChecked={!!editing.isLightLogo}
                className="w-4 h-4 accent-[#cddbf2] mt-0.5"
              />
              <span className="text-[#cddbf2]/80 text-sm">
                El logo es blanco o muy claro
                <span className="block text-[#cddbf2]/45 text-xs mt-0.5">
                  Se invierte al mostrarlo; sin esto desaparece sobre el fondo claro de la sección.
                </span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={editing._id ? editing.isActive : true}
                className="w-4 h-4 accent-[#cddbf2]"
              />
              <span className="text-[#cddbf2]/80 text-sm">Visible en la portada</span>
            </label>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-transparent text-[#cddbf2]/70 border border-[#cddbf2]/20 rounded-xl hover:bg-white/5 transition-colors font-bold text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-bold text-sm disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

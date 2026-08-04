"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createFinca,
  updateFinca,
  addOrUpdateExperience,
  deleteExperience,
} from "@/app/actions/finca";
import { FINCA_REGIONS, PROCESS_TYPES } from "@/lib/finca-constants";

const inputCls =
  "w-full bg-white/5 border border-[#cddbf2]/20 rounded-xl px-4 py-2.5 text-[#cddbf2] placeholder-[#cddbf2]/30 outline-none focus:border-[#cddbf2]/60 transition-colors";
const labelCls = "block text-sm font-medium text-[#cddbf2]/80 mb-1.5";
const cardCls = "bg-white/5 border border-[#cddbf2]/10 rounded-2xl p-6";

export default function FincaFormClient({ finca }: { finca: any }) {
  const router = useRouter();
  const isNew = !finca;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expEditing, setExpEditing] = useState<any | null>(null);
  const [expSaving, setExpSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    try {
      if (isNew) {
        const created: any = await createFinca(formData);
        router.push(`/admin/fincas/finca-form/${created._id}`);
      } else {
        await updateFinca(finca._id, formData);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "No se pudo guardar la finca");
    } finally {
      setSaving(false);
    }
  };

  const handleExpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExpSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addOrUpdateExperience(
        finca._id,
        formData,
        expEditing?._id || undefined
      );
      setExpEditing(null);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || "No se pudo guardar la experiencia");
    } finally {
      setExpSaving(false);
    }
  };

  const handleExpDelete = async (expId: string) => {
    if (!confirm("¿Eliminar esta experiencia?")) return;
    try {
      await deleteExperience(finca._id, expId);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || "No se pudo eliminar");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#cddbf2]">
            {isNew ? "Nueva Finca" : finca.name}
          </h1>
          <p className="text-[#cddbf2]/70 mt-1">
            {isNew
              ? "Crea la finca y luego podrás agregarle experiencias."
              : "Edita los datos de la finca y sus experiencias."}
          </p>
        </div>
        <Link
          href="/admin/fincas"
          className="px-4 py-2 bg-[#cddbf2]/10 border border-[#cddbf2]/20 text-[#cddbf2] rounded-xl hover:bg-[#cddbf2]/20 transition-all font-medium"
        >
          ← Volver
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ── Datos de la finca ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cardCls}>
          <h2 className="text-xl font-bold text-[#cddbf2] mb-5">Identificación</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nombre de la finca *</label>
              <input name="name" required defaultValue={finca?.name || ""} className={inputCls} placeholder="Finca La Neblina" />
            </div>
            <div>
              <label className={labelCls}>Productor o familia</label>
              <input name="producer" defaultValue={finca?.producer || ""} className={inputCls} placeholder="Familia Him" />
            </div>
            <div>
              <label className={labelCls}>Región</label>
              <select name="region" defaultValue={finca?.region || "Boquete"} className={inputCls}>
                {FINCA_REGIONS.map((r) => (
                  <option key={r} value={r} className="bg-[#22191A]">{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Ubicación específica</label>
              <input name="location" defaultValue={finca?.location || ""} className={inputCls} placeholder="Alto Quiel, Boquete" />
            </div>
            <div>
              <label className={labelCls}>Altitud (msnm)</label>
              <input name="altitude" type="number" min="0" defaultValue={finca?.altitude || ""} className={inputCls} placeholder="1650" />
            </div>
            <div>
              <label className={labelCls}>Orden de aparición</label>
              <input name="order" type="number" defaultValue={finca?.order ?? 0} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Variedades <span className="opacity-50">(separadas por coma)</span></label>
              <input name="varieties" defaultValue={(finca?.varieties || []).join(", ")} className={inputCls} placeholder="Geisha, Caturra, Typica" />
            </div>
            <div>
              <label className={labelCls}>Procesos <span className="opacity-50">(separados por coma)</span></label>
              <input name="processes" defaultValue={(finca?.processes || []).join(", ")} className={inputCls} placeholder={PROCESS_TYPES.join(", ")} />
            </div>
          </div>
        </div>

        <div className={cardCls}>
          <h2 className="text-xl font-bold text-[#cddbf2] mb-5">El relato</h2>
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Descripción corta <span className="opacity-50">(se ve en la tarjeta del listado)</span></label>
              <input name="shortDescription" defaultValue={finca?.shortDescription || ""} className={inputCls} placeholder="Geisha de altura en las laderas del Barú." />
            </div>
            <div>
              <label className={labelCls}>Quiénes están detrás <span className="opacity-50">(historia del productor)</span></label>
              <textarea name="story" rows={4} defaultValue={finca?.story || ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Terroir <span className="opacity-50">(suelo, clima, altura, sombra)</span></label>
              <textarea name="terroir" rows={4} defaultValue={finca?.terroir || ""} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Su café <span className="opacity-50">(notas de taza y perfil)</span></label>
              <textarea name="coffeeProfile" rows={4} defaultValue={finca?.coffeeProfile || ""} className={inputCls} />
            </div>
          </div>
        </div>

        <div className={cardCls}>
          <h2 className="text-xl font-bold text-[#cddbf2] mb-5">Imagen y contacto</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Foto de portada</label>
              {finca?.coverImage && (
                <img src={finca.coverImage} alt="" className="w-40 h-28 object-cover rounded-xl mb-2 border border-[#cddbf2]/20" />
              )}
              <input name="coverImage" type="file" accept="image/*" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Sitio web</label>
              <input name="website" defaultValue={finca?.website || ""} className={inputCls} placeholder="https://" />
            </div>
            <div>
              <label className={labelCls}>Instagram</label>
              <input name="instagram" defaultValue={finca?.instagram || ""} className={inputCls} placeholder="https://instagram.com/" />
            </div>
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input name="whatsapp" defaultValue={finca?.whatsapp || ""} className={inputCls} placeholder="+507 6000 0000" />
            </div>
            <div>
              <label className={labelCls}>Correo</label>
              <input name="email" type="email" defaultValue={finca?.email || ""} className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-3 mt-5 cursor-pointer">
            <input type="checkbox" name="isActive" value="true" defaultChecked={finca ? finca.isActive : true} className="w-4 h-4 accent-[#cddbf2]" />
            <span className="text-[#cddbf2]/80 text-sm">Publicada en el sitio</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-bold disabled:opacity-50"
        >
          {saving ? "Guardando..." : isNew ? "Crear finca" : "Guardar cambios"}
        </button>
      </form>

      {/* ── Experiencias ── */}
      {!isNew && (
        <div className={cardCls}>
          <div className="flex justify-between items-center mb-5 gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[#cddbf2]">Experiencias</h2>
              <p className="text-[#cddbf2]/60 text-sm mt-1">
                Aparecen en la ficha de la finca y en &ldquo;Del Origen a la Barra&rdquo;.
              </p>
            </div>
            <button
              onClick={() => setExpEditing({})}
              className="px-4 py-2 bg-[#cddbf2]/10 border border-[#cddbf2]/20 text-[#cddbf2] rounded-xl hover:bg-[#cddbf2]/20 transition-all font-medium"
            >
              + Nueva experiencia
            </button>
          </div>

          <div className="space-y-3">
            {(finca.experiences || []).map((exp: any) => (
              <div key={exp._id} className="flex items-center gap-4 bg-white/5 border border-[#cddbf2]/10 rounded-xl p-4">
                {exp.image ? (
                  <img src={exp.image} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-[#cddbf2]/10 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#cddbf2] truncate">{exp.title}</div>
                  <div className="text-[#cddbf2]/60 text-sm">
                    {exp.duration || "sin duración"} · {exp.price > 0 ? `$${exp.price}` : "sin precio"}
                    {!exp.isActive && <span className="text-red-400"> · oculta</span>}
                  </div>
                </div>
                <div className="flex gap-3 text-sm flex-shrink-0">
                  <button onClick={() => setExpEditing(exp)} className="text-[#cddbf2]/80 hover:text-white transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleExpDelete(exp._id)} className="text-red-400 hover:text-red-300 transition-colors">
                    Borrar
                  </button>
                </div>
              </div>
            ))}
            {(finca.experiences || []).length === 0 && (
              <p className="text-[#cddbf2]/50 text-sm py-4">Esta finca aún no tiene experiencias.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Modal de experiencia ── */}
      {expEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleExpSubmit}
            className="bg-[#22191A] border border-white/10 rounded-2xl max-w-2xl w-full p-6 my-8 space-y-5"
          >
            <h3 className="text-2xl font-bold text-[#cddbf2]">
              {expEditing._id ? "Editar experiencia" : "Nueva experiencia"}
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>Título *</label>
                <input name="title" required defaultValue={expEditing.title || ""} className={inputCls} placeholder="Del cafetal a la taza" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Resumen <span className="opacity-50">(se ve en la tarjeta)</span></label>
                <textarea name="summary" rows={2} defaultValue={expEditing.summary || ""} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Duración</label>
                <input name="duration" defaultValue={expEditing.duration || ""} className={inputCls} placeholder="4 horas" />
              </div>
              <div>
                <label className={labelCls}>Cupo por tanda</label>
                <input name="capacity" type="number" min="0" defaultValue={expEditing.capacity ?? 0} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Precio por persona</label>
                <input name="price" type="number" min="0" step="0.01" defaultValue={expEditing.price ?? 0} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Moneda</label>
                <input name="currency" defaultValue={expEditing.currency || "USD"} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Incluye <span className="opacity-50">(separado por coma)</span></label>
                <input name="includes" defaultValue={(expEditing.includes || []).join(", ")} className={inputCls} placeholder="Transporte, Cata guiada, Almuerzo" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Idiomas <span className="opacity-50">(separado por coma)</span></label>
                <input name="languages" defaultValue={(expEditing.languages || ["Español"]).join(", ")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Orden</label>
                <input name="order" type="number" defaultValue={expEditing.order ?? 0} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Foto</label>
                {expEditing.image && (
                  <img src={expEditing.image} alt="" className="w-32 h-20 object-cover rounded-lg mb-2 border border-[#cddbf2]/20" />
                )}
                <input name="image" type="file" accept="image/*" className={inputCls} />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isActive" value="true" defaultChecked={expEditing._id ? expEditing.isActive : true} className="w-4 h-4 accent-[#cddbf2]" />
              <span className="text-[#cddbf2]/80 text-sm">Visible en el sitio</span>
            </label>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setExpEditing(null)}
                className="px-4 py-2 bg-transparent text-[#cddbf2]/70 border border-[#cddbf2]/20 rounded-xl hover:bg-white/5 transition-colors font-bold text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={expSaving}
                className="px-5 py-2 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-bold text-sm disabled:opacity-50"
              >
                {expSaving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

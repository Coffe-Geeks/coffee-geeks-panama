"use client";

import { useActionState, useEffect, useState } from "react";
import { updateSiteConfig } from "@/app/actions/siteConfig";

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/30 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-all text-sm";
const labelCls = "text-[#cddbf2] text-xs font-semibold uppercase tracking-widest pl-1";
const sectionCls =
  "p-6 rounded-2xl bg-[#38050e] border border-[#cddbf2]/10 shadow-lg space-y-4";

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <h2 className="flex items-center gap-2 text-[#cddbf2] font-bold text-sm uppercase tracking-widest mb-2">
      <span>{icon}</span> {label}
    </h2>
  );
}

export default function SettingsForm({ config }: { config: any }) {
  const [state, formAction, pending] = useActionState(updateSiteConfig, null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg(state.success);
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
    if (state?.error) {
      setErrorMsg(state.error);
      setSuccessMsg("");
      setTimeout(() => setErrorMsg(""), 5000);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Flash messages */}
      <div className="lg:col-span-2 space-y-4">
        {successMsg && (
          <div className="p-4 rounded-xl bg-green-900/30 border border-green-700/50 text-green-300 text-sm font-medium text-center">
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm font-medium text-center">
            ✗ {errorMsg}
          </div>
        )}
      </div>

      {/* ── SEO ── */}
      <div className={sectionCls}>
        <SectionTitle icon="🔍" label="SEO & Open Graph" />

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="seoTitle">Título del sitio</label>
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            defaultValue={config.seoTitle}
            placeholder="Coffee Geeks Panamá | ..."
            className={inputCls}
          />
          <p className="text-[#cddbf2]/30 text-xs pl-1">Aparece en la pestaña del navegador y resultados de búsqueda.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="seoDescription">Descripción SEO</label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={3}
            defaultValue={config.seoDescription}
            placeholder="Descripción corta del sitio para buscadores y redes sociales..."
            className={`${inputCls} resize-y`}
          />
          <p className="text-[#cddbf2]/30 text-xs pl-1">
            Se usa en <code className="text-[#cddbf2]/60">&lt;meta name="description"&gt;</code> y en la etiqueta OG de descripción.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="ogImage">URL de imagen Open Graph</label>
          <input
            id="ogImage"
            name="ogImage"
            type="text"
            defaultValue={config.ogImage}
            placeholder="https://tusitio.com/og-image.jpg  (o ruta relativa /og.jpg)"
            className={inputCls}
          />
          <p className="text-[#cddbf2]/30 text-xs pl-1">
            Imagen que aparece cuando se comparte el sitio en redes sociales. Recomendado: 1200×630 px.
          </p>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className={`${sectionCls} lg:col-span-2`}>
        <SectionTitle icon="✨" label="Sección Hero" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="heroEyebrow">Texto superior (Eyebrow)</label>
            <input
              id="heroEyebrow"
              name="heroEyebrow"
              type="text"
              defaultValue={config.heroEyebrow}
              placeholder="Coffee Geeks Panamá"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="heroTitle1">Título Línea 1</label>
            <input
              id="heroTitle1"
              name="heroTitle1"
              type="text"
              defaultValue={config.heroTitle1}
              placeholder="El Camino"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="heroTitle2">Título Línea 2 (Gradiente)</label>
            <input
              id="heroTitle2"
              name="heroTitle2"
              type="text"
              defaultValue={config.heroTitle2}
              placeholder="a la Gran Taza"
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="heroDescription">Descripción del Hero</label>
          <textarea
            id="heroDescription"
            name="heroDescription"
            rows={4}
            defaultValue={config.heroDescription}
            placeholder="Los mejores baristas, coffee shops..."
            className={`${inputCls} resize-y`}
          />
          <p className="text-[#cddbf2]/30 text-xs pl-1">Se respetarán los saltos de línea al mostrarse en la web.</p>
        </div>
      </div>

      {/* ── Contacto ── */}
      <div className={sectionCls}>
        <SectionTitle icon="📬" label="Datos de Contacto" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="contactEmail">Email de contacto</label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={config.contactEmail}
              placeholder="contacto@coffeegeeks.pa"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="contactPhone">Teléfono Principal</label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="text"
              defaultValue={config.contactPhone}
              placeholder="+507 6000-0000"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="contactWhatsApp">WhatsApp</label>
            <input
              id="contactWhatsApp"
              name="contactWhatsApp"
              type="text"
              defaultValue={config.contactWhatsApp}
              placeholder="6557-5776"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="contactPhone2">Teléfonos Secundarios</label>
            <input
              id="contactPhone2"
              name="contactPhone2"
              type="text"
              defaultValue={config.contactPhone2}
              placeholder="308-3093 / 403-4390"
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="address">Dirección (Footer)</label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={config.address}
            placeholder="Chiriquí, David · Panamá"
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Redes Sociales ── */}
      <div className={sectionCls}>
        <SectionTitle icon="📱" label="Redes Sociales" />
        <p className="text-[#cddbf2]/30 text-xs -mt-2 mb-2">Si el campo está vacío, el ícono no aparecerá en el footer.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="facebook">URL Facebook</label>
            <input
              id="facebook"
              name="facebook"
              type="text"
              defaultValue={config.facebook}
              placeholder="https://facebook.com/..."
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="instagram">URL Instagram</label>
            <input
              id="instagram"
              name="instagram"
              type="text"
              defaultValue={config.instagram}
              placeholder="https://instagram.com/..."
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="twitter">URL Twitter / X</label>
            <input
              id="twitter"
              name="twitter"
              type="text"
              defaultValue={config.twitter}
              placeholder="https://twitter.com/..."
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="youtube">URL YouTube</label>
            <input
              id="youtube"
              name="youtube"
              type="text"
              defaultValue={config.youtube}
              placeholder="https://youtube.com/..."
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* ── Guías y Legal ── */}
      <div className={`${sectionCls} lg:col-span-2`}>
        <SectionTitle icon="📜" label="Guías y Legal" />
        <p className="text-[#cddbf2]/40 text-xs -mt-2 mb-4">
          El contenido se mostrará con el formato de texto plano (respetando saltos de línea) en sus respectivas páginas.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="guiaParticipante">Guía del Participante</label>
            <textarea
              id="guiaParticipante"
              name="guiaParticipante"
              rows={12}
              defaultValue={config.guiaParticipante}
              placeholder="Instrucciones para cafeterías y baristas..."
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="guiaConsumidor">Guía del Consumidor</label>
            <textarea
              id="guiaConsumidor"
              name="guiaConsumidor"
              rows={12}
              defaultValue={config.guiaConsumidor}
              placeholder="Instrucciones para el público y cómo votar..."
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="privacyPolicy">Política de Privacidad</label>
            <textarea
              id="privacyPolicy"
              name="privacyPolicy"
              rows={12}
              defaultValue={config.privacyPolicy}
              placeholder="Texto de la política de privacidad..."
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="termsAndConditions">Términos del Concurso</label>
            <textarea
              id="termsAndConditions"
              name="termsAndConditions"
              rows={12}
              defaultValue={config.termsAndConditions}
              placeholder="Bases legales del evento..."
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className={labelCls} htmlFor="purchasePolicy">Política de Compras</label>
            <textarea
              id="purchasePolicy"
              name="purchasePolicy"
              rows={8}
              defaultValue={config.purchasePolicy}
              placeholder="Políticas de envío, devolución y compras de la tienda..."
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className={labelCls} htmlFor="cancellationPolicy">Política de Cancelaciones, Devoluciones y Reembolsos</label>
            <textarea
              id="cancellationPolicy"
              name="cancellationPolicy"
              rows={8}
              defaultValue={config.cancellationPolicy}
              placeholder="Políticas de cancelación, devoluciones y reembolsos de la tienda..."
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className={labelCls} htmlFor="dataProtection">Ley 81 · Datos Personales</label>
            <textarea
              id="dataProtection"
              name="dataProtection"
              rows={8}
              defaultValue={config.dataProtection}
              placeholder="Información sobre la protección de datos personales..."
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
            />
          </div>
        </div>
      </div>

      {/* ── Cafeterías ── */}
      <div className={`${sectionCls} lg:col-span-2`}>
        <SectionTitle icon="☕" label="Configuración de Cafeterías" />

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="maxGalleryImages">Límite de Imágenes en Galería</label>
          <input
            id="maxGalleryImages"
            name="maxGalleryImages"
            type="number"
            min="1"
            max="20"
            defaultValue={config.maxGalleryImages ?? 3}
            className={inputCls}
          />
          <p className="text-[#cddbf2]/30 text-xs pl-1">Número máximo de imágenes que una cafetería puede subir a su galería (por defecto 3).</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="votingEndDate">Fecha de Cierre de Votaciones</label>
          <input
            id="votingEndDate"
            name="votingEndDate"
            type="date"
            defaultValue={config.votingEndDate}
            className={inputCls}
          />
          <p className="text-[#cddbf2]/30 text-xs pl-1">Se muestra en la portada y en la sección de protagonistas, con el formato de cada lugar.</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full py-4 rounded-2xl bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] font-bold text-base tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:-translate-y-0.5"
        >
          {pending ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  checked: boolean;
  onChange: (val: boolean) => void;
  accentColor?: "white" | "amber" | "#cddbf2" | "#38050e"; // blanco, ámbar, celeste, o color de voto
  textColor?: string;
}

export default function PrivacyCheckbox({
  checked,
  onChange,
  accentColor = "white",
  textColor,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [policy, setPolicy] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Carga la política solo cuando se abre el modal (lazy)
  async function openModal(e: React.MouseEvent) {
    e.preventDefault();
    setModalOpen(true);
    if (policy) return; // ya cargada

    setLoading(true);
    try {
      const res = await fetch("/api/privacy-policy");
      const data = await res.json();
      setPolicy(data.privacyPolicy || "La política de privacidad no ha sido configurada aún.");
    } catch {
      setPolicy("No se pudo cargar la política de privacidad.");
    } finally {
      setLoading(false);
    }
  }

  // Cerrar con click en overlay o Escape
  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const linkCls =
    accentColor === "amber"
      ? "text-amber-400 underline underline-offset-2 hover:text-amber-300 font-semibold"
      : accentColor === "#cddbf2"
      ? "text-[#cddbf2] underline underline-offset-2 hover:text-[#cddbf2]/80 font-semibold"
      : accentColor === "#38050e"
      ? "text-[#38050e] underline underline-offset-2 hover:text-[#38050e]/80 font-semibold"
      : "text-white underline underline-offset-2 hover:text-white/80 font-semibold";

  const checkboxRing =
    accentColor === "amber" ? "focus:ring-amber-500" : accentColor === "#cddbf2" ? "focus:ring-[#cddbf2]/50" : accentColor === "#38050e" ? "focus:ring-[#38050e]/50" : "focus:ring-white/50";

  return (
    <>
      {/* Checkbox + texto */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border border-current bg-black/5 accent-current focus:outline-none focus:ring-2 ${checkboxRing} cursor-pointer transition-all`}
          style={{ color: textColor || 'inherit' }}
        />
        <span className="text-xs leading-snug" style={{ color: textColor || 'rgba(205, 219, 242, 0.7)' }}>
          He leído y acepto la{" "}
          <button
            type="button"
            onClick={openModal}
            className={linkCls}
          >
            Política de Privacidad
          </button>{" "}
          <strong style={{ color: textColor || '#cddbf2' }}>Panama International Firm By YelCaballero</strong>{" "}
          y autorizo el tratamiento de mis datos personales conforme a la normativa vigente.
        </span>
      </label>

      {/* Modal */}
      {modalOpen && (
        <div
          ref={overlayRef}
          onClick={(e) => { if (e.target === overlayRef.current) setModalOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl bg-[#38050e] border border-white/15 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <h2 className="text-white font-bold text-base tracking-wide">
                🔒 Política de Privacidad
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/50 hover:text-white transition-colors text-xl leading-none font-light"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-white/40 text-xs mb-4">
                Panama International Firm By YelCaballero — Coffee Geeks Panamá
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {policy}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

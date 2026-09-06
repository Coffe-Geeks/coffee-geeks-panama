"use client";

import { useState, useTransition } from "react";
import { reintentarActivacionPasaporte } from "@/app/actions/pedidos";

/**
 * Estado de la activación del pasaporte, con reintento.
 *
 * Solo aparece en los pedidos que lo incluyen. Una activación fallida se
 * muestra en rojo y con el motivo a la vista: es dinero ya cobrado con el
 * servicio sin entregar, y no debe pasar desapercibida en la lista.
 */
export default function ActivacionPasaporte({
  id,
  activacion,
}: {
  id: string;
  activacion?: {
    intentada?: boolean;
    ok?: boolean;
    cuentaYaExistia?: boolean;
    error?: string;
  };
}) {
  const [pendiente, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(activacion?.error || "");
  const [ok, setOk] = useState(Boolean(activacion?.ok));

  function reintentar() {
    setMensaje("");
    setError("");
    startTransition(async () => {
      const r = await reintentarActivacionPasaporte(id);
      if (r.error) setError(r.error);
      else {
        setOk(true);
        setMensaje(r.success || "Pasaporte activado.");
      }
    });
  }

  if (ok) {
    return (
      <div className="mt-3 text-xs text-emerald-300/80 flex items-center gap-2">
        <span>🎫</span>
        <span>
          Pasaporte activado
          {activacion?.cuentaYaExistia ? " (la cuenta ya existía)" : ""}
          {mensaje ? ` · ${mensaje}` : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-3 flex-wrap bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
      <span className="text-xs text-red-300">
        🎫 Pasaporte sin activar
        {error ? ` — ${error}` : activacion?.intentada ? "" : " (no se ha intentado)"}
      </span>
      <button
        type="button"
        onClick={reintentar}
        disabled={pendiente}
        className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-[#cddbf2]/15 hover:bg-[#cddbf2]/25 text-[#cddbf2] transition-colors disabled:opacity-50"
      >
        {pendiente ? "Activando…" : "Reintentar"}
      </button>
    </div>
  );
}

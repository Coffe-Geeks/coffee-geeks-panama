"use client";

import { useState, useTransition } from "react";
import { actualizarEstadoPedido } from "@/app/actions/pedidos";

/**
 * Cambio de estado del pedido. Sirve para el seguimiento manual del
 * despacho: la pasarela mueve el pedido a pagado o rechazado por su cuenta,
 * pero enviado y entregado los marca el equipo.
 */
export default function SelectorEstado({
  id,
  estado,
  estados,
}: {
  id: string;
  estado: string;
  estados: string[];
}) {
  const [valor, setValor] = useState(estado);
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState("");

  function cambiar(nuevo: string) {
    const anterior = valor;
    setValor(nuevo);
    setError("");

    startTransition(async () => {
      const r = await actualizarEstadoPedido(id, nuevo);
      if (r?.error) {
        setValor(anterior);
        setError(r.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={valor}
        disabled={pendiente}
        onChange={(e) => cambiar(e.target.value)}
        className="bg-black/50 border border-[#cddbf2]/20 text-[#cddbf2] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#cddbf2]/60 disabled:opacity-50"
      >
        {estados.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
}

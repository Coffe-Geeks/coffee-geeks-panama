"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { simularPago } from "@/app/actions/pago-prueba";

/**
 * Panel de simulación del entorno de pruebas. Se muestra en amarillo y con
 * la advertencia visible para que nadie lo confunda con un cobro real.
 */
export default function PanelPrueba({ orderNumber }: { orderNumber: string }) {
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function correr(aprobar: boolean) {
    setError("");
    setProcesando(true);
    const r = await simularPago(orderNumber, aprobar);
    if (r.error) {
      setError(r.error);
      setProcesando(false);
      return;
    }
    router.push(`/tienda/pedido/${orderNumber}`);
  }

  return (
    <>
      <style>{`
        .prueba{margin-top:22px;border:2px dashed #b8860b;background:#fdf6e3;border-radius:16px;padding:20px}
        .prueba-h{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:900;text-transform:uppercase;color:#7a5c00;margin:0 0 6px}
        .prueba-p{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.5;color:#7a5c00;margin:0 0 16px}
        .prueba-btns{display:flex;gap:12px;flex-wrap:wrap}
        .prueba-btn{height:44px;padding:0 22px;border-radius:50px;border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-size:14px;font-weight:700;transition:opacity .15s}
        .prueba-btn:disabled{opacity:.5;cursor:not-allowed}
        .prueba-ok{background:#1f6b3a;color:#fff}
        .prueba-no{background:#8a1220;color:#fff}
      `}</style>

      <div className="prueba">
        <h3 className="prueba-h">Entorno de pruebas · no es un cobro real</h3>
        <p className="prueba-p">
          Simula la respuesta de la pasarela para recorrer el flujo completo mientras BAC entrega las
          páginas alojadas. Aprobar envía el correo de confirmación real al comprador.
        </p>

        {error && <div className="error">{error}</div>}

        <div className="prueba-btns">
          <button type="button" className="prueba-btn prueba-ok" disabled={procesando} onClick={() => correr(true)}>
            {procesando ? "Procesando…" : "Simular pago aprobado"}
          </button>
          <button type="button" className="prueba-btn prueba-no" disabled={procesando} onClick={() => correr(false)}>
            Simular pago rechazado
          </button>
        </div>
      </div>
    </>
  );
}

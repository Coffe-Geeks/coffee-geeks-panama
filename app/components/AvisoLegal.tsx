"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Aviso de términos y cookies para iniciar la navegación.
 *
 * No bloquea el sitio: la Ley 51 de comercio electrónico y la Ley 81 de
 * datos exigen informar y dar control, no secuestrar el contenido detrás de
 * un muro. Aparece abajo, se puede leer la página mientras tanto, y la
 * decisión se recuerda para no volver a preguntar en cada visita.
 *
 * Se guarda en localStorage y no en una cookie a propósito: preguntar por
 * cookies escribiendo una cookie antes de tener respuesta es justamente lo
 * que la norma busca evitar.
 */

const CLAVE = "cg_aviso_legal_v1";

export default function AvisoLegal() {
  const [visible, setVisible] = useState(false);
  const ruta = usePathname();

  useEffect(() => {
    // El servidor no tiene localStorage: se decide después del primer render
    try {
      if (!window.localStorage.getItem(CLAVE)) setVisible(true);
    } catch {
      // Navegación privada o almacenamiento bloqueado: no se insiste
    }
  }, []);

  function aceptar() {
    try {
      window.localStorage.setItem(CLAVE, new Date().toISOString());
    } catch {
      // Si no se puede guardar, al menos se cierra en esta sesión
    }
    setVisible(false);
  }

  if (!visible || ruta?.startsWith("/admin")) return null;

  return (
    <>
      <style>{`
        .cg-aviso{
          position:fixed; left:clamp(12px,3vw,24px); bottom:clamp(12px,3vw,24px);
          right:auto; z-index:190; max-width:430px;
          background:#38050e; color:#f4efe4; border-radius:18px;
          padding:22px 24px; box-shadow:0 12px 40px rgba(0,0,0,.35);
          font-family:'Barlow',system-ui,sans-serif;
          animation:cg-aviso-in .35s ease-out;
        }
        @keyframes cg-aviso-in{ from{opacity:0; transform:translateY(12px)} to{opacity:1; transform:none} }
        .cg-aviso h3{
          font-family:'Barlow Condensed','Barlow',sans-serif; font-size:19px; font-weight:900;
          text-transform:uppercase; margin:0 0 8px; color:#fff; letter-spacing:.01em;
        }
        .cg-aviso p{ font-size:14px; line-height:1.6; margin:0 0 16px; color:rgba(244,239,228,.85) }
        .cg-aviso a{ color:#cddbf2; text-decoration:underline; text-underline-offset:2px }
        .cg-aviso-btns{ display:flex; gap:10px; align-items:center; flex-wrap:wrap }
        .cg-aviso-ok{
          height:44px; padding:0 26px; border:none; border-radius:50px; cursor:pointer;
          background:#cddbf2; color:#38050e; font-family:inherit; font-size:15px; font-weight:700;
          transition:background .2s;
        }
        .cg-aviso-ok:hover{ background:#fff }
        .cg-aviso-ok:focus-visible{ outline:3px solid #fff; outline-offset:3px }
        @media(max-width:560px){
          .cg-aviso{ left:12px; right:12px; max-width:none; padding:20px }
          .cg-aviso-ok{ width:100% }
        }
        @media (prefers-reduced-motion: reduce){ .cg-aviso{ animation:none } }
      `}</style>

      <div className="cg-aviso" role="dialog" aria-live="polite" aria-label="Aviso de términos y cookies">
        <h3>Antes de empezar</h3>
        <p>
          Usamos cookies para que el sitio funcione, recordar tu sesión y procesar tus compras. Al
          continuar navegando aceptas nuestros{" "}
          <Link href="/terminos">Términos y Condiciones</Link>, la{" "}
          <Link href="/terminos#anexo-1">Política de Cookies</Link> y la{" "}
          <Link href="/privacidad">Política de Privacidad</Link>.
        </p>
        <div className="cg-aviso-btns">
          <button type="button" className="cg-aviso-ok" onClick={aceptar}>
            Aceptar y continuar
          </button>
        </div>
      </div>
    </>
  );
}

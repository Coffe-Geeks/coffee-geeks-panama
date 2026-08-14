"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Botón flotante para aplicar a los sellos. Aparece cuando el visitante
 * ya bajó un poco: arriba compite con el hero y no hay contexto todavía.
 */
export default function AplicaFlotante() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .aplica{
          position:fixed; right:clamp(16px,3vw,28px); bottom:clamp(16px,3vw,28px); z-index:180;
          display:inline-flex; align-items:center; gap:10px;
          height:54px; padding:0 26px; border-radius:50px;
          background:#38050e; color:#cddbf2; text-decoration:none;
          font-family:'Barlow',sans-serif; font-size:15px; font-weight:500;
          box-shadow:0 6px 20px rgba(56,5,14,.35);
          opacity:0; transform:translateY(14px); pointer-events:none;
          transition:opacity .3s ease, transform .3s ease, background .2s, color .2s;
        }
        .aplica.on{opacity:1; transform:translateY(0); pointer-events:auto}
        .aplica:hover{background:#cddbf2; color:#38050e}
        .aplica-sub{display:block; font-size:11px; letter-spacing:.1em; text-transform:uppercase; opacity:.7; line-height:1}
        .aplica-txt{display:flex; flex-direction:column; gap:3px; line-height:1}
        @media(max-width:640px){
          .aplica{height:50px; padding:0 20px; font-size:14px; left:16px; right:16px; justify-content:center}
        }
        @media (prefers-reduced-motion: reduce){
          .aplica{transition:opacity .3s ease}
          .aplica.on{transform:none}
        }
      `}</style>

      <Link href="/aplicar" className={`aplica${visible ? " on" : ""}`}>
        <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 1.8, flexShrink: 0 }}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
        <span className="aplica-txt">
          <span className="aplica-sub">Sellos de excelencia</span>
          Aplica ya
        </span>
      </Link>
    </>
  );
}

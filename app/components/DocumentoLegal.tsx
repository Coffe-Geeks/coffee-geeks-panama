"use client";

import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

/**
 * Armazón para documentos legales largos: términos, políticas y bases.
 *
 * Existe para que todos se lean igual. Antes cada página resolvía su propia
 * tipografía, y un texto de cuarenta cláusulas sin jerarquía visual no se
 * lee: se abandona. Aquí las secciones numeradas, las listas y las notas
 * tienen un tratamiento consistente.
 */
export default function DocumentoLegal({
  eyebrow,
  titulo,
  bajada,
  actualizado,
  migas,
  children,
}: {
  eyebrow: string;
  titulo: string;
  bajada?: string;
  actualizado?: string;
  migas: { label: string; href?: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@300;400;500;700&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:52px 0 46px}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(34px,5.4vw,60px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin:0;max-width:860px;text-wrap:balance}
        .ph-by{display:block;font-family:'Barlow',sans-serif;font-size:15px;font-weight:300;line-height:1.6;color:rgba(205,219,242,.82);margin-top:16px;max-width:680px;text-transform:none;letter-spacing:0}
        .ph-fecha{display:inline-block;margin-top:18px;font-family:'Barlow',sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:rgba(205,219,242,.6)}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px;flex-wrap:wrap}
        .bread-i a{color:#38050e;opacity:.7;text-decoration:none;transition:opacity .2s}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:820px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .doc{background:#f4efe4;padding:48px 0 80px}
        .hoja{background:#fff;border:1px solid #cddbf2;border-radius:20px;padding:clamp(26px,5vw,56px)}

        /* ── Tipografía del documento ── */
        .doc h2{
          font-family:'Barlow Condensed',sans-serif;font-size:clamp(21px,2.8vw,27px);
          font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.1;
          margin:44px 0 14px;padding-top:22px;border-top:2px solid #f4efe4;
        }
        .doc h2:first-child{margin-top:0;padding-top:0;border-top:none}
        .doc h3{
          font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;
          text-transform:uppercase;color:#38050e;margin:26px 0 10px;letter-spacing:.01em;
        }
        .doc p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.75;color:#38050e;opacity:.88;margin:0 0 15px}
        .doc p:last-child{margin-bottom:0}
        .doc strong{font-weight:700;opacity:1}
        .doc a{color:#38050e;text-decoration:underline;text-underline-offset:2px}

        .doc ul{list-style:none;padding:0;margin:0 0 18px}
        .doc ul li{
          position:relative;padding:7px 0 7px 26px;
          font-family:'Barlow',sans-serif;font-size:16px;line-height:1.65;color:#38050e;opacity:.88;
        }
        .doc ul li::before{content:"";position:absolute;left:6px;top:17px;width:6px;height:6px;border-radius:50%;background:#38050e;opacity:.4}

        /* Bloque de datos: identificación, contacto */
        .datos{background:#f4efe4;border-radius:14px;padding:20px 24px;margin:0 0 18px}
        .datos dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 18px}
        .datos dt{font-family:'Barlow',sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#38050e;opacity:.55;padding-top:3px;white-space:nowrap}
        .datos dd{margin:0;font-family:'Barlow',sans-serif;font-size:15px;line-height:1.5;color:#38050e}

        /* Nota destacada dentro del texto */
        .nota{background:#f4efe4;border-left:3px solid #38050e;padding:16px 20px;margin:0 0 18px}
        .nota p{font-size:15px;margin:0}

        /* Casillas de aceptación (informativas) */
        .casillas{list-style:none;padding:0;margin:0}
        .casillas li{position:relative;padding:9px 0 9px 30px;font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#38050e;opacity:.88}
        .casillas li::before{content:"";position:absolute;left:0;top:12px;width:15px;height:15px;border:2px solid #38050e;border-radius:4px;opacity:.5}

        @media(max-width:560px){
          .datos dl{grid-template-columns:1fr;gap:2px}
          .datos dt{padding-top:10px}
        }
      `}</style>

      <Navbar />

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">{eyebrow}</div>
            <h1 className="ph-h1">
              {titulo}
              {bajada && <span className="ph-by">{bajada}</span>}
            </h1>
            {actualizado && <span className="ph-fecha">Última actualización: {actualizado}</span>}
          </div>
        </div>
      </div>

      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            {migas.map((m, i) => (
              <span key={i} style={{ display: "contents" }}>
                <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                {m.href ? <Link href={m.href}>{m.label}</Link> : <span>{m.label}</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="doc">
        <div className="wrap">
          <div className="hoja">{children}</div>
        </div>
      </section>
    </>
  );
}

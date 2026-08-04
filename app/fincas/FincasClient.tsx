"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import { getSlugId } from "@/lib/utils";

// Orden de presentación de las regiones cafetaleras
const REGION_ORDER = ["Boquete", "Volcán", "Renacimiento", "Tierras Altas", "Santa Fe", "Otra"];

export default function FincasClient({ initialFincas }: { initialFincas: any[] }) {
  const [filter, setFilter] = useState("all");

  // Solo mostramos chips de las regiones que tienen fincas
  const regions = REGION_ORDER.filter((r) => initialFincas.some((f) => f.region === r));

  // Ordenadas por región y luego por nombre, para que las de una misma
  // zona queden contiguas dentro de la grilla
  const filtered = initialFincas
    .filter((f) => filter === "all" || f.region === filter)
    .sort(
      (a, b) =>
        REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
        a.name.localeCompare(b.name)
    );

  const totalExperiences = initialFincas.reduce((sum, f) => sum + f.experiences, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.18}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,#38050e 0%,rgba(56,5,14,.7) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0 44px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}
        .ph-logo{width:clamp(120px,18vw,220px);height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3));animation:float 6s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:opacity .2s;text-decoration:none}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* ── Intro: los productores ── */
        .intro{background:#fff;padding:56px 0 44px}
        .eyebrow-row{display:flex;align-items:center;gap:14px;margin-bottom:12px}
        .eyebrow-line{height:1px;width:40px;background:#cddbf2}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e;opacity:.6}
        .intro-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:start}
        .intro-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.94}
        .intro-p{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.65;color:#38050e;opacity:.78;margin-top:14px}
        .intro-stats{display:flex;gap:34px;margin-top:24px;flex-wrap:wrap}
        .stat-n{font-family:'Barlow Condensed',sans-serif;font-size:2.6rem;font-weight:900;color:#38050e;line-height:1}
        .stat-l{font-family:'Barlow',sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#38050e;opacity:.55;margin-top:2px}

        /* ── Listado ── */
        .regions{background:#f4efe4;padding:40px 0 72px}
        .shops-ctrl{display:flex;align-items:center;gap:10px;margin-bottom:22px;flex-wrap:wrap}
        .shops-badge{font-family:'Barlow Condensed',sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#38050e;background:#cddbf2;padding:5px 13px;border-radius:50px;border:1px solid rgba(56,5,14,.12);flex-shrink:0}
        .chip{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:8px;border:1px solid #cddbf2;background:transparent;color:#38050e;opacity:.7;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}
        .chip:hover{background:#cddbf2;opacity:1}
        .chip.on{background:#38050e;color:#cddbf2;border-color:#38050e;opacity:1}

        .fc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .fc{background:#fff;border:1px solid #cddbf2;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .25s,transform .25s}
        .fc:hover{box-shadow:0 4px 8px 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.12);transform:translateY(-5px)}
        .fc-img{width:100%;aspect-ratio:4/3;background-size:cover;background-position:center;position:relative;display:flex;align-items:flex-end;padding:10px}
        .fc-tag{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;background:rgba(255,255,255,.94);color:#38050e;padding:5px 11px;border-radius:50px;border:1px solid rgba(56,5,14,.08)}
        .fc-body{padding:15px 16px 14px;display:flex;flex-direction:column;flex:1}
        .fc-name{font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:3px}
        .fc-loc{font-family:'Barlow',sans-serif;font-size:13px;color:#38050e;opacity:.55}
        .fc-meta{display:flex;align-items:center;gap:6px;font-family:'Barlow',sans-serif;font-size:12px;color:#38050e;opacity:.6;margin-top:8px}
        .fc-desc{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.5;color:#38050e;opacity:.7;margin-top:9px}
        .fc-disc{margin-top:auto;padding-top:14px}
        .fc-disc a{display:inline-flex;align-items:center;gap:7px;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;color:#38050e;text-decoration:none;border-bottom:1px solid #38050e;padding-bottom:2px;transition:opacity .2s}
        .fc-disc a:hover{opacity:.6}

        /* ── Cierre hacia las experiencias ── */
        .cta{background:#38050e;padding:56px 0}
        .cta-i{text-align:center}
        .cta-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,219,242,.7);margin-bottom:10px}
        .cta-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(30px,4.6vw,48px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.94}
        .cta-p{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.6;color:rgba(205,219,242,.75);max-width:560px;margin:12px auto 22px}
        .cta-b{display:inline-flex;align-items:center;gap:9px;height:44px;padding:0 26px;border-radius:50px;background:#cddbf2;color:#38050e;font-family:'Barlow',sans-serif;font-size:15px;font-weight:500;text-decoration:none;transition:all .2s}
        .cta-b:hover{background:#8AAFD4;color:#fff}

        .empty{text-align:center;color:#38050e;opacity:.5;font-family:'Barlow',sans-serif;padding:60px 0}

        @media(max-width:960px){.fc-grid{grid-template-columns:1fr 1fr}.intro-grid{grid-template-columns:1fr;gap:24px}}
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
        }
        @media(max-width:640px){.fc-grid{grid-template-columns:1fr}}
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="ph">
        <div
          className="ph-bg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524350876685-274059332603?w=1800&q=75')",
          }}
        />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Coffee Geeks Panamá · Temporada 2026</div>
                <h1 className="ph-h1">Fincas</h1>
                <h2 className="ph-h2">
                  Donde nace
                  <br />
                  el café de Panamá
                </h2>
              </div>
              <div className="ph-side">
                <img src="/concurso.webp" alt="Concurso Logo" className="ph-logo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/home">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>Fincas</span>
          </div>
        </div>
      </div>

      {/* Los productores */}
      <section className="intro">
        <div className="wrap">
          <div className="intro-grid">
            <div>
              <div className="eyebrow-row">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">Los productores</span>
              </div>
              <h2 className="intro-h2">Detrás de cada taza hay una familia</h2>
              <p className="intro-p">
                El café que llega a la barra empezó mucho antes, en las tierras altas de
                Panamá, en manos de productores que llevan generaciones leyendo la
                montaña. Ellos deciden cuándo cosechar, cómo secar y qué variedad
                sembrar en cada ladera.
              </p>
              <p className="intro-p">
                Estas son las fincas que abren sus puertas esta temporada. Conócelas por
                dónde están, porque en el café la ubicación lo es casi todo: la altura,
                la sombra y el suelo explican por qué dos granos vecinos saben distinto.
              </p>
            </div>
            <div className="intro-stats">
              <div>
                <div className="stat-n">{initialFincas.length}</div>
                <div className="stat-l">Fincas participantes</div>
              </div>
              <div>
                <div className="stat-n">{regions.length}</div>
                <div className="stat-l">{regions.length === 1 ? "Región" : "Regiones"}</div>
              </div>
              <div>
                <div className="stat-n">{totalExperiences}</div>
                <div className="stat-l">Experiencias</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fincas — todas en una grilla, filtrables por ubicación */}
      <main className="regions">
        <div className="wrap">
          <div className="shops-ctrl">
            <span className="shops-badge">
              {filtered.length} {filtered.length === 1 ? "finca" : "fincas"}
            </span>
            <button
              className={`chip${filter === "all" ? " on" : ""}`}
              onClick={() => setFilter("all")}
            >
              Todas
            </button>
            {regions.map((r) => (
              <button
                key={r}
                className={`chip${filter === r ? " on" : ""}`}
                onClick={() => setFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="fc-grid">
            {filtered.map((finca) => (
              <article className="fc" key={finca.id}>
                <div className="fc-img" style={{ backgroundImage: `url('${finca.img}')` }}>
                  <span className="fc-tag">{finca.region}</span>
                </div>
                <div className="fc-body">
                  <h3 className="fc-name">{finca.name}</h3>
                  <div className="fc-loc">
                    {finca.loc}
                    {finca.producer ? ` · ${finca.producer}` : ""}
                  </div>
                  {finca.altitude > 0 && (
                    <div className="fc-meta">
                      <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", fill: "none", strokeWidth: 1.5 }}>
                        <polygon points="12 2 22 20 2 20 12 2" />
                      </svg>
                      {finca.altitude} msnm
                      {finca.varieties.length > 0 && ` · ${finca.varieties.slice(0, 2).join(", ")}`}
                    </div>
                  )}
                  {finca.desc && <p className="fc-desc">{finca.desc}</p>}
                  {finca.experiences > 0 && (
                    <div className="fc-meta">
                      <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", fill: "none", strokeWidth: 1.5 }}>
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                      </svg>
                      {finca.experiences === 1 ? "1 experiencia" : `${finca.experiences} experiencias`}
                    </div>
                  )}
                  <div className="fc-disc">
                    <Link href={`/fincas/${getSlugId(finca.name, finca.id)}`}>
                      Descubre
                      <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="empty">
              {initialFincas.length === 0
                ? "Todavía no hay fincas publicadas."
                : "No hay fincas en esa región."}
            </p>
          )}
        </div>
      </main>

      {/* Cierre hacia las experiencias */}
      <section className="cta">
        <div className="wrap">
          <div className="cta-i">
            <div className="cta-eye">Experiencias</div>
            <h2 className="cta-h">Del Origen a la Barra</h2>
            <p className="cta-p">
              Cada finca abre sus puertas para mostrarte el camino completo del grano:
              del árbol sembrado en altura hasta la taza servida en la barra.
            </p>
            <Link href="/fincas/experienciasdelorigenalabarra" className="cta-b">
              Ver todas las experiencias
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 2.5 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

const STEPS = [
  { n: "01", t: "El origen", d: "Caminas el cafetal con quien lo siembra y entiendes por qué la altura y la sombra cambian la taza." },
  { n: "02", t: "El proceso", d: "Ves el despulpado, el secado y la fermentación que definen el perfil del grano." },
  { n: "03", t: "El tueste", d: "Descubres cómo una misma cereza se vuelve tazas distintas según cómo se tueste." },
  { n: "04", t: "La barra", d: "Cierras catando, extrayendo y comparando lo que probaste en el árbol." },
];

export default function ExperienciasClient({
  initialExperiences,
}: {
  initialExperiences: any[];
}) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [booking, setBooking] = useState<any | null>(null);

  const fincas = Array.from(new Set(initialExperiences.map((e) => e.finca)));

  const filtered = initialExperiences
    .filter((e) => filter === "all" || e.finca === filter)
    .sort((a, b) =>
      sortBy === "price" ? a.price - b.price : a.finca.localeCompare(b.finca)
    );

  const fmtPrice = (exp: any) =>
    exp.price > 0 ? `$${exp.price.toFixed(2)}` : "Consultar";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.62}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
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
        .bread-i a{color:#38050e;opacity:.7;transition:color .2s;text-decoration:none}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* ── Los cuatro pasos del recorrido ── */
        .steps-sec{background:#fff;padding:56px 0 48px}
        .eyebrow-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px}
        .eyebrow-line{height:1px;width:40px;background:#cddbf2}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e;opacity:.6}
        .steps-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,42px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.92;text-align:center}
        .steps-p{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.6;color:#38050e;opacity:.7;max-width:620px;margin:10px auto 0;text-align:center}
        .steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:36px}
        .step{border:1px solid #cddbf2;border-radius:16px;padding:20px 18px;background:#f4efe4}
        .step-n{font-family:'Barlow Condensed',sans-serif;font-size:2.2rem;font-weight:900;color:#cddbf2;line-height:1}
        .step-t{font-family:'Barlow Condensed',sans-serif;font-size:1.25rem;font-weight:900;text-transform:uppercase;color:#38050e;margin:6px 0 5px;line-height:1.05}
        .step-d{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.55;color:#38050e;opacity:.7}

        /* ── Listado de experiencias ── */
        .exp-sec{background:#f4efe4;padding:32px 0 80px}
        .shops-ctrl{display:flex;align-items:center;gap:10px;margin-bottom:22px;flex-wrap:wrap}
        .shops-badge{font-family:'Barlow Condensed',sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#38050e;background:#cddbf2;padding:5px 13px;border-radius:50px;border:1px solid rgba(56,5,14,.12);flex-shrink:0}
        .chip{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:8px;border:1px solid #cddbf2;background:transparent;color:#38050e;opacity:.7;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}
        .chip:hover{background:#cddbf2;opacity:1}
        .chip.on{background:#38050e;color:#cddbf2;border-color:#38050e;opacity:1}
        .m3-sel{border:1px solid #cddbf2;border-radius:8px;padding:5px 10px;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;background:#fff;outline:none;margin-left:auto;cursor:pointer}

        .ec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .ec{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.12),0 1px 3px 1px rgba(0,0,0,.08);transition:box-shadow .25s,transform .25s;border:1px solid #cddbf2;display:flex;flex-direction:column}
        .ec:hover{box-shadow:0 4px 8px 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.12);transform:translateY(-5px)}
        .ec-img{width:100%;aspect-ratio:4/3;background-size:cover;background-position:center;display:flex;align-items:flex-start;justify-content:space-between;padding:9px}
        .ec-finca{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.04em;background:#38050e;color:#fff;padding:4px 9px;border-radius:50px}
        .ec-price{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:900;background:#cddbf2;color:#38050e;padding:4px 11px;border-radius:50px}
        .ec-body{padding:13px 14px 11px;display:flex;flex-direction:column;flex:1}
        .ec-loc{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#38050e;opacity:.6;margin-bottom:1px}
        .ec-title{font-family:'Barlow Condensed',sans-serif;font-size:1.45rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:5px}
        .ec-sum{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.5;color:#38050e;opacity:.75;margin-bottom:10px}
        .ec-meta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:10px}
        .ec-m{display:flex;align-items:center;gap:5px;font-family:'Barlow',sans-serif;font-size:12px;color:#38050e;opacity:.6}
        .ec-inc{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:11px}
        .ec-i{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;color:#38050e;background:#f4efe4;border:1px solid #cddbf2;padding:3px 9px;border-radius:50px}
        .ec-acts{display:flex;gap:7px;padding-top:9px;border-top:1px solid #cddbf2;margin-top:auto}
        .ecb{flex:1;height:33px;border-radius:50px;border:none;font-family:'Barlow',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;background:#38050e;color:#fff}
        .ecb:hover{background:#cddbf2;color:#38050e}

        .empty{text-align:center;color:#38050e;opacity:.5;font-family:'Barlow',sans-serif;padding:40px 0}

        /* ── Modal de reserva ── */
        .bk-ov{position:fixed;inset:0;z-index:400;background:rgba(56,5,14,.75);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px}
        .bk{background:#fff;border-radius:20px;max-width:440px;width:100%;overflow:hidden;border:1px solid #cddbf2}
        .bk-hd{background:#38050e;padding:18px 22px}
        .bk-hd-t{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:900;text-transform:uppercase;color:#fff;line-height:1.05}
        .bk-hd-s{font-family:'Barlow',sans-serif;font-size:12px;color:rgba(205,219,242,.75);margin-top:3px}
        .bk-bd{padding:20px 22px}
        .bk-row{display:flex;justify-content:space-between;align-items:center;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;padding:7px 0;border-bottom:1px solid #f4efe4}
        .bk-row strong{font-family:'Barlow Condensed',sans-serif;font-size:1.15rem;font-weight:900}
        .bk-note{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.55;color:#38050e;opacity:.75;margin-top:14px;background:#f4efe4;border:1px solid #cddbf2;border-radius:12px;padding:12px 14px}
        .bk-acts{display:flex;gap:8px;margin-top:16px}
        .bkb{flex:1;height:38px;border-radius:50px;border:none;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}
        .bkb-c{background:#f4efe4;color:#38050e}
        .bkb-c:hover{background:#cddbf2}

        @media(max-width:960px){.ec-grid{grid-template-columns:1fr 1fr}.steps-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
        }
        @media(max-width:640px){.ec-grid{grid-template-columns:1fr}.steps-grid{grid-template-columns:1fr}}
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="ph">
        <div
          className="ph-bg"
          style={{
            backgroundImage: "url('/banner-fincas.webp')",
          }}
        />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Experiencias · Fincas participantes</div>
                <h1 className="ph-h1">Del Origen<br />a la Barra</h1>
                <h2 className="ph-h2">El recorrido completo del grano</h2>
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
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/guia-de-experiencias">Fincas</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>Del Origen a la Barra</span>
          </div>
        </div>
      </div>

      {/* Los cuatro pasos */}
      <section className="steps-sec">
        <div className="wrap">
          <div className="eyebrow-row">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Cómo funciona</span>
            <div className="eyebrow-line" />
          </div>
          <h2 className="steps-h2">Cuatro etapas, una sola taza</h2>
          <p className="steps-p">
            Cada finca participante abre sus puertas para mostrar el camino completo del
            café panameño: del árbol sembrado en altura hasta la taza servida en la barra.
          </p>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-n">{s.n}</div>
                <div className="step-t">{s.t}</div>
                <div className="step-d">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiencias */}
      <main className="exp-sec">
        <div className="wrap">
          <div className="shops-ctrl">
            <span className="shops-badge">
              {initialExperiences.length}{" "}
              {initialExperiences.length === 1 ? "experiencia disponible" : "experiencias disponibles"}
            </span>
            <button className={`chip${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>
              Todas
            </button>
            {fincas.map((f) => (
              <button key={f} className={`chip${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
            <select className="m3-sel" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price">Menor precio</option>
              <option value="finca">Por finca</option>
            </select>
          </div>

          <div className="ec-grid">
            {filtered.map((exp) => (
              <div className="ec" key={exp.id}>
                <div className="ec-img" style={{ backgroundImage: `url('${exp.img}')` }}>
                  <span className="ec-finca">{exp.finca}</span>
                  <span className="ec-price">{fmtPrice(exp)}</span>
                </div>
                <div className="ec-body">
                  <div className="ec-loc">{exp.loc}</div>
                  <div className="ec-title">{exp.title}</div>
                  {exp.summary && <p className="ec-sum">{exp.summary}</p>}
                  <div className="ec-meta">
                    {exp.duration && (
                      <span className="ec-m">
                        <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", fill: "none", strokeWidth: 1.5 }}>
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {exp.duration}
                      </span>
                    )}
                    {exp.capacity > 0 && (
                      <span className="ec-m">
                        <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", fill: "none", strokeWidth: 1.5 }}>
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        Hasta {exp.capacity}
                      </span>
                    )}
                  </div>
                  {exp.includes.length > 0 && (
                    <div className="ec-inc">
                      {exp.includes.slice(0, 3).map((i: string) => (
                        <span className="ec-i" key={i}>
                          {i}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="ec-acts">
                    <button className="ecb" onClick={() => setBooking(exp)}>
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="empty">
              {initialExperiences.length === 0
                ? "Todavía no hay experiencias publicadas."
                : "No hay experiencias de esa finca."}
            </p>
          )}
        </div>
      </main>

      {/* Modal de reserva — punto único donde se conectará la pasarela de pago */}
      {booking && (
        <div className="bk-ov" onClick={() => setBooking(null)}>
          <div className="bk" onClick={(e) => e.stopPropagation()}>
            <div className="bk-hd">
              <div className="bk-hd-t">{booking.title}</div>
              <div className="bk-hd-s">
                {booking.finca} · {booking.loc}
              </div>
            </div>
            <div className="bk-bd">
              {booking.duration && (
                <div className="bk-row">
                  <span>Duración</span>
                  <span>{booking.duration}</span>
                </div>
              )}
              {booking.capacity > 0 && (
                <div className="bk-row">
                  <span>Cupo por tanda</span>
                  <span>{booking.capacity} personas</span>
                </div>
              )}
              <div className="bk-row">
                <span>Precio por persona</span>
                <strong>{fmtPrice(booking)}</strong>
              </div>

              <div className="bk-note">
                Las reservas en línea abren cuando se active la pasarela de pago.
                Mientras tanto, escríbenos y coordinamos tu visita a {booking.finca}.
              </div>

              <div className="bk-acts">
                <button className="bkb bkb-c" onClick={() => setBooking(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

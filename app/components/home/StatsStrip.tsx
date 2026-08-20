"use client";

import { useEffect, useState } from "react";

/* Contador que sube animado hasta la cifra real al cargar la página. */
function AnimCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.floor(ease * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    const timeout = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(timeout);
  }, [target, duration]);
  return <>{val.toLocaleString()}{suffix}</>;
}

export type StripStats = { cafeterias: number; votos: number; fincas: number };

/* Franja de cifras del concurso, justo bajo el hero: cafeterías, votos,
   fincas, cierre de registro y gran final. Las cifras llegan del servidor. */
export default function StatsStrip({ stats, cierre }: { stats: StripStats; cierre: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const css = `
    .stats-strip {
      background: #0D0404;
      border-top: 1px solid rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 22px 0;
    }
    .stats-strip .stats-row {
      display: flex; align-items: center; justify-content: center;
      max-width: 900px; margin: 0 auto; padding: 0 24px;
      overflow-x: auto;
    }
    .stats-strip .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0 28px;
      border-right: 1px solid rgba(255,255,255,0.08);
    }
    .stats-strip .stat-item:last-child { border-right: none; }
    .stats-strip .stat-fecha { font-size: clamp(21px, 2.7vw, 29px); letter-spacing: .01em; }
    .stats-strip .stat-num {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(27px, 3.6vw, 38px);
      font-weight: 900;
      color: #cddbf2;
      line-height: 1;
    }
    .stats-strip .stat-label {
      font-family: 'Barlow', sans-serif;
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: 0.11em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.55);
      text-align: center;
      line-height: 1.4;
    }
    @media (max-width: 640px) {
      .stats-strip .stat-item { padding: 0 14px; border-right: none; }
      .stats-strip .stat-num { font-size: 24px; }
      .stats-strip .stats-row { flex-wrap: wrap; gap: 16px; }
    }
  `;

  return (
    <section className="stats-strip" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{css}</style>
      <div className="stats-row">
        {[
          { num: stats.cafeterias, label: "Cafeterías\nParticipantes" },
          { num: stats.votos,      label: "Votos\nEmitidos" },
          { num: stats.fincas,     label: "Fincas\nAliadas" },
          // La fecha va como texto, no como contador: un día suelto
          // animándose no se lee como fecha
          { texto: cierre,         label: "Cierre de\nRegistro" },
        ].map((s, i) => (
          <div key={i} className="stat-item">
            <span className={`stat-num${s.texto ? " stat-fecha" : ""}`}>
              {s.texto
                ? s.texto
                : mounted
                  ? <AnimCounter target={s.num!} suffix="" />
                  : s.num}
            </span>
            <span className="stat-label" style={{ whiteSpace: "pre-line" }}>{s.label}</span>
          </div>
        ))}
        <div className="stat-item" style={{ borderRight: "none" }}>
          <span className="stat-num">OCT</span>
          <span className="stat-label">Gran Final<br />2026</span>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "var(--op,#fff)", fill: "none", strokeWidth: 1.5 }}>
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    name: "Explora cafeterías",
    desc: "Encuentra los participantes en nuestro directorio",
  },
  {
    n: "02",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "var(--op,#fff)", fill: "none", strokeWidth: 1.5 }}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    name: "Visítalas",
    desc: "Vive la experiencia y prueba sus mejores extracciones",
  },
  {
    n: "03",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "var(--op,#fff)", fill: "none", strokeWidth: 1.5 }}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    name: "Escanea el QR",
    desc: "Registra tu visita con el código en el local",
  },
  {
    n: "04",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "var(--op,#fff)", fill: "none", strokeWidth: 1.5 }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    name: "Gana puntos",
    desc: "Acumula en tu pasaporte digital",
  },
  {
    n: "05",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "var(--op,#fff)", fill: "none", strokeWidth: 1.5 }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    name: "Vota",
    desc: "Elige al mejor y compite por premios exclusivos",
  },
];

export default function StepsSection() {
  return (
    <>
      <style>{`
        .steps-sec { background: #cddbf2; padding: 80px 0; }
        .steps-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px); }
        .steps-hd { text-align: center; margin-bottom: 32px; }
        .eyebrow-dark {
          display: inline-flex; align-items: center; gap: 9px; margin-bottom: 8px; justify-content: center;
        }
        .eyebrow-line-dark { width: 24px; height: 2px; background: #38050e; flex-shrink: 0; }
        .eyebrow-text-dark { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: #38050e; }
        .steps-hd h2 { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(28px,4vw,42px); font-weight: 900; text-transform: uppercase; color: #38050e; line-height: .92; }
        .steps-hd p { font-family: 'Barlow', sans-serif; font-size: 16px; color: rgba(56,5,14,.52); margin-top: 5px; line-height: 1.7; }
        .steps-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 1px; background: rgba(56,5,14,.15);
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(56,5,14,.15);
          box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 1px 3px 1px rgba(0,0,0,.08);
        }
        .step { background: #cddbf2; padding: 26px 16px 22px; transition: background .2s; position: relative; }
        .step:hover { background: rgba(255,255,255,.55); }
        .step-n { font-family: 'Barlow Condensed', sans-serif; font-size: 34px; font-weight: 900; color: #38050e; opacity: .14; line-height: 1; margin-bottom: 11px; }
        .step-ico { width: 38px; height: 38px; background: #38050e; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 9px; }
        .step-name { font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #38050e; margin-bottom: 3px; }
        .step-desc { font-family: 'Barlow', sans-serif; font-size: 13px; color: rgba(56,5,14,.5); line-height: 1.5; }
        @media (max-width: 640px) {
          .steps-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <section className="steps-sec">
        <div className="steps-wrap">
          <div className="steps-hd">
            <div className="eyebrow-dark">
              <div className="eyebrow-line-dark" />
              <span className="eyebrow-text-dark">Tu experiencia Coffee Geek</span>
              <div className="eyebrow-line-dark" />
            </div>
            <h2>En 5 pasos</h2>
            <p>Participar en el concurso es así de simple</p>
          </div>

          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-n">{s.n}</div>
                <div className="step-ico">{s.icon}</div>
                <div className="step-name">{s.name}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

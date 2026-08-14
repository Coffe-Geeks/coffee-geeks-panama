"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroVideo from "./HeroVideo";
import VoteModal from "@/app/components/VoteModal";

/* ─── Coffee Bean SVG ──────────────────────────────────────────────────────
   Una forma de grano de café auténtica: elipse con la línea central curva
   característica del grano. Cada "bean" es un SVG inline parametrizado.
─────────────────────────────────────────────────────────────────────────── */
interface CoffeeBeanSVGProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

function CoffeeBeanSVG({
  width = 120,
  height = 72,
  fill = "rgba(56,5,14,0.18)",
  stroke = "rgba(205,219,242,0.25)",
  strokeWidth = 1.5,
}: CoffeeBeanSVGProps) {
  const rx = width / 2;
  const ry = height / 2;
  const cx = width / 2;
  const cy = height / 2;
  const crease = `M ${cx - rx * 0.72},${cy}
    C ${cx - rx * 0.3},${cy - ry * 0.55}
      ${cx + rx * 0.3},${cy + ry * 0.55}
      ${cx + rx * 0.72},${cy}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`beanGrad-${width}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
        </radialGradient>
        <filter id={`beanBlur-${width}`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill={`url(#beanGrad-${width})`}
      />
      <path
        d={crease}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth * 1.4}
        strokeLinecap="round"
        opacity={0.9}
      />
    </svg>
  );
}

/* ─── Floating Bean ────────────────────────────────────────────────────────
   Cada grano flota con su propia animación CSS keyframe única,
   usando delay, duración y amplitud de oscilación distintos.
─────────────────────────────────────────────────────────────────────────── */
interface BeanConfig {
  id: number;
  top: string;
  left: string;
  width: number;
  height: number;
  rotate: number;
  delay: number;
  floatDuration: number;
  floatAmplitude: number;
  entryDuration: number;
  opacity: number;
  fill: string;
  stroke: string;
}

function FloatingBean({ config }: { config: BeanConfig }) {
  const {
    id, top, left, width, height, rotate, delay,
    floatDuration, floatAmplitude, entryDuration, opacity,
    fill, stroke,
  } = config;

  const keyframeName = `floatBean${id}`;
  const entryName = `enterBean${id}`;

  const css = `
    @keyframes ${entryName} {
      0%   { opacity: 0; transform: rotate(${rotate - 20}deg) translateY(-120px); }
      100% { opacity: ${opacity}; transform: rotate(${rotate}deg) translateY(0px); }
    }
    @keyframes ${keyframeName} {
      0%   { transform: rotate(${rotate}deg) translateY(0px); }
      50%  { transform: rotate(${rotate + 3}deg) translateY(${floatAmplitude}px); }
      100% { transform: rotate(${rotate}deg) translateY(0px); }
    }
    .bean-${id} {
      position: absolute;
      top: ${top};
      left: ${left};
      opacity: 0;
      animation:
        ${entryName} ${entryDuration}s cubic-bezier(0.23,0.86,0.39,0.96) ${delay}s forwards,
        ${keyframeName} ${floatDuration}s ease-in-out ${delay + entryDuration}s infinite;
      filter: blur(0.5px);
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className={`bean-${id}`}>
        <CoffeeBeanSVG width={width} height={height} fill={fill} stroke={stroke} />
      </div>
    </>
  );
}

/* ─── Bean configs ─────────────────────────────────────────────────────────
   Conjunto de granos posicionados para rodear el contenido central,
   con paleta en tonos espresso/burgundy/azul CGP.
─────────────────────────────────────────────────────────────────────────── */
const BEANS: BeanConfig[] = [
  { id: 1,  top: "12%", left: "-4%",  width: 220, height: 110, rotate: 18,  delay: 0.2, floatDuration: 14, floatAmplitude: 18, entryDuration: 2.2, opacity: 0.9,  fill: "rgba(56,5,14,0.22)",  stroke: "rgba(205,219,242,0.30)" },
  { id: 2,  top: "68%", left: "88%",  width: 180, height: 90,  rotate: -20, delay: 0.4, floatDuration: 16, floatAmplitude: 14, entryDuration: 2.4, opacity: 0.85, fill: "rgba(56,5,14,0.18)", stroke: "rgba(205,219,242,0.25)" },
  { id: 3,  top: "75%", left: "4%",   width: 140, height: 70,  rotate: -12, delay: 0.5, floatDuration: 11, floatAmplitude: 20, entryDuration: 2.0, opacity: 0.8,  fill: "rgba(56,5,14,0.20)",   stroke: "rgba(205,219,242,0.20)" },
  { id: 4,  top: "8%",  left: "80%",  width: 110, height: 55,  rotate: 25,  delay: 0.6, floatDuration: 13, floatAmplitude: 16, entryDuration: 2.1, opacity: 0.75, fill: "rgba(56,5,14,0.15)",  stroke: "rgba(205,219,242,0.22)" },
  { id: 5,  top: "5%",  left: "22%",  width: 80,  height: 40,  rotate: -28, delay: 0.7, floatDuration: 10, floatAmplitude: 22, entryDuration: 1.8, opacity: 0.7,  fill: "rgba(56,5,14,0.14)", stroke: "rgba(205,219,242,0.18)" },
  { id: 6,  top: "40%", left: "93%",  width: 70,  height: 35,  rotate: 8,   delay: 0.8, floatDuration: 9,  floatAmplitude: 12, entryDuration: 1.9, opacity: 0.65, fill: "rgba(56,5,14,0.16)",   stroke: "rgba(205,219,242,0.20)" },
  { id: 7,  top: "45%", left: "-2%",  width: 60,  height: 30,  rotate: 15,  delay: 0.9, floatDuration: 12, floatAmplitude: 18, entryDuration: 2.0, opacity: 0.6,  fill: "rgba(56,5,14,0.12)",  stroke: "rgba(205,219,242,0.15)" },
  { id: 8,  top: "88%", left: "70%",  width: 55,  height: 27,  rotate: -18, delay: 1.0, floatDuration: 8,  floatAmplitude: 10, entryDuration: 1.7, opacity: 0.55, fill: "rgba(56,5,14,0.12)", stroke: "rgba(205,219,242,0.15)" },
  { id: 9,  top: "18%", left: "8%",   width: 45,  height: 22,  rotate: 30,  delay: 1.1, floatDuration: 7,  floatAmplitude: 25, entryDuration: 1.6, opacity: 0.5,  fill: "rgba(56,5,14,0.10)",  stroke: "rgba(205,219,242,0.12)" },
  { id: 10, top: "92%", left: "42%",  width: 40,  height: 20,  rotate: -5,  delay: 1.2, floatDuration: 15, floatAmplitude: 8,  entryDuration: 1.8, opacity: 0.45, fill: "rgba(56,5,14,0.10)",   stroke: "rgba(205,219,242,0.12)" },
];

/* ─── Animated counter ─────────────────────────────────────────────────── */
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
    const timeout = setTimeout(() => requestAnimationFrame(step), 1400);
    return () => clearTimeout(timeout);
  }, [target, duration]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ─── Main Hero ─────────────────────────────────────────────────────────── */
export default function CoffeeBeansHero({ config }: { config?: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [voteModal, setVoteModal] = useState(false);
  useEffect(() => setMounted(true), []);

  const heroEyebrow = config?.heroEyebrow ?? "Concurso Nacional · Temporada 2026";
  const heroTitle1 = config?.heroTitle1 ?? "El Camino";
  const heroTitle2 = config?.heroTitle2 ?? "a la Gran Taza";
  const heroDescription = config?.heroDescription ?? "Los mejores baristas, coffee shops, hoteles, restaurantes que ofrecen experiencias únicas alrededor del café.\n\nPara postularlos en la lista oficial de Panamá en Continent’s y The World’s 100 Best Coffee Shops.";

  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

    .cgp-hero * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp {
      0%   { opacity: 0; transform: translateY(32px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes badgePop {
      0%   { opacity: 0; transform: scale(0.85) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes lineGrow {
      0%   { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes breathe {
      0%, 100% { opacity: 0.4; }
      50%       { opacity: 0.65; }
    }
    @keyframes statsIn {
      0%   { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .hero-badge {
      animation: badgePop 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
    }
    .hero-title-1 {
      animation: fadeUp 1.1s cubic-bezier(0.25,0.4,0.25,1) 0.6s both;
    }
    .hero-title-2 {
      animation: fadeUp 1.1s cubic-bezier(0.25,0.4,0.25,1) 0.85s both;
    }
    .hero-sub {
      animation: fadeUp 1s cubic-bezier(0.25,0.4,0.25,1) 1.1s both;
    }
    .hero-ctas {
      animation: fadeUp 1s cubic-bezier(0.25,0.4,0.25,1) 1.3s both;
    }
    .hero-stats {
      animation: statsIn 1s ease 1.6s both;
    }
    .eyebrow-line {
      transform-origin: left;
      animation: lineGrow 0.8s ease 0.8s both;
    }
    .title-gradient {
      background: linear-gradient(
        135deg,
        #cddbf2 0%,
        #ffffff 30%,
        #cddbf2 55%,
        #ffffff 80%,
        #cddbf2 100%
      );
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear 1.5s infinite;
    }
    .btn-primary {
      background: #cddbf2;
      color: #38050e;
      border: none;
      padding: 14px 32px;
      border-radius: 50px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 0.88rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(205,219,242,0.25);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary:hover {
      background: #8AAFD4;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(205,219,242,0.35);
    }
    .btn-secondary {
      background: transparent;
      color: rgba(255,255,255,0.65);
      border: 1.5px solid rgba(255,255,255,0.25);
      padding: 13px 30px;
      border-radius: 50px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-secondary:hover {
      border-color: rgba(196,212,232,0.6);
      color: #cddbf2;
      background: rgba(196,212,232,0.06);
      transform: translateY(-2px);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0 28px;
      border-right: 1px solid rgba(255,255,255,0.08);
    }
    .stat-item:last-child { border-right: none; }
    .stat-num {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(22px, 3vw, 30px);
      font-weight: 900;
      color: #cddbf2;
      line-height: 1;
    }
    .stat-label {
      font-family: 'Barlow', sans-serif;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      text-align: center;
      line-height: 1.4;
    }
    .noise-overlay {
      position: absolute;
      inset: 0;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-size: 180px 180px;
      pointer-events: none;
    }
    .glow-top {
      position: absolute;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 50%;
      background: radial-gradient(ellipse, rgba(56,5,14,0.35) 0%, transparent 70%);
      pointer-events: none;
      animation: breathe 6s ease-in-out infinite;
    }
    .glow-bottom-left {
      position: absolute;
      bottom: 0;
      left: -10%;
      width: 40%;
      height: 40%;
      background: radial-gradient(ellipse, rgba(56,5,14,0.2) 0%, transparent 70%);
      pointer-events: none;
    }
    .glow-bottom-right {
      position: absolute;
      bottom: 5%;
      right: -5%;
      width: 35%;
      height: 35%;
      background: radial-gradient(ellipse, rgba(56,5,14,0.25) 0%, transparent 70%);
      pointer-events: none;
    }

    @media (max-width: 640px) {
      .stat-item { padding: 0 14px; }
      .stat-num { font-size: 20px; }
      .hero-ctas { flex-direction: column; align-items: center; }
      .stats-row { flex-wrap: wrap; gap: 16px; }
      .stat-item { border-right: none; }
    }
  `;

  return (
    <div className="cgp-hero" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{globalCSS}</style>

      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "linear-gradient(160deg, #1A0808 0%, #0D0404 45%, #1A0808 100%)",
        }}
      >
        {/* ── Atmospheric glows ── */}
        <div className="glow-top" />
        <div className="glow-bottom-left" />
        <div className="glow-bottom-right" />

        {/* ── Noise texture ── */}
        <div className="noise-overlay" />

        {/* ── Subtle radial vignette ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }} />

        {/* ── Montaje de fotos de los coffee shops ── */}
        {mounted && <HeroVideo />}

        {/* ── Horizontal separator line ── */}
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(205,219,242,0.05) 30%, rgba(205,219,242,0.08) 50%, rgba(205,219,242,0.05) 70%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* ── Content ── */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 760,
          width: "100%",
          paddingBottom: 120,
        }}>

          {/* Badge */}
          <div className="hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px 6px 10px",
            borderRadius: 50,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            marginBottom: 32,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#38050e",
              boxShadow: "0 0 8px rgba(56,5,14,0.8)",
              display: "inline-block",
              animation: "breathe 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.75rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}>
              {heroEyebrow}
            </span>
          </div>

          {/* Eyebrow line */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div className="eyebrow-line" style={{ width: 32, height: 2, background: "#cddbf2" }} />
            <span style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.7rem", fontWeight: 500,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#cddbf2", opacity: 0.8,
            }}>Coffee Geeks Panamá</span>
            <div className="eyebrow-line" style={{ width: 32, height: 2, background: "#cddbf2" }} />
          </div>

          {/* Title line 1 */}
          <h1 className="hero-title-1" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(52px, 10vw, 96px)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            color: "#ffffff",
            marginBottom: 4,
          }}>
            {heroTitle1}
          </h1>

          {/* Title line 2 — gradient shimmer */}
          <h1 className="hero-title-2 title-gradient" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(52px, 10vw, 96px)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            marginBottom: 28,
          }}>
            {heroTitle2}
          </h1>

          {/* Subtitle */}
          <p className="hero-sub" style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: "clamp(14px, 1.8vw, 17px)",
            fontWeight: 300,
            lineHeight: 1.7,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.40)",
            maxWidth: 440,
            marginBottom: 40,
            whiteSpace: "pre-wrap",
          }}>
            {heroDescription}
          </p>

          {/* CTA Buttons */}
          <div className="hero-ctas" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => setVoteModal(true)}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" style={{ flexShrink: 0 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Votar ahora
            </button>
            <button className="btn-secondary" onClick={() => router.push("/participantes")}>
              Explorar cafeterías
              <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="hero-stats" style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          background: "rgba(56,5,14,0.55)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "18px 0",
          zIndex: 10,
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            maxWidth: 900, margin: "0 auto", padding: "0 24px",
            overflowX: "auto",
          }} className="stats-row">
            {[
              { num: 24,   suffix: "",  label: "Cafeterías\nRegistradas" },
              { num: 1840, suffix: "",  label: "Votos\nEmitidos" },
              { num: 3,    suffix: "",  label: "Categorías en\nCompetencia" },
              { num: 23,   suffix: "",  label: "Abril · Cierre\nde Registro" },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-num">
                  {mounted ? <AnimCounter target={s.num} suffix={s.suffix} /> : `${s.num}${s.suffix}`}
                </span>
                <span className="stat-label" style={{ whiteSpace: "pre-line" }}>{s.label}</span>
              </div>
            ))}
            <div className="stat-item" style={{ borderRight: "none" }}>
              <span className="stat-num" style={{ color: "#38050e" }}>OCT</span>
              <span className="stat-label">Gran Final<br />2026</span>
            </div>
          </div>
        </div>

        {/* ── Bottom gradient fade ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "30%",
          background: "linear-gradient(to top, rgba(13,4,4,0.6) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }} />
      </div>

      <VoteModal 
        open={voteModal} 
        onClose={() => setVoteModal(false)} 
      />
    </div>
  );
}

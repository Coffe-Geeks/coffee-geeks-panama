"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { INTRO_CARDS, INTRO_BROLLS, INTRO_POSTER } from "./introData";
import HeroMapa from "./HeroMapa";

function IconChevron(p: { width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={p.width ?? 24}
      height={p.height ?? 24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const AUTOPLAY_MS = 7000;

// Retardo para recargar el clip de la capa SALIENTE: debe superar la
// transición de opacidad de .intro-vid-layer (0.9s en intro.css). Así el
// cambio de src ocurre cuando la capa ya está invisible y su recarga nunca
// asoma el poster por encima del fundido.
const SWAP_AFTER_FADE_MS = 1000;

// Fondo de b-rolls propios: dos capas de video que se alternan con fundido
// cruzado. Solo reproduce la capa visible; la oculta precarga el siguiente
// clip para que el cambio sea instantáneo y sin cortes. Mudo + inline para
// que el autoplay funcione en móvil; si el navegador lo bloquea, queda el
// poster de cada video como imagen fija.
function HeroBg({ videos, poster }: { videos: string[]; poster: string }) {
  const n = videos.length;
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [showA, setShowA] = useState(true);
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(n > 1 ? 1 : 0);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    aRef.current?.play().catch(() => {});
    return () => clearTimeout(swapTimer.current);
  }, []);

  const onEndA = useCallback(() => {
    const b = bRef.current;
    if (b) {
      b.currentTime = 0;
      b.play().catch(() => {});
    }
    setShowA(false);
    // La capa A (saliente) recién avanza al siguiente clip cuando YA terminó
    // de desvanecerse; si cambiáramos el src ahora, su recarga mostraría el
    // poster encima durante el cruce.
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => setIdxA((idxB + 1) % n), SWAP_AFTER_FADE_MS);
  }, [idxB, n]);

  const onEndB = useCallback(() => {
    const a = aRef.current;
    if (a) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
    setShowA(true);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => setIdxB((idxA + 1) % n), SWAP_AFTER_FADE_MS);
  }, [idxA, n]);

  return (
    <>
      <video
        ref={aRef}
        className={`intro-video intro-vid-layer${showA ? " on" : ""}`}
        src={videos[idxA]}
        poster={poster}
        muted
        playsInline
        preload="auto"
        onEnded={onEndA}
      />
      <video
        ref={bRef}
        className={`intro-video intro-vid-layer${!showA ? " on" : ""}`}
        src={videos[idxB]}
        poster={poster}
        muted
        playsInline
        preload="auto"
        onEnded={onEndB}
      />
    </>
  );
}

// Intro a pantalla completa con video de fondo (o poster cinematográfico como
// stand-in) + carrusel de tarjetas que se desliza en automático. Cada tarjeta
// redirige a su página con "Ver más".
//
// El arrastre (dedo / trackpad / mouse) mueve el track 1:1 escribiendo el
// transform directo en el DOM —sin estado de React por cada movimiento— para
// que siga al puntero sin retraso. Al soltar, hace snap a la tarjeta más cercana.
export default function HeroIntro({
  videos = INTRO_BROLLS,
  poster = INTRO_POSTER,
  mapPts = [],
}: {
  videos?: string[];
  poster?: string;
  mapPts?: [number, number][];
}) {
  const cards = INTRO_CARDS;
  const len = cards.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const centerRef = useRef(0); // offset para centrar (independiente del índice)
  const stepRef = useRef(0); // ancho de tarjeta + gap
  const baseRef = useRef(0); // offset del índice actual
  const deltaRef = useRef(0); // desplazamiento en vivo del gesto
  const startXRef = useRef(0);
  const movedRef = useRef(false);
  const activeRef = useRef(false); // hay un gesto en curso
  const capturedRef = useRef(false); // capturamos el puntero sólo al arrastrar

  // Escribe el transform en el DOM. Con transición para el asentado animado,
  // sin transición mientras se arrastra (seguimiento exacto).
  const paint = useCallback((animate: boolean) => {
    const t = trackRef.current;
    if (!t) return;
    t.style.transition = animate ? "" : "none";
    t.style.transform = `translate3d(${baseRef.current + deltaRef.current}px,0,0)`;
  }, []);

  // Limita el desplazamiento en vivo con un pequeño efecto elástico en los bordes.
  const clampDelta = useCallback(
    (d: number) => {
      const step = stepRef.current || 1;
      const center = centerRef.current;
      const leftmost = center - (len - 1) * step;
      const rubber = step * 0.28;
      const pos = baseRef.current + d;
      const clamped = Math.max(leftmost - rubber, Math.min(center + rubber, pos));
      return clamped - baseRef.current;
    },
    [len]
  );

  // Cierra el gesto: hace snap a la tarjeta más cercana según lo desplazado.
  const commitGesture = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    const step = stepRef.current || 1;
    const raw = -deltaRef.current / step; // >0 avanza, <0 retrocede
    let moved = Math.round(raw);
    if (moved === 0 && Math.abs(raw) > 0.2) moved = raw > 0 ? 1 : -1;
    deltaRef.current = 0;
    setDragging(false);
    if (moved !== 0) {
      setIndex((i) => ((i + moved) % len + len) % len); // recalc anima al nuevo lugar
    } else {
      paint(true); // vuelve a su sitio animado
    }
  }, [len, paint]);

  // Recentra midiendo el ancho real de la tarjeta + gap.
  const recalc = useCallback(() => {
    const vp = viewportRef.current;
    const card = cardRef.current;
    if (!vp || !card) return;
    const gap = parseFloat(
      getComputedStyle(vp.firstElementChild as Element).gap || "0"
    );
    stepRef.current = card.offsetWidth + gap;
    centerRef.current = vp.offsetWidth / 2 - card.offsetWidth / 2;
    baseRef.current = centerRef.current - index * stepRef.current;
    paint(!activeRef.current);
  }, [index, paint]);

  useLayoutEffect(() => {
    recalc();
  }, [recalc]);

  useEffect(() => {
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % len), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, len]);

  const go = (i: number) => setIndex((i + len) % len);

  // Gesto de trackpad (wheel horizontal de dos dedos): mueve el track en vivo y,
  // al terminar el gesto, hace snap. Listener nativo { passive:false } para
  // cancelar el "atrás/adelante" del navegador.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let endTimer: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical → scroll normal
      e.preventDefault();
      if (!activeRef.current) {
        activeRef.current = true;
        setPaused(true);
        setDragging(true);
      }
      deltaRef.current = clampDelta(deltaRef.current - e.deltaX);
      paint(false);
      clearTimeout(endTimer);
      endTimer = setTimeout(commitGesture, 120);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      vp.removeEventListener("wheel", onWheel);
      clearTimeout(endTimer);
    };
  }, [clampDelta, paint, commitGesture]);

  // Arrastre con puntero (dedo / mouse). Escribe el transform directo → 1:1.
  //
  // IMPORTANTE: NO capturamos el puntero en el pointerdown. Capturar en cada
  // toque rompe la semántica de "click" (el navegador dispara el click en el
  // contenedor capturado, no en el enlace), y por eso "Ver más" no navegaba y
  // tocar una tarjeta lateral se sentía muerto. Capturamos sólo cuando se
  // confirma un arrastre real (>4px), preservando el click para taps.
  const onPointerDown = (e: React.PointerEvent) => {
    activeRef.current = true;
    startXRef.current = e.clientX;
    movedRef.current = false;
    deltaRef.current = 0;
    setPaused(true);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!activeRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (!movedRef.current && Math.abs(dx) > 4) {
      movedRef.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        capturedRef.current = true;
      } catch {}
    }
    deltaRef.current = clampDelta(dx);
    paint(false);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (capturedRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      capturedRef.current = false;
    }
    commitGesture();
    if (e.pointerType === "touch") setPaused(false);
  };

  // Evita que un arrastre termine navegando por un clic accidental.
  const guardClick = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      className="intro"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!activeRef.current) setPaused(false);
      }}
    >
      {/* Fondo: b-rolls propios rotando con fundido cruzado. Si no hay clips,
          cae al poster con zoom lento. */}
      <div className="intro-bg">
        {videos.length > 0 ? (
          <HeroBg videos={videos} poster={poster} />
        ) : (
          <div
            className="intro-poster"
            style={{ backgroundImage: `url(${poster})` }}
          />
        )}
        <div className="intro-scrim" />
        <div className="intro-grain" />
      </div>

      <div className="intro-head">
        <span className="intro-eye">
          <span className="intro-eye-line" />
          COFFEE GEEKS PANAMÁ
          <span className="intro-eye-line" />
        </span>
        <div className="intro-logo">
          <Image src="/logo.webp" alt="Coffee Geeks Panamá" width={130} height={115} priority />
        </div>
        <h1 className="intro-h1">INSIGNIA EXCELENCIA DEL CAFÉ</h1>
      </div>

      {/* Carrusel */}
      <div className="intro-carousel">
        <button
          className="intro-arrow left"
          aria-label="Anterior"
          onClick={() => go(index - 1)}
        >
          <IconChevron width={20} height={20} />
        </button>

        <div
          className={`intro-viewport${dragging ? " dragging" : ""}`}
          ref={viewportRef}
          style={{
            touchAction: "pan-y",
            userSelect: dragging ? "none" : undefined,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="intro-track" ref={trackRef}>
            {cards.map((c, i) => (
              <div
                className={`intro-card${i === index ? " active" : ""}`}
                key={c.key}
                ref={i === 0 ? cardRef : undefined}
                onClick={(e) => {
                  if (movedRef.current) return;
                  if (i !== index) {
                    e.preventDefault();
                    go(i);
                  }
                }}
              >
                <div className={`intro-card-media${c.logo ? " intro-card-media--logo" : ""}${c.key === "pasaporte" ? " intro-card-media--map" : ""}`}>
                  {c.key === "pasaporte" ? (
                    <HeroMapa pts={mapPts} />
                  ) : (
                    <div
                      className={`intro-card-img${c.logo ? " intro-card-img--logo" : ""}`}
                      style={{ backgroundImage: `url(${c.img})` }}
                      role="img"
                      aria-label={c.title.replace(/\n/g, " ")}
                    />
                  )}
                  <div className="intro-card-shade" />
                </div>
                <div className="intro-card-body">
                  <span className="intro-card-eye">{c.eyebrow}</span>
                  <h3 className="intro-card-title">
                    {c.title.split("\n").map((l, j) => (
                      <span key={j} style={{ display: "block" }}>
                        {l}
                      </span>
                    ))}
                  </h3>
                  <p className="intro-card-desc">{c.desc}</p>
                  <Link
                    className="intro-card-cta"
                    href={c.href}
                    onClick={guardClick}
                    draggable={false}
                  >
                    {c.cta} <IconChevron width={14} height={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="intro-arrow right"
          aria-label="Siguiente"
          onClick={() => go(index + 1)}
        >
          <IconChevron width={20} height={20} />
        </button>
      </div>

      {/* Puntos */}
      <div className="intro-dots">
        {cards.map((c, i) => (
          <button
            key={c.key}
            className={`intro-dot${i === index ? " on" : ""}`}
            aria-label={`Ir a ${c.key}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}

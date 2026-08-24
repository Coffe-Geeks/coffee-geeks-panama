"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fondo del hero: fotos de TODAS las cafeterías participantes (portadas
 * y galerías: baristas, locales y bebidas) rotando con fundido cruzado y
 * un zoom lento (Ken Burns) — así ningún participante acapara la entrada.
 * Las fotos llegan por props desde la página y viven en el Blob; se
 * barajan en cada visita.
 *
 * Con movimiento reducido activado se queda una sola foto fija.
 */
// Imagen de base mientras carga la primera foto del pase: una foto real
// aprobada por curaduría (interior sin gente ni rótulos), NO el cuadro
// del video viejo.
const POSTER =
  "https://67nfjlu2uec5rb7z.public.blob.vercel-storage.com/participantes/sisu-coffee-studio/foto-01.webp";

// Cada foto se sostiene este tiempo antes de fundir a la siguiente.
const HOLD_MS = 4600;
const FADE_MS = 1400;

function Slideshow({ fotos, animado }: { fotos: string[]; animado: boolean }) {
  // Barajado por visita (solo corre en cliente): así se intercalan baristas,
  // locales y bebidas en vez de salir juntas las fotos de un mismo café.
  const [lista] = useState(() => {
    const l = [...fotos];
    for (let i = l.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [l[i], l[j]] = [l[j], l[i]];
    }
    return l;
  });
  const n = lista.length;
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!animado || n < 2) return;
    timer.current = setTimeout(() => {
      // Precargar la que sigue a la entrante para que el fundido nunca
      // muestre una imagen a medio bajar.
      const img = new Image();
      img.src = lista[(idx + 2) % n];
      setPrev(idx);
      setIdx((idx + 1) % n);
    }, HOLD_MS);
    return () => clearTimeout(timer.current);
  }, [idx, animado, n, lista]);

  return (
    <>
      {prev !== null && (
        <div
          key={`p-${prev}`}
          className="hf-foto hf-out"
          style={{ backgroundImage: `url('${lista[prev]}')` }}
        />
      )}
      <div
        key={`f-${idx}`}
        className={`hf-foto hf-in${animado ? " hf-zoom" : ""}`}
        style={{ backgroundImage: `url('${lista[idx]}')` }}
      />
    </>
  );
}

export default function HeroFotos({ fotos = [] }: { fotos?: string[] }) {
  // Solo en cliente: el índice inicial es aleatorio y en el servidor no
  // hay Math.random estable, así que primero pinta el póster y al montar
  // entra el pase de fotos.
  const [listo, setListo] = useState(false);
  const [animado, setAnimado] = useState(true);

  useEffect(() => {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluar = () => setAnimado(!quieto.matches);
    evaluar();
    setListo(true);
    quieto.addEventListener("change", evaluar);
    return () => quieto.removeEventListener("change", evaluar);
  }, []);

  return (
    <>
      <style>{`
        .hf{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
        .hf-foto{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.78}
        @keyframes hfFadeIn{from{opacity:0}to{opacity:.78}}
        @keyframes hfFadeOut{from{opacity:.78}to{opacity:0}}
        /* El zoom dura más que la foto en pantalla: nunca se le ve el final */
        @keyframes hfZoom{from{transform:scale(1)}to{transform:scale(1.09)}}
        .hf-in{animation:hfFadeIn ${FADE_MS}ms ease both}
        .hf-out{animation:hfFadeOut ${FADE_MS}ms ease both}
        .hf-zoom{animation:hfFadeIn ${FADE_MS}ms ease both,hfZoom ${HOLD_MS + FADE_MS * 2}ms linear both}
        .hf-velo{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.5) 0%,rgba(0,0,0,.32) 45%,rgba(0,0,0,.62) 100%)}
      `}</style>

      <div className="hf" aria-hidden="true">
        {/* Póster siempre de base: tapa el hueco mientras baja la 1ª foto */}
        <div className="hf-foto" style={{ backgroundImage: `url('${POSTER}')` }} />
        {listo && fotos.length > 0 && <Slideshow fotos={fotos} animado={animado} />}
        <div className="hf-velo" />
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fondo del hero: las portadas de TODAS las cafeterías participantes
 * rotando con fundido cruzado y un zoom lento (Ken Burns) — así ningún
 * participante acapara la entrada. Las fotos llegan por props desde la
 * página (las mismas portadas de la sección Descúbrenos, que viven en
 * el Blob). El pase arranca en una foto distinta en cada visita.
 *
 * Con movimiento reducido activado se queda una sola foto fija.
 */
const POSTER =
  "https://67nfjlu2uec5rb7z.public.blob.vercel-storage.com/brolls/poster.jpg";

// Cada foto se sostiene este tiempo antes de fundir a la siguiente.
const HOLD_MS = 4600;
const FADE_MS = 1400;

function Slideshow({ fotos, animado }: { fotos: string[]; animado: boolean }) {
  const n = fotos.length;
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * n));
  const [prev, setPrev] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!animado || n < 2) return;
    timer.current = setTimeout(() => {
      // Precargar la que sigue a la entrante para que el fundido nunca
      // muestre una imagen a medio bajar.
      const img = new Image();
      img.src = fotos[(idx + 2) % n];
      setPrev(idx);
      setIdx((idx + 1) % n);
    }, HOLD_MS);
    return () => clearTimeout(timer.current);
  }, [idx, animado, n, fotos]);

  return (
    <>
      {prev !== null && (
        <div
          key={`p-${prev}`}
          className="hf-foto hf-out"
          style={{ backgroundImage: `url('${fotos[prev]}')` }}
        />
      )}
      <div
        key={`f-${idx}`}
        className={`hf-foto hf-in${animado ? " hf-zoom" : ""}`}
        style={{ backgroundImage: `url('${fotos[idx]}')` }}
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
        {listo && fotos.length > 0 ? (
          <Slideshow fotos={fotos} animado={animado} />
        ) : (
          <div className="hf-foto" style={{ backgroundImage: `url('${POSTER}')` }} />
        )}
        <div className="hf-velo" />
      </div>
    </>
  );
}

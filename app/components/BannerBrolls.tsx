"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fondo de banner con b-rolls en fundido cruzado: los baristas haciendo
 * las bebidas con las manos (mismos clips del hero del home). En móvil o
 * con reduced-motion se queda el póster fijo, igual que el hero.
 * Va posicionado absolute para llenar el contenedor del banner.
 */
const FADE_MS = 1000;

function CrossfadeVideos({ videos, poster }: { videos: string[]; poster: string }) {
  const n = videos.length;
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [showA, setShowA] = useState(true);
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(n > 1 ? 1 : 0);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  // Al terminar el visible arranca el otro; el que salió carga el
  // siguiente clip cuando ya está invisible (el fundido nunca lo delata).
  const onEndA = useCallback(() => {
    const b = bRef.current;
    if (b) { b.currentTime = 0; b.play().catch(() => {}); }
    setShowA(false);
    swapTimer.current = setTimeout(() => setIdxA((i) => (i + 2) % n), FADE_MS);
  }, [n]);

  const onEndB = useCallback(() => {
    const a = aRef.current;
    if (a) { a.currentTime = 0; a.play().catch(() => {}); }
    setShowA(true);
    swapTimer.current = setTimeout(() => setIdxB((i) => (i + 2) % n), FADE_MS);
  }, [n]);

  return (
    <>
      <video
        ref={aRef}
        className={`bb-video${showA ? " bb-on" : ""}`}
        src={videos[idxA]}
        poster={poster}
        autoPlay muted playsInline preload="auto"
        onEnded={onEndA}
      />
      <video
        ref={bRef}
        className={`bb-video${!showA ? " bb-on" : ""}`}
        src={videos[idxB]}
        poster={poster}
        muted playsInline preload="auto"
        onEnded={onEndB}
      />
    </>
  );
}

export default function BannerBrolls({ videos, poster }: { videos: string[]; poster: string }) {
  const [conVideo, setConVideo] = useState(false);

  useEffect(() => {
    const anchas = window.matchMedia("(min-width: 900px)");
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluar = () => setConVideo(anchas.matches && !quieto.matches);
    evaluar();
    anchas.addEventListener("change", evaluar);
    quieto.addEventListener("change", evaluar);
    return () => {
      anchas.removeEventListener("change", evaluar);
      quieto.removeEventListener("change", evaluar);
    };
  }, []);

  return (
    <div className="bb-wrap" aria-hidden>
      <style>{`
        .bb-wrap{position:absolute;inset:0;overflow:hidden}
        .bb-poster{position:absolute;inset:0;background-size:cover;background-position:center 62%}
        .bb-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity ${FADE_MS}ms ease}
        .bb-video.bb-on{opacity:1}
      `}</style>
      <div className="bb-poster" style={{ backgroundImage: `url('${poster}')` }} />
      {conVideo && <CrossfadeVideos videos={videos} poster={poster} />}
    </div>
  );
}

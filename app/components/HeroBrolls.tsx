"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fondo del hero: b-rolls propios rotando con fundido cruzado.
 *
 * Dos capas de video que se alternan; solo reproduce la visible y la oculta
 * precarga el siguiente clip para que el cambio sea sin cortes. Los clips
 * viven en el Blob (no en el repo). El video solo se monta en pantallas
 * anchas y con movimiento permitido: en un teléfono con datos móviles queda
 * el póster, que ya muestra una foto real.
 */
const BLOB = "https://67nfjlu2uec5rb7z.public.blob.vercel-storage.com/brolls";

const BROLLS = [
  `${BLOB}/cg_broll_01_foodbarn_espresso.mp4`,
  `${BLOB}/cg_broll_02_sisu_filtrado.mp4`,
  `${BLOB}/cg_broll_03_kotowa_espresso.mp4`,
  `${BLOB}/cg_broll_04_tosto_filtrado.mp4`,
  `${BLOB}/cg_broll_05_sip_espresso.mp4`,
  `${BLOB}/cg_broll_06_wknd_filtrado.mp4`,
  `${BLOB}/cg_broll_07_momo_espresso.mp4`,
  `${BLOB}/cg_broll_08_leto_filtrado.mp4`,
];

const POSTER = `${BLOB}/poster.jpg`;

// Retardo para recargar el clip de la capa SALIENTE: debe superar la
// transición de opacidad (0.9s). Así el cambio de src ocurre cuando la capa
// ya está invisible y su recarga nunca asoma el poster sobre el fundido.
const SWAP_AFTER_FADE_MS = 1000;

function CrossfadeVideos({ videos }: { videos: string[] }) {
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
        className={`hv-media hv-layer${showA ? " on" : ""}`}
        src={videos[idxA]}
        poster={POSTER}
        muted
        playsInline
        preload="auto"
        onEnded={onEndA}
      />
      <video
        ref={bRef}
        className={`hv-media hv-layer${!showA ? " on" : ""}`}
        src={videos[idxB]}
        poster={POSTER}
        muted
        playsInline
        preload="auto"
        onEnded={onEndB}
      />
    </>
  );
}

export default function HeroBrolls() {
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
    <>
      <style>{`
        .hv{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
        .hv-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
        .hv-layer{opacity:0;transition:opacity .9s ease}
        .hv-layer.on{opacity:.78}
        .hv-poster{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.78}
        /* Oscurecido neutro, sin tinte de color: lo justo para que el
           texto blanco se lea sobre fotos claras */
        .hv-velo{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.5) 0%,rgba(0,0,0,.32) 45%,rgba(0,0,0,.62) 100%)}
      `}</style>

      <div className="hv" aria-hidden="true">
        {conVideo ? (
          <CrossfadeVideos videos={BROLLS} />
        ) : (
          <div className="hv-poster" style={{ backgroundImage: `url('${POSTER}')` }} />
        )}
        <div className="hv-velo" />
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Montaje de las fotos de los coffee shops como fondo del hero.
 *
 * El video solo se monta en pantallas anchas y con movimiento permitido:
 * son 3.7 MB, y en un teléfono con datos móviles eso es caro para algo
 * decorativo. Ahí queda el póster, que pesa 170 KB y ya muestra una foto
 * real. El elemento se renderiza recién tras comprobarlo, para que el
 * navegador no llegue a pedir el archivo.
 */
export default function HeroVideo() {
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
        .hv-media{width:100%;height:100%;object-fit:cover;display:block;opacity:.5}
        .hv-poster{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.5}
        /* Velo: el texto del hero debe leerse por encima de cualquier foto */
        .hv-velo{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(56,5,14,.82) 0%,rgba(56,5,14,.68) 45%,rgba(56,5,14,.88) 100%)}
      `}</style>

      <div className="hv" aria-hidden="true">
        {conVideo ? (
          <video
            className="hv-media"
            src="/hero.mp4"
            poster="/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="hv-poster" style={{ backgroundImage: "url('/hero-poster.jpg')" }} />
        )}
        <div className="hv-velo" />
      </div>
    </>
  );
}

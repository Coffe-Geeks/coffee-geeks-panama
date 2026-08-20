"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Mapa real (Carto dark) con las cafeterías registradas, para la tarjeta del
// pasaporte del hero. Es una vista fija: pointer-events:none, sin arrastre ni
// zoom, así que la tarjeta sigue siendo cliqueable/deslizable por encima.
// Recibe las coordenadas desde el servidor (solo cafeterías con ubicación).
export default function HeroMapa({ pts }: { pts: [number, number][] }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove?: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      const map = L.map(elRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        keyboard: false,
        boxZoom: false,
        touchZoom: false,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      const icon = L.divIcon({ className: "hero-map-pin", html: "<span></span>", iconSize: [12, 12], iconAnchor: [6, 6] });
      pts.forEach((p) => L.marker(p, { icon }).addTo(map));

      if (pts.length) map.fitBounds(pts, { padding: [26, 26] });
      else map.setView([8.9824, -79.5199], 12); // Ciudad de Panamá
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove?.();
      mapRef.current = null;
    };
  }, [pts]);

  return (
    <div className="hero-map" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ width: "100%", height: "100%" }} ref={elRef} />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSlugId } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamic imports to prevent SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

export default function MapSection({ shops }: { shops: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // @ts-ignore
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!isMounted || !L) {
    return (
      <section className="map-sec-placeholder" style={{ height: 600, background: "#1a0207", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#fff", opacity: 0.5, fontFamily: "Barlow" }}>Cargando mapa...</p>
      </section>
    );
  }

  const validShops = shops.filter(s => s.lat && s.lng);
  
  // FALLBACK: If no shops have coordinates, we add mock ones for visual verification
  const displayShops = validShops.length > 0 ? validShops : [
    {
      id: 'mock-1',
      name: 'KOTOWA COFFEE',
      img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75',
      loc: 'Costa Verde, La Chorrera',
      lat: 8.9824,
      lng: -79.5199,
      cat: 'Coffee House'
    },
    {
      id: 'mock-2',
      name: 'Café Unido',
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=75',
      loc: 'Casco Antiguo, Panamá',
      lat: 8.952,
      lng: -79.533,
      cat: 'Specialty Coffee'
    }
  ];

  const center: [number, number] = [8.9824, -79.5199]; // Panama City center

  const customIcon = L.divIcon({
    className: "custom-marker-wrap",
    html: `
      <div class="marker-pin">
        <div class="marker-inner">
          <img src="/fav-pri.webp" alt="logo" />
        </div>
      </div>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46]
  });

  return (
    <>
      <style>{`
        .map-sec { position: relative; width: 100%; height: 750px; overflow: hidden; background: #38050e; }
        .map-container-inner { width: 100%; height: 100%; background: #38050e; z-index: 1; }
        
        /* Perfect color match using mix-blend-mode */
        .leaflet-tile-pane {
          mix-blend-mode: screen;
          filter: grayscale(100%) brightness(2.5) contrast(1.2);
          opacity: 0.8;
        }

        .custom-marker-wrap {
          background: transparent !important;
          border: none !important;
        }

        /* Marker Styling */
        .marker-pin {
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          background: #38050e;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -16px 0 0 -16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          border: 2px solid #38050e;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 2000;
        }
        .marker-pin:hover { transform: rotate(-45deg) scale(1.15); }
        
        .marker-inner {
          width: 24px;
          height: 24px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          overflow: hidden;
          border: 2px solid #38050e;
        }
        .marker-inner img { width: 85%; height: 85%; object-fit: contain; }

        /* Popup / Tooltip Styling */
        .leaflet-popup-content-wrapper, .leaflet-tooltip {
          background: #cddbf2 !important;
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
          border: none !important;
        }
        .leaflet-popup-content { margin: 0 !important; width: 300px !important; }
        .leaflet-tooltip { padding: 0 !important; border: none !important; }
        .leaflet-popup-tip { background: #cddbf2 !important; }
        .leaflet-tooltip-top:before { border-top-color: #cddbf2 !important; }
        
        .map-card-popup { display: flex; text-decoration: none; color: inherit; }
        .mp-img { width: 110px; height: 100px; background-size: cover; background-position: center; flex-shrink: 0; }
        .mp-info { padding: 12px 16px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .mp-name { font-family: 'Barlow Condensed', sans-serif; font-size: 1.45rem; font-weight: 900; color: #38050e; text-transform: uppercase; line-height: 0.95; margin-bottom: 2px; }
        .mp-cat { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 800; color: #38050e; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em; opacity: 0.9; }
        .mp-loc { font-family: 'Barlow', sans-serif; font-size: 11px; color: #38050e; opacity: 0.8; display: flex; align-items: center; gap: 5px; font-weight: 500; }

        /* Overlay Card */
        .map-overlay {
          position: absolute;
          right: 6%;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          max-width: 500px;
          background: #38050eff;
          padding: 60px;
          border-radius: 30px;
          z-index: 1500;
          color: #fff;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
          pointer-events: auto;
        }
        .mo-eyebrow { font-family: 'Barlow', sans-serif; font-size: 32px; font-weight: 200; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 5px; color: rgba(255,255,255,0.6); position: relative; z-index: 1510; }
        .mo-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(40px, 5vw, 64px); font-weight: 900; text-transform: uppercase; line-height: 0.85; margin-bottom: 28px; position: relative; z-index: 1510; }
        .mo-desc { font-family: 'Barlow', sans-serif; font-size: 18px; opacity: 0.8; line-height: 1.55; margin-bottom: 40px; font-weight: 400; position: relative; z-index: 1510; }
        .mo-btn {
          display: inline-flex; align-items: center; justify-content: center;
          height: 54px; padding: 0 36px; background: #cddbf2; color: #38050e;
          border-radius: 10px; font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 800;
          text-decoration: none; transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px;
          position: relative; z-index: 1510;
        }
        .mo-btn:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.4); }

        @media (max-width: 1100px) {
          .map-overlay { right: 3%; max-width: 450px; padding: 45px; }
        }

        @media (max-width: 850px) {
          .map-overlay { position: relative; right: auto; top: auto; transform: none; max-width: 100%; border-radius: 0; padding: 50px 25px; text-align: center; }
          .map-sec { height: auto; display: flex; flex-direction: column-reverse; }
          .map-container-inner { height: 500px; }
          .mo-eyebrow { font-size: 24px; }
          .mo-title { font-size: 42px; }
        }
      `}</style>

      <section className="map-sec">
        <div className="map-container-inner">
          <MapContainer 
            center={center} 
            zoom={15} 
            scrollWheelZoom={false} 
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {displayShops.map((shop: any) => (
              <Marker 
                key={shop.id} 
                position={[shop.lat, shop.lng]} 
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    router.push(`/participantes/${getSlugId(shop.name, shop.id)}`);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -32]} opacity={1} permanent={false}>
                  <div className="map-card-popup" style={{ width: 280 }}>
                    <div className="mp-img" style={{ backgroundImage: `url('${shop.img}')`, width: 90, height: 90 }} />
                    <div className="mp-info" style={{ padding: "10px 14px" }}>
                      <div className="mp-name" style={{ fontSize: "1.15rem" }}>{shop.name}</div>
                      <div className="mp-loc" style={{ fontSize: "11px" }}>{shop.loc}</div>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="map-overlay">
          <div className="mo-eyebrow">Explora</div>
          <h2 className="mo-title">La ruta<br />del café</h2>
          <p className="mo-desc">
            Encuentra tu próxima taza perfecta. Descubre qué cafeterías de la competencia están cerca de ti y planifica tu recorrido.
          </p>
          <a href="#shops-grid" className="mo-btn" onClick={(e) => {
            e.preventDefault();
            document.querySelector('.shops-sec')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Ver en mapa
          </a>
        </div>
      </section>
    </>
  );
}

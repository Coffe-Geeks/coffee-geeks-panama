"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import VoteModal from "@/app/components/VoteModal";
import MapPicker from "@/app/components/MapPicker";

export default function PerfilDetailClient({ shop }: { shop: any }) {
  const [voteModal, setVoteModal] = useState(false);

  // Mapeos de fallback si el usuario no ha subido data completa
  const coverImg = shop.coverImage || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80";
  // La foto principal es SIEMPRE la misma de la tarjeta: el barista.
  // Él es la cara del proyecto; las fotos del local no van en el perfil.
  const mainImg = coverImg;
  const barista = (shop.baristas && shop.baristas.length > 0) 
    ? (shop.baristas.find((b: any) => b.isHighlighted) || shop.baristas[0])
    : { fullName: "Aún no registrado", photo: "", role: "Barista" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .perf-hero{position:relative;height:340px;background-size:cover;background-position:center}
        .perf-hero-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(56,5,14,.5) 0%,rgba(56,5,14,.88) 100%)}
        .perf-hero-cnt{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 0 32px}
        .perf-cat{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(196,212,232,.6);margin-bottom:4px}
        .perf-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,5vw,56px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92}
        .perf-sub{font-family:'Barlow',sans-serif;font-size:14px;color:rgba(255,255,255,.42);margin-top:6px}
        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:color .2s;text-decoration:none}
        .bread-i a:hover{color:#38050e;opacity:1}
        .bread-i span{color:#38050e;opacity:.6}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .perf-wrap{display:grid;grid-template-columns:1fr 320px;gap:0;align-items:start;padding:40px 0 80px;background:#f4efe4}
        .perf-main{padding:0 32px 0 0}
        .perf-photo{aspect-ratio:4/3;background-size:cover;background-position:center;border-radius:16px;margin-bottom:24px}
        .perf-loc-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,2.5vw,26px);font-weight:900;text-transform:uppercase;color:#38050e;margin-bottom:1px}
        .perf-loc-s{font-family:'Barlow Condensed',sans-serif;font-size:.95rem;font-weight:700;text-transform:uppercase;color:#38050e;opacity:.7;margin-bottom:12px}

        /* Map placeholder */
        .map-box{width:100%;height:300px;border-radius:16px;overflow:hidden;position:relative;background:linear-gradient(135deg,#cddbf2,#8AAFD4);border:1px solid #cddbf2;margin-top:12px; z-index:0;}

        /* Tabs */
        .tabs{display:flex;gap:0;border-bottom:2px solid #cddbf2;margin-bottom:24px}
        .tab{font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;color:#38050e;opacity:.6;padding:10px 18px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s}
        .tab.on{color:#38050e;opacity:1;border-bottom-color:#38050e;font-weight:700}

        /* Score bars */
        .score-row{margin-bottom:14px}
        .score-label{font-family:'Barlow',sans-serif;font-size:12px;font-weight:500;color:#38050e;opacity:.7;margin-bottom:5px;display:flex;justify-content:space-between}
        .score-label span{font-weight:700;color:#38050e}
        .score-bar{height:7px;border-radius:50px;background:#cddbf2/30;overflow:hidden}
        .score-fill{height:100%;border-radius:50px;background:linear-gradient(90deg,#38050e,#8AAFD4);transition:width .8s ease}

        /* Info items */
        .info-item{display:flex;align-items:flex-start;gap:10px;padding:11px 0;border-bottom:1px solid #cddbf2/20;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;word-break:break-word}

        /* ── Ficha de competencia ── */
        .cg-tagline{font-family:'Barlow Condensed',sans-serif;font-size:clamp(19px,2.4vw,25px);font-weight:400;font-style:italic;line-height:1.28;color:#38050e;opacity:.82;margin-bottom:18px;padding-left:14px;border-left:3px solid #cddbf2}
        .cg-ficha{display:grid;gap:14px;margin-bottom:26px}
        .cg-blk{background:#f4efe4;border:1px solid #cddbf2;border-radius:14px;padding:15px 17px}
        .cg-blk-sig{background:#38050e;border-color:#38050e}
        .cg-blk-t{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#38050e;opacity:.65;margin-bottom:6px}
        .cg-blk-sig .cg-blk-t{color:#cddbf2;opacity:1}
        .cg-blk-p{font-family:'Barlow',sans-serif;font-size:14.5px;line-height:1.65;color:#38050e;white-space:pre-wrap}
        .cg-blk-sig .cg-blk-p{color:rgba(255,255,255,.88)}
        /* Bebida con foto: la imagen al lado del texto */
        .cg-blk-foto{display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:start}
        .cg-blk-img{width:100%;aspect-ratio:1;border-radius:12px;background-size:cover;background-position:center;border:1px solid rgba(56,5,14,.08)}
        .cg-blk-sig .cg-blk-img{border-color:rgba(205,219,242,.25)}
        @media(max-width:640px){.cg-blk{padding:13px 14px}.cg-blk-foto{grid-template-columns:1fr}.cg-blk-img{max-width:260px}}
        .info-item:last-child{border-bottom:none}
        .info-item a{color:#38050e;text-decoration:underline}
        .info-item a:hover{opacity:.8}

        /* Sticky sidebar card */
        .perf-sidebar{padding:0 0 40px;position:sticky;top:76px;align-self:flex-start;max-height:calc(100vh - 90px);overflow:auto;scrollbar-width:none}
        .perf-sidebar::-webkit-scrollbar{display:none}
        .stk-card{background:#38050e;border-radius:28px;overflow:hidden;box-shadow:0 4px 8px 3px rgba(0,0,0,.1)}
        .stk-img{width:100%;aspect-ratio:16/9;background-size:cover;background-position:center}
        .stk-body{padding:16px 16px 20px}
        .stk-name{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:900;text-transform:uppercase;color:#fff;margin-bottom:1px}
        .stk-sub{font-family:'Barlow Condensed',sans-serif;font-size:.72rem;font-weight:700;text-transform:uppercase;color:#cddbf2;margin-bottom:7px}
        .stk-loc{display:flex;align-items:center;gap:5px;font-size:13px;color:rgba(255,255,255,.42);font-family:'Barlow',sans-serif;margin-bottom:14px}
        .stk-vote-btn{width:100%;height:38px;border-radius:50px;border:none;background:#cddbf2;color:#38050e;font-family:'Barlow Condensed',sans-serif;font-size:.82rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s}
        .stk-vote-btn:hover{background:#fff;color:#38050e}
        .stk-div{height:1px;background:rgba(255,255,255,.1);margin:12px 0}
        .stk-stat{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
        .stk-sl{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.38);font-family:'Barlow',sans-serif}
        .stk-sv{font-family:'Barlow Condensed',sans-serif;font-size:.85rem;font-weight:700;color:rgba(255,255,255,.8)}
        .stk-score{font-family:'Barlow Condensed',sans-serif;font-size:2.8rem;font-weight:900;color:#cddbf2;line-height:1;text-align:center;padding:12px 0 6px}
        .stk-score small{display:block;font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.08em;font-family:'Barlow',sans-serif;text-transform:uppercase;font-weight:400}

        /* Barista card */
        .barista-card{background:#cddbf2/20;border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:16px;border:1px solid #cddbf2}
        .barista-av{width:50px;height:50px;border-radius:50%;background:#38050e;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:900;flex-shrink:0}
        .barista-name{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;text-transform:uppercase;color:#38050e}
        .barista-role{font-family:'Barlow',sans-serif;font-size:12px;color:#38050e;opacity:.6}
        

        @media(max-width:960px){.perf-wrap{grid-template-columns:1fr;gap:0}.perf-main{padding:0}.perf-sidebar{position:static;max-height:none;padding-bottom:0}}
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="perf-hero" style={{ backgroundImage: `url('${coverImg}')` }}>
        <div className="perf-hero-sc" />
        <div className="perf-hero-cnt">
          <div className="wrap">
            <div className="perf-cat">
              {Array.isArray(shop.competitionCategory) && shop.competitionCategory.length > 0 
                ? shop.competitionCategory.join(" - ") 
                : (typeof shop.competitionCategory === 'string' && shop.competitionCategory ? shop.competitionCategory : "Cafetería")}
            </div>
            <div className="perf-name">{shop.cafeteriaName || `${shop.name} ${shop.lastName}`}</div>
            <div className="perf-sub">{shop.neighborhood || "Panamá"}</div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#857375", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <Link href="/participantes">Participantes</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#857375", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>{shop.cafeteriaName || shop.name}</span>
          </div>
        </div>
      </div>

      {/* Profile body */}
      <div style={{ background: "#f4efe4" }}>
        <div className="wrap">
          <div className="perf-wrap">
            {/* Main content */}
            <div className="perf-main">
              {/* Photo */}
              <div className="perf-photo" style={{ backgroundImage: `url('${mainImg}')` }} />

              {/* Location */}
              <div className="perf-loc-h">{shop.cafeteriaName || shop.name}</div>
              <div className="perf-loc-s">{shop.neighborhood}</div>

              {/* Barista */}
              <div className="barista-card">
                {/* Su foto propia, o la portada cuando la portada ES su
                    retrato (convención portada-barista-*) */}
                {(barista.photo || (/(?:portada-)?barista/i.test(shop.coverImage || "") ? shop.coverImage : "")) ? (
                  <div className="barista-av" style={{ backgroundImage: `url('${barista.photo || shop.coverImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' }}>B</div>
                ) : (
                  <div className="barista-av">{barista.fullName.charAt(0).toUpperCase()}</div>
                )}
                <div>
                  <div className="barista-name">{barista.fullName}</div>
                  <div className="barista-role">{barista.role || "Barista"}</div>
                </div>
              </div>

              {/* Frase de cabecera del local */}
              {shop.tagline && (
                <p className="cg-tagline">“{shop.tagline}”</p>
              )}

              {/* About */}
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, lineHeight: 1.7, color: "#38050e", marginBottom: 24, whiteSpace: "pre-wrap" }}>
                {shop.description || "Esta cafetería aún no ha agregado una descripción."}
              </p>

              {/* Ficha de competencia */}
              {(shop.originStory || shop.espresso || shop.filtrado || shop.signatureDrink) && (
                <div className="cg-ficha">
                  {shop.originStory && (
                    <div className="cg-blk">
                      <div className="cg-blk-t">Su origen</div>
                      <p className="cg-blk-p">{shop.originStory}</p>
                    </div>
                  )}
                  {shop.espresso && (
                    <div className={`cg-blk${shop.espressoPhoto ? " cg-blk-foto" : ""}`}>
                      {shop.espressoPhoto && (
                        <div className="cg-blk-img" style={{ backgroundImage: `url('${shop.espressoPhoto}')` }} />
                      )}
                      <div>
                        <div className="cg-blk-t">Espresso</div>
                        <p className="cg-blk-p">{shop.espresso}</p>
                      </div>
                    </div>
                  )}
                  {shop.filtrado && (
                    <div className={`cg-blk${shop.filtradoPhoto ? " cg-blk-foto" : ""}`}>
                      {shop.filtradoPhoto && (
                        <div className="cg-blk-img" style={{ backgroundImage: `url('${shop.filtradoPhoto}')` }} />
                      )}
                      <div>
                        <div className="cg-blk-t">Filtrado</div>
                        <p className="cg-blk-p">{shop.filtrado}</p>
                      </div>
                    </div>
                  )}
                  {shop.signatureDrink && (
                    <div className={`cg-blk cg-blk-sig${shop.signatureDrinkPhoto ? " cg-blk-foto" : ""}`}>
                      {shop.signatureDrinkPhoto && (
                        <div className="cg-blk-img" style={{ backgroundImage: `url('${shop.signatureDrinkPhoto}')` }} />
                      )}
                      <div>
                        <div className="cg-blk-t">
                          Signature Drink
                          {shop.signatureDrinkName ? ` · ${shop.signatureDrinkName}` : ""}
                        </div>
                        <p className="cg-blk-p">{shop.signatureDrink}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* El perfil muestra solo café: la foto del barista y sus
                  bebidas. Las fotos del establecimiento no van aquí. */}

              {/* Info */}
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase", color: "#38050e", marginBottom: 8 }}>Información</div>
              {[
                { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10 m-3 0a3 3 0 0 0 6 0 3 3 0 0 0-6 0", label: shop.neighborhood || "Ubicación no especificada" },
                { icon: "M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z M12 13A3 3 0 1 0 12 7a3 3 0 0 0 0 6z", label: shop.hours || "Horarios no especificados" },
                { icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z", label: shop.phone || "Sin teléfono" },
                { icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", label: shop.web ? <a href={shop.web.startsWith('http') ? shop.web : `https://${shop.web}`} target="_blank" rel="noopener noreferrer">{shop.web}</a> : "Sin web" },
              ].map((item, i) => (
                <div key={i} className="info-item">
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "#38050e", opacity: 0.6, fill: "none", strokeWidth: 1.5, flexShrink: 0, marginTop: 1 }}>
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </div>
              ))}

              {/* Map View */}
              {shop.locationLat && shop.locationLng && (
                <div className="map-box" style={{ pointerEvents: 'none' }}>
                  <MapPicker 
                    initialLat={shop.locationLat} 
                    initialLng={shop.locationLng} 
                    onLocationChange={() => {}} 
                  />
                  <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#524345", background: "#fff", padding: "4px 12px", borderRadius: 50, zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                    Ver en el mapa
                  </div>
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <div className="perf-sidebar">
              <div className="stk-card">
                <div className="stk-img" style={{ backgroundImage: `url('${coverImg}')` }} />
                <div className="stk-body">
                  <div className="stk-name">{shop.cafeteriaName || shop.name}</div>
                  <div className="stk-sub">
                    {Array.isArray(shop.competitionCategory) && shop.competitionCategory.length > 0 
                      ? shop.competitionCategory.join(" - ") 
                      : (typeof shop.competitionCategory === 'string' && shop.competitionCategory ? shop.competitionCategory : "Cafetería")}
                  </div>
                  <div className="stk-loc">
                    <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: "rgba(255,255,255,.4)", fill: "none", strokeWidth: 1.5 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {shop.neighborhood}
                  </div>
                  <div className="stk-score">
                    {shop.votesCount || 0}
                    <small>Votos Totales</small>
                  </div>
                  <button className="stk-vote-btn" onClick={() => setVoteModal(true)}>
                    ⭐ Votar por {shop.cafeteriaName || shop.name}
                  </button>
                  <div className="stk-div" />
                  <div className="stk-stat">
                    <span className="stk-sl">Puntaje global</span>
                    <span className="stk-sv">Procesando...</span>
                  </div>
                  <div className="stk-stat">
                    <span className="stk-sl">Posición actual</span>
                    <span className="stk-sv">Pendiente</span>
                  </div>
                </div>
              </div>

              {/* Back links */}
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  href="/participantes"
                  style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#38050e", opacity: 0.7, textDecoration: "none" }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><polyline points="15 18 9 12 15 6" /></svg>
                  Ver todos los participantes
                </Link>
                <Link
                  href="/votaciones"
                  style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#38050e", opacity: 0.7, textDecoration: "none" }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  Ver ranking de votaciones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoteModal
        open={voteModal}
        preselected={shop.id}
        onClose={() => setVoteModal(false)}
      />
    </>
  );
}

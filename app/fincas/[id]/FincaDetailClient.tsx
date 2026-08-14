"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

export default function FincaDetailClient({ finca }: { finca: any }) {
  const [slide, setSlide] = useState(0);

  const total = finca.gallery.length;
  const go = (dir: number) => setSlide((s) => (s + dir + total) % total);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.62}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0 44px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}
        .ph-logo{width:clamp(120px,18vw,220px);height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3));animation:float 6s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:opacity .2s;text-decoration:none}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* ── Carrusel ── */
        .car-sec{background:#fff;padding:32px 0 8px}
        .car{position:relative;border-radius:20px;overflow:hidden;border:1px solid #cddbf2;background:#f4efe4}
        .car-track{width:100%;aspect-ratio:16/9;background-size:cover;background-position:center;transition:background-image .3s}
        .car-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50px;border:none;background:rgba(255,255,255,.92);color:#38050e;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
        .car-nav:hover{background:#cddbf2}
        .car-prev{left:14px}
        .car-next{right:14px}
        .car-count{position:absolute;top:14px;right:14px;font-family:'Barlow',sans-serif;font-size:12px;font-weight:500;background:rgba(56,5,14,.85);color:#fff;padding:5px 12px;border-radius:50px}
        .car-dots{display:flex;justify-content:center;gap:7px;margin-top:14px}
        .dot{width:8px;height:8px;border-radius:50px;border:none;background:#cddbf2;cursor:pointer;padding:0;transition:all .2s}
        .dot.on{background:#38050e;width:22px}
        .car-thumbs{display:flex;gap:9px;margin-top:14px;overflow-x:auto;padding-bottom:4px}
        .thumb{width:96px;height:64px;flex-shrink:0;border-radius:10px;background-size:cover;background-position:center;cursor:pointer;border:2px solid transparent;transition:border-color .2s;opacity:.65}
        .thumb.on{border-color:#38050e;opacity:1}

        /* ── Relato de la finca ── */
        .story-sec{background:#fff;padding:44px 0 56px}
        .eyebrow-row{display:flex;align-items:center;gap:14px;margin-bottom:12px}
        .eyebrow-line{height:1px;width:40px;background:#cddbf2}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e;opacity:.6}
        .story-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:44px;align-items:start}
        .blk{margin-bottom:30px}
        .blk:last-child{margin-bottom:0}
        .blk-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(24px,3vw,34px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.98;margin-bottom:10px}
        .blk-p{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.68;color:#38050e;opacity:.78;white-space:pre-line}

        /* Ficha técnica */
        .spec{background:#f4efe4;border:1px solid #cddbf2;border-radius:16px;padding:20px 22px;position:sticky;top:76px}
        .spec-h{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:900;text-transform:uppercase;color:#38050e;margin-bottom:12px}
        .spec-r{display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-bottom:1px solid #cddbf2;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e}
        .spec-r:last-of-type{border-bottom:none}
        .spec-k{opacity:.6}
        .spec-v{font-weight:500;text-align:right}
        .spec-tags{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}
        .spec-tag{font-family:'Barlow',sans-serif;font-size:11px;background:#fff;border:1px solid #cddbf2;color:#38050e;padding:3px 9px;border-radius:50px}
        .spec-links{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
        .spec-lnk{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:50px;background:#38050e;color:#fff;font-family:'Barlow',sans-serif;font-size:13px;text-decoration:none;transition:all .15s}
        .spec-lnk:hover{background:#cddbf2;color:#38050e}

        /* ── Experiencias de esta finca ── */
        .exp-sec{background:#f4efe4;padding:52px 0 72px}
        .exp-head{text-align:center;margin-bottom:30px}
        .exp-eye-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:10px}
        .exp-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.94}
        .exp-p{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.6;color:#38050e;opacity:.7;max-width:600px;margin:10px auto 0}
        /* ── Botón hacia Panama Unique ── */
        .exp-cta{display:flex;flex-direction:column;align-items:center;gap:12px}
        .exp-cta-btn{display:inline-flex;align-items:center;gap:10px;height:52px;padding:0 34px;border-radius:50px;background:#38050e;color:#cddbf2;font-family:'Barlow',sans-serif;font-size:16px;font-weight:500;text-decoration:none;transition:all .2s;box-shadow:0 2px 6px rgba(56,5,14,.18)}
        .exp-cta-btn:hover{background:#cddbf2;color:#38050e;transform:translateY(-2px);box-shadow:0 6px 14px rgba(56,5,14,.22)}
        .exp-cta-nota{font-family:'Barlow',sans-serif;font-size:13px;color:#38050e;opacity:.55}
        @media(max-width:640px){.exp-cta-btn{height:48px;padding:0 26px;font-size:15px}}

        @media(max-width:960px){
          .story-grid{grid-template-columns:1fr;gap:26px}
          .spec{position:static}
        }
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
          .car-nav{width:36px;height:36px}
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="ph">
        <div className="ph-bg" style={{ backgroundImage: `url('${finca.gallery[0]}')` }} />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">
                  {finca.region}
                  {finca.producer ? ` · ${finca.producer}` : ""}
                </div>
                <h1 className="ph-h1">{finca.name}</h1>
                <h2 className="ph-h2">{finca.location}</h2>
              </div>
              <div className="ph-side">
                <img src="/concurso.webp" alt="Concurso Logo" className="ph-logo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/home">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/fincas">Fincas</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>{finca.name}</span>
          </div>
        </div>
      </div>

      {/* Carrusel */}
      <section className="car-sec">
        <div className="wrap">
          <div className="car">
            <div className="car-track" style={{ backgroundImage: `url('${finca.gallery[slide]}')` }} />
            {total > 1 && (
              <>
                <button className="car-nav car-prev" onClick={() => go(-1)} aria-label="Anterior">
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="car-nav car-next" onClick={() => go(1)} aria-label="Siguiente">
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <span className="car-count">
                  {slide + 1} / {total}
                </span>
              </>
            )}
          </div>

          {total > 1 && (
            <>
              <div className="car-dots">
                {finca.gallery.map((_: string, i: number) => (
                  <button
                    key={i}
                    className={`dot${i === slide ? " on" : ""}`}
                    onClick={() => setSlide(i)}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
              <div className="car-thumbs">
                {finca.gallery.map((g: string, i: number) => (
                  <div
                    key={i}
                    className={`thumb${i === slide ? " on" : ""}`}
                    style={{ backgroundImage: `url('${g}')` }}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Relato + ficha técnica */}
      <section className="story-sec">
        <div className="wrap">
          <div className="story-grid">
            <div>
              {finca.story && (
                <div className="blk">
                  <div className="eyebrow-row">
                    <div className="eyebrow-line" />
                    <span className="eyebrow-text">La finca</span>
                  </div>
                  <h2 className="blk-h">Quiénes están detrás</h2>
                  <p className="blk-p">{finca.story}</p>
                </div>
              )}

              {finca.terroir && (
                <div className="blk">
                  <div className="eyebrow-row">
                    <div className="eyebrow-line" />
                    <span className="eyebrow-text">Terroir</span>
                  </div>
                  <h2 className="blk-h">La tierra que lo explica todo</h2>
                  <p className="blk-p">{finca.terroir}</p>
                </div>
              )}

              {finca.coffeeProfile && (
                <div className="blk">
                  <div className="eyebrow-row">
                    <div className="eyebrow-line" />
                    <span className="eyebrow-text">Su café</span>
                  </div>
                  <h2 className="blk-h">Qué vas a encontrar en la taza</h2>
                  <p className="blk-p">{finca.coffeeProfile}</p>
                </div>
              )}

              {!finca.story && !finca.terroir && !finca.coffeeProfile && finca.description && (
                <div className="blk">
                  <div className="eyebrow-row">
                    <div className="eyebrow-line" />
                    <span className="eyebrow-text">La finca</span>
                  </div>
                  <h2 className="blk-h">{finca.name}</h2>
                  <p className="blk-p">{finca.description}</p>
                </div>
              )}
            </div>

            <aside className="spec">
              <div className="spec-h">Ficha técnica</div>
              {finca.producer && (
                <div className="spec-r">
                  <span className="spec-k">Productor</span>
                  <span className="spec-v">{finca.producer}</span>
                </div>
              )}
              <div className="spec-r">
                <span className="spec-k">Ubicación</span>
                <span className="spec-v">{finca.location}</span>
              </div>
              {finca.altitude > 0 && (
                <div className="spec-r">
                  <span className="spec-k">Altitud</span>
                  <span className="spec-v">{finca.altitude} msnm</span>
                </div>
              )}
              {finca.varieties.length > 0 && (
                <div className="spec-r">
                  <span className="spec-k">Variedades</span>
                  <span className="spec-v spec-tags">
                    {finca.varieties.map((v: string) => (
                      <span className="spec-tag" key={v}>{v}</span>
                    ))}
                  </span>
                </div>
              )}
              {finca.processes.length > 0 && (
                <div className="spec-r">
                  <span className="spec-k">Procesos</span>
                  <span className="spec-v spec-tags">
                    {finca.processes.map((p: string) => (
                      <span className="spec-tag" key={p}>{p}</span>
                    ))}
                  </span>
                </div>
              )}

              {(finca.website || finca.instagram || finca.whatsapp) && (
                <div className="spec-links">
                  {finca.website && (
                    <a className="spec-lnk" href={finca.website} target="_blank" rel="noopener noreferrer">
                      Sitio web
                    </a>
                  )}
                  {finca.instagram && (
                    <a className="spec-lnk" href={finca.instagram} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  )}
                  {finca.whatsapp && (
                    <a className="spec-lnk" href={`https://wa.me/${finca.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Experiencias de esta finca */}
      <section className="exp-sec">
        <div className="wrap">
          <div className="exp-head">
            <div className="exp-eye-row">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Del Origen a la Barra</span>
              <div className="eyebrow-line" />
            </div>
            <h2 className="exp-h">Experiencias en {finca.name}</h2>
            <p className="exp-p">
              Recorre con quien lo siembra el camino completo del grano, desde el cafetal
              hasta la taza.
            </p>
          </div>

          {/* Las experiencias se reservan en Panama Unique */}
          <div className="exp-cta">
            <a
              className="exp-cta-btn"
              href="https://panamaunique.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver experiencias
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <p className="exp-cta-nota">Reservas gestionadas por Panama Unique</p>
          </div>
        </div>
      </section>

    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

export default function FincaDetailClient({ finca }: { finca: any }) {
  const [slide, setSlide] = useState(0);
  const [booking, setBooking] = useState<any | null>(null);

  const total = finca.gallery.length;
  const go = (dir: number) => setSlide((s) => (s + dir + total) % total);

  const fmtPrice = (exp: any) => (exp.price > 0 ? `$${exp.price.toFixed(2)}` : "Consultar");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.18}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,#38050e 0%,rgba(56,5,14,.7) 100%)}
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
        .ec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .ec{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.12),0 1px 3px 1px rgba(0,0,0,.08);transition:box-shadow .25s,transform .25s;border:1px solid #cddbf2;display:flex;flex-direction:column}
        .ec:hover{box-shadow:0 4px 8px 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.12);transform:translateY(-5px)}
        .ec-img{width:100%;aspect-ratio:4/3;background-size:cover;background-position:center;display:flex;align-items:flex-start;justify-content:flex-end;padding:9px}
        .ec-price{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:900;background:#cddbf2;color:#38050e;padding:4px 11px;border-radius:50px}
        .ec-body{padding:13px 14px 11px;display:flex;flex-direction:column;flex:1}
        .ec-title{font-family:'Barlow Condensed',sans-serif;font-size:1.45rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:5px}
        .ec-sum{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.5;color:#38050e;opacity:.75;margin-bottom:10px}
        .ec-meta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:10px}
        .ec-m{display:flex;align-items:center;gap:5px;font-family:'Barlow',sans-serif;font-size:12px;color:#38050e;opacity:.6}
        .ec-inc{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:11px}
        .ec-i{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;color:#38050e;background:#f4efe4;border:1px solid #cddbf2;padding:3px 9px;border-radius:50px}
        .ec-acts{display:flex;gap:7px;padding-top:9px;border-top:1px solid #cddbf2;margin-top:auto}
        .ecb{flex:1;height:33px;border-radius:50px;border:none;font-family:'Barlow',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;background:#38050e;color:#fff}
        .ecb:hover{background:#cddbf2;color:#38050e}
        .exp-empty{text-align:center;color:#38050e;opacity:.55;font-family:'Barlow',sans-serif;padding:20px 0 0}
        .exp-all{display:flex;justify-content:center;margin-top:30px}
        .exp-all a{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 22px;border-radius:50px;border:1px solid #38050e;color:#38050e;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;text-decoration:none;transition:all .2s}
        .exp-all a:hover{background:#38050e;color:#fff}

        /* ── Modal de reserva ── */
        .bk-ov{position:fixed;inset:0;z-index:400;background:rgba(56,5,14,.75);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px}
        .bk{background:#fff;border-radius:20px;max-width:440px;width:100%;overflow:hidden;border:1px solid #cddbf2}
        .bk-hd{background:#38050e;padding:18px 22px}
        .bk-hd-t{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:900;text-transform:uppercase;color:#fff;line-height:1.05}
        .bk-hd-s{font-family:'Barlow',sans-serif;font-size:12px;color:rgba(205,219,242,.75);margin-top:3px}
        .bk-bd{padding:20px 22px}
        .bk-row{display:flex;justify-content:space-between;align-items:center;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;padding:7px 0;border-bottom:1px solid #f4efe4}
        .bk-row strong{font-family:'Barlow Condensed',sans-serif;font-size:1.15rem;font-weight:900}
        .bk-note{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.55;color:#38050e;opacity:.75;margin-top:14px;background:#f4efe4;border:1px solid #cddbf2;border-radius:12px;padding:12px 14px}
        .bk-acts{display:flex;gap:8px;margin-top:16px}
        .bkb{flex:1;height:38px;border-radius:50px;border:none;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s;background:#f4efe4;color:#38050e}
        .bkb:hover{background:#cddbf2}

        @media(max-width:960px){
          .story-grid{grid-template-columns:1fr;gap:26px}
          .spec{position:static}
          .ec-grid{grid-template-columns:1fr 1fr}
        }
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
          .car-nav{width:36px;height:36px}
        }
        @media(max-width:640px){.ec-grid{grid-template-columns:1fr}}
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

          {finca.experiences.length > 0 ? (
            <div className="ec-grid">
              {finca.experiences.map((exp: any) => (
                <article className="ec" key={exp.id}>
                  <div className="ec-img" style={{ backgroundImage: `url('${exp.img}')` }}>
                    <span className="ec-price">{fmtPrice(exp)}</span>
                  </div>
                  <div className="ec-body">
                    <h3 className="ec-title">{exp.title}</h3>
                    {exp.summary && <p className="ec-sum">{exp.summary}</p>}
                    <div className="ec-meta">
                      {exp.duration && (
                        <span className="ec-m">
                          <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", fill: "none", strokeWidth: 1.5 }}>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {exp.duration}
                        </span>
                      )}
                      {exp.capacity > 0 && (
                        <span className="ec-m">
                          <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", fill: "none", strokeWidth: 1.5 }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          Hasta {exp.capacity}
                        </span>
                      )}
                    </div>
                    {exp.includes.length > 0 && (
                      <div className="ec-inc">
                        {exp.includes.slice(0, 3).map((i: string) => (
                          <span className="ec-i" key={i}>{i}</span>
                        ))}
                      </div>
                    )}
                    <div className="ec-acts">
                      <button className="ecb" onClick={() => setBooking(exp)}>Reservar</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="exp-empty">Esta finca aún no publica experiencias.</p>
          )}

          <div className="exp-all">
            <Link href="/fincas/experienciasdelorigenalabarra">
              Ver todas las experiencias
              <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de reserva — punto único donde se conectará la pasarela de pago */}
      {booking && (
        <div className="bk-ov" onClick={() => setBooking(null)}>
          <div className="bk" onClick={(e) => e.stopPropagation()}>
            <div className="bk-hd">
              <div className="bk-hd-t">{booking.title}</div>
              <div className="bk-hd-s">
                {finca.name} · {finca.location}
              </div>
            </div>
            <div className="bk-bd">
              {booking.duration && (
                <div className="bk-row">
                  <span>Duración</span>
                  <span>{booking.duration}</span>
                </div>
              )}
              {booking.capacity > 0 && (
                <div className="bk-row">
                  <span>Cupo por tanda</span>
                  <span>{booking.capacity} personas</span>
                </div>
              )}
              <div className="bk-row">
                <span>Precio por persona</span>
                <strong>{fmtPrice(booking)}</strong>
              </div>

              <div className="bk-note">
                Las reservas en línea abren cuando se active la pasarela de pago.
                Mientras tanto, escríbenos y coordinamos tu visita a {finca.name}.
              </div>

              <div className="bk-acts">
                <button className="bkb" onClick={() => setBooking(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

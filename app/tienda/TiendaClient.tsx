"use client";

import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

export default function TiendaClient({ initialProducts }: { initialProducts: any[] }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.62}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:64px 0 58px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{max-width:920px}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(42px,6.4vw,76px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.88;margin:0;max-width:900px;text-wrap:balance}
        .ph-by{display:block;font-size:.44em;font-weight:400;line-height:1.15;color:rgba(205,219,242,.82);margin-top:14px;letter-spacing:.02em}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:opacity .2s;text-decoration:none}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* ── Intro ── */
        .intro{background:#fff;padding:64px 0 54px}
        .eyebrow-row{display:flex;align-items:center;gap:14px;margin-bottom:12px}
        .eyebrow-line{height:1px;width:40px;background:#cddbf2}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e;opacity:.6}
        .intro-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
        .intro-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(32px,4.5vw,52px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.94;margin-bottom:24px;max-width:850px}
        .intro-p{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.65;color:#38050e;opacity:.78;margin-top:14px}
        .curated{margin-top:24px;padding:22px 24px;border-left:3px solid #38050e;background:#f4efe4}
        .curated-h{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;text-transform:uppercase;color:#38050e;margin:0 0 6px}
        .curated .intro-p{margin-top:0}

        /* ── Catálogo ── */
        .catalog-sec{background:#f4efe4;padding:56px 0 72px}
        .fc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .fc{background:#fff;border:1px solid #cddbf2;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .25s,transform .25s}
        .fc:hover{box-shadow:0 8px 24px rgba(56,5,14,0.12);transform:translateY(-5px)}
        .fc-img{width:100%;aspect-ratio:4/3;background-size:cover;background-position:center;position:relative;display:flex;align-items:flex-end;padding:12px}
        
        /* Lámina del producto si no tiene imagen */
        .fc-lamina{background:linear-gradient(140deg,#4a0a15 0%,#38050e 55%,#24060c 100%);align-items:stretch;flex-direction:column;justify-content:space-between}
        .fc-lamina-txt{position:relative;z-index:1}
        .fc-lamina-eye{display:block;font-family:'Barlow',sans-serif;font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,219,242,.7);margin-bottom:5px}
        .fc-lamina-name{display:block;font-family:'Barlow Condensed',sans-serif;font-size:clamp(20px,2.4vw,26px);font-weight:900;text-transform:uppercase;line-height:.95;color:#fff}
        
        .fc-price-badge{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;background:#38050e;color:#fff;padding:6px 14px;border-radius:50px;border:1px solid rgba(205,219,242,.2);align-self:flex-end;box-shadow:0 4px 10px rgba(0,0,0,0.2)}
        
        .fc-body{padding:20px;display:flex;flex-direction:column;flex:1}
        .fc-name{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:6px}
        .fc-desc{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.5;color:#38050e;opacity:.78;margin-top:6px}
        .fc-disc{margin-top:auto;padding-top:20px}
        .fc-disc a{display:inline-flex;align-items:center;gap:7px;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;color:#38050e;text-decoration:none;border-bottom:1px solid #38050e;padding-bottom:2px;transition:opacity .2s}
        .fc-disc a:hover{opacity:.6}

        .empty{text-align:center;color:#38050e;opacity:.5;font-family:'Barlow',sans-serif;padding:80px 0}

        @media(max-width:960px){.fc-grid{grid-template-columns:1fr 1fr}.intro-grid{grid-template-columns:1fr;gap:24px}}
        @media(max-width:768px){.ph-cnt{padding:54px 0 46px}}
        @media(max-width:640px){.fc-grid{grid-template-columns:1fr}}
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Coffee Geeks Shop · Panamá</div>
                <h1 className="ph-h1">
                  La Tienda Oficial
                  <span className="ph-by">De la Comunidad Coffee Geek</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>Tienda</span>
          </div>
        </div>
      </div>

      {/* Catálogo de Productos */}
      <section className="catalog-sec">
        <div className="wrap">
          {initialProducts.length === 0 ? (
            <div className="empty">
              <h3>No hay productos disponibles en este momento.</h3>
              <p>Vuelve pronto para conocer nuestro nuevo inventario de especialidad.</p>
            </div>
          ) : (
            <div className="fc-grid">
              {initialProducts.map((product) => (
                <div key={product._id} className="fc">
                  {product.image ? (
                    <div 
                      className="fc-img" 
                      style={{ backgroundImage: `url('${product.image}')` }}
                    >
                      <span className="fc-price-badge">${product.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="fc-img fc-lamina">
                      <div className="fc-lamina-txt">
                        <span className="fc-lamina-eye">Coffee Geeks</span>
                        <span className="fc-lamina-name">{product.name}</span>
                      </div>
                      <span className="fc-price-badge">${product.price.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="fc-body">
                    <h3 className="fc-name">{product.name}</h3>
                    <p className="fc-desc">{product.shortDescription || "Sin descripción corta disponible."}</p>
                    
                    <div className="fc-disc">
                      <Link href={`/tienda/${product._id}`}>
                        Ver detalles del producto
                        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 2.5, marginLeft: 2, display: "inline-block", verticalAlign: "middle" }}>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

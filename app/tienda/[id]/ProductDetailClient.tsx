"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import { useCarrito } from "@/app/components/tienda/CarritoContext";

export default function ProductDetailClient({ product }: { product: any }) {
  const { agregarProducto } = useCarrito();
  const router = useRouter();

  const variantes: any[] = product.variants || [];
  const [varianteId, setVarianteId] = useState<string>(variantes[0]?._id?.toString() || "");
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const variante = variantes.find((v) => v._id?.toString() === varianteId);
  // -1 significa existencia ilimitada: es lo correcto para el pasaporte digital
  const existencia = variante ? variante.stock : product.stock ?? -1;
  const agotado = existencia === 0;
  const quedanPocas = existencia > 0 && existencia <= 5;

  function alCarrito() {
    agregarProducto({
      productId: product._id,
      variantId: varianteId,
      variant: variante?.label || "",
      name: product.name,
      price: product.price,
      image: product.image || "",
      requiresShipping: product.requiresShipping !== false,
      quantity: cantidad,
    });
    setAgregado(true);
    return true;
  }

  function comprarAhora() {
    alCarrito();
    router.push("/tienda/checkout");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0 44px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,2.5vw,26px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:opacity .2s;text-decoration:none}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* ── Detail Page Layout ── */
        .main-sec{background:#fff;padding:56px 0 72px}
        .prod-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:start}
        .prod-left-col{display:flex;flex-direction:column;gap:48px;min-width:0}
        
        .img-container{width:100%;aspect-ratio:4/3;border-radius:24px;overflow:hidden;border:1px solid #cddbf2;background:#f4efe4;box-shadow:0 8px 30px rgba(56,5,14,0.06)}
        .img-view{width:100%;height:100%;background-size:cover;background-position:center}
        
        .img-lamina{background:linear-gradient(140deg,#4a0a15 0%,#38050e 55%,#24060c 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px;text-align:center;height:100%}
        .img-lamina-eye{font-family:'Barlow',sans-serif;font-size:12px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(205,219,242,.7);margin-bottom:12px}
        .img-lamina-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:900;text-transform:uppercase;color:#fff;line-height:1}

        /* Pay Card */
        .pay-card{background:#f4efe4;border:1px solid #cddbf2;border-radius:24px;padding:32px;position:sticky;top:88px}
        .pay-name{font-family:'Barlow Condensed',sans-serif;font-size:2.2rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:8px}
        .pay-price{font-family:'Barlow Condensed',sans-serif;font-size:3.2rem;font-weight:900;color:#38050e;line-height:1;margin:16px 0 24px}
        .pay-short{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#38050e;opacity:.8;margin-bottom:28px}
        
        .btn-pay{width:100%;height:56px;background:#38050e;color:#fff;font-family:'Barlow',sans-serif;font-weight:700;font-size:16px;border-radius:50px;border:none;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(56,5,14,0.18);display:flex;align-items:center;justify-content:center;gap:10px}
        .btn-pay:hover{background:#24060c;transform:translateY(-2px);box-shadow:0 6px 20px rgba(56,5,14,0.25)}

        /* Description content (WYSIWYG output) */
        .desc-sec{border-top:1px solid #eef3f9;padding-top:48px}
        .desc-h{font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:900;text-transform:uppercase;color:#38050e;margin-bottom:20px}
        .rich-content{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.75;color:#38050e;opacity:.9}
        .rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 16px;
          margin: 28px 0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .rich-content h2{font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:900;text-transform:uppercase;margin:32px 0 16px;color:#38050e}
        .rich-content h3{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:900;text-transform:uppercase;margin:24px 0 12px;color:#38050e}
        .rich-content p{margin-bottom:20px}
        .rich-content ul{list-style-type:disc;padding-left:20px;margin-bottom:20px}
        .rich-content ol{list-style-type:decimal;padding-left:20px;margin-bottom:20px}

        /* ── Selector de compra ── */
        .opciones{margin-bottom:22px}
        .opciones-lbl{display:block;font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#38050e;opacity:.65;margin-bottom:9px}
        .variantes{display:flex;flex-wrap:wrap;gap:8px}
        .variante{padding:9px 18px;border-radius:50px;border:1px solid #cddbf2;background:#fff;color:#38050e;font-family:'Barlow',sans-serif;font-size:14px;cursor:pointer;transition:all .15s}
        .variante:hover{border-color:#38050e}
        .variante.sel{background:#38050e;color:#fff;border-color:#38050e}
        .variante:disabled{opacity:.35;cursor:not-allowed;text-decoration:line-through}

        .cant{display:inline-flex;align-items:center;border:1px solid #cddbf2;border-radius:50px;overflow:hidden;background:#fff}
        .cant button{width:38px;height:38px;border:none;background:transparent;color:#38050e;font-size:18px;font-family:'Barlow',sans-serif;cursor:pointer;transition:background .15s}
        .cant button:hover{background:#cddbf2}
        .cant button:disabled{opacity:.3;cursor:not-allowed}
        .cant span{min-width:40px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:17px;color:#38050e;font-variant-numeric:tabular-nums}

        .stock{font-family:'Barlow',sans-serif;font-size:13px;margin-top:10px}
        .stock-pocas{color:#8a1220}
        .stock-agotado{color:#8a1220;font-weight:500}

        .btn-sec{width:100%;height:52px;margin-top:12px;background:transparent;color:#38050e;font-family:'Barlow',sans-serif;font-weight:500;font-size:15px;border-radius:50px;border:1px solid #38050e;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}
        .btn-sec:hover{background:#38050e;color:#fff}
        .btn-pay:disabled,.btn-sec:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}

        .listo{display:flex;align-items:center;gap:9px;margin-top:14px;padding:12px 16px;background:#fff;border:1px solid #cddbf2;border-radius:14px;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e}
        .listo a{color:#38050e;font-weight:500}

        .envio-nota{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.5;color:#38050e;opacity:.65;margin-top:16px}

        @media(max-width:960px){
          .prod-grid{grid-template-columns:1fr;gap:32px}
          .prod-left-col{display:contents}
          .img-container{order:1}
          .pay-card{order:2}
          .desc-sec{order:3;padding-top:32px}
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Tienda Oficial · Detalle del Producto</div>
                <h1 className="ph-h1">{product.name}</h1>
                <h2 className="ph-h2">${product.price.toFixed(2)} USD</h2>
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
            <Link href="/tienda">Tienda</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Main Section */}
      <section className="main-sec">
        <div className="wrap">
          <div className="prod-grid">
            {/* Left Column: Image & Description */}
            <div className="prod-left-col">
              <div className="img-container">
                {product.image ? (
                  <div className="img-view" style={{ backgroundImage: `url('${product.image}')` }} />
                ) : (
                  <div className="img-lamina">
                    <span className="img-lamina-eye">Coffee Geeks</span>
                    <span className="img-lamina-name">{product.name}</span>
                  </div>
                )}
              </div>

              {/* Complete Description (WYSIWYG Output) */}
              {product.description && (
                <div className="desc-sec">
                  <h3 className="desc-h">Descripción del Producto</h3>
                  <div 
                    className="rich-content" 
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                </div>
              )}
            </div>

            {/* Tarjeta de compra */}
            <div className="pay-card">
              <h2 className="pay-name">{product.name}</h2>
              <div className="pay-price">${product.price.toFixed(2)} USD</div>
              <p className="pay-short">{product.shortDescription || "Este producto no tiene una descripción corta asignada."}</p>

              {variantes.length > 0 && (
                <div className="opciones">
                  <span className="opciones-lbl">Presentación</span>
                  <div className="variantes">
                    {variantes.map((v) => {
                      const id = v._id?.toString();
                      return (
                        <button
                          key={id}
                          type="button"
                          className={`variante${id === varianteId ? " sel" : ""}`}
                          disabled={v.stock === 0}
                          onClick={() => {
                            setVarianteId(id);
                            setCantidad(1);
                            setAgregado(false);
                          }}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="opciones">
                <span className="opciones-lbl">Cantidad</span>
                <div className="cant">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    disabled={cantidad <= 1}
                    aria-label="Quitar una unidad"
                  >
                    −
                  </button>
                  <span>{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => (existencia === -1 ? c + 1 : Math.min(existencia, c + 1)))}
                    disabled={existencia !== -1 && cantidad >= existencia}
                    aria-label="Agregar una unidad"
                  >
                    +
                  </button>
                </div>

                {agotado ? (
                  <div className="stock stock-agotado">Agotado por ahora</div>
                ) : quedanPocas ? (
                  <div className="stock stock-pocas">Quedan {existencia} unidades</div>
                ) : null}
              </div>

              <button className="btn-pay" onClick={comprarAhora} disabled={agotado}>
                Comprar ahora
              </button>

              <button className="btn-sec" onClick={alCarrito} disabled={agotado}>
                Agregar al carrito
              </button>

              {agregado && (
                <div className="listo">
                  <span>✓</span>
                  <span>
                    Listo, está en tu carrito. <Link href="/tienda/carrito">Ver carrito</Link>
                  </span>
                </div>
              )}

              <p className="envio-nota">
                {product.requiresShipping === false
                  ? "Entrega digital: te llega por correo, sin costo de envío."
                  : "Envíos a todo Panamá. El costo se calcula en el siguiente paso."}
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

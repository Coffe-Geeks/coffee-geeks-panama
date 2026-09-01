"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

export default function ProductDetailClient({ product }: { product: any }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentStage, setPaymentStage] = useState<"processing" | "success">("processing");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (showModal) {
      setPaymentStage("processing");
      // Generate a random order number
      const randomOrder = `CG-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(randomOrder);

      // Simulate processing checkout
      const timer = setTimeout(() => {
        setPaymentStage("success");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Handle redirection if webhook exists when payment succeeds
  useEffect(() => {
    if (showModal && paymentStage === "success" && product.webhook) {
      const redirectTimer = setTimeout(() => {
        try {
          const webhookUrl = new URL(product.webhook);
          webhookUrl.searchParams.append("status", "success");
          webhookUrl.searchParams.append("orderId", orderNumber);
          webhookUrl.searchParams.append("productId", product._id);
          webhookUrl.searchParams.append("price", product.price.toString());
          webhookUrl.searchParams.append("productName", product.name);
          
          window.location.href = webhookUrl.toString();
        } catch (e) {
          // If URL parsing fails, redirect to the literal string
          const divider = product.webhook.includes("?") ? "&" : "?";
          window.location.href = `${product.webhook}${divider}status=success&orderId=${orderNumber}&productId=${product._id}`;
        }
      }, 2500);

      return () => clearTimeout(redirectTimer);
    }
  }, [paymentStage, showModal, product.webhook, orderNumber, product._id, product.name, product.price]);

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

        /* ── Modal ── */
        .modal-overlay{position:fixed;inset:0;background:rgba(20,5,8,0.75);backdrop-filter:blur(8px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
        .modal-card{width:100%;max-width:480px;background:#fff;border:1px solid #cddbf2;border-radius:32px;padding:40px;box-shadow:0 20px 50px rgba(0,0,0,0.3);text-align:center;position:relative;overflow:hidden;animation:fadeInUp 0.3s ease-out}
        @keyframes fadeInUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        
        .modal-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:#38050e;opacity:.5;margin-bottom:8px}
        .modal-title{font-family:'Barlow Condensed',sans-serif;font-size:2.2rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1;margin-bottom:20px}
        .modal-desc{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#38050e;opacity:.8;margin-bottom:28px}
        
        /* Spinner */
        .spinner{width:56px;height:56px;border:4px solid #cddbf2;border-top-color:#38050e;border-radius:50px;animation:spin 1s linear infinite;margin:0 auto 24px}
        @keyframes spin{to{transform:rotate(360deg)}}
        
        /* Success Icon */
        .success-icon{width:64px;height:64px;background:#cddbf2;color:#38050e;font-size:32px;border-radius:50px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 8px 20px rgba(205,219,242,0.4)}
        
        .order-badge{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:900;background:#f4efe4;color:#38050e;padding:6px 16px;border-radius:50px;display:inline-block;margin-bottom:20px}
        .webhook-notice{font-family:'Barlow',sans-serif;font-size:12px;color:#cddbf2;background:#38050e;padding:8px 16px;border-radius:8px;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:8px}

        .btn-close{height:44px;padding:0 24px;background:#38050e;color:#fff;font-family:'Barlow',sans-serif;font-weight:500;font-size:14px;border-radius:50px;border:none;cursor:pointer;transition:all .15s}
        .btn-close:hover{background:#24060c}

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

            {/* Pay Card Info */}
            <div className="pay-card">
              <h2 className="pay-name">{product.name}</h2>
              <div className="pay-price">${product.price.toFixed(2)} USD</div>
              <p className="pay-short">{product.shortDescription || "Este producto no tiene una descripción corta asignada."}</p>
              
              <button className="btn-pay" onClick={() => setShowModal(true)}>
                <span>🛒</span>
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simulated Payment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            {paymentStage === "processing" ? (
              <>
                <div className="spinner" />
                <div className="modal-eye">Pasarela Simulado</div>
                <h3 className="modal-title">Procesando Pago</h3>
                <p className="modal-desc">
                  Estamos contactando a tu banco de prueba para validar los fondos de tu compra de <strong>{product.name}</strong> por un total de <strong>${product.price.toFixed(2)} USD</strong>.
                </p>
              </>
            ) : (
              <>
                <div className="success-icon">✓</div>
                <div className="modal-eye">¡Transacción Exitosa!</div>
                <h3 className="modal-title">¡Gracias por tu compra!</h3>
                <div className="order-badge">Orden: {orderNumber}</div>
                <p className="modal-desc">
                  Tu pago de <strong>${product.price.toFixed(2)} USD</strong> por <strong>{product.name}</strong> ha sido acreditado exitosamente. Se ha enviado un comprobante a tu correo de prueba.
                </p>
                
                {product.webhook ? (
                  <div className="webhook-notice">
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 2, animation: "spin 2s linear infinite" }}>
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    <span>Redireccionando al webhook de destino...</span>
                  </div>
                ) : (
                  <button className="btn-close" onClick={() => setShowModal(false)}>
                    Cerrar Ventana
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

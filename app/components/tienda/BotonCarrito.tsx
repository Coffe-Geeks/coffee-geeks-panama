"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCarrito } from "./CarritoContext";

/**
 * Acceso flotante al carrito. Solo aparece cuando hay algo dentro: un
 * carrito vacío no necesita botón, y ocupando esquina estorba la lectura.
 * Tampoco se muestra en carrito, checkout ni pago, donde el total ya está
 * a la vista.
 */
export default function BotonCarrito() {
  const { unidades, subtotal, listo } = useCarrito();
  const ruta = usePathname();

  const enProcesoDeCompra =
    ruta?.startsWith("/tienda/carrito") ||
    ruta?.startsWith("/tienda/checkout") ||
    ruta?.startsWith("/tienda/pago") ||
    ruta?.startsWith("/tienda/pedido");

  if (!listo || unidades === 0 || enProcesoDeCompra) return null;

  return (
    <>
      <style>{`
        .cg-cart{
          position:fixed; right:clamp(16px,3vw,28px); bottom:clamp(16px,3vw,28px); z-index:180;
          display:inline-flex; align-items:center; gap:12px;
          height:54px; padding:0 24px; border-radius:50px;
          background:#38050e; color:#cddbf2; text-decoration:none;
          font-family:'Barlow',sans-serif; font-size:15px; font-weight:500;
          box-shadow:0 6px 20px rgba(56,5,14,.35);
          transition:background .2s, color .2s, transform .2s;
        }
        .cg-cart:hover{background:#cddbf2; color:#38050e; transform:translateY(-2px)}
        .cg-cart-txt{display:flex; flex-direction:column; gap:3px; line-height:1}
        .cg-cart-sub{font-size:11px; letter-spacing:.1em; text-transform:uppercase; opacity:.7; line-height:1}
        .cg-cart-num{
          position:absolute; top:-6px; left:-6px; min-width:24px; height:24px; padding:0 6px;
          display:flex; align-items:center; justify-content:center;
          border-radius:50px; background:#cddbf2; color:#38050e;
          font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:14px;
          border:2px solid #38050e;
        }
        @media(max-width:640px){
          .cg-cart{height:52px; left:16px; right:16px; justify-content:center}
        }
        @media (prefers-reduced-motion: reduce){ .cg-cart:hover{transform:none} }
      `}</style>

      <Link href="/tienda/carrito" className="cg-cart" style={{ position: "fixed" }}>
        <span style={{ position: "relative", display: "flex" }}>
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}>
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
          </svg>
          <span className="cg-cart-num">{unidades}</span>
        </span>
        <span className="cg-cart-txt">
          <span className="cg-cart-sub">Ver carrito</span>
          ${subtotal.toFixed(2)}
        </span>
      </Link>
    </>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { estilosTienda } from "@/app/components/tienda/estilos";
import { getPedidoPorNumero } from "@/app/actions/pedidos";
import LimpiarCarrito from "./LimpiarCarrito";
import { PUNTOS_RETIRO } from "@/lib/tienda/puntos-retiro";

export const metadata = {
  title: "Tu pedido | Tienda · Coffee Geeks Panamá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MENSAJES: Record<string, { titulo: string; texto: string; tono: "bien" | "mal" | "espera" }> = {
  pagado: {
    titulo: "¡Gracias por tu compra!",
    texto: "Tu pago fue aprobado y ya estamos preparando tu pedido. Te enviamos el comprobante por correo.",
    tono: "bien",
  },
  rechazado: {
    titulo: "El pago no se completó",
    // Sin texto propio a propósito: el motivo lo pone la pasarela. Inventar
    // aquí "tu banco no autorizó" afirma algo que muchas veces no es cierto
    // —puede ser la tarjeta, la verificación o un fallo técnico— y manda al
    // cliente a reclamarle a quien no tiene la culpa.
    texto: "",
    tono: "mal",
  },
  cancelado: {
    titulo: "Pedido cancelado",
    texto: "Este pedido fue cancelado. Si crees que es un error, escríbenos con el número de pedido.",
    tono: "mal",
  },
  pendiente: {
    titulo: "Tu pedido está pendiente de pago",
    texto: "Todavía no hemos recibido la confirmación del pago. Si ya pagaste, dale un momento y recarga esta página.",
    tono: "espera",
  },
  enviado: {
    titulo: "Tu pedido va en camino",
    texto: "Ya despachamos tu compra. Te avisamos por correo cualquier novedad de la entrega.",
    tono: "bien",
  },
  entregado: {
    titulo: "Pedido entregado",
    texto: "Tu compra fue entregada. Gracias por apoyar el café panameño.",
    tono: "bien",
  },
};

export default async function PedidoPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const pedido = await getPedidoPorNumero(numero);

  if (!pedido) return notFound();

  const mensaje = MENSAJES[pedido.status] || MENSAJES.pendiente;
  const dir = pedido.shippingAddress || {};
  // Solo se listan los puntos si el pedido trae algo físico que retirar, y
  // solo cuando ya está pagado: antes no hay nada que recoger.
  const hayRetiro =
    pedido.items?.some((i: any) => i.pickupInStore) &&
    ["pagado", "enviado", "entregado"].includes(pedido.status);

  return (
    <>
      <style>{estilosTienda}</style>
      <style>{`
        .marca{width:64px;height:64px;border-radius:50px;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 20px}
        .marca-bien{background:#cddbf2;color:#38050e}
        .marca-mal{background:#fdecee;color:#8a1220}
        .marca-espera{background:#f4efe4;color:#38050e;border:2px solid #cddbf2}
        .conf-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,42px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:1;margin:0 0 12px;text-align:center}
        .conf-p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.6;color:#38050e;opacity:.8;margin:0 auto;max-width:520px;text-align:center}
        .num{display:block;width:fit-content;margin:22px auto 0;font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:900;background:#38050e;color:#f4efe4;padding:8px 22px;border-radius:50px;letter-spacing:.04em}
        .datos-envio{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.65;color:#38050e;opacity:.85}
        .datos-envio dt{font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.6;margin-bottom:4px}
        .datos-envio dd{margin:0 0 14px}

        .puntos{display:grid;grid-template-columns:repeat(2,1fr);gap:2px 20px;margin-top:14px;list-style:none;padding:0}
        .punto{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.5;color:#38050e;padding:7px 0;border-bottom:1px solid #f4efe4}
        .punto b{font-weight:500}
        .punto span{display:block;font-size:12.5px;opacity:.62}
        @media(max-width:640px){.puntos{grid-template-columns:1fr}}
      `}</style>

      <Navbar />

      {pedido.status === "pagado" && <LimpiarCarrito />}

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">Tienda Oficial · Coffee Geeks Panamá</div>
            <h1 className="ph-h1">Tu pedido</h1>
            <h2 className="ph-h2">{pedido.orderNumber}</h2>
          </div>
        </div>
      </div>

      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <Flecha />
            <Link href="/tienda">Tienda</Link>
            <Flecha />
            <span>Pedido {pedido.orderNumber}</span>
          </div>
        </div>
      </div>

      <section className="sec-claro">
        <div className="wrap">
          <div className="compra-grid">
            <div>
              <div className="tarjeta" style={{ paddingTop: 36, paddingBottom: 36 }}>
                <div className={`marca marca-${mensaje.tono}`}>
                  {mensaje.tono === "bien" ? "✓" : mensaje.tono === "mal" ? "✕" : "…"}
                </div>
                <h2 className="conf-h">{mensaje.titulo}</h2>

                {/* El motivo real de la pasarela manda sobre el texto genérico */}
                {pedido.status === "rechazado" ? (
                  <>
                    {pedido.payment?.responseMessage && (
                      <p className="conf-p">{pedido.payment.responseMessage}</p>
                    )}
                    <p className="conf-p" style={{ marginTop: 10 }}>
                      No se te ha cobrado nada.
                    </p>
                  </>
                ) : (
                  mensaje.texto && <p className="conf-p">{mensaje.texto}</p>
                )}
                <span className="num">{pedido.orderNumber}</span>

                {/* Indicación del banco emisor, cuando la manda */}
                {pedido.payment?.cardholderInfo && (
                  <p className="conf-p" style={{ marginTop: 20, fontSize: 14 }}>
                    <strong>Tu banco indica:</strong> {pedido.payment.cardholderInfo}
                  </p>
                )}

                {pedido.status === "rechazado" && (
                  <Link href="/tienda/carrito" className="btn-primario" style={{ maxWidth: 320, margin: "26px auto 0" }}>
                    Volver a intentar
                  </Link>
                )}
              </div>

              {hayRetiro && (
                <div className="tarjeta">
                  <h2 className="tarjeta-h">Dónde retirar tu pasaporte</h2>
                  <p className="tarjeta-p">
                    Tu cuenta digital ya quedó activa. La libreta física la retiras en cualquiera de
                    estos establecimientos, presentando tu número de pedido{" "}
                    <strong>{pedido.orderNumber}</strong>. No hacemos entregas a domicilio.
                  </p>
                  <ul className="puntos">
                    {PUNTOS_RETIRO.map((p, i) => (
                      <li className="punto" key={i}>
                        <b>{p.nombre}</b>
                        <span>{p.ubicacion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="tarjeta">
                <h2 className="tarjeta-h">{pedido.requiresShipping ? "Entrega" : "Cómo lo recibes"}</h2>
                <p className="tarjeta-p">
                  {pedido.requiresShipping
                    ? "Despachamos a esta dirección."
                    : "Te escribimos al correo con las instrucciones de acceso."}
                </p>

                <dl className="datos-envio">
                  <dt>A nombre de</dt>
                  <dd>
                    {pedido.customer.name}
                    <br />
                    {pedido.customer.email}
                    {pedido.customer.phone ? <><br />{pedido.customer.phone}</> : null}
                  </dd>

                  {pedido.requiresShipping && dir.line1 && (
                    <>
                      <dt>Dirección</dt>
                      <dd>
                        {dir.line1}
                        {dir.line2 ? <><br />{dir.line2}</> : null}
                        <br />
                        {[dir.city, dir.province].filter(Boolean).join(", ")}
                        <br />
                        {dir.country || "Panamá"}
                        {dir.notes ? (
                          <>
                            <br />
                            <span style={{ opacity: 0.7 }}>Indicaciones: {dir.notes}</span>
                          </>
                        ) : null}
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            </div>

            <aside className="resumen">
              <h2 className="resumen-h">Detalle</h2>

              {pedido.items.map((i: any, idx: number) => (
                <div className="fila" key={idx}>
                  <span>
                    {i.quantity} × {i.name}
                    {i.variant ? ` · ${i.variant}` : ""}
                  </span>
                  <span>${(i.unitPrice * i.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="fila">
                <span>Envío</span>
                <span>
                  {!pedido.requiresShipping
                    ? "No aplica"
                    : pedido.shippingCost === 0
                    ? "Gratis"
                    : `$${pedido.shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="fila fila-total">
                <span>Total</span>
                <span>${pedido.total.toFixed(2)} USD</span>
              </div>

              <Link href="/tienda" className="btn-primario">
                Seguir comprando
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Flecha() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

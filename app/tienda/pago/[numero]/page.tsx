import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { estilosTienda } from "@/app/components/tienda/estilos";
import { getPedidoPorNumero } from "@/app/actions/pedidos";
import { iniciarPago, pasarelaDisponible } from "@/lib/pagos/powertranz";
import { registrarInicioDePago } from "@/lib/tienda/pago-pedido";
import PanelPrueba from "./PanelPrueba";

export const metadata = {
  title: "Pago | Tienda · Coffee Geeks Panamá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** URL absoluta de este sitio: la pasarela necesita a dónde devolver al cliente. */
async function urlBase() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function PagoPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const pedido = await getPedidoPorNumero(numero);

  if (!pedido) return notFound();

  // Un pedido ya resuelto no vuelve a la pasarela: se muestra su resultado
  if (pedido.status !== "pendiente") redirect(`/tienda/pedido/${numero}`);

  const modoPrueba = process.env.POWERTRANZ_MODO_PRUEBA === "true";
  let redirectData = "";
  let errorPasarela = "";

  if (pasarelaDisponible()) {
    try {
      const base = await urlBase();
      const transactionIdentifier = crypto.randomUUID();

      const respuesta = await iniciarPago({
        transactionIdentifier,
        orderIdentifier: pedido.orderNumber,
        total: pedido.total,
        merchantResponseUrl: `${base}/api/pagos/powertranz/respuesta`,
      });

      await registrarInicioDePago(pedido.orderNumber, {
        transactionIdentifier,
        orderIdentifier: pedido.orderNumber,
        spiToken: respuesta.spiToken,
      });

      redirectData = respuesta.redirectData;
    } catch (err: any) {
      console.error("Error al abrir la transacción en PowerTranz:", err);
      errorPasarela = err?.message || "No pudimos conectar con la pasarela de pago.";
    }
  }

  return (
    <>
      <style>{estilosTienda}</style>
      <style>{`
        .marco-pago{padding:0;overflow:hidden}
        .marco-cab{background:#38050e;padding:16px 24px;display:flex;flex-direction:column;gap:4px}
        .marco-cab-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,219,242,.7)}
        .marco-cab-txt{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.45;color:#fff}
      `}</style>

      <Navbar />

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">Pedido {pedido.orderNumber}</div>
            <h1 className="ph-h1">Pago</h1>
            <h2 className="ph-h2">${pedido.total.toFixed(2)} USD</h2>
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
            <span>Pago</span>
          </div>
        </div>
      </div>

      <section className="sec-claro">
        <div className="wrap">
          <div className="pasos">
            <span className="paso"><span className="paso-num">1</span> Carrito</span>
            <span className="paso-sep" />
            <span className="paso"><span className="paso-num">2</span> Tus datos</span>
            <span className="paso-sep" />
            <span className="paso activo"><span className="paso-num">3</span> Pago</span>
          </div>

          <div className="compra-grid">
            <div>
              {redirectData ? (
                <div className="tarjeta marco-pago">
                  {/* El formulario de tarjeta lo sirve BAC desde su propio
                      dominio. No se le puede aplicar CSS desde aquí, así que
                      la continuidad visual se sostiene con este marco y con
                      la plantilla de marca cargada en el Portal del Comercio
                      (ver docs/pago). */}
                  <div className="marco-cab">
                    <span className="marco-cab-eye">Pago seguro</span>
                    <span className="marco-cab-txt">
                      Estás en la plataforma de BAC Credomatic. Tus datos de tarjeta no pasan por Coffee Geeks.
                    </span>
                  </div>

                  <iframe
                    title="Pago seguro con BAC Credomatic"
                    srcDoc={redirectData}
                    style={{ width: "100%", minHeight: 620, border: "none", display: "block" }}
                  />
                </div>
              ) : (
                <div className="tarjeta">
                  <h2 className="tarjeta-h">
                    {errorPasarela ? "No pudimos abrir el pago" : "Pago en línea aún no habilitado"}
                  </h2>
                  <p className="tarjeta-p">
                    {errorPasarela
                      ? errorPasarela
                      : "Tu pedido quedó registrado y reservado. La pasarela de BAC Credomatic todavía no está conectada, así que el cobro se coordina de forma manual."}
                  </p>

                  <div className="aviso" style={{ marginTop: 0 }}>
                    Guarda tu número de pedido <strong>{pedido.orderNumber}</strong> y escríbenos para
                    completar el pago. Nadie ha sido cobrado.
                  </div>

                  {modoPrueba && <PanelPrueba orderNumber={pedido.orderNumber} />}
                </div>
              )}
            </div>

            <aside className="resumen">
              <h2 className="resumen-h">Tu pedido</h2>

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

              <p className="aviso" style={{ marginTop: 16 }}>
                El cobro lo procesa Panamá International Firm a través de BAC Credomatic. Coffee Geeks
                Panamá no almacena datos de tu tarjeta.
              </p>

              <Link href="/tienda/carrito" className="enlace-secundario">
                Volver al carrito
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

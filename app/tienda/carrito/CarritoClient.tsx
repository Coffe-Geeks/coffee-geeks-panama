"use client";

import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import { useCarrito } from "@/app/components/tienda/CarritoContext";
import {
  claveLinea,
  calcularEnvio,
  requiereEnvio,
  type ConfigEnvio,
} from "@/lib/tienda/carrito";
import { estilosTienda } from "@/app/components/tienda/estilos";

export default function CarritoClient({ configEnvio }: { configEnvio: ConfigEnvio }) {
  const { lineas, subtotal, listo, actualizarCantidad, quitar } = useCarrito();

  const envio = calcularEnvio(lineas, configEnvio);
  const total = subtotal + envio;
  const hayEnvio = requiereEnvio(lineas);
  const faltaParaEnvioGratis =
    hayEnvio && configEnvio.envioGratisDesde > 0 && subtotal < configEnvio.envioGratisDesde
      ? configEnvio.envioGratisDesde - subtotal
      : 0;

  return (
    <>
      <style>{estilosTienda}</style>

      <Navbar />

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">Tienda Oficial · Coffee Geeks Panamá</div>
            <h1 className="ph-h1">Tu carrito</h1>
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
            <span>Carrito</span>
          </div>
        </div>
      </div>

      <section className="sec-claro">
        <div className="wrap">
          {!listo ? (
            <div className="vacio">Cargando tu carrito…</div>
          ) : lineas.length === 0 ? (
            <div className="vacio">
              <h3 className="vacio-h">Tu carrito está vacío</h3>
              <p className="vacio-p">Todavía no has agregado nada. Date una vuelta por el catálogo.</p>
              <Link href="/tienda" className="btn-primario" style={{ maxWidth: 280, margin: "24px auto 0" }}>
                Ver la tienda
              </Link>
            </div>
          ) : (
            <div className="compra-grid">
              <div className="lineas">
                {lineas.map((l) => {
                  const clave = claveLinea(l);
                  return (
                    <div key={clave} className="linea">
                      <div
                        className="linea-img"
                        style={l.image ? { backgroundImage: `url('${l.image}')` } : undefined}
                      >
                        {!l.image && <span className="linea-img-txt">Coffee Geeks</span>}
                      </div>

                      <div className="linea-datos">
                        <Link href={`/tienda/${l.productId}`} className="linea-nombre">
                          {l.name}
                        </Link>
                        {l.variant && <div className="linea-var">{l.variant}</div>}
                        {!l.requiresShipping && <div className="linea-var">Entrega digital</div>}
                        <div className="linea-precio">${l.price.toFixed(2)} c/u</div>
                      </div>

                      <div className="linea-acciones">
                        <div className="cant">
                          <button
                            type="button"
                            onClick={() => actualizarCantidad(clave, l.quantity - 1)}
                            aria-label={`Quitar una unidad de ${l.name}`}
                          >
                            −
                          </button>
                          <span>{l.quantity}</span>
                          <button
                            type="button"
                            onClick={() => actualizarCantidad(clave, l.quantity + 1)}
                            aria-label={`Agregar una unidad de ${l.name}`}
                          >
                            +
                          </button>
                        </div>
                        <div className="linea-total">${(l.price * l.quantity).toFixed(2)}</div>
                        <button type="button" className="quitar" onClick={() => quitar(clave)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className="resumen">
                <h2 className="resumen-h">Resumen</h2>

                <div className="fila">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="fila">
                  <span>Envío</span>
                  <span>{!hayEnvio ? "No aplica" : envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
                </div>

                {faltaParaEnvioGratis > 0 && (
                  <p className="aviso">
                    Te faltan <strong>${faltaParaEnvioGratis.toFixed(2)}</strong> para que el envío te salga gratis.
                  </p>
                )}

                <div className="fila fila-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)} USD</span>
                </div>

                <Link href="/tienda/checkout" className="btn-primario">
                  Continuar con la compra
                </Link>

                <Link href="/tienda" className="enlace-secundario">
                  Seguir comprando
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
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

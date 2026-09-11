"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import { useCarrito } from "@/app/components/tienda/CarritoContext";
import { estilosTienda } from "@/app/components/tienda/estilos";
import { crearPedido } from "@/app/actions/pedidos";
import { calcularEnvio, requiereEnvio, type ConfigEnvio } from "@/lib/tienda/carrito";

// Las diez provincias y las comarcas, como aparecen en la división política
const PROVINCIAS = [
  "Panamá",
  "Panamá Oeste",
  "Colón",
  "Coclé",
  "Chiriquí",
  "Herrera",
  "Los Santos",
  "Veraguas",
  "Bocas del Toro",
  "Darién",
  "Comarca Guna Yala",
  "Comarca Emberá-Wounaan",
  "Comarca Ngäbe-Buglé",
];

export default function CheckoutClient({
  clienteInicial,
  configEnvio,
}: {
  clienteInicial: { name: string; email: string; phone: string };
  configEnvio: ConfigEnvio;
}) {
  const { lineas, subtotal, listo } = useCarrito();
  const router = useRouter();

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const envio = calcularEnvio(lineas, configEnvio);
  const total = subtotal + envio;
  const hayEnvio = requiereEnvio(lineas);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const f = new FormData(e.currentTarget);

    const resultado = await crearPedido({
      // Solo viaja qué y cuánto: el precio lo pone el servidor
      lineas: lineas.map((l) => ({
        productId: l.productId,
        variantId: l.variantId || undefined,
        quantity: l.quantity,
      })),
      cliente: {
        name: f.get("name")?.toString() || "",
        email: f.get("email")?.toString() || "",
        phone: f.get("phone")?.toString() || "",
      },
      envio: hayEnvio
        ? {
            line1: f.get("line1")?.toString() || "",
            line2: f.get("line2")?.toString() || "",
            city: f.get("city")?.toString() || "",
            province: f.get("province")?.toString() || "",
            country: "Panamá",
            notes: f.get("notes")?.toString() || "",
          }
        : undefined,
    });

    if ("error" in resultado && resultado.error) {
      setError(resultado.error);
      setEnviando(false);
      return;
    }

    // El carrito se vacía al confirmarse el pago, no antes: si el cobro
    // falla, el cliente vuelve y sus productos siguen ahí.
    router.push(`/tienda/pago/${resultado.orderNumber}`);
  }

  return (
    <>
      <style>{estilosTienda}</style>

      <Navbar />

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">Tienda Oficial · Coffee Geeks Panamá</div>
            <h1 className="ph-h1">Finalizar compra</h1>
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
            <Link href="/tienda/carrito">Carrito</Link>
            <Flecha />
            <span>Datos de envío</span>
          </div>
        </div>
      </div>

      <section className="sec-claro">
        <div className="wrap">
          <div className="pasos">
            <span className="paso"><span className="paso-num">1</span> Carrito</span>
            <span className="paso-sep" />
            <span className="paso activo"><span className="paso-num">2</span> Tus datos</span>
            <span className="paso-sep" />
            <span className="paso"><span className="paso-num">3</span> Pago</span>
          </div>

          {!listo ? (
            <div className="vacio">Cargando tu carrito…</div>
          ) : lineas.length === 0 ? (
            <div className="vacio">
              <h3 className="vacio-h">No hay nada que pagar</h3>
              <p className="vacio-p">Tu carrito está vacío.</p>
              <Link href="/tienda" className="btn-primario" style={{ maxWidth: 280, margin: "24px auto 0" }}>
                Ver la tienda
              </Link>
            </div>
          ) : (
            <form className="compra-grid" onSubmit={onSubmit}>
              <div>
                {error && <div className="error">{error}</div>}

                <div className="tarjeta">
                  <h2 className="tarjeta-h">Tus datos</h2>
                  <p className="tarjeta-p">A este correo llega la confirmación de tu compra.</p>

                  <div className="campos">
                    <div className="campo ancho">
                      <label htmlFor="name">Nombre completo</label>
                      <input id="name" name="name" required defaultValue={clienteInicial.name} autoComplete="name" />
                    </div>
                    <div className="campo">
                      <label htmlFor="email">Correo electrónico</label>
                      <input id="email" name="email" type="email" required defaultValue={clienteInicial.email} autoComplete="email" />
                    </div>
                    <div className="campo">
                      <label htmlFor="phone">Teléfono</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        defaultValue={clienteInicial.phone}
                        autoComplete="tel"
                        placeholder="6000-0000"
                      />
                    </div>
                  </div>
                </div>

                {hayEnvio ? (
                  <div className="tarjeta">
                    <h2 className="tarjeta-h">Dirección de entrega</h2>
                    <p className="tarjeta-p">Solo hacemos entregas dentro de Panamá.</p>

                    <div className="campos">
                      <div className="campo ancho">
                        <label htmlFor="line1">Dirección</label>
                        <input id="line1" name="line1" required autoComplete="address-line1" placeholder="Calle, edificio, casa" />
                      </div>
                      <div className="campo ancho">
                        <label htmlFor="line2">Apartamento, piso o referencia</label>
                        <input id="line2" name="line2" autoComplete="address-line2" placeholder="Opcional" />
                      </div>
                      <div className="campo">
                        <label htmlFor="city">Ciudad o corregimiento</label>
                        <input id="city" name="city" required autoComplete="address-level2" />
                      </div>
                      <div className="campo">
                        <label htmlFor="province">Provincia o comarca</label>
                        <select id="province" name="province" defaultValue="Panamá">
                          {PROVINCIAS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div className="campo ancho">
                        <label htmlFor="notes">Indicaciones para la entrega</label>
                        <textarea id="notes" name="notes" placeholder="Horario en que te encuentran, punto de referencia…" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tarjeta">
                    <h2 className="tarjeta-h">Entrega digital</h2>
                    <p className="tarjeta-p" style={{ marginBottom: 0 }}>
                      Todo lo que llevas se entrega por correo, así que no necesitamos una dirección de envío.
                    </p>
                  </div>
                )}
              </div>

              <aside className="resumen">
                <h2 className="resumen-h">Tu pedido</h2>

                {lineas.map((l) => (
                  <div className="fila" key={`${l.productId}-${l.variantId}`}>
                    <span>
                      {l.quantity} × {l.name}
                      {l.variant ? ` · ${l.variant}` : ""}
                    </span>
                    <span>${(l.price * l.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="fila">
                  <span>Envío</span>
                  <span>{!hayEnvio ? "No aplica" : envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
                </div>

                <div className="fila fila-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)} USD</span>
                </div>

                <label className="acepto">
                  <input type="checkbox" name="acepto" required />
                  <span>
                    He leído y acepto los{" "}
                    <a href="/terminos" target="_blank" rel="noopener noreferrer">
                      Términos y Condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="/privacidad" target="_blank" rel="noopener noreferrer">
                      Política de Privacidad
                    </a>
                    .
                  </span>
                </label>

                <button type="submit" className="btn-primario" disabled={enviando}>
                  {enviando ? "Registrando tu pedido…" : "Ir a pagar"}
                </button>

                <p className="aviso" style={{ marginTop: 16 }}>
                  El pago se procesa en la plataforma segura de BAC Credomatic. Los datos de tu tarjeta nunca pasan por este sitio.
                </p>

                <Link href="/tienda/carrito" className="enlace-secundario">
                  Volver al carrito
                </Link>
              </aside>
            </form>
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

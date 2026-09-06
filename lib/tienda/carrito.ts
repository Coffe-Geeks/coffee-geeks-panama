/**
 * Carrito de compras — tipos y cálculos.
 *
 * Sin React y sin Mongoose a propósito: el navegador y el servidor hacen
 * exactamente las mismas cuentas. El carrito del cliente es solo una
 * intención de compra; al crear el pedido el servidor vuelve a leer precios
 * y existencias de la base de datos y descarta lo que venga del navegador.
 */

export type LineaCarrito = {
  productId: string;
  /** Id de la variante elegida (talla, presentación). Vacío si no tiene. */
  variantId: string;
  /** Etiqueta legible de la variante: "M", "500 g" */
  variant: string;
  name: string;
  price: number;
  image: string;
  requiresShipping: boolean;
  quantity: number;
};

/** Dos líneas son la misma solo si coinciden producto y variante. */
export function claveLinea(l: Pick<LineaCarrito, "productId" | "variantId">) {
  return `${l.productId}::${l.variantId || ""}`;
}

export function agregarLinea(carrito: LineaCarrito[], linea: LineaCarrito): LineaCarrito[] {
  const clave = claveLinea(linea);
  const existente = carrito.find((l) => claveLinea(l) === clave);

  if (!existente) return [...carrito, linea];

  return carrito.map((l) =>
    claveLinea(l) === clave ? { ...l, quantity: l.quantity + linea.quantity } : l
  );
}

export function cambiarCantidad(
  carrito: LineaCarrito[],
  clave: string,
  cantidad: number
): LineaCarrito[] {
  if (cantidad <= 0) return carrito.filter((l) => claveLinea(l) !== clave);
  return carrito.map((l) => (claveLinea(l) === clave ? { ...l, quantity: cantidad } : l));
}

export function subtotal(carrito: LineaCarrito[]): number {
  return redondear(carrito.reduce((suma, l) => suma + l.price * l.quantity, 0));
}

export function unidades(carrito: LineaCarrito[]): number {
  return carrito.reduce((suma, l) => suma + l.quantity, 0);
}

/** Solo se pide dirección si algo del pedido se despacha físicamente. */
export function requiereEnvio(carrito: LineaCarrito[]): boolean {
  return carrito.some((l) => l.requiresShipping);
}

export type ConfigEnvio = {
  /** Tarifa plana nacional */
  costoEnvio: number;
  /** Compras iguales o mayores a este monto no pagan envío. 0 lo desactiva. */
  envioGratisDesde: number;
};

export function calcularEnvio(
  carrito: LineaCarrito[],
  cfg: ConfigEnvio
): number {
  if (!requiereEnvio(carrito)) return 0;
  if (cfg.envioGratisDesde > 0 && subtotal(carrito) >= cfg.envioGratisDesde) return 0;
  return redondear(cfg.costoEnvio);
}

/**
 * Los importes viajan a la pasarela con dos decimales. Trabajar en centavos
 * evita que 0.1 + 0.2 termine cobrando un centavo de más.
 */
export function redondear(monto: number): number {
  return Math.round((monto + Number.EPSILON) * 100) / 100;
}

export function formatearPrecio(monto: number): string {
  return `$${redondear(monto).toFixed(2)}`;
}

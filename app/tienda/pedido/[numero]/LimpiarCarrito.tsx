"use client";

import { useEffect } from "react";
import { useCarrito } from "@/app/components/tienda/CarritoContext";

/**
 * Vacía el carrito al confirmarse el pago, y no antes: si el cobro falla,
 * el cliente vuelve atrás y encuentra sus productos donde los dejó.
 */
export default function LimpiarCarrito() {
  const { vaciar, lineas } = useCarrito();

  useEffect(() => {
    if (lineas.length > 0) vaciar();
  }, [lineas.length, vaciar]);

  return null;
}

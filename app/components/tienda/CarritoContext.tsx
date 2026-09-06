"use client";

/**
 * Estado del carrito, guardado en localStorage.
 *
 * Se eligió localStorage y no la sesión porque en la tienda puede comprar
 * alguien sin cuenta: obligar a registrarse antes de ver el carrito costaría
 * ventas. El precio de esta decisión es que el carrito no viaja entre
 * dispositivos, algo aceptable para una tienda de mercancía.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  type LineaCarrito,
  agregarLinea as agregar,
  cambiarCantidad as cambiar,
  claveLinea,
  subtotal as calcularSubtotal,
  unidades as contarUnidades,
} from "@/lib/tienda/carrito";

const CLAVE_ALMACEN = "cg_carrito_v1";

type CarritoContexto = {
  lineas: LineaCarrito[];
  unidades: number;
  subtotal: number;
  /** false hasta que se lee localStorage; evita parpadeos y errores de hidratación */
  listo: boolean;
  agregarProducto: (linea: LineaCarrito) => void;
  actualizarCantidad: (clave: string, cantidad: number) => void;
  quitar: (clave: string) => void;
  vaciar: () => void;
};

const Contexto = createContext<CarritoContexto | null>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [lineas, setLineas] = useState<LineaCarrito[]>([]);
  const [listo, setListo] = useState(false);

  // El servidor no tiene localStorage: se lee después del primer render
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_ALMACEN);
      if (guardado) {
        const datos = JSON.parse(guardado);
        if (Array.isArray(datos)) setLineas(datos);
      }
    } catch {
      // Navegación privada o almacenamiento bloqueado: se sigue sin carrito
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lineas));
    } catch {
      // Si no se puede guardar, el carrito sigue vivo en memoria
    }
  }, [lineas, listo]);

  const agregarProducto = useCallback((linea: LineaCarrito) => {
    setLineas((actual) => agregar(actual, linea));
  }, []);

  const actualizarCantidad = useCallback((clave: string, cantidad: number) => {
    setLineas((actual) => cambiar(actual, clave, cantidad));
  }, []);

  const quitar = useCallback((clave: string) => {
    setLineas((actual) => actual.filter((l) => claveLinea(l) !== clave));
  }, []);

  const vaciar = useCallback(() => setLineas([]), []);

  return (
    <Contexto.Provider
      value={{
        lineas,
        unidades: contarUnidades(lineas),
        subtotal: calcularSubtotal(lineas),
        listo,
        agregarProducto,
        actualizarCantidad,
        quitar,
        vaciar,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}

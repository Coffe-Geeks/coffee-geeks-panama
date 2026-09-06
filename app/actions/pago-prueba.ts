"use server";

/**
 * Simulación de cobro — SOLO para el entorno de pruebas.
 *
 * Existe porque FAC todavía no crea el PageSet/PageName en el Portal del
 * Comercio y sin eso no hay forma de recorrer el flujo completo (pedido →
 * pago → correo → panel) antes de la entrega.
 *
 * No se activa nunca por su cuenta: hace falta poner POWERTRANZ_MODO_PRUEBA
 * en "true". Esa variable NO debe existir en producción. Si algún día
 * apareciera ahí, este archivo puede borrarse sin tocar nada más: ningún
 * otro módulo lo importa.
 */

import { revalidatePath } from "next/cache";
import { marcarPedidoPagado, marcarPedidoRechazado } from "@/lib/tienda/pago-pedido";

function modoPruebaActivo() {
  return process.env.POWERTRANZ_MODO_PRUEBA === "true";
}

export async function simularPago(orderNumber: string, aprobar: boolean) {
  if (!modoPruebaActivo()) {
    return { error: "La simulación de pagos no está habilitada en este entorno." };
  }

  const datos = {
    transactionIdentifier: `PRUEBA-${orderNumber}`,
    orderIdentifier: orderNumber,
    isoResponseCode: aprobar ? "00" : "05",
    responseMessage: aprobar ? "SIMULACIÓN: aprobado" : "SIMULACIÓN: rechazado",
    cardBrand: "SIMULACION",
    authenticationStatus: aprobar ? "Y" : "N",
    fraudResponseCode: "A",
  };

  const pedido = aprobar
    ? await marcarPedidoPagado(orderNumber, datos)
    : await marcarPedidoRechazado(orderNumber, datos, "SIMULACIÓN de pago rechazado (entorno de pruebas).");

  if (!pedido) {
    return { error: "Este pedido ya no estaba pendiente de pago." };
  }

  revalidatePath(`/tienda/pedido/${orderNumber}`);
  revalidatePath("/admin/pedidos");
  return { success: true };
}

/**
 * Aplicación del resultado del pago sobre el pedido.
 *
 * Vive aparte de la pasarela y aparte de las acciones de la tienda porque
 * lo llaman dos caminos distintos: la respuesta de PowerTranz y el modo de
 * prueba. Los dos tienen que dejar el pedido exactamente igual.
 *
 * Todas las transiciones son idempotentes: la pasarela puede notificar el
 * mismo cobro más de una vez y el cliente no debe recibir dos correos ni
 * ver su existencia descontada dos veces.
 */

import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import StoreProduct from "@/models/StoreProduct";
import { sendEmail } from "@/lib/email";
import { getOrderConfirmationEmailTemplate } from "@/lib/email-templates";
import { activarPasaporte, activacionDisponible } from "@/lib/tienda/pasaporte";

export type DatosPago = {
  transactionIdentifier?: string;
  orderIdentifier?: string;
  spiToken?: string;
  isoResponseCode?: string;
  responseMessage?: string;
  cardBrand?: string;
  authenticationStatus?: string;
  cardholderInfo?: string;
  fraudResponseCode?: string;
  fraudScore?: string;
};

/**
 * Descuenta existencias. Un stock de -1 significa ilimitado, así que la
 * condición `$gte: 0` evita convertirlo en -2 y romper el significado.
 */
async function descontarExistencias(items: any[]) {
  for (const item of items) {
    try {
      if (item.variantId) {
        await StoreProduct.updateOne(
          { _id: item.productId, "variants._id": item.variantId, "variants.stock": { $gte: 0 } },
          { $inc: { "variants.$.stock": -item.quantity } }
        );
      } else {
        await StoreProduct.updateOne(
          { _id: item.productId, stock: { $gte: 0 } },
          { $inc: { stock: -item.quantity } }
        );
      }
    } catch (err) {
      // Una existencia mal descontada no puede tumbar un pago ya cobrado:
      // se registra y el equipo lo corrige desde el admin.
      console.error(`No se pudo descontar la existencia de ${item.name}:`, err);
    }
  }
}

/**
 * Arma las rutas anidadas de `payment`. Escribir "payment.approved" en vez
 * de un objeto `payment` completo deja intactos los campos que ya estaban
 * guardados y que esta llamada no conoce.
 */
function camposDePago(
  datos: DatosPago & { approved: boolean; paidAt?: Date },
  status: string
): Record<string, any> {
  const campos: Record<string, any> = {
    status,
    "payment.provider": "powertranz",
    "payment.approved": datos.approved,
  };

  if (datos.paidAt) campos["payment.paidAt"] = datos.paidAt;

  // Solo se escribe lo que realmente vino: un campo vacío no debe borrar
  // el valor que ya estaba guardado.
  const mapa: Record<string, string | undefined> = {
    "payment.transactionIdentifier": datos.transactionIdentifier,
    "payment.orderIdentifier": datos.orderIdentifier,
    "payment.spiToken": datos.spiToken,
    "payment.isoResponseCode": datos.isoResponseCode,
    "payment.responseMessage": datos.responseMessage,
    "payment.cardBrand": datos.cardBrand,
    "payment.authenticationStatus": datos.authenticationStatus,
    "payment.cardholderInfo": datos.cardholderInfo,
    "payment.fraudResponseCode": datos.fraudResponseCode,
    "payment.fraudScore": datos.fraudScore,
  };

  for (const [ruta, valor] of Object.entries(mapa)) {
    if (valor) campos[ruta] = valor;
  }

  return campos;
}

/**
 * Activa el Coffee Geeks Passport si el pedido lo incluye.
 *
 * Devuelve el enlace de acceso para armar el correo, y guarda en el pedido
 * únicamente si salió bien: el enlace no se persiste.
 *
 * Un fallo aquí NO invalida el pedido — el cobro ya ocurrió. Se registra el
 * motivo para que el equipo lo reintente desde el panel.
 */
export async function activarPasaporteDePedido(pedido: any): Promise<string> {
  const necesita = (pedido.items || []).some((i: any) => i.activatesPassport);
  if (!necesita) return "";

  if (!activacionDisponible()) {
    await Order.updateOne(
      { orderNumber: pedido.orderNumber },
      {
        $set: {
          "passportActivation.intentada": true,
          "passportActivation.ok": false,
          "passportActivation.error": "Falta PASAPORTE_API_KEY en este entorno.",
        },
      }
    );
    console.error(`Pedido ${pedido.orderNumber}: no hay clave para activar el pasaporte.`);
    return "";
  }

  try {
    const r = await activarPasaporte({
      nombre: pedido.customer.name,
      correo: pedido.customer.email,
      telefono: pedido.customer.phone,
    });

    await Order.updateOne(
      { orderNumber: pedido.orderNumber },
      {
        $set: {
          "passportActivation.intentada": true,
          "passportActivation.ok": true,
          "passportActivation.usuarioId": r.usuarioId,
          "passportActivation.cuentaYaExistia": r.cuentaYaExistia,
          "passportActivation.error": "",
          "passportActivation.activadaEl": new Date(),
        },
      }
    );

    return r.magicLink;
  } catch (err: any) {
    await Order.updateOne(
      { orderNumber: pedido.orderNumber },
      {
        $set: {
          "passportActivation.intentada": true,
          "passportActivation.ok": false,
          "passportActivation.error": err?.message || "Error desconocido al activar.",
        },
      }
    );
    console.error(`Pedido ${pedido.orderNumber}: falló la activación del pasaporte:`, err?.message);
    return "";
  }
}

/**
 * Marca el pedido como pagado, descuenta existencias y envía el
 * comprobante. Devuelve null si el pedido no existía o ya no estaba
 * pendiente (notificación repetida).
 */
export async function marcarPedidoPagado(orderNumber: string, datos: DatosPago) {
  await dbConnect();

  // Solo la primera notificación mueve el pedido: las siguientes no
  // encuentran nada pendiente y salen sin efecto.
  // Se actualiza campo por campo y no el objeto `payment` completo: al
  // reemplazarlo se perderían los identificadores que dejó
  // registrarInicioDePago antes de mandar al cliente a la pasarela.
  const pedido = await Order.findOneAndUpdate(
    { orderNumber, status: "pendiente" },
    { $set: camposDePago({ ...datos, approved: true, paidAt: new Date() }, "pagado") },
    { new: true }
  ).lean<any>();

  if (!pedido) return null;

  await descontarExistencias(pedido.items || []);

  // El pasaporte se activa antes del correo, para que el acceso viaje en el
  // mismo comprobante y el comprador no tenga que esperar un segundo envío.
  const magicLink = await activarPasaporteDePedido(pedido);

  try {
    await sendEmail({
      to: pedido.customer.email,
      subject: `Confirmación de tu compra ${pedido.orderNumber} · Coffee Geeks Panamá`,
      html: getOrderConfirmationEmailTemplate({
        orderNumber: pedido.orderNumber,
        customer: pedido.customer,
        items: pedido.items,
        subtotal: pedido.subtotal,
        shippingCost: pedido.shippingCost,
        total: pedido.total,
        requiresShipping: pedido.requiresShipping,
        shippingAddress: pedido.shippingAddress,
        magicLink,
      }),
    });
  } catch (err) {
    // El cobro ya ocurrió: si el correo falla, el pedido sigue siendo válido
    console.error(`Pedido ${orderNumber} pagado, pero falló el envío del correo:`, err);
  }

  return pedido;
}

/** Registra el rechazo dejando por escrito por qué, para poder atender el reclamo. */
export async function marcarPedidoRechazado(
  orderNumber: string,
  datos: DatosPago,
  motivo: string
) {
  await dbConnect();

  const pedido = await Order.findOneAndUpdate(
    { orderNumber, status: "pendiente" },
    {
      $set: {
        ...camposDePago({ ...datos, approved: false }, "rechazado"),
        internalNotes: motivo,
      },
    },
    { new: true }
  ).lean<any>();

  return pedido;
}

/** Guarda los identificadores con que se abrió la transacción en la pasarela. */
export async function registrarInicioDePago(
  orderNumber: string,
  datos: { transactionIdentifier: string; orderIdentifier: string; spiToken: string }
) {
  await dbConnect();
  await Order.updateOne(
    { orderNumber, status: "pendiente" },
    {
      $set: {
        "payment.provider": "powertranz",
        "payment.transactionIdentifier": datos.transactionIdentifier,
        "payment.orderIdentifier": datos.orderIdentifier,
        "payment.spiToken": datos.spiToken,
      },
    }
  );
}

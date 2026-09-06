"use server";

import dbConnect from "@/lib/mongodb";
import Order, { ESTADOS_PEDIDO, type EstadoPedido } from "@/models/Order";
import StoreProduct from "@/models/StoreProduct";
import { getSession } from "@/lib/session";
import { getSiteConfig } from "@/lib/siteConfig";
import { revalidatePath } from "next/cache";
import { redondear } from "@/lib/tienda/carrito";

/** Lo que el navegador puede pedir: qué y cuánto. Nunca a qué precio. */
export type LineaSolicitada = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type DatosCliente = {
  name: string;
  email: string;
  phone?: string;
};

export type DatosEnvio = {
  line1?: string;
  line2?: string;
  city?: string;
  province?: string;
  country?: string;
  notes?: string;
};

async function checkAdminAuth() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("No autorizado.");
  }
  return session;
}

/**
 * Número de pedido legible: CG-260906-0007.
 *
 * Se numera por día y no de corrido, porque así el equipo lee de un vistazo
 * cuándo se hizo la compra al atender un reclamo.
 */
async function generarNumeroPedido(): Promise<string> {
  const ahora = new Date();
  const yy = String(ahora.getFullYear()).slice(2);
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");
  const dd = String(ahora.getDate()).padStart(2, "0");
  const prefijo = `CG-${yy}${mm}${dd}`;

  const ultimo = await Order.findOne({ orderNumber: new RegExp(`^${prefijo}-`) })
    .sort({ orderNumber: -1 })
    .select("orderNumber")
    .lean<{ orderNumber: string } | null>();

  const consecutivo = ultimo ? parseInt(ultimo.orderNumber.split("-")[2], 10) + 1 : 1;
  return `${prefijo}-${String(consecutivo).padStart(4, "0")}`;
}

function existenciaDisponible(producto: any, variantId?: string): number {
  if (variantId) {
    const v = (producto.variants || []).find((x: any) => x._id.toString() === variantId);
    return v ? v.stock : 0;
  }
  return producto.stock;
}

/**
 * Crea el pedido en estado "pendiente".
 *
 * Vuelve a leer cada producto de la base de datos: el precio, el nombre y la
 * existencia salen de ahí, nunca del navegador. Si alguien manipula el
 * carrito para pagar un dólar, el pedido se arma igual con el precio real.
 */
export async function crearPedido(datos: {
  lineas: LineaSolicitada[];
  cliente: DatosCliente;
  envio?: DatosEnvio;
}) {
  try {
    await dbConnect();

    if (!datos.lineas?.length) return { error: "El carrito está vacío." };

    const nombre = datos.cliente?.name?.trim();
    const correo = datos.cliente?.email?.trim().toLowerCase();
    if (!nombre) return { error: "Necesitamos tu nombre para el pedido." };
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return { error: "Necesitamos un correo válido para enviarte la confirmación." };
    }

    const items: any[] = [];
    let requiereEnvio = false;

    for (const solicitada of datos.lineas) {
      const cantidad = Math.floor(Number(solicitada.quantity));
      if (!Number.isFinite(cantidad) || cantidad < 1) {
        return { error: "Hay una cantidad inválida en el carrito." };
      }

      const producto = await StoreProduct.findById(solicitada.productId).lean<any>();
      if (!producto || !producto.isActive) {
        return { error: "Uno de los productos ya no está disponible. Revisa tu carrito." };
      }

      const variante = solicitada.variantId
        ? (producto.variants || []).find((v: any) => v._id.toString() === solicitada.variantId)
        : null;

      if (solicitada.variantId && !variante) {
        return { error: `La presentación elegida de ${producto.name} ya no está disponible.` };
      }

      // -1 significa existencia ilimitada
      const disponible = existenciaDisponible(producto, solicitada.variantId);
      if (disponible !== -1 && disponible < cantidad) {
        return {
          error:
            disponible <= 0
              ? `${producto.name} se agotó.`
              : `De ${producto.name} solo quedan ${disponible} unidades.`,
        };
      }

      if (producto.requiresShipping) requiereEnvio = true;

      items.push({
        productId: producto._id,
        variantId: solicitada.variantId || "",
        name: producto.name,
        variant: variante?.label || "",
        sku: variante?.sku || producto.sku || "",
        unitPrice: producto.price,
        quantity: cantidad,
        image: producto.image || "",
        requiresShipping: producto.requiresShipping !== false,
      });
    }

    const subtotal = redondear(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0));

    const cfg = await getSiteConfig();
    const costoEnvio = Number((cfg as any).costoEnvio ?? 0);
    const envioGratisDesde = Number((cfg as any).envioGratisDesde ?? 0);
    const gastosEnvio =
      !requiereEnvio || (envioGratisDesde > 0 && subtotal >= envioGratisDesde)
        ? 0
        : redondear(costoEnvio);

    if (requiereEnvio) {
      const dir = datos.envio || {};
      if (!dir.line1?.trim() || !dir.city?.trim()) {
        return { error: "Necesitamos la dirección y la ciudad de entrega." };
      }
    }

    const session = await getSession();

    // El número de pedido es único en la base; si dos compras coinciden en
    // el mismo instante, el segundo intento toma el siguiente consecutivo.
    let pedido = null;
    for (let intento = 0; intento < 5 && !pedido; intento++) {
      try {
        pedido = await Order.create({
          orderNumber: await generarNumeroPedido(),
          userId: session?.userId || null,
          customer: { name: nombre, email: correo, phone: datos.cliente.phone?.trim() || "" },
          items,
          subtotal,
          shippingCost: gastosEnvio,
          total: redondear(subtotal + gastosEnvio),
          requiresShipping: requiereEnvio,
          shippingAddress: requiereEnvio
            ? {
                line1: datos.envio?.line1?.trim() || "",
                line2: datos.envio?.line2?.trim() || "",
                city: datos.envio?.city?.trim() || "",
                province: datos.envio?.province?.trim() || "",
                country: datos.envio?.country?.trim() || "Panamá",
                notes: datos.envio?.notes?.trim() || "",
              }
            : {},
          status: "pendiente",
        });
      } catch (err: any) {
        if (err?.code !== 11000) throw err;
      }
    }

    if (!pedido) return { error: "No pudimos generar el número de pedido. Intenta de nuevo." };

    revalidatePath("/admin/pedidos");
    return { orderNumber: pedido.orderNumber as string };
  } catch (err: any) {
    console.error("Error al crear el pedido:", err);
    return { error: "No pudimos registrar tu pedido. Intenta de nuevo." };
  }
}

export async function getPedidoPorNumero(orderNumber: string) {
  try {
    await dbConnect();
    const pedido = await Order.findOne({ orderNumber }).lean();
    return pedido ? JSON.parse(JSON.stringify(pedido)) : null;
  } catch (err) {
    console.error("Error al obtener el pedido:", err);
    return null;
  }
}

export async function getPedidos(estado?: EstadoPedido) {
  try {
    await checkAdminAuth();
    await dbConnect();
    const filtro = estado ? { status: estado } : {};
    const pedidos = await Order.find(filtro).sort({ createdAt: -1 }).limit(300).lean();
    return JSON.parse(JSON.stringify(pedidos));
  } catch (err) {
    console.error("Error al listar pedidos:", err);
    return [];
  }
}

export async function actualizarEstadoPedido(id: string, estado: string) {
  try {
    await checkAdminAuth();
    await dbConnect();

    if (!(ESTADOS_PEDIDO as readonly string[]).includes(estado)) {
      return { error: "Estado de pedido no válido." };
    }

    await Order.findByIdAndUpdate(id, { status: estado });
    revalidatePath("/admin/pedidos");
    return { success: "Estado actualizado." };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || "No se pudo actualizar el pedido." };
  }
}

export async function guardarNotaPedido(id: string, nota: string) {
  try {
    await checkAdminAuth();
    await dbConnect();
    await Order.findByIdAndUpdate(id, { internalNotes: nota });
    revalidatePath("/admin/pedidos");
    return { success: "Nota guardada." };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || "No se pudo guardar la nota." };
  }
}

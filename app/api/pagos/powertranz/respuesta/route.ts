import { NextRequest, NextResponse } from "next/server";
import { evaluarResultado, finalizarPago, type ResultadoAutenticacion } from "@/lib/pagos/powertranz";
import { marcarPedidoPagado, marcarPedidoRechazado } from "@/lib/tienda/pago-pedido";

/**
 * MerchantResponseUrl: aquí devuelve PowerTranz al cliente cuando termina
 * la autenticación 3DS.
 *
 * La llamada llega dentro del iframe del pago, así que la respuesta no
 * puede ser un redirect normal — mostraría la confirmación embebida en un
 * marco de 620 píxeles. Se devuelve una página mínima que mueve la ventana
 * principal.
 */

export const dynamic = "force-dynamic";

async function leerRespuesta(req: NextRequest): Promise<ResultadoAutenticacion | null> {
  const tipo = req.headers.get("content-type") || "";

  try {
    if (tipo.includes("application/json")) {
      return await req.json();
    }

    // PowerTranz envía el JSON dentro de un campo de formulario
    const form = await req.formData();
    const bruto = form.get("Response") ?? form.get("response");
    if (typeof bruto === "string") return JSON.parse(bruto);

    // Algunas configuraciones mandan los campos sueltos
    const objeto: Record<string, any> = {};
    form.forEach((valor, clave) => {
      objeto[clave] = valor;
    });
    return Object.keys(objeto).length ? (objeto as ResultadoAutenticacion) : null;
  } catch (err) {
    console.error("No se pudo interpretar la respuesta de PowerTranz:", err);
    return null;
  }
}

/** Saca al cliente del iframe y lo lleva a la confirmación de su pedido. */
function salirDelIframe(destino: string) {
  const url = JSON.stringify(destino);
  return new NextResponse(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Procesando tu pago…</title></head>
<body style="font-family:system-ui,sans-serif;background:#f4efe4;color:#38050e;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<p>Estamos confirmando tu pago…</p>
<script>
  var destino = ${url};
  try { window.top.location.href = destino; } catch (e) { window.location.href = destino; }
</script>
<noscript><a href=${url}>Continuar</a></noscript>
</body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function POST(req: NextRequest) {
  const resultado = await leerRespuesta(req);

  if (!resultado) {
    return salirDelIframe("/tienda/carrito?error=respuesta");
  }

  const orderNumber = resultado.OrderIdentifier || "";
  if (!orderNumber) {
    console.error("PowerTranz respondió sin OrderIdentifier:", resultado.IsoResponseCode);
    return salirDelIframe("/tienda/carrito?error=pedido");
  }

  const datosBase = {
    transactionIdentifier: (resultado as any).TransactionIdentifier || "",
    orderIdentifier: orderNumber,
    spiToken: resultado.SpiToken || "",
    cardBrand: resultado.CardBrand || "",
  };

  const veredicto = evaluarResultado(resultado);

  // Antifraude denegado o autenticación fallida: no se llama a /payment
  if (!veredicto.cobrar) {
    await marcarPedidoRechazado(
      orderNumber,
      {
        ...datosBase,
        isoResponseCode: resultado.IsoResponseCode || "",
        responseMessage: veredicto.motivo,
        authenticationStatus: veredicto.authStatus,
        cardholderInfo: veredicto.mensajeParaCliente,
        fraudResponseCode: veredicto.fraudCode,
        fraudScore: resultado.RiskManagement?.FraudCheck?.FcScore || "",
      },
      veredicto.motivo
    );
    return salirDelIframe(`/tienda/pedido/${orderNumber}`);
  }

  try {
    const cobro = await finalizarPago(resultado.SpiToken || "");

    const datos = {
      ...datosBase,
      isoResponseCode: cobro.isoResponseCode,
      responseMessage: cobro.responseMessage,
      cardBrand: cobro.cardBrand || datosBase.cardBrand,
      authenticationStatus: veredicto.authStatus,
      cardholderInfo: veredicto.mensajeParaCliente,
      fraudResponseCode: veredicto.fraudCode,
      fraudScore: resultado.RiskManagement?.FraudCheck?.FcScore || "",
    };

    if (cobro.aprobado) {
      await marcarPedidoPagado(orderNumber, datos);
    } else {
      await marcarPedidoRechazado(
        orderNumber,
        datos,
        cobro.responseMessage || "El banco no aprobó el cobro."
      );
    }
  } catch (err: any) {
    console.error(`Error al cobrar el pedido ${orderNumber}:`, err?.message);
    await marcarPedidoRechazado(
      orderNumber,
      { ...datosBase, responseMessage: "Error de comunicación con la pasarela." },
      "No se pudo completar el cobro por un error de comunicación con la pasarela."
    );
  }

  return salirDelIframe(`/tienda/pedido/${orderNumber}`);
}

/** Algunas configuraciones del portal devuelven por GET; se atiende igual. */
export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("OrderIdentifier");
  return salirDelIframe(orderNumber ? `/tienda/pedido/${orderNumber}` : "/tienda/carrito");
}

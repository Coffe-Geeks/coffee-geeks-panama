/**
 * Pasarela de pago — PowerTranz (FAC / BAC Credomatic)
 *
 * Integración vía Hosted Payment Page: el formulario de tarjeta lo aloja y
 * lo sirve PowerTranz dentro de un iframe, de modo que ningún dato de
 * tarjeta pasa por nuestro servidor ni por nuestro HTML. Eso es lo que
 * mantiene el proyecto en alcance PCI SAQ A.
 *
 * Todo lo específico de la pasarela vive en este archivo. El resto de la
 * tienda solo conoce las tres funciones exportadas, así que cambiar de
 * proveedor no obliga a tocar el checkout.
 *
 * Flujo:
 *   1. iniciarPago()      → PowerTranz devuelve SP4, un SpiToken (5 min de
 *                           vigencia) y el HTML del iframe.
 *   2. El cliente completa tarjeta y 3DS dentro del iframe.
 *   3. PowerTranz llama a nuestro MerchantResponseUrl con el resultado.
 *   4. evaluarResultado()  → decide si corresponde cobrar.
 *   5. finalizarPago()     → ejecuta el cobro con el SpiToken.
 */

const BASE_URL = process.env.POWERTRANZ_BASE_URL || "https://staging.ptranz.com/api/spi";
const MONEDA = process.env.POWERTRANZ_CURRENCY || "840"; // 840 = USD

/**
 * Verificación antifraude (Kount).
 *
 * Viene apagada por omisión porque el comercio todavía no la tiene
 * aprovisionada: con `fraudCheck: true` la pasarela responde
 * `FC3 / Invalid Provider (1011)` y **ninguna transacción llega a abrirse**.
 * Se enciende con POWERTRANZ_FRAUD_CHECK=true cuando FAC lo habilite.
 */
const ANTIFRAUDE = process.env.POWERTRANZ_FRAUD_CHECK === "true";

/**
 * Página alojada creada en el Portal del Comercio (id 2071, comercio
 * 77702076). No son secretos: son los nombres de una página que solo
 * funciona con nuestras credenciales, así que van por omisión en el código
 * y no como configuración obligatoria del entorno. Una variable de entorno
 * los reemplaza cuando haga falta —por ejemplo si producción usa otros.
 *
 * El prefijo "Ptz/" es obligatorio: sin él la pasarela responde
 * 757 "Hosted page not found" aunque la página exista y esté publicada.
 * No aparece en la documentación de FAC; lo confirmó su soporte.
 */
const PAGE_SET = process.env.POWERTRANZ_PAGE_SET || "Ptz/CoffeeGeeks";
const PAGE_NAME = process.env.POWERTRANZ_PAGE_NAME || "Checkout";

export type ResultadoAutenticacion = {
  Approved?: boolean;
  IsoResponseCode?: string;
  ResponseMessage?: string;
  /** Errores de la pasarela: sin ellos un fallo se diagnostica a ciegas */
  Errors?: { Code?: string; Message?: string }[];
  CardBrand?: string;
  SpiToken?: string;
  TotalAmount?: number;
  OrderIdentifier?: string;
  RiskManagement?: {
    ThreeDSecure?: {
      AuthenticationStatus?: string;
      Eci?: string;
      /** Mensaje del emisor que la documentación pide mostrar al cliente */
      CardholderInfo?: string;
    };
    FraudCheck?: { FcResponseCode?: string; FcScore?: string };
  };
};

function credenciales() {
  const id = process.env.POWERTRANZ_ID;
  const password = process.env.POWERTRANZ_PASSWORD;
  if (!id || !password) {
    throw new Error(
      "Faltan POWERTRANZ_ID y POWERTRANZ_PASSWORD. La tienda no puede cobrar sin ellas."
    );
  }
  return { id, password };
}

/** La pasarela está configurada y lista para cobrar. */
export function pasarelaDisponible(): boolean {
  // La página alojada tiene valores por omisión, así que lo único
  // imprescindible del entorno son las credenciales
  return Boolean(process.env.POWERTRANZ_ID && process.env.POWERTRANZ_PASSWORD);
}

async function llamar(endpoint: string, body: unknown, conCredenciales = true) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // La documentación es explícita: la finalización del pago no requiere
  // PowerTranz-PowerTranzId ni PowerTranz-PowerTranzPassword. Se autentica
  // con el propio SpiToken.
  if (conCredenciales) {
    const { id, password } = credenciales();
    headers["PowerTranz-PowerTranzId"] = id;
    headers["PowerTranz-PowerTranzPassword"] = password;
  }

  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const texto = await res.text();
  let datos: any;
  try {
    datos = JSON.parse(texto);
  } catch {
    throw new Error(`Respuesta no interpretable de la pasarela (${res.status}): ${texto.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(datos?.ResponseMessage || `La pasarela respondió ${res.status}`);
  }
  return datos;
}

/**
 * Abre la transacción. Devuelve el HTML que hay que renderizar dentro de un
 * iframe: ahí es donde el cliente escribe su tarjeta.
 *
 * Se usa `sale` (venta directa) en vez de `auth`, porque la tienda cobra el
 * total al confirmar y no necesita capturar en un segundo paso.
 */
export async function iniciarPago(params: {
  transactionIdentifier: string;
  orderIdentifier: string;
  total: number;
  merchantResponseUrl: string;
}) {
  // Se acepta el nombre sin prefijo por si alguien lo carga así en el entorno
  const pageSetCompleto = PAGE_SET.startsWith("Ptz/") ? PAGE_SET : `Ptz/${PAGE_SET}`;

  const respuesta = await llamar("sale", {
    TransactionIdentifier: params.transactionIdentifier,
    TotalAmount: Number(params.total.toFixed(2)),
    CurrencyCode: MONEDA,
    ThreeDSecure: true,
    fraudCheck: ANTIFRAUDE,
    OrderIdentifier: params.orderIdentifier,
    AddressMatch: false,
    ExtendedData: {
      ThreeDSecure: { ChallengeWindowSize: 4, ChallengeIndicator: "01" },
      HostedPage: { PageSet: pageSetCompleto, PageName: PAGE_NAME },
      MerchantResponseUrl: params.merchantResponseUrl,
    },
  });

  // SP4 = preprocesamiento correcto, el iframe viene en RedirectData
  if (respuesta?.IsoResponseCode !== "SP4" || !respuesta?.RedirectData) {
    throw new Error(
      respuesta?.ResponseMessage || `La pasarela no entregó el formulario (${respuesta?.IsoResponseCode})`
    );
  }

  return {
    spiToken: respuesta.SpiToken as string,
    redirectData: respuesta.RedirectData as string,
  };
}

/**
 * Interpreta el resultado de 3DS y del antifraude para decidir si se cobra.
 *
 * Los estados U (falla técnica) sí permiten cobrar, pero el comercio pierde
 * la protección ante contracargos. Por eso la decisión es configurable y no
 * viene fijada en el código: se controla con POWERTRANZ_ACEPTAR_3DS_U.
 */
export function evaluarResultado(r: ResultadoAutenticacion): {
  cobrar: boolean;
  motivo: string;
  authStatus: string;
  fraudCode: string;
  sinProteccion: boolean;
  /** Indicación del emisor para el cliente, si la mandó */
  mensajeParaCliente: string;
} {
  const authStatus = r?.RiskManagement?.ThreeDSecure?.AuthenticationStatus || "";
  const fraudCode = r?.RiskManagement?.FraudCheck?.FcResponseCode || "";
  const infoCliente = r?.RiskManagement?.ThreeDSecure?.CardholderInfo || "";

  /**
   * Errores explícitos de la pasarela: se atienden antes que nada y se
   * conserva su texto. Un "Hosted page not found" diagnosticado como "la
   * tarjeta no se pudo verificar" manda al equipo a buscar donde no es.
   */
  if (r?.Errors?.length) {
    const detalle = r.Errors.map((e) => `${e.Code}: ${e.Message}`).join(" · ");
    return {
      cobrar: false,
      motivo: `${r.ResponseMessage || "La pasarela rechazó la transacción"} (${detalle})`,
      authStatus,
      fraudCode,
      mensajeParaCliente: infoCliente,
      sinProteccion: false,
    };
  }

  /**
   * La tarjeta no es apta para 3D-Secure y la transacción se procesa sin
   * autenticación. La pasarela lo señala de dos maneras: `SP1` en la
   * documentación y `3D1` en las respuestas reales de staging.
   *
   * Se puede cobrar, pero sin traslado de responsabilidad: ante un
   * contracargo responde el comercio. Por eso es una decisión de negocio y
   * no una constante.
   */
  if (r?.IsoResponseCode === "SP1" || r?.IsoResponseCode === "3D1") {
    const aceptar = process.env.POWERTRANZ_ACEPTAR_SIN_3DS === "true";
    return {
      cobrar: aceptar,
      motivo: aceptar
        ? "La tarjeta no admite 3D Secure; se cobra sin protección ante contracargos."
        : "La tarjeta no admite la verificación de seguridad requerida.",
      authStatus,
      fraudCode,
      mensajeParaCliente: infoCliente,
      sinProteccion: true,
    };
  }

  if (fraudCode === "D") {
    return {
      cobrar: false,
      motivo: "La verificación antifraude rechazó la transacción.",
      authStatus,
      fraudCode,
      mensajeParaCliente: infoCliente,
      sinProteccion: false,
    };
  }

  if (authStatus === "Y" || authStatus === "A") {
    return {
      cobrar: true,
      motivo: "Autenticación exitosa.",
      authStatus,
      fraudCode,
      mensajeParaCliente: infoCliente,
      sinProteccion: false,
    };
  }

  if (authStatus === "U") {
    const aceptar = process.env.POWERTRANZ_ACEPTAR_3DS_U === "true";
    return {
      cobrar: aceptar,
      motivo: aceptar
        ? "Autenticación no concluyente por falla técnica; se cobra sin protección ante contracargos."
        : "No se pudo verificar la tarjeta con el banco emisor.",
      authStatus,
      fraudCode,
      mensajeParaCliente: infoCliente,
      sinProteccion: true,
    };
  }

  // N y R son rechazo del emisor. Un estado vacío o desconocido también se
  // deniega: la especificación solo autoriza a cobrar con Y, A y U, así que
  // cualquier otra cosa se trata como no autenticada.
  return {
    cobrar: false,
    motivo: authStatus
      ? "El banco emisor no autorizó la transacción."
      : "La tarjeta no completó la verificación de seguridad.",
    authStatus,
    fraudCode,
    mensajeParaCliente: infoCliente,
    sinProteccion: false,
  };
}

/**
 * Ejecuta el cobro. Hay que llamarla dentro de los 5 minutos de vigencia
 * del SpiToken; pasado ese plazo la pasarela lo rechaza.
 */
export async function finalizarPago(spiToken: string) {
  // El cuerpo es el token entre comillas, no un objeto JSON
  const respuesta = await llamar("payment", spiToken, false);

  return {
    aprobado: Boolean(respuesta?.Approved) && respuesta?.IsoResponseCode === "00",
    isoResponseCode: (respuesta?.IsoResponseCode as string) || "",
    responseMessage: (respuesta?.ResponseMessage as string) || "",
    cardBrand: (respuesta?.CardBrand as string) || "",
    bruto: respuesta,
  };
}

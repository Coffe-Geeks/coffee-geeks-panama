/**
 * Activación del Coffee Geeks Passport.
 *
 * Se llama una sola vez, justo después de que BAC confirma el cobro. Vive
 * aparte de la pasarela y aparte del pedido porque es un tercer sistema: si
 * mañana cambia la URL o el contrato, se toca solo este archivo.
 *
 * De la respuesta NO se guarda la contraseña temporal ni el enlace mágico.
 * Los dos dan acceso a la cuenta del comprador, y dejarlos escritos en
 * nuestra base convertiría el panel de pedidos en un llavero. El enlace se
 * usa en el momento para armar el correo y ahí muere; si el correo falla, se
 * vuelve a pedir la activación, que el propio servicio resuelve devolviendo
 * `cuenta_ya_existia`.
 */

export type DatosActivacion = {
  nombre: string;
  correo: string;
  telefono?: string;
};

export type ResultadoActivacion = {
  ok: boolean;
  usuarioId: string;
  cuentaYaExistia: boolean;
  /** Efímero: se usa para el correo y no se persiste */
  magicLink: string;
  passwordTemporal: string;
};

const URL_POR_OMISION = "https://passport.coffeegeekspanama.com/api/public/passport-sale";

/** El servicio está configurado y se le puede pedir una activación. */
export function activacionDisponible(): boolean {
  return Boolean(process.env.PASAPORTE_API_KEY);
}

export async function activarPasaporte(datos: DatosActivacion): Promise<ResultadoActivacion> {
  const url = process.env.PASAPORTE_API_URL || URL_POR_OMISION;
  const apiKey = process.env.PASAPORTE_API_KEY;

  if (!apiKey) {
    throw new Error("Falta PASAPORTE_API_KEY: no se puede activar el pasaporte.");
  }

  // El cobro ya ocurrió; si el servicio no responde no se puede esperar
  // indefinidamente con el comprador en pantalla.
  const control = new AbortController();
  const corte = setTimeout(() => control.abort(), 15000);

  let respuesta: Response;
  try {
    respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        nombre: datos.nombre,
        correo: datos.correo,
        telefono: datos.telefono || "",
      }),
      signal: control.signal,
    });
  } catch (err: any) {
    throw new Error(
      err?.name === "AbortError"
        ? "El servicio del pasaporte no respondió a tiempo."
        : `No se pudo contactar el servicio del pasaporte: ${err?.message}`
    );
  } finally {
    clearTimeout(corte);
  }

  const texto = await respuesta.text();
  let datosRespuesta: any;
  try {
    datosRespuesta = JSON.parse(texto);
  } catch {
    throw new Error(`Respuesta no interpretable del pasaporte (${respuesta.status}).`);
  }

  if (!respuesta.ok || datosRespuesta?.ok !== true) {
    // El mensaje del servicio puede traer la clave; se reporta solo su texto
    throw new Error(
      datosRespuesta?.error || datosRespuesta?.message || `El pasaporte respondió ${respuesta.status}.`
    );
  }

  return {
    ok: true,
    usuarioId: datosRespuesta?.usuario?.id?.toString() || "",
    cuentaYaExistia: Boolean(datosRespuesta?.cuenta_ya_existia),
    magicLink: datosRespuesta?.magic_link || "",
    passwordTemporal: datosRespuesta?.password_temporal || "",
  };
}

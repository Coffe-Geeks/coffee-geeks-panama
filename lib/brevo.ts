/**
 * Integración con Brevo: contactos y correos transaccionales.
 * Todo es opcional: si falta BREVO_API_KEY (o la lista correspondiente) las
 * funciones no hacen nada y la web sigue funcionando como antes.
 */

const API = "https://api.brevo.com/v3";

function cabeceras(apiKey: string) {
  return {
    "api-key": apiKey,
    accept: "application/json",
    "content-type": "application/json",
  };
}

type Lista = "BREVO_LISTA_BOLETIN" | "BREVO_LISTA_PARTICIPANTES";

/**
 * Da de alta (o actualiza) un contacto en la lista indicada por la variable de entorno.
 * Por defecto va al boletín. No lanza: cualquier fallo queda en el log.
 */
export async function agregarContactoBrevo(
  email: string,
  lista: Lista = "BREVO_LISTA_BOLETIN",
  atributos: Record<string, string> = {}
) {
  const apiKey = process.env.BREVO_API_KEY;
  const listaId = Number(process.env[lista]);
  if (!apiKey || !listaId) return;

  try {
    const res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: cabeceras(apiKey),
      body: JSON.stringify({
        email,
        listIds: [listaId],
        updateEnabled: true,
        attributes: atributos,
      }),
    });
    if (!res.ok && res.status !== 204) {
      console.error("Brevo no aceptó el contacto:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Error enviando el contacto a Brevo:", err);
  }
}

/**
 * Envía un correo transaccional por Brevo. Devuelve true si Brevo lo aceptó.
 * El remitente debe estar verificado en Brevo (marketing@ lo está).
 */
export async function enviarCorreoBrevo(opts: { to: string; subject: string; html: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  const remitente = process.env.BREVO_REMITENTE || "marketing@coffeegeekspanama.com";
  try {
    const res = await fetch(`${API}/smtp/email`, {
      method: "POST",
      headers: cabeceras(apiKey),
      body: JSON.stringify({
        sender: { name: "Coffee Geeks Panamá", email: remitente },
        replyTo: { email: remitente },
        to: [{ email: opts.to }],
        subject: opts.subject,
        htmlContent: opts.html,
      }),
    });
    if (!res.ok) {
      console.error("Brevo no aceptó el correo:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error enviando correo por Brevo:", err);
    return false;
  }
}

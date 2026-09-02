/**
 * Sincronización de suscriptores con Brevo.
 * Solo actúa si BREVO_API_KEY y BREVO_LISTA_BOLETIN están definidas en el entorno;
 * si no, no hace nada y el alta local sigue funcionando igual.
 */
export async function agregarContactoBrevo(email: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const listaId = Number(process.env.BREVO_LISTA_BOLETIN);
  if (!apiKey || !listaId) return;

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, listIds: [listaId], updateEnabled: true }),
    });
    if (!res.ok && res.status !== 204) {
      console.error("Brevo no aceptó el contacto:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Error enviando el contacto a Brevo:", err);
  }
}

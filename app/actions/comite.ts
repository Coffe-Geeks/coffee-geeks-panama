"use server";

import { sendEmail } from "@/lib/email";

type ActionState = { error?: string; success?: string };

/**
 * A dónde llega el interés en el Comité Nacional País. Va con valor por
 * omisión a propósito: si dependiera solo de una variable de entorno, un
 * despliegue sin configurar dejaría el formulario aceptando mensajes que
 * nadie recibe.
 */
const DESTINO = process.env.CONTACTO_EMAIL || "info@coffeegeekspanama.com";

/** Escapa el texto del visitante: llega a un correo HTML. */
const limpiar = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fila = (etiqueta: string, valor: string) =>
  valor
    ? `<tr><td style="padding:7px 14px 7px 0;color:#8a7b7d;font-size:13px;vertical-align:top;white-space:nowrap">${etiqueta}</td>
         <td style="padding:7px 0;color:#22191a;font-size:15px">${valor}</td></tr>`
    : "";

/**
 * Recibe el interés de una persona en formar parte del Comité Nacional País
 * y se lo hace llegar al equipo.
 */
export async function enviarInteresComite(
  _state: any,
  formData: FormData
): Promise<ActionState> {
  const dato = (k: string) => limpiar(formData.get(k)?.toString().trim() || "");

  const nombre = dato("nombre");
  const email = dato("email");
  const area = dato("area");
  const empresa = dato("empresa");
  const mensaje = dato("mensaje");

  if (!nombre || !email || !area || !empresa) {
    return { error: "Nombre, correo, área de interés y empresa que representas son obligatorios." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Escribe un correo electrónico válido." };
  }

  const html = `
    <div style="font-family:'Segoe UI',Tahoma,sans-serif;background:#38050e;padding:32px 20px">
      <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;padding:28px 30px">
        <h1 style="font-size:20px;color:#38050e;margin:0 0 4px">Interés en el Comité Nacional País</h1>
        <p style="font-size:13px;color:#8a7b7d;margin:0 0 20px">Enviado desde la página de Academia</p>
        <table style="width:100%;border-collapse:collapse">
          ${fila("Nombre", nombre)}
          ${fila("Correo", `<a href="mailto:${email}" style="color:#38050e">${email}</a>`)}
          ${fila("Área de interés", area)}
          ${fila("Empresa", empresa)}
        </table>
        ${
          mensaje
            ? `<div style="margin-top:18px;padding-top:16px;border-top:1px solid #eee">
                 <div style="font-size:12px;color:#8a7b7d;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Mensaje</div>
                 <p style="font-size:14px;line-height:1.6;color:#22191a;margin:0;white-space:pre-line">${mensaje}</p>
               </div>`
            : ""
        }
      </div>
    </div>`;

  try {
    const res = await sendEmail({
      to: DESTINO,
      subject: `Comité Nacional País · ${nombre} (${empresa})`,
      html,
    });
    if ((res as any)?.error) throw new Error((res as any).error);

    return {
      success:
        "Recibimos tu interés. El equipo de Coffee Geeks Panamá se pondrá en contacto contigo para contarte los siguientes pasos.",
    };
  } catch (error) {
    console.error("Error al enviar el interés en el Comité Nacional País:", error);
    return { error: "No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos." };
  }
}

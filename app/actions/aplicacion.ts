"use server";

import { sendEmail } from "@/lib/email";

type ActionState = { error?: string; success?: string };

const SELLOS: Record<string, string> = {
  coffeegeeks: "Insignia Panamá Coffee Geeks",
  itrust: "iTRUST Consumer Brands",
  trustedorigin: "Trusted Origin",
};

const fila = (etiqueta: string, valor: string) =>
  valor
    ? `<tr><td style="padding:6px 12px 6px 0;color:#8a7b7d;font-size:13px;vertical-align:top;white-space:nowrap">${etiqueta}</td>
         <td style="padding:6px 0;color:#22191a;font-size:14px">${valor}</td></tr>`
    : "";

/** Recibe una solicitud para aplicar a los sellos y la envía al equipo. */
export async function enviarAplicacion(
  _state: any,
  formData: FormData
): Promise<ActionState> {
  const dato = (k: string) => formData.get(k)?.toString().trim() || "";

  const negocio = dato("negocio");
  const contacto = dato("contacto");
  const email = dato("email");
  const telefono = dato("telefono");
  const tipo = dato("tipo");
  const ubicacion = dato("ubicacion");
  const mensaje = dato("mensaje");
  const sellos = formData.getAll("sellos").map((s) => SELLOS[s.toString()] || s.toString());

  if (!negocio || !contacto || !email) {
    return { error: "Nombre del establecimiento, persona de contacto y correo son obligatorios." };
  }
  if (!email.includes("@")) {
    return { error: "Escribe un correo electrónico válido." };
  }
  if (!sellos.length) {
    return { error: "Selecciona al menos un sello al que quieras aplicar." };
  }

  const destino = process.env.ADMIN_EMAIL;
  if (!destino) {
    console.error("ADMIN_EMAIL no configurado: no hay a dónde enviar la solicitud.");
    return { error: "No pudimos enviar la solicitud. Escríbenos directamente, por favor." };
  }

  const html = `
    <div style="font-family:'Segoe UI',Tahoma,sans-serif;background:#4c000a;padding:32px 20px">
      <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;padding:28px 30px">
        <h1 style="font-size:20px;color:#4c000a;margin:0 0 4px">Nueva solicitud de sellos</h1>
        <p style="font-size:13px;color:#8a7b7d;margin:0 0 20px">Enviada desde el formulario de Nuestro Método</p>
        <table style="width:100%;border-collapse:collapse">
          ${fila("Establecimiento", negocio)}
          ${fila("Contacto", contacto)}
          ${fila("Correo", `<a href="mailto:${email}" style="color:#4c000a">${email}</a>`)}
          ${fila("Teléfono", telefono)}
          ${fila("Tipo", tipo)}
          ${fila("Ubicación", ubicacion)}
          ${fila("Sellos", sellos.join("<br>"))}
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
      to: destino,
      subject: `Solicitud de sellos · ${negocio}`,
      html,
    });
    if ((res as any)?.error) throw new Error((res as any).error);

    return {
      success:
        "Recibimos tu solicitud. El equipo de Coffee Geeks Panamá se pondrá en contacto contigo para explicarte los siguientes pasos.",
    };
  } catch (error) {
    console.error("Error al enviar la solicitud de sellos:", error);
    return { error: "No pudimos enviar la solicitud. Intenta de nuevo en unos minutos." };
  }
}

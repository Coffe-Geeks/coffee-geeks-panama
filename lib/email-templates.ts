/**
 * Email templates for the Coffee Geeks platform.
 * You can modify the content and design of the emails here.
 */

export const getWelcomeEmailTemplate = (name: string) => {
  const brandColor = "#4c000a"; // Background
  const accentColor = "#bedcf8"; // Text and Button BG
  const buttonTextColor = "#4c000a"; // Button Text

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Coffee Geeks</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: ${brandColor};
          color: ${accentColor};
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 30px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 40px;
          border-radius: 12px;
          border: 1px solid rgba(190, 220, 248, 0.1);
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          opacity: 0.9;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background-color: ${accentColor};
          color: ${buttonTextColor} !important;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 16px;
          transition: transform 0.2s ease;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          opacity: 0.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">COFFEE GEEKS</div>
        <div class="content">
          <h1>¡Hola, ${name}!</h1>
          <p>
            Estamos emocionados de tenerte en nuestra comunidad de amantes del café. 
            Tu registro ha sido exitoso y ya puedes empezar a explorar todo lo que tenemos para ti.
          </p>
          <a href="https://coffeegeekspanama.com/login" class="button">Ir a mi Perfil</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Coffee Geeks. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getAdminNotificationEmailTemplate = (userData: { name: string; email: string; role: string; lastName?: string }) => {
  const brandColor = "#4c000a";
  const accentColor = "#bedcf8";
  const textColor = "#ffffff";
  
  const registrationType = userData.role === "cafeteria" ? "Participante" : "Usuario";
  const fullName = userData.lastName ? `${userData.name} ${userData.lastName}` : userData.name;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Registro - Coffee Geeks</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4efe4;
          color: ${brandColor};
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${brandColor};
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .header {
          padding: 40px 20px;
          text-align: center;
          background: linear-gradient(135deg, ${brandColor} 0%, #6d000f 100%);
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: ${accentColor};
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .badge {
          display: inline-block;
          padding: 6px 16px;
          background-color: ${accentColor};
          color: ${brandColor};
          border-radius: 50px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .content {
          padding: 40px;
          color: ${accentColor};
        }
        .info-card {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 30px;
          border-radius: 16px;
          border: 1px solid rgba(190, 220, 248, 0.1);
        }
        .info-item {
          margin-bottom: 20px;
        }
        .info-label {
          font-size: 12px;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 4px;
          letter-spacing: 1px;
        }
        .info-value {
          font-size: 18px;
          font-weight: 500;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: ${accentColor};
          opacity: 0.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">COFFEE GEEKS</div>
          <div class="badge">Nuevo Registro</div>
        </div>
        <div class="content">
          <h2 style="margin-top: 0; color: ${accentColor};">Se ha registrado un nuevo ${registrationType.toLowerCase()}</h2>
          <div class="info-card">
            <div class="info-item">
              <div class="info-label">Nombre Completo</div>
              <div class="info-value">${fullName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Correo Electrónico</div>
              <div class="info-value">${userData.email}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Tipo de Cuenta</div>
              <div class="info-value">${registrationType}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Fecha de Registro</div>
              <div class="info-value">${new Date().toLocaleString('es-PA', { timeZone: 'America/Panama' })}</div>
            </div>
          </div>
        </div>
        <div class="footer">
          Notificación automática del sistema Coffee Geeks Panamá.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getPasswordResetEmailTemplate = (name: string, resetUrl: string) => {
  const brandColor = "#4c000a";
  const accentColor = "#bedcf8";
  const buttonTextColor = "#4c000a";

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablece tu contraseña</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:${brandColor};color:${accentColor};">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;text-align:center;">
        <div style="font-size:28px;font-weight:bold;margin-bottom:30px;letter-spacing:2px;text-transform:uppercase;">
          Coffee Geeks Panamá
        </div>
        <div style="background-color:rgba(0,0,0,0.2);padding:40px;border-radius:12px;border:1px solid rgba(190,220,248,0.1);">
          <h1 style="font-size:24px;margin-bottom:20px;color:${accentColor};">Restablece tu contraseña</h1>
          <p style="font-size:16px;line-height:1.6;">
            ${name ? `Hola ${name},` : "Hola,"} recibimos una solicitud para cambiar la contraseña
            de tu cuenta. Pulsa el botón para elegir una nueva:
          </p>
          <p style="margin:32px 0;">
            <a href="${resetUrl}"
               style="display:inline-block;background-color:${accentColor};color:${buttonTextColor};
                      text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:bold;font-size:16px;">
              Crear nueva contraseña
            </a>
          </p>
          <p style="font-size:14px;opacity:0.75;line-height:1.6;">
            El enlace vence en una hora y solo puede usarse una vez.
          </p>
          <p style="font-size:14px;opacity:0.75;line-height:1.6;">
            Si no pediste este cambio, ignora este correo: tu contraseña seguirá siendo la misma.
          </p>
          <p style="font-size:12px;opacity:0.55;word-break:break-all;margin-top:28px;">
            ¿El botón no funciona? Copia esta dirección en tu navegador:<br>${resetUrl}
          </p>
        </div>
        <div style="margin-top:24px;font-size:12px;opacity:0.5;">
          Correo automático del sistema Coffee Geeks Panamá.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Comprobante de compra. Va con tablas y estilos en línea porque los
 * clientes de correo ignoran hojas de estilo y buena parte del CSS moderno;
 * lo que aquí parece anticuado es lo que hace que se vea igual en Gmail,
 * Outlook y el correo del teléfono.
 */
export const getOrderConfirmationEmailTemplate = (pedido: {
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  items: { name: string; variant?: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  requiresShipping: boolean;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    province?: string;
    country?: string;
    notes?: string;
  };
  /** Acceso al Coffee Geeks Passport, si la compra lo incluía */
  magicLink?: string;
  /** Establecimientos donde retirar lo físico, si aplica */
  puntosRetiro?: { nombre: string; ubicacion: string }[];
}) => {
  const brandColor = "#4c000a";
  const accentColor = "#bedcf8";

  const filas = pedido.items
    .map(
      (i) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid rgba(190,220,248,0.12);font-size:15px;">
            ${i.quantity} × ${i.name}${i.variant ? ` <span style="opacity:0.6;">· ${i.variant}</span>` : ""}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid rgba(190,220,248,0.12);font-size:15px;text-align:right;white-space:nowrap;">
            $${(i.unitPrice * i.quantity).toFixed(2)}
          </td>
        </tr>`
    )
    .join("");

  // El acceso al pasaporte va arriba del detalle: es lo que el comprador
  // vino a buscar, y enterrarlo bajo la lista de importes lo esconde.
  const bloquePasaporte = pedido.magicLink
    ? `
        <div style="background-color:${accentColor};color:${brandColor};padding:26px;border-radius:12px;margin-bottom:26px;text-align:center;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.75;margin-bottom:8px;">
            Tu pasaporte ya está activo
          </div>
          <div style="font-size:16px;line-height:1.55;margin-bottom:20px;">
            Entra con este enlace para empezar a sellar tu ruta del café.
          </div>
          <a href="${pedido.magicLink}"
             style="display:inline-block;background-color:${brandColor};color:${accentColor};
                    text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:bold;font-size:16px;">
            Abrir mi pasaporte
          </a>
          <div style="font-size:12px;opacity:0.7;margin-top:16px;line-height:1.5;">
            El enlace es personal: no lo compartas.
          </div>
        </div>`
    : "";

  // Dónde retirar la parte física. Va después del acceso digital, porque
  // primero se usa lo que ya está disponible y luego se recoge la libreta.
  const bloqueRetiro = pedido.puntosRetiro?.length
    ? `
        <div style="background-color:rgba(0,0,0,0.25);padding:24px;border-radius:12px;margin-bottom:26px;text-align:left;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.6;margin-bottom:10px;">
            Dónde retirar tu pasaporte físico
          </div>
          <div style="font-size:14px;line-height:1.55;opacity:0.85;margin-bottom:16px;">
            Presenta tu número de pedido <strong>${pedido.orderNumber}</strong> en cualquiera de
            estos establecimientos. No hacemos entregas a domicilio.
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${pedido.puntosRetiro
              .map(
                (p) => `
              <tr>
                <td style="padding:7px 0;border-bottom:1px solid rgba(190,220,248,0.10);font-size:14px;">
                  ${p.nombre}
                  <span style="opacity:0.6;"> · ${p.ubicacion}</span>
                </td>
              </tr>`
              )
              .join("")}
          </table>
        </div>`
    : "";

  const dir = pedido.shippingAddress || {};
  const bloqueEnvio =
    pedido.requiresShipping && dir.line1
      ? `
        <div style="background-color:rgba(0,0,0,0.25);padding:22px;border-radius:12px;margin-top:22px;text-align:left;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.6;margin-bottom:10px;">
            Dirección de entrega
          </div>
          <div style="font-size:15px;line-height:1.6;">
            ${[dir.line1, dir.line2].filter(Boolean).join("<br>")}<br>
            ${[dir.city, dir.province].filter(Boolean).join(", ")}<br>
            ${dir.country || "Panamá"}
            ${dir.notes ? `<br><span style="opacity:0.7;font-size:14px;">Indicaciones: ${dir.notes}</span>` : ""}
          </div>
        </div>`
      : `
        <div style="background-color:rgba(0,0,0,0.25);padding:22px;border-radius:12px;margin-top:22px;text-align:left;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.6;margin-bottom:10px;">
            Entrega
          </div>
          <div style="font-size:15px;line-height:1.6;">
            ${
              pedido.puntosRetiro?.length
                ? "Tu acceso digital va en este correo; la parte física la retiras en los puntos indicados arriba."
                : "Tu compra es digital. Te escribimos a este mismo correo con las instrucciones de acceso."
            }
          </div>
        </div>`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de tu compra ${pedido.orderNumber}</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:${brandColor};color:${accentColor};">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="font-size:28px;font-weight:bold;margin-bottom:30px;letter-spacing:2px;text-transform:uppercase;text-align:center;">
          Coffee Geeks Panamá
        </div>

        <div style="background-color:rgba(0,0,0,0.2);padding:36px;border-radius:12px;border:1px solid rgba(190,220,248,0.1);">
          <h1 style="font-size:24px;margin:0 0 14px;color:${accentColor};text-align:center;">¡Gracias por tu compra!</h1>
          <p style="font-size:16px;line-height:1.6;text-align:center;margin:0 0 24px;">
            ${pedido.customer.name ? `${pedido.customer.name}, tu` : "Tu"} pago fue aprobado y ya estamos preparando tu pedido.
          </p>

          <div style="text-align:center;margin-bottom:26px;">
            <span style="display:inline-block;background-color:${accentColor};color:${brandColor};padding:8px 22px;border-radius:50px;font-weight:bold;font-size:16px;letter-spacing:1px;">
              ${pedido.orderNumber}
            </span>
          </div>

          ${bloquePasaporte}
          ${bloqueRetiro}

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${filas}
            <tr>
              <td style="padding:12px 0;font-size:15px;opacity:0.8;">Subtotal</td>
              <td style="padding:12px 0;font-size:15px;text-align:right;opacity:0.8;">$${pedido.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:0 0 12px;font-size:15px;opacity:0.8;">Envío</td>
              <td style="padding:0 0 12px;font-size:15px;text-align:right;opacity:0.8;">
                ${pedido.shippingCost === 0 ? (pedido.requiresShipping ? "Gratis" : "No aplica") : `$${pedido.shippingCost.toFixed(2)}`}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 0 0;border-top:2px solid rgba(190,220,248,0.3);font-size:19px;font-weight:bold;">Total</td>
              <td style="padding:16px 0 0;border-top:2px solid rgba(190,220,248,0.3);font-size:19px;font-weight:bold;text-align:right;">
                $${pedido.total.toFixed(2)} USD
              </td>
            </tr>
          </table>

          ${bloqueEnvio}

          <p style="font-size:14px;opacity:0.75;line-height:1.6;margin-top:26px;text-align:center;">
            Guarda este correo: el número de pedido es lo que necesitas si escribes para consultar por tu compra.
          </p>
        </div>

        <div style="margin-top:24px;font-size:12px;opacity:0.5;text-align:center;">
          Correo automático del sistema Coffee Geeks Panamá.<br>
          El cobro aparece en tu estado de cuenta procesado por Panamá International Firm.
        </div>
      </div>
    </body>
    </html>
  `;
};

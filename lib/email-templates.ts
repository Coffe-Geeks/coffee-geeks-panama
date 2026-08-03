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
          <a href="https://coffee-geeks.com/login" class="button">Ir a mi Perfil</a>
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

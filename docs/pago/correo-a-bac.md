# Correo para BAC / FAC — dos solicitudes que bloquean el cobro

**Para:** BACSoporte@powertranz.bm (Giancarlo Torres, Operations Analyst)
**Copia:** el ejecutivo de BAC Credomatic que atiende la cuenta
**Asunto:** Coffee Geeks Panamá (PowerTranz ID 77702076) — Solicitud de Hosted Page y habilitación de FraudCheck

---

Estimado Giancarlo, buen día:

Escribimos por la integración de **Coffee Geeks Panamá**, comercio con
**PowerTranz ID 77702076**, en el entorno de staging.

Ya completamos el desarrollo del checkout con el producto **Hosted Payment
Page** y lo validamos contra `https://staging.ptranz.com/api/spi`. Nuestras
credenciales funcionan correctamente: el endpoint `/sale` responde
`IsoResponseCode: SP4 · SPI Preprocessing complete`, con `SpiToken` y
`RedirectData` válidos, y nuestro `MerchantResponseUrl` recibe e interpreta
bien la respuesta.

Nos quedan **dos puntos que dependen de la configuración de la cuenta** y que
no podemos resolver de nuestro lado. Les agradecemos su apoyo con ambos:

## 1. Crear la Página Alojada (Page Set / Page Name)

Cuando el navegador envía el `SpiToken` a `/api/spi/Conductor`, la respuesta
es:

> `Code 757 — "Hosted page not found"`

La documentación indica que la Página Alojada se crea en el Portal del
Comercio. Les solicitamos crear el **Page Set** y el **Page Name** para
nuestro comercio, e informarnos los valores literales para enviarlos en
`ExtendedData.HostedPage`.

Ya tenemos preparada la personalización visual de esa página con la marca de
Coffee Geeks Panamá, y podemos enviarla en el formato que su portal acepte:

- una hoja de estilo con selectores de elemento (`input`, `select`,
  `button`), de modo que se aplique sin depender de los nombres de clase
  internos del formulario;
- un armazón HTML con nuestro logo, títulos y pie de seguridad, indicando el
  punto exacto donde va el bloque de campos de tarjeta.

¿Podrían confirmarnos **qué formato acepta el Portal del Comercio** para esa
personalización, y si podemos cargarla nosotros o la aplican ustedes?

Dos notas técnicas sobre esa página:

- Va embebida en un iframe dentro de nuestro dominio, así que necesitamos que
  permita `frame-ancestors` desde `coffeegeekspanama.com` y desde nuestros
  dominios de prueba.
- Carga nuestro logo desde `https://coffeegeekspanama.com/logo.webp` y las
  tipografías desde `fonts.googleapis.com`. Si su política de contenido lo
  bloquea, indíquennos y les enviamos el logo para alojarlo dentro del
  portal.

## 2. Habilitar la verificación antifraude

Toda solicitud enviada con `"fraudCheck": true` devuelve:

> `IsoResponseCode: FC3 — FraudCheck error`
> `Code 1011 — "Invalid Provider"`

Con ese error **la transacción no llega a abrirse**, así que hoy operamos con
`fraudCheck: false`. Les solicitamos habilitar el proveedor de verificación
antifraude para esta cuenta, o bien confirmarnos que debemos continuar sin
él.

## 3. Acceso al Portal del Comercio

Aún no hemos recibido el correo con el usuario y el enlace para crear la
contraseña del Portal del Comercio. Agradecemos nos lo hagan llegar para
poder monitorear las transacciones.

---

Quedamos atentos. Apenas nos confirmen estos puntos completamos la batería de
pruebas en staging —aprobadas y denegadas, por cada marca— y les enviamos los
resultados para avanzar con la habilitación de producción.

Saludos cordiales,

**Coffee Geeks Panamá**

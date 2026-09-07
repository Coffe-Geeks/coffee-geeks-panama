# Correo para BAC / FAC — dos solicitudes que bloquean el cobro

**Para:** BACSoporte@powertranz.bm (Giancarlo Torres, Operations Analyst)
**Copia:** el ejecutivo de BAC Credomatic que atiende la cuenta
**Asunto:** Coffee Geeks Panamá (PowerTranz ID 77702076) — Hosted Page publicada devuelve 757 y habilitación de FraudCheck

---

Estimado Giancarlo, buen día:

Escribimos por la integración de **Coffee Geeks Panamá**, comercio con
**PowerTranz ID 77702076**, en el entorno de staging.

Agradecemos su correo con el resumen del proceso de integración, las
credenciales del entorno de pruebas y el acceso al Portal del Comercio.

Ya completamos el desarrollo del checkout con el producto **Hosted Payment
Page** y lo validamos contra `https://staging.ptranz.com/api/spi`. Nuestras
credenciales funcionan correctamente: el endpoint `/sale` responde
`IsoResponseCode: SP4 · SPI Preprocessing complete`, con `SpiToken` y
`RedirectData` válidos, y nuestro `MerchantResponseUrl` recibe e interpreta
bien la respuesta.

Confirmamos además que nuestro manejo del campo `AuthenticationStatus` sigue
exactamente la tabla que nos enviaron: completamos el pago con `Y` y `A`, lo
denegamos con `N` y `R`, y dejamos `U` como decisión configurable del
comercio, entendiendo que en ese caso se pierde la protección ante ciertos
contracargos. Ese último punto lo revisaremos con el adquirente, como
ustedes indican.

Nos quedan **dos puntos que dependen de la configuración de la cuenta** y que
no podemos resolver de nuestro lado. Les agradecemos su apoyo con ambos:

## 1. La Hosted Page está publicada pero el Conductor no la encuentra

Ya recibimos el acceso al Portal del Comercio y **creamos y publicamos la
página**. En el portal figura así:

| | |
|---|---|
| Id | `2701` |
| Page Set | `CoffeeGeeks` |
| Page Name | `Checkout` |
| Editor Type | Advanced |
| Estado | **Published** |
| Comercio | `77702076` — PANAMA UNIQUE |

Sin embargo, al enviar esos mismos valores en `ExtendedData.HostedPage`, el
flujo se corta:

1. `/api/spi/sale` responde correctamente
   `IsoResponseCode: SP4 · SPI Preprocessing complete`, con `SpiToken` y
   `RedirectData`.
2. Al postear ese `SpiToken` a `/api/spi/Conductor`, la respuesta es:

> `Code 757 — "Hosted page not found"`

Antes de escribirles descartamos lo que estaba a nuestro alcance. Las
siguientes pruebas devuelven todas el mismo `757`:

- Los valores exactos del portal, `CoffeeGeeks` / `Checkout`.
- Once variantes de esos nombres: mayúsculas, minúsculas, espacios al
  principio y al final, y con corchetes (`[CoffeeGeeks]` / `[Checkout]`),
  por si los corchetes que muestra el portal formaran parte del valor.
- El endpoint `/auth` en lugar de `/sale`.
- Referenciando la página por su id `2701`, y con un campo `PageId` adicional.
- Veinte nombres genéricos (`Default`, `Test`, `Standard`, el propio
  PowerTranz ID, entre otros), para descartar que hubiera una página por
  omisión.
- Reintentos espaciados en el tiempo, por si se trataba de propagación.

Todas las pruebas se hicieron contra `https://staging.ptranz.com/api/spi` con
las credenciales del ID `77702076`, las mismas con las que el `/sale`
responde `SP4` sin problema.

**Nuestra consulta:** ¿queda algún paso pendiente para que una página
publicada quede disponible para el `Conductor` —alguna asociación al
comercio, un permiso, o una activación adicional—, o hay algo en la cuenta
que debamos ajustar de nuestro lado?

Quedamos a disposición para hacer las pruebas que necesiten mientras revisan.

## 3. Habilitar la verificación antifraude

Toda solicitud enviada con `"fraudCheck": true` devuelve:

> `IsoResponseCode: FC3 — FraudCheck error`
> `Code 1011 — "Invalid Provider"`

Con ese error **la transacción no llega a abrirse**, así que hoy operamos con
`fraudCheck: false`. Les solicitamos habilitar el proveedor de verificación
antifraude para esta cuenta, o bien confirmarnos que debemos continuar sin
él.

## 4. Tarjetas de prueba de American Express

Recibimos el anexo de tarjetas de prueba, que agradecemos. Contiene seis
tarjetas Visa y seis MasterCard, pero **ninguna de American Express**.

Como nuestra cuenta está habilitada para Amex y ustedes nos indican que las
pruebas deben incluir transacciones aprobadas y denegadas de cada marca,
les solicitamos las tarjetas de prueba de Amex con SafeKey para poder cerrar
la batería completa.



---

Quedamos atentos. Apenas nos confirmen estos puntos completamos la batería de
pruebas en staging —aprobadas y denegadas, por cada marca— y les enviamos los
resultados para avanzar con la habilitación de producción.

Saludos cordiales,

**Coffee Geeks Panamá**

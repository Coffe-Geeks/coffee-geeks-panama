# Para Muce — por qué el pago no se puede probar todavía en línea

## Resumen

La integración con BAC está terminada y **probada contra el ambiente de
staging de PowerTranz**. Lo que falta para poder probarla en línea no es
código: son cuatro variables de entorno en el proyecto de Vercel, a las que
no tenemos acceso.

## Lo que ya está verificado

Corriendo el flujo completo contra `staging.ptranz.com` con las credenciales
del comercio `77702076`:

| Paso | Resultado |
|---|---|
| `POST /api/spi/sale` | `SP4 · SPI Preprocessing complete`, con `SpiToken` y `RedirectData` |
| `POST /api/spi/Conductor` | Devuelve el formulario de tarjeta, con la marca de Coffee Geeks |
| `POST /api/spi/HostedPage` | Responde con el resultado de la autenticación |
| `POST /api/spi/payment` | **`Approved: true` · `Iso 00` · autorización `123456` · RRN `625021379114`** |
| Retorno a `MerchantResponseUrl` | Se interpreta, actualiza el pedido y saca al cliente del iframe |

También quedó probada la activación del Coffee Geeks Passport contra su
servicio real, y el correo de confirmación con los 23 puntos de retiro.

## Por qué no se puede probar en línea

`pruebas-coffee-geeks.vercel.app` responde *"Pago en línea aún no
habilitado"*. Eso lo decide una sola condición en el código:

```ts
export function pasarelaDisponible(): boolean {
  return Boolean(
    process.env.POWERTRANZ_ID &&
    process.env.POWERTRANZ_PASSWORD &&
    process.env.POWERTRANZ_PAGE_SET &&
    process.env.POWERTRANZ_PAGE_NAME
  );
}
```

Falta al menos una de esas cuatro en el proyecto de Vercel. Sabemos que el
mecanismo funciona porque `POWERTRANZ_MODO_PRUEBA` sí llega al despliegue —
su panel de simulación aparece en pantalla.

**Detalle importante sobre los entornos.** `pruebas.yml` despliega con
`vercel deploy` **sin `--prod`**, así que genera un despliegue de tipo
*Preview* y después le pone el alias. Una variable marcada solo para
*Production* no la ve ese despliegue. Hay que marcar los tres entornos.

## Por qué no lo resolvemos nosotros

- **No tenemos acceso al proyecto de Vercel.** Nuestra cuenta solo ve su
  propio equipo; el proyecto vive en la cuenta de Coffee Geeks.
- **El `DEPLOY_TOKEN` del repo no alcanza.** Es de alcance limitado al
  proyecto: sirve para desplegar, pero no para consultar ni escribir
  variables. Lo intentamos por CLI y por la API de Vercel; las dos
  devuelven error de permisos.
- **El panel de diagnóstico que agregamos en `/admin/pedidos`** —que dice
  exactamente cuál variable falta, sin exponer valores— necesita una sesión
  de administrador que no tenemos a mano.

## Qué hace falta

**1. Cargar estas cuatro variables** en el proyecto de Vercel, marcando
**Production, Preview y Development**:

```
POWERTRANZ_ID          ← del correo de incorporación de FAC
POWERTRANZ_PASSWORD    ← del correo de incorporación de FAC
POWERTRANZ_PAGE_SET    Ptz/CoffeeGeeks
POWERTRANZ_PAGE_NAME   Checkout
```

El prefijo `Ptz/` es obligatorio y no está en la documentación de FAC: sin
él la pasarela responde `757 · Hosted page not found` aunque la página
exista y esté publicada. Lo confirmó su soporte. El código lo agrega solo
si falta, así que también funciona escribiendo `CoffeeGeeks`.

Conviene cargar además `POWERTRANZ_BASE_URL`, `POWERTRANZ_CURRENCY`,
`PASAPORTE_API_URL` y `PASAPORTE_API_KEY`. Están todas documentadas en
`.env.example`.

**2. Ajustar el producto** *Pasaporte Turístico del Café* en
`/admin/productos`: apagar **Requiere envío**, encender **Activa el
Pasaporte** y **Se retira en punto de venta**. Hoy le pide dirección de
envío a quien compra algo que se retira en punto de venta, y sin el segundo
interruptor no se crea la cuenta digital al aprobarse el pago.

**3. Volver a publicar.** Vercel fija las variables al compilar, así que un
despliegue anterior al cambio no las ve.

## Verificación

Una vez hecho, `/admin/pedidos` muestra arriba un panel **"Estado de la
pasarela"** que dice si puede cobrar y qué falta, sin exponer ningún valor.

## Pendiente de FAC, no nuestro

- **3DS no está funcionando.** Las cinco tarjetas del anexo, incluidas las
  que ellos marcan como *challenge*, devuelven `3D1 · 3DS not supported`. Su
  correo dice que la cuenta está configurada para 3DS2 con Visa y
  MasterCard. Importa porque sin 3DS el comercio no conserva la protección
  ante contracargos.
- **Antifraude sin aprovisionar.** Con `fraudCheck: true` responde
  `FC3 · 1011 Invalid Provider` y ninguna transacción llega a abrirse. Por
  eso `POWERTRANZ_FRAUD_CHECK` viene apagado.
- **Faltan las tarjetas de prueba de American Express.** El anexo trae solo
  Visa y MasterCard, y ellos exigen probar aprobadas y denegadas de cada
  marca antes de habilitar producción.

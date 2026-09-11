# Módulo de pago — PowerTranz / BAC Credomatic

Todo lo específico de la pasarela está aislado en tres archivos. Cambiar de
proveedor no obliga a tocar el carrito, el checkout ni el panel de pedidos.

| Archivo | Qué hace |
|---|---|
| `lib/pagos/powertranz.ts` | Habla con la pasarela: abre la transacción, interpreta 3DS y antifraude, ejecuta el cobro. |
| `lib/tienda/pago-pedido.ts` | Aplica el resultado sobre el pedido: estado, existencias y correo. No sabe nada de PowerTranz. |
| `app/api/pagos/powertranz/respuesta/route.ts` | Recibe la respuesta de la pasarela (`MerchantResponseUrl`). |

---

## Variables de entorno

Ninguna credencial va en el código ni en el repositorio. Se cargan en el
panel de Vercel para el entorno de pruebas y en el `.env` del droplet para
producción.

| Variable | Para qué | Ejemplo |
|---|---|---|
| `POWERTRANZ_ID` | Usuario de la pasarela (cabecera `PowerTranz-PowerTranzId`) | *lo entrega FAC* |
| `POWERTRANZ_PASSWORD` | Contraseña (cabecera `PowerTranz-PowerTranzPassword`) | *lo entrega FAC* |
| `POWERTRANZ_BASE_URL` | Ambiente | `https://staging.ptranz.com/api/spi` |
| `POWERTRANZ_CURRENCY` | Moneda ISO | `840` (USD) |
| `POWERTRANZ_PAGE_SET` | Conjunto de páginas alojadas. **Lleva el prefijo `Ptz/`** | *se consulta en el Portal* |
| `POWERTRANZ_PAGE_NAME` | Página dentro del conjunto | *se consulta en el Portal* |
| `POWERTRANZ_FRAUD_CHECK` | Enciende la verificación antifraude Kount | `false` (ver abajo) |
| `POWERTRANZ_ACEPTAR_3DS_U` | Si se cobra cuando 3DS responde `U` | `false` |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, para armar el `MerchantResponseUrl` | `https://coffeegeekspanama.com` |
| `POWERTRANZ_MODO_PRUEBA` | **Solo pruebas.** Habilita simular el cobro sin pasarela | *no debe existir en producción* |

Mientras falten `POWERTRANZ_PAGE_SET` y `POWERTRANZ_PAGE_NAME`, la tienda
sigue funcionando: registra el pedido, avisa que el pago en línea aún no
está habilitado y no cobra nada.

---

## Lo que ya se probó contra staging

Prueba hecha el 6 de septiembre de 2026 con las credenciales del handoff,
desde un servidor local en HTTPS.

**Funciona:**

- Las credenciales son válidas. `/sale` responde `HTTP 200` con
  `IsoResponseCode: SP4 · SPI Preprocessing complete`, más `SpiToken` y
  `RedirectData`. Un error de autenticación daría 401; no es el caso.
- El `RedirectData` es un formulario que se auto-envía a
  `/api/spi/Conductor` recogiendo datos del navegador para 3DS2. Se monta
  bien dentro del iframe.
- El pedido guarda el `TransactionIdentifier` y el `SpiToken` reales.
- El retorno a `MerchantResponseUrl` llega como formulario con un campo
  `Response` en JSON. Nuestra ruta lo interpreta, actualiza el pedido y
  saca al cliente del iframe.

**Dos cosas bloqueadas del lado de FAC:**

1. **Antifraude sin aprovisionar.** Con `fraudCheck: true` la pasarela
   responde `FC3 · FraudCheck error` con `Code 1011 · Invalid Provider`, y
   **ninguna transacción llega a abrirse**. Por eso `POWERTRANZ_FRAUD_CHECK`
   viene apagado. Hay que pedirle a FAC que habilite el proveedor Kount para
   este comercio y luego encenderlo.
2. **Página alojada inexistente.** Con un `PageSet` de relleno, `/sale` pasa
   pero el `Conductor` devuelve `Code 757 · Hosted page not found`. Es decir:
   el `PageSet`/`PageName` hace falta de verdad para que el cliente vea el
   formulario de tarjeta.

**Para probar en local** hace falta servir por HTTPS: la página de BAC es
`https`, y un formulario que envíe hacia `http://localhost` lo bloquea el
navegador por contenido mixto. Con certificado propio:

```
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certificates/localhost-key.pem -out certificates/localhost.pem \
  -days 365 -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"

npx next dev -p 3000 --experimental-https \
  --experimental-https-key certificates/localhost-key.pem \
  --experimental-https-cert certificates/localhost.pem
```

Tarjeta de prueba del handoff: `4012000000020006`, CVV `323`, vence `2310`,
contraseña del desafío 3DS2 `3ds2`.

---

## Recorrido de una compra

1. El cliente arma su carrito y llena sus datos en `/tienda/checkout`.
2. `crearPedido` vuelve a leer precios y existencias **de la base de datos**
   y guarda el pedido en estado `pendiente`. Lo que venga del navegador no
   se usa para cobrar.
3. `/tienda/pago/[numero]` abre la transacción con `/sale` y muestra dentro
   de un iframe el formulario que sirve BAC.
4. El cliente escribe su tarjeta y pasa la autenticación 3DS.
5. PowerTranz llama a `MerchantResponseUrl`. Ahí se evalúa:
   - `FcResponseCode = D` → se deniega sin llamar a `/payment`.
   - `AuthenticationStatus` `Y` o `A` → se cobra.
   - `U` → falla técnica; se cobra solo si `POWERTRANZ_ACEPTAR_3DS_U=true`,
     y en ese caso **el comercio pierde la protección ante contracargos**.
   - `N` o `R` → se deniega.
6. Si procede, se ejecuta `/payment` con el `SpiToken` (vence a los 5
   minutos), se marca el pedido como pagado, se descuentan existencias y
   sale el correo de confirmación.

Las transiciones son idempotentes: si la pasarela notifica dos veces, el
pedido no se mueve dos veces ni el cliente recibe dos correos.

---

## Alcance PCI

### Se evaluó el formulario propio y se descartó (6 de septiembre de 2026)

PowerTranz permite un segundo camino: mandar la tarjeta en `Source` desde
nuestro servidor, sin `HostedPage`. **Funciona hoy** — se probó contra
staging y devuelve `SP4` con `SpiToken` y `RedirectData`, sin depender del
`PageSet`. Habría desbloqueado el cobro de inmediato.

Se descartó igual. La tabla de FAC es clara: el sitio que genera el
formulario de pago cae en **SAQ A-EP**, cuya complejidad de cumplimiento pasa
de baja a alta y arrastra controles adicionales sobre el sitio, con cada
cambio del checkout dentro del alcance de auditoría. Y quien firma ese SAQ es
Panamá International Firm, que es quien procesa los cargos: no es una
decisión que se tome solo por conveniencia de calendario.

Los dos bloqueos que quedan se resuelven con un correo a FAC, no con semanas
de trabajo. Ver `solicitud-pageset-fac.md`.

### El camino elegido

La integración es **SAQ A**: el formulario de tarjeta lo aloja y lo sirve
PowerTranz. Ningún dato de tarjeta pasa por este servidor ni queda en la
base de datos. En el pedido solo se guardan identificadores de transacción,
el código de respuesta y la marca de la tarjeta, que es lo que hace falta
para conciliar y para atender un reclamo.

---

## Personalización del formulario alojado

La pantalla donde el cliente escribe su tarjeta **la sirve PowerTranz desde
su propio dominio**. Por eso no se le puede aplicar CSS desde nuestro sitio:
el navegador lo impide entre dominios distintos. La personalización se hace
en el Portal del Comercio de FAC, cargando la plantilla del Page Set.

En esta carpeta queda lista para entregar:

- **`hpp-coffee-geeks.css`** — la hoja de estilo con los colores, las
  tipografías y las formas de Coffee Geeks. Usa selectores de elemento
  (`input`, `select`, `button`) en vez de nombres de clase, de modo que
  funciona sin conocer el marcado interno de FAC y sobrevive a sus cambios
  de versión.
- **`hpp-coffee-geeks.html`** — el armazón de la página: logo, titular,
  textos y pie de seguridad, con el punto exacto donde FAC debe insertar su
  bloque de campos.

### Lo que hay que pedirle a FAC

1. Crear el Page Set y el Page Name para Coffee Geeks Panamá, y entregarnos
   sus nombres para cargarlos en `POWERTRANZ_PAGE_SET` y `POWERTRANZ_PAGE_NAME`.
2. Cargar en ese Page Set la plantilla y la hoja de estilo de esta carpeta.
3. Permitir la carga del logo desde `coffeegeekspanama.com` y de las
   tipografías desde `fonts.googleapis.com`. Si su política de contenido no
   lo permite, alojar el logo dentro del portal y cambiar el `src` de la
   etiqueta `<img>`.
4. Confirmar que la página se sirve dentro de un iframe en nuestro dominio
   (`ALLOW-FROM` / `frame-ancestors`), que es como está integrada.

### La marca

| Elemento | Valor |
|---|---|
| Vino de marca | `#38050e` |
| Vino oscuro (hover) | `#24060c` |
| Azul pálido | `#cddbf2` |
| Crema de fondo | `#f4efe4` |
| Titulares | Barlow Condensed 900, mayúsculas |
| Texto y campos | Barlow 400/500 |
| Botones | Cápsula, radio 50px, alto 54px |
| Campos | Radio 14px, borde `#cddbf2`, fondo blanco |
| Logo (fondo claro) | `https://coffeegeekspanama.com/logo-vino.png` |

Lo que ya está de nuestro lado: el iframe va montado dentro de la página de
la tienda, con el mismo encabezado, el mismo resumen del pedido al costado y
los mismos pasos numerados, para que el salto de dominio se note lo menos
posible.

---

## Pendiente

- **El correo electrónico debe ir en la página alojada.** FAC lo pidió el 11
  de septiembre de 2026: la plantilla publicada no lo envía y las marcas lo
  exigen. Hay que republicar la página con la plantilla que lo incluye, con el
  campo y su validación obligatorios, y hacer una transacción de prueba antes
  de que entreguen las credenciales de producción. Los pasos están en
  [`ajuste-correo-obligatorio.md`](ajuste-correo-obligatorio.md).
- FAC debe crear el `PageSet` / `PageName` en el Portal del Comercio. Sin
  eso el cliente nunca ve el formulario de tarjeta (`757 · Hosted page not
  found`), aunque el resto del recorrido ya quedó probado.
- FAC debe aprovisionar el antifraude Kount (`1011 · Invalid Provider`), o
  confirmar que se opera sin él.
- Decidir si se acepta `AuthenticationStatus = U`. Es una decisión de
  negocio, no técnica: cobrar en ese caso aumenta las ventas aprobadas y
  traslada al comercio el riesgo del contracargo. Por eso viene apagado.

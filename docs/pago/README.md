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
| `POWERTRANZ_PAGE_SET` | Conjunto de páginas alojadas | *lo crea FAC en el Portal* |
| `POWERTRANZ_PAGE_NAME` | Página dentro del conjunto | *lo crea FAC en el Portal* |
| `POWERTRANZ_ACEPTAR_3DS_U` | Si se cobra cuando 3DS responde `U` | `false` |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, para armar el `MerchantResponseUrl` | `https://coffeegeekspanama.com` |
| `POWERTRANZ_MODO_PRUEBA` | **Solo pruebas.** Habilita simular el cobro sin pasarela | *no debe existir en producción* |

Mientras falten `POWERTRANZ_PAGE_SET` y `POWERTRANZ_PAGE_NAME`, la tienda
sigue funcionando: registra el pedido, avisa que el pago en línea aún no
está habilitado y no cobra nada.

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
| Logo | `https://coffeegeekspanama.com/logo.webp` |

Lo que ya está de nuestro lado: el iframe va montado dentro de la página de
la tienda, con el mismo encabezado, el mismo resumen del pedido al costado y
los mismos pasos numerados, para que el salto de dominio se note lo menos
posible.

---

## Pendiente

- FAC debe crear el `PageSet` / `PageName`. **Sin eso no se puede probar
  contra staging**, aunque el código ya está completo.
- Decidir si se acepta `AuthenticationStatus = U`. Es una decisión de
  negocio, no técnica: cobrar en ese caso aumenta las ventas aprobadas y
  traslada al comercio el riesgo del contracargo. Por eso viene apagado.

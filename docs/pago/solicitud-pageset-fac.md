# Solicitud a FAC — Crear el Page Set de Coffee Geeks Panamá

## Por qué hace falta

La integración está terminada y probada contra staging, pero el comprador
todavía no puede ver el formulario de tarjeta. Al renderizar, el `Conductor`
devuelve:

```
Code 757 · "Hosted page not found"
```

El `/sale` sí pasa (`SP4 · SPI Preprocessing complete`, con `SpiToken` y
`RedirectData`), así que las credenciales y el contrato están bien. Lo único
que falta es que exista la página alojada en el Portal del Comercio.

Hay además un segundo tope, independiente:

```
Code 1011 · "Invalid Provider"  (IsoResponseCode FC3 · FraudCheck error)
```

Aparece cada vez que se envía `fraudCheck: true`, y **ninguna transacción
llega a abrirse**. El comercio no tiene aprovisionado el proveedor antifraude.

---

## Correo para enviar a FAC (`support@powertranz.bm`)

> **Subject:** Coffee Geeks Panama — Hosted Page (Page Set / Page Name) creation request
>
> Hello,
>
> We have completed the SPI integration for **Coffee Geeks Panama** and
> validated it against staging. Our credentials work: `/sale` returns
> `SP4 · SPI Preprocessing complete` with a valid `SpiToken` and
> `RedirectData`, and our `MerchantResponseUrl` correctly receives and parses
> the response.
>
> We are blocked on two items that need to be enabled on your side:
>
> **1. Hosted Page (Page Set / Page Name)**
> When the browser posts the `SpiToken` to `/api/spi/Conductor`, the response
> is `Code 757 — "Hosted page not found"`. Please create a Page Set and Page
> Name for our merchant account and let us know the exact literal values, so
> we can send them in `ExtendedData.HostedPage`.
>
> We have prepared the branding for that page and can send it in whichever
> format your portal accepts:
> - a stylesheet (`hpp-coffee-geeks.css`) using element-level selectors
>   (`input`, `select`, `button`), so it applies without depending on your
>   internal class names;
> - an HTML shell (`hpp-coffee-geeks.html`) with our logo, headings and
>   security footer, marking exactly where your card-field block goes.
>
> Could you confirm which format the Merchant Portal accepts for hosted page
> customization, and whether we can upload it ourselves or you apply it?
>
> Two technical notes for that page:
> - It is embedded in an iframe on our domain, so it must allow
>   `frame-ancestors` from `coffeegeekspanama.com` (and our test domains).
> - It loads our logo from `https://coffeegeekspanama.com/logo.webp` and
>   fonts from `fonts.googleapis.com`. If your content policy blocks those,
>   tell us and we will supply the logo for hosting inside the portal.
>
> **2. Fraud check provider**
> Any request sent with `"fraudCheck": true` returns
> `IsoResponseCode: FC3 — FraudCheck error` with `Code 1011 — "Invalid
> Provider"`, and the transaction never opens. Please either provision the
> fraud-check provider for this merchant account, or confirm that we should
> operate with `fraudCheck: false`.
>
> **3. Merchant Portal access**
> We have not yet received the Merchant Portal credentials. Please send the
> access email so we can monitor transactions.
>
> Thank you,
> Coffee Geeks Panamá

---

## Qué hacemos cuando respondan

1. Cargar los valores literales en el entorno:
   ```
   POWERTRANZ_PAGE_SET="<lo que entregue FAC>"
   POWERTRANZ_PAGE_NAME="<lo que entregue FAC>"
   ```
2. Si habilitan el antifraude, encender `POWERTRANZ_FRAUD_CHECK="true"`.
3. Repetir la prueba en local por HTTPS con la tarjeta de staging
   (`4012000000020006`, CVV `323`, vence `2310`, clave 3DS2 `3ds2`) y
   confirmar que el formulario se ve con la marca de Coffee Geeks.
4. Documentar las pruebas aprobadas y denegadas, que es lo que FAC pide antes
   de habilitar producción.

## Para tener en cuenta del calendario

FAC no hace pasos a producción los viernes, fines de semana ni festivos de
Bermuda, y las pruebas en producción son solo de lunes a viernes de 8:30 a
17:30 hora del Atlántico. Conviene no agendar la salida cerca de un viernes.

## Portal del Comercio

`https://staging.ptranz.com/portal` — las credenciales las envía FAC desde
`support@powertranz.bm`.

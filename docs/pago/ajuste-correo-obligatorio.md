# Ajuste pedido por FAC: el correo electrónico es obligatorio

**Fecha:** 11 de septiembre de 2026
**Quién lo pide:** José González — soporte PowerTranz / BAC

## Qué dijo FAC

> A nivel de procesamiento todas sus transacciones fueron exitosas; sin
> embargo, es necesario aplicar un ajuste en su integración. En este caso, la
> página alojada que seleccionaron no envía el correo electrónico y este campo
> es mandatorio por las marcas, por lo que deben realizar al menos una
> transacción de pruebas con el template correcto; este debe ser email y
> marcar el correo y validación como obligatorios.
>
> Cuando tengan la transacción de pruebas con el template correcto, por favor
> indíquenme para validar y entregarle las credenciales de producción
> correctas.

Las siete transacciones del reporte (`77702076 — PANAMA UNIQUE`) salieron
aprobadas, con 3DS `Y` y protocolo 2.1.0. **No hay nada que corregir en el
código de la tienda ni en el flujo de pago.** Lo que falta es un campo en la
página alojada, que vive en el Portal del Comercio.

## Qué hay que cambiar, y dónde

El cambio **no está en este repositorio**: la página de tarjeta la sirve
PowerTranz desde su dominio y se edita en el Portal del Comercio. Hace falta
alguien con acceso al Portal.

1. Abrir el Page Set de Coffee Geeks y **crear la página con la plantilla que
   incluye correo electrónico** (FAC la llama «email»). La plantilla actual no
   lo trae, que es justo lo que reportan.
2. Marcar el campo de correo como **obligatorio** y dejar su **validación
   activa**.
3. Pegar el HTML y los estilos de [`hpp-advanced-pegar.html`](hpp-advanced-pegar.html),
   que ya llevan el campo ubicado y con el mismo trato visual que el resto.
4. **Confirmar el nombre del token en la lista que muestra el editor.** En el
   archivo va como `@Email@`, por coherencia con `@CardHolderName@` y los
   demás, pero no está confirmado contra el Portal. Si allí se llama distinto,
   se corrige en esa línea y ya: el estilo cuelga del atributo `type`, no del
   nombre del token.
5. Publicar y anotar el `PageName` resultante. Si cambia respecto al actual,
   hay que actualizar `POWERTRANZ_PAGE_NAME` en Vercel — recordando que el
   `PageSet` lleva el prefijo `Ptz/`.

## La transacción de prueba

Con la página publicada, una compra basta. Va por el flujo real de la tienda,
no por una llamada suelta: es lo que FAC quiere ver.

1. Entrar a la tienda en pruebas y comprar el Pasaporte.
2. Pagar con una de las tarjetas de [`tarjetas-de-prueba.md`](tarjetas-de-prueba.md).
   Vencimiento `1228`.
3. En la página de BAC **debe aparecer el campo de correo**, y debe rechazar
   el envío si se deja vacío o con un valor inválido. Si no lo pide, la página
   publicada no es la nueva y no tiene sentido seguir.
4. Anotar el número de pedido (`CG-…`) y el `TransactionIdentifier`.

El pedido guarda la respuesta cruda de la pasarela en
`payment.respuestaCruda`, que es lo primero que pide FAC cuando hay que
sustentar algo.

## Cómo se resolvió, y la prueba

**El problema no estaba en la página alojada.** La especificación de PowerTranz
define el request de `sale` con un objeto `BillingAddress` obligatorio que
lleva `EmailAddress` y `PhoneNumber`, y nosotros nunca lo enviábamos. El
correo no viajaba porque el request no lo llevaba.

Descartada la página alojada por dos vías: la plantilla asignada a nuestro
PageSet solo ofrece nueve tokens —`@FormStart@`, `@Invalid@`,
`@CardHolderName@`, `@CardNo@`, `@CardExpDate@`, `@CardCVV2@`, `@Amount@`,
`@Submit@`, `@FormEnd@`— ninguno de correo, y el editor del Portal elimina
cualquier `<input>` escrito a mano.

Las tres transacciones del 11 de septiembre de 2026, por el flujo completo de
la tienda en producción, con la pasarela devolviendo el correo:

| Marca | Pedido | Transaction Id | 3DS | ECI | Protocolo |
|---|---|---|---|---|---|
| Visa | `CG-260911-0005` | `085ecbae-24e3-4e85-ab72-511d84863199` | Y | 05 | 2.1.0 |
| MasterCard | `CG-260911-0006` | `966ff868-fe60-4486-88a3-21b07e7ef609` | Y | 02 | 2.1.0 |
| Amex | `CG-260911-0007` | `c63ec786-59ef-4bef-a264-e652fce7d39e` | Y | 05 | 2.1.0 |

Las tres con `3D0 · 3D-Secure complete` y el `BillingAddress` de vuelta en la
respuesta:

```json
{"FirstName":"Tester","LastName":"Visa","CountryCode":"591",
 "EmailAddress":"info@ewebpanama.com","PhoneNumber":"50767326715"}
```

Esa devolución es la evidencia de que el dato llegó.

## La plantilla Basic, que sí trae el campo

El Portal ofrece dos plantillas y la diferencia estaba ahí: **Advanced** es el
editor de HTML con nueve tokens y ningún campo de correo; **Basic** es el
formulario propio de PowerTranz, que trae `BillToEmail` incorporado y una
casilla **«Make email mandatory»** en Field Requirements.

Sin marcar esa casilla la página declara `data-email-required="false"` y el
campo existe pero no obliga. Marcada, queda en `true`.

Basic conserva personalización: selectores de color para fondo, título,
subtítulo, etiquetas y botón, más un cuadro de Custom Styles. Usa Tailwind por
CDN, así que el CSS propio necesita `!important` en lo que compita. Los
ganchos son `.titleColor`, `.subtitleColor`, `.labelColor`, `.backgroundColor`
y `#BtnSubmit`. El logo entra por `h3.titleColor::before`, porque la plantilla
no tiene dónde colocarlo.

Las tres transacciones con la página nueva, el 11 de septiembre de 2026:

| Marca | Pedido | Transaction Id | 3DS | ECI |
|---|---|---|---|---|
| Visa | `CG-260911-0011` | `6b008cdc-4dad-434b-b9f6-d9014ab81884` | Y | 05 |
| MasterCard | `CG-260911-0012` | `642b548e-c2f2-4fc9-af31-1d6058f322aa` | Y | 02 |
| Amex | `CG-260911-0013` | `6c415e21-8469-4cdf-9e49-6fce6e8c5198` | Y | 05 |

Con el correo capturado en la página alojada llegando de vuelta en la
respuesta, por encima del que enviamos nosotros:

```json
"BillingAddress": {"EmailAddress": "info@ewebpanama.com"}
```

## Qué responderle a José

Borrador, a completar con los datos de la prueba:

> Estimado José,
>
> Gracias por la revisión y por la evidencia.
>
> Ya publicamos la página alojada con la plantilla que incluye el correo
> electrónico, con el campo y su validación marcados como obligatorios, y
> realizamos una transacción de prueba por el flujo completo de la tienda.
>
> - Order Id: `CG-…`
> - Transaction Id: `…`
> - Fecha y hora: `…`
> - Tarjeta: `…` · Monto: USD 20.00
> - Resultado: aprobada, ISO `00`, 3DS `Y`, protocolo 2.1.0
> - Correo capturado en la página alojada: `…`
>
> Quedamos atentos a su validación y a las credenciales de producción.

## Lo que sigue pendiente de FAC, aparte de esto

- **Antifraude sin aprovisionar.** Con `fraudCheck: true` responde
  `FC3 · 1011 Invalid Provider` y la transacción no llega a abrirse. Por eso
  `POWERTRANZ_FRAUD_CHECK` está apagado.
- **Credenciales y PageSet de producción.** Ver
  [`para-salir-a-produccion.md`](para-salir-a-produccion.md): `POWERTRANZ_BASE_URL`
  apunta hoy a staging y no debe pasar al ambiente real, y
  `POWERTRANZ_MODO_PRUEBA` nunca debe existir allí.

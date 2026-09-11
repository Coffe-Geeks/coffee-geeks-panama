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

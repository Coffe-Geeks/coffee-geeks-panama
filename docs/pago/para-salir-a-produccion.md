# Qué falta para cobrar en producción

Estado al 8 de septiembre de 2026. La integración está completa y probada
contra staging: el cobro se ejecutó con `Approved: true`, `Iso 00`,
autorización `123456`, RRN `625021379114`.

---

## Bloqueos que dependen de FAC

**1. 3DS no se está ejecutando.** Todas las transacciones devuelven
`3D1 · 3DS not supported`, en navegador real y con las dos marcas
habilitadas, incluso con las tarjetas que su anexo marca como *Challenge*.
Sin 3DS el comercio no conserva la protección ante contracargos: cada
disputa la responde Coffee Geeks. **Este es el bloqueo serio**, no un
trámite.

**2. Antifraude sin aprovisionar.** Con `fraudCheck: true` responde
`FC3 · 1011 Invalid Provider` y ninguna transacción llega a abrirse.

**3. Faltan las tarjetas de prueba de American Express.** La cuenta está
habilitada para Amex y FAC exige probar aprobadas y denegadas **de cada
marca** antes de habilitar producción. Sin esas tarjetas la batería no se
puede cerrar.

**4. El visto bueno de FAC.** Su proceso es: se completan las pruebas en
staging → FAC las valida → habilita el ambiente de producción → avisa a BAC
Credomatic para la aprobación final.

**5. Credenciales y página alojada de producción.** Son distintas de las de
staging. El `PageSet` hay que volver a crearlo en el portal de producción,
con los mismos nombres para que solo cambie la URL base.

---

## Lo que nos toca a nosotros

**6. Apuntar la pasarela al ambiente real.** Hoy `POWERTRANZ_BASE_URL`
apunta a `https://staging.ptranz.com/api/spi`. Hay que cambiarlo por el de
producción **solo cuando FAC lo habilite**.

**7. Verificar que producción no tenga configuración de pruebas.**
`POWERTRANZ_MODO_PRUEBA` no debe existir ahí — permite simular un cobro
aprobado sin pasarela.

**8. Mover el logo del formulario alojado.** Hoy apunta a
`pruebas-coffee-geeks.vercel.app`. En producción debe ser
`coffeegeekspanama.com/logo-vino.png`, o mejor, subirlo por *Upload
Resource* del portal para no depender de ningún dominio nuestro.

**9. Dos decisiones de negocio**, hoy apagadas porque trasladan el riesgo al
comercio:

- `POWERTRANZ_ACEPTAR_3DS_U` — cobrar cuando 3DS responde `U` (falla
  técnica). FAC lo permite, pero advierte que se pierde la protección y que
  debe revisarse con el adquirente.
- `POWERTRANZ_ACEPTAR_SIN_3DS` — cobrar cuando la tarjeta no admite 3DS.

**Mientras 3DS no funcione, con las dos apagadas la tienda no puede cobrar
nada.** Encenderlas sería salir a producción sin protección ante
contracargos. Por eso el punto 1 es el que de verdad manda.

---

## Riesgo abierto hoy

La tienda ya está publicada en `coffeegeekspanama.com` con el módulo de
pago. Conviene confirmar en `/admin/pedidos` de producción que el recuadro
del ambiente **no** diga *"pruebas (staging)"*: si lo dice, un cliente real
que compre sería enviado a la pasarela de pruebas de BAC.

---

## Calendario de FAC

No hacen pasos a producción los viernes, fines de semana ni festivos de
Bermuda, y las pruebas en producción son solo de lunes a viernes de 8:30 a
17:30 hora del Atlántico. Conviene no agendar la salida cerca de un viernes.

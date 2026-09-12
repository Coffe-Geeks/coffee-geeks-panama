# Salida a producción — FAC entregó las credenciales

Estado al 11 de septiembre de 2026. FAC validó las pruebas de staging y envió
las credenciales del ambiente real. Lo que sigue son pruebas **en producción,
con tarjetas reales**, antes del visto bueno final de BAC.

---

## Lo que cambia en el entorno

| Variable | Valor |
|---|---|
| `POWERTRANZ_BASE_URL` | `https://gateway.ptranz.com/api/spi` |
| `POWERTRANZ_ID` | **otro número**, no el de staging |
| `POWERTRANZ_PASSWORD` | **otra cadena**, no la de staging |
| `POWERTRANZ_PAGE_SET` | `CoffeeGeeks` — **recreado en el portal de producción** |
| `POWERTRANZ_PAGE_NAME` | `Checkout` |
| `POWERTRANZ_MODO_PRUEBA` | **no debe existir** |

Las credenciales se cargan en Vercel marcadas como sensibles. **Nunca al
repositorio**, ni siquiera en `.env.example`.

**Las credenciales de producción no son las de staging.** El `Ptz Id` de
staging es el que aparece en sus Reportes de Transacciones; el de producción
es otro número y otra contraseña, en el correo del 11 de septiembre de 2026.
Las tres variables se cambian juntas: con la URL de producción y las
credenciales de staging la pasarela responde 401 y ninguna transacción se
abre; al revés, los pagos siguen yendo a staging con credenciales que allí no
existen.

---

## La trampa que va a aparecer

**El portal de producción es otro portal.** La página alojada que se publicó
—plantilla Basic, con «Make email mandatory» marcado— vive en el portal de
staging y **no existe** del otro lado. Si solo se cambian las credenciales y
la URL, la pasarela responderá `757 · Hosted page not found`, igual que el 7
de septiembre.

Hay que volver a crearla en el portal de producción:

1. Page Set `CoffeeGeeks`, página `Checkout` — los mismos nombres, para que
   las variables no cambien.
2. Plantilla **Basic**, no Advanced: es la única que trae el campo de correo.
3. Marcar **«Make email mandatory»**. Sin eso la página declara
   `data-email-required="false"` y vuelve el reclamo de las marcas.
4. Copiar los colores y el bloque de Custom Styles desde el portal de
   staging.

---

## Las pruebas que exige FAC

- **Tarjetas reales.** FAC no entrega tarjetas de prueba para producción, y
  las de staging no sirven.
- **Montos pequeños**, US$1.00, al menos una transacción por marca: Visa,
  MasterCard y American Express.
- **En horario hábil de FAC**, lunes a viernes de 8:30 a 17:30 hora del
  Atlántico, para tener a su personal disponible si algo falla.
- **Verificar en el Reporte de Transacciones** del Portal del Comercio que
  las transacciones quedaron **capturadas**: la captura es lo que hace que
  BAC acredite la cuenta. La liquidación toma de dos a tres días hábiles.

Nuestro módulo usa el endpoint `sale`, que cobra y captura en un solo paso,
así que el requisito de captura se cumple por diseño.

**El producto cuesta US$20.** Para probar con US$1.00 hay que crear un
producto de prueba con ese precio, o bajar el del pasaporte mientras dure la
prueba y devolverlo después. Son cobros reales: alguien va a pagarlos.

---

## Acceso al Portal del Comercio

Hay que enviar a FAC **dos cuentas de correo** que tendrán acceso; ellos
responden con un enlace para crear la contraseña. La dirección que indican es
`bacsopore@fac.bm` —parece faltarle una `t`, conviene confirmarla antes de
escribir, o usar `BACSoporte@fac.bm`.

Hay además un video de capacitación del portal:
`https://www.screencast.com/t/mC4dlK3O`, contraseña `FACTraining23`.

---

## Decisiones de negocio, que siguen apagadas

FAC permite completar el pago con `AuthenticationStatus` en `Y`, `A` o `U`, y
lo prohíbe con `N` o `R`. El campo `AuthenticationStatus` **tiene prioridad
sobre el ECI**, que es como está implementado.

- `POWERTRANZ_ACEPTAR_3DS_U` — cobrar cuando 3DS responde `U`. FAC lo
  permite, pero advierte por escrito que la transacción **no queda protegida**
  ante contracargos y que debe revisarse con el banco. Apagada.
- `POWERTRANZ_ACEPTAR_SIN_3DS` — cobrar cuando la tarjeta no admite 3DS.
  Apagada, por lo mismo.

---

## Riesgo que conviene mirar

`lib/pagos/powertranz.ts` toma `https://staging.ptranz.com/api/spi` por
omisión si falta `POWERTRANZ_BASE_URL`. Después del paso a producción esa
omisión se vuelve peligrosa: un despliegue sin la variable mandaría clientes
reales a la pasarela de pruebas sin avisar. El recuadro de `/admin/pedidos`
lo delata —debe decir **«Ambiente: PRODUCCIÓN»**, no «pruebas (staging)»—,
pero conviene revisarlo después de cada despliegue.

---

## Calendario

FAC no traslada comercios a producción los viernes, sábados, domingos ni
festivos de Bermuda. Las pruebas sí se pueden hacer un viernes en horario
hábil; el paso final hay que agendarlo de lunes a jueves.

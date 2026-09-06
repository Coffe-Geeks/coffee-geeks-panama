# Tarjetas de prueba — staging de FAC

Fuente: anexo *"3D Secure (Test Cards) - Cobalt.pdf"* enviado por FAC.
Son números de prueba emitidos por el procesador: no corresponden a ninguna
tarjeta real y solo funcionan contra `staging.ptranz.com`.

**Fecha de vencimiento y CVV: cualquiera.**

| Marca | Tarjeta | 3DS | Resultado esperado |
|---|---|---|---|
| MasterCard | `5158060000000003` | Challenge | Aprobada |
| MasterCard | `5527100000000001` | Frictionless | Aprobada |
| MasterCard | `5597600000000005` | Challenge | Declinada – 51 |
| MasterCard | `5158060100000002` | Frictionless | Aleatorio |
| MasterCard | `5527101234567898` | Challenge | Rechazada |
| MasterCard | `5597601234567892` | Frictionless | Sin respuesta |
| Visa | `4196581200000003` | Frictionless | Aprobada |
| Visa | `4196591200000002` | Challenge | Aprobada |
| Visa | `4196601200000009` | Frictionless | Declinada – 51 |
| Visa | `4525000000000008` | Challenge | Aleatorio |
| Visa | `4137261200000004` | Challenge | Sin respuesta |
| Visa | `4196601212345673` | Frictionless | Rechazada |

## Notas del anexo

- **El OTP de todos los escenarios con desafío es `123456`.** Cualquier otro
  valor produce un rechazo por OTP inválido.
- Las tarjetas de estado *aleatorio* se aprueban el 95% de las veces, así que
  no sirven para verificar el camino de rechazo.

## La tarjeta del manual

El manual de integración usa otra distinta, con datos fijos:
`4012000000020006`, CVV `323`, vence `2310`, y la clave del desafío 3DS2 es
`3ds2` (no `123456`). Es la que aparece en el simulador DS/ACS.

## Falta American Express

La cuenta está habilitada para **Amex, MasterCard y Visa**, y FAC exige que
las pruebas incluyan transacciones aprobadas y denegadas **de cada marca**.
El anexo solo trae Visa y MasterCard. Hay que pedirles las tarjetas de prueba
de Amex con SafeKey; sin ellas no se puede cerrar la batería que ellos mismos
piden para habilitar producción.

## Qué hay que probar

Según el correo de incorporación de FAC, la batería debe cubrir transacciones
**aprobadas y denegadas de cada marca y en cada moneda** que maneje el
comercio. La única moneda habilitada es USD (`840`), así que son dos marcas
—tres cuando lleguen las de Amex— por los dos resultados, más los caminos de
desafío y sin fricción.

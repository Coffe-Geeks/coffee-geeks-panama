# Tarjetas de prueba — staging de FAC

Enviadas por José González (PowerTranz) el 8 de septiembre de 2026.

**Estas son las que corresponden a nuestra cuenta.** El anexo anterior
(*"3D Secure (Test Cards) - Cobalt.pdf"*) trae otros números que en esta
cuenta devuelven `3D1 · 3DS not supported`; no sirven y conviene ignorarlo.

**Vencimiento:** `1228` (diciembre de 2028) · **CVV:** `123`, y `1234` en
American Express · **Nombre:** cualquiera.

## Aprobadas

| Caso | Tarjeta | Marca | Desafío | Clave | Estatus |
|---|---|---|---|---|---|
| V2-01-YA | `4012000000020071` | Visa | no | | Y |
| V2-02-AA | `4012000000020089` | Visa | no | | A |
| V2-03-YA | `4012000000020006` | Visa | sí | `3ds2` | Y |
| V2-04-YA | `4012010000020070` | Visa | no, con huella | | Y |
| V2-05-AA | `4012010000020088` | Visa | no, con huella | | A |
| V2-06-YA | `4012010000020005` | Visa | sí, con huella | `3ds2` | Y |
| M2-01-YA | `5100270000000023` | MasterCard | no | | Y |
| M2-03-YA | `5100270000000031` | MasterCard | sí | `3ds2` | Y |
| M2-04-YA | `5100271000000120` | MasterCard | no, con huella | | Y |
| A2-01-YA | `341111000000009` | Amex | no | | Y |
| A2-02-AA | `341111000000011` | Amex | no | | A |
| A2-03-YA | `341112000000001` | Amex | sí, con huella | `3ds2` | Y |
| A2-04-YA | `341111000000037` | Amex | sí | `3ds2` | Y |
| A2-05-YA | `341112000008012` | Amex | no, con huella | | Y |

## Sin 3DS

| Caso | Tarjeta | Marca |
|---|---|---|
| VI-01-0A | `4333333333332222` | Visa |
| MC-01-0A | `5333333333332222` | MasterCard |
| AX-01-0A | `343333333333335` | Amex |
| DS-01-0A | `6011111111111111` | Discover |
| JC-01-0A | `3528111111111108` | JCB |

## Denegadas

| Caso | Tarjeta | Estatus | Resultado |
|---|---|---|---|
| V2-01-ND | `4012000000020121` | N | no permite completar el pago (ISO 12) |
| M2-01-ND | `5100270000000098` | N | no permite completar el pago (ISO 12) |
| M2-02-ND | `5100270000000056` | N | con desafío, no permite completar (ISO 12) |
| M2-02-RA | `5100270000000072` | R | sin desafío |
| A2-01-ND | `341111000000029` | N | no permite completar el pago (ISO 12) |
| V2-02-AD | `4666666666662222` | A | ISO 05, respuesta de CVV = N |
| M2-03-UD | `5555666666662222` | U | ISO 05 |
| V2-03-AD | `4111111111119999` | A | ISO 98 |
| M2-04-AD | `5111111111113333` | A | ISO 05 |
| V2-04-YD | `4111111111110000` | Y | con desafío, ISO 91 |
| M2-05-YD | `5111111111110000` | Y | con desafío, ISO 91 |
| DS-01-0D | `6011111111111152` | | Discover |
| JC-01-0D | `3528111111111157` | | JCB |

## Resultados obtenidos

Las tres transacciones que FAC exige, una por marca, el 8 de septiembre de
2026 contra `staging.ptranz.com`:

| Marca | Tarjeta | 3DS | ISO | Autorización | RRN |
|---|---|---|---|---|---|
| Visa | `4012000000020071` | Y · ECI 05 | `00` | `123456` | `625123380623` |
| MasterCard | `5100270000000023` | Y · ECI 02 | `00` | `123456` | `625123380624` |
| Amex | `341111000000009` | Y · ECI 05 | `00` | `123456` | `625123380625` |

Las tres con `3D0 · 3D-Secure complete`, protocolo 2.1.0, y `CardholderInfo`
presente en la respuesta —que la confirmación del pedido muestra al cliente,
tal como pide el criterio de validación de FAC.

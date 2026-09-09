# Correo a José González — resultados de las pruebas

**Para:** BACSoporte@powertranz.bm
**Asunto:** PowerTranz ID 77702076 — Resultados de las tres transacciones de prueba

---

Estimado José, buen día:

Gracias por las tarjetas. Con esas sí funciona: **3D-Secure se ejecuta
correctamente**. Las que teníamos del anexo anterior devolvían
`3D1 · 3DS not supported` en esta cuenta, ahí estaba el problema.

Completamos las tres transacciones, una por marca:

| Marca | Tarjeta | 3DS | ISO | Autorización | RRN |
|---|---|---|---|---|---|
| Visa | `4012000000020071` | `Y` · ECI 05 | `00` | `123456` | `625123380623` |
| MasterCard | `5100270000000023` | `Y` · ECI 02 | `00` | `123456` | `625123380624` |
| Amex | `341111000000009` | `Y` · ECI 05 | `00` | `123456` | `625123380625` |

Las tres con `Approved: true`, `3D0 · 3D-Secure complete` y protocolo 2.1.0.

Las repetimos además **por el flujo operativo completo de la tienda**
—carrito, checkout, página alojada, cobro y confirmación—, que es como las
verá un cliente:

| Marca | Pedido | TransactionIdentifier | 3DS |
|---|---|---|---|
| Visa | `CG-260909-0003` | `cd7b0015-bad4-4919-816c-6b5b575f6fce` | `Y` · ECI 05 |
| MasterCard | `CG-260909-0004` | `6dec675c-f6cc-4aa0-bd3b-5449af47f153` | `Y` · ECI 02 |
| Amex | `CG-260909-0005` | `436a571a-1e98-4686-9bd5-87d42be2a843` | `Y` · ECI 05 |

Identificadores de las primeras tres, hechas contra la API directamente:

- Visa `d161e5a3-7652-4239-bd0a-98fe19b45997`
- MasterCard `ab562a10-2056-4388-a8e0-c58fb4af2131`
- Amex `a3aee60f-7118-42ed-9b03-a7b2ef769c58`

**Sobre sus criterios de validación:**

- Transacción aprobada: sí, `Approved: true` con ISO `00`.
- Transacción capturada: sí, usamos el endpoint `/sale`, que autoriza y
  marca para captura en un solo paso.
- Cumple con 3DS: sí, estatus `Y` en las tres marcas.
- `CardholderInfo`: viene presente y **se le muestra al cliente** en la
  pantalla de confirmación del pedido.
- Teléfono y correo en el request, State/PostalCode y acentos: no aplica,
  usamos Página Alojada.
- Impuesto: no aplica, operamos en Panamá.

**Queda un punto pendiente de su lado:** con `"fraudCheck": true` la
pasarela responde `FC3 · 1011 Invalid Provider` y la transacción no llega a
abrirse, así que hoy operamos con `fraudCheck: false`. ¿Nos confirman si se
habilita el proveedor antifraude o si debemos continuar sin él?

Quedamos atentos a su visto bueno para avanzar con el ambiente de
producción.

Saludos cordiales,
**Coffee Geeks Panamá**

# Correo a José González — detalle de cumplimiento

**Para:** BACSoporte@powertranz.bm
**Asunto:** PowerTranz ID 77702076 — Tres transacciones de prueba y detalle de cumplimiento

---

Estimado José, buen día:

Gracias por las tarjetas de prueba. Con esas la autenticación 3D-Secure
funciona correctamente; las que teníamos del anexo anterior devolvían
`3D1 · 3DS not supported` en nuestra cuenta.

Completamos las tres transacciones, una por marca, **a través del flujo
operativo completo de la tienda** —carrito, checkout, página alojada, cobro
y confirmación—, tal como lo recorrerá un cliente:

| Marca | Pedido | TransactionIdentifier | 3DS | ECI | ISO |
|---|---|---|---|---|---|
| Visa | `CG-260909-0003` | `cd7b0015-bad4-4919-816c-6b5b575f6fce` | `Y` | 05 | `00` |
| MasterCard | `CG-260909-0004` | `6dec675c-f6cc-4aa0-bd3b-5449af47f153` | `Y` | 02 | `00` |
| American Express | `CG-260909-0005` | `436a571a-1e98-4686-9bd5-87d42be2a843` | `Y` | 05 | `00` |

Las tres con `3D0 · 3D-Secure complete`, protocolo 2.1.0.

Tarjetas usadas: Visa `4012000000020071`, MasterCard `5100270000000023`,
American Express `341111000000009`, vencimiento `1228`.

---

## Detalle de cumplimiento

**1. Que la transacción esté aprobada.**
Cumplido. Las tres responden `Approved: true` con
`IsoResponseCode: 00 — Transaction is approved`, código de autorización
`123456` y RRN `625123380623`, `625123380624` y `625123380625`.

**2. Que la transacción esté capturada.**
Cumplido. Usamos el endpoint `/sale`, que efectúa la autorización y marca la
transacción para captura en un solo paso, sin llamada adicional a `/capture`.

**3. Que la transacción cumpla con 3DS.**
Cumplido. `AuthenticationStatus: Y` en las tres marcas, con `ProtocolVersion
2.1.0` y ECI 05 en Visa y American Express, 02 en MasterCard.

**4. Que `cardholderinfo` se le muestre al usuario final.**
Cumplido. Cuando el campo viene presente, la pantalla de confirmación del
pedido lo muestra al cliente, encabezado como *"Tu banco indica:"*. En estas
tres transacciones se mostró:

> Additional authentication is needed for this transaction, please
> contact(Issuer Name) at xxx - xxx - xxxx.

**5. Teléfono y correo electrónico en el request de pagos.**
No aplica: usamos Página Alojada. Aun así, ambos datos se solicitan en el
checkout y quedan registrados en el pedido, disponibles para conciliación.

**6. No enviar State ni PostalCode; sin acentos ni caracteres especiales en
campos de texto.**
No aplica por Página Alojada, y lo cumplimos igualmente. Nuestro request
contiene únicamente `TransactionIdentifier`, `TotalAmount`, `CurrencyCode`,
`ThreeDSecure`, `fraudCheck`, `OrderIdentifier`, `AddressMatch` y
`ExtendedData`. No enviamos `State`, `PostalCode` ni dirección de
facturación. El único campo de texto libre es `OrderIdentifier`, con formato
`CG-AAMMDD-NNNN`, solo caracteres ASCII.

---

## Punto pendiente de su lado

Con `"fraudCheck": true` la pasarela responde
`IsoResponseCode: FC3 — FraudCheck error` con `Code 1011 — Invalid
Provider`, y la transacción no llega a abrirse. Hoy operamos con
`fraudCheck: false`. ¿Nos confirman si se habilita el proveedor antifraude
para esta cuenta o si debemos continuar sin él?

Quedamos atentos a su visto bueno para avanzar con el ambiente de
producción.

Saludos cordiales,
**Coffee Geeks Panamá**

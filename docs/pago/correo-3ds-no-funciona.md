# Correo a FAC — 3DS no se está ejecutando

**Para:** BACSoporte@powertranz.bm
**Asunto:** Coffee Geeks Panamá (PowerTranz ID 77702076) — 3DS2 no se ejecuta: todas las transacciones devuelven 3D1

---

Estimados,

Gracias por la indicación del prefijo `Ptz/` en el PageSet: con eso la
página alojada quedó funcionando y el formulario de tarjeta ya se muestra
correctamente.

Nos encontramos ahora con que **la autenticación 3D-Secure no se está
ejecutando**. Todas las transacciones devuelven:

> `IsoResponseCode: 3D1 — "3DS not supported"`

sin ningún `AuthenticationStatus` en `RiskManagement.ThreeDSecure`.

## Qué probamos

- Enviamos `"ThreeDSecure": true` en el `/sale`, que responde
  `SP4 · SPI Preprocessing complete` correctamente.
- Renderizamos el `RedirectData` en un iframe, según la documentación.
- Completamos el formulario **desde un navegador real**, con la página
  alojada `Ptz/CoffeeGeeks` / `Checkout`.
- **En ningún caso aparece la pantalla de desafío del ACS.** El flujo pasa
  directo al resultado.

## Con qué tarjetas

Usamos las del anexo que ustedes nos enviaron. Las que ese mismo anexo
marca como **Challenge** devuelven `3D1` igual:

| Marca | Tarjeta | Anexo dice | Obtenemos |
|---|---|---|---|
| Visa | `4196591200000002` | Challenge · Aprobada | `3D1 · 3DS not supported` |
| MasterCard | `5158060000000003` | Challenge · Aprobada | `3D1 · 3DS not supported` |

Probamos también las variantes *frictionless* y las de resultado declinado:
todas responden lo mismo.

## Descartamos que sea un parámetro nuestro

Enviamos la solicitud con los cuatro valores posibles de
`ExtendedData.ThreeDSecure.ChallengeIndicator` —`01` sin preferencia, `02`
sin desafío, `03` desafío solicitado y `04` desafío por mandato—. **Los
cuatro devuelven el mismo `3D1`**, incluido el `04`, que según el estándar
obliga al emisor a presentar el desafío.

## Por qué nos preocupa

Su correo de incorporación indica que la cuenta **está configurada para 3DS
versión 2 con Visa y MasterCard, y SafeKey con American Express**. Con `3D1`
en todas, el comercio quedaría operando sin traslado de responsabilidad y
asumiendo los contracargos, cosa que queremos evitar antes de salir a
producción.

## Transacciones para rastrear

| TransactionIdentifier | Marca | Resultado |
|---|---|---|
| `870d9fc3-c696-4109-9c1b-44d46520434c` | MasterCard | `3D1` |
| `c361b2c1-209e-4ef8-b254-fbbbb52d7fcf` | Visa | `3D1` |

Todas contra `https://staging.ptranz.com/api/spi` con el ID `77702076`.

## Nuestra consulta

¿Hay algo pendiente de habilitar en la cuenta para que 3DS2 se ejecute, o
algo que debamos ajustar en la solicitud? Adjuntamos el request y el
response completos.

Quedamos atentos también a los dos puntos anteriores: la habilitación del
proveedor antifraude —hoy `fraudCheck: true` devuelve
`FC3 · 1011 Invalid Provider` y la transacción no llega a abrirse— y las
tarjetas de prueba de American Express, que no venían en el anexo.

Saludos cordiales,
**Coffee Geeks Panamá**

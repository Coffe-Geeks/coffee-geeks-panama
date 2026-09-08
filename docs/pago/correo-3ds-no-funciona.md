# Correo a José González (PowerTranz)

**Para:** BACSoporte@powertranz.bm
**Asunto:** PowerTranz ID 77702076 — 3DS2 devuelve 3D1 en todas las transacciones
**Adjuntar:** `traza-3ds.txt`

---

Estimado José, buen día:

Gracias por la indicación del prefijo `Ptz/` en el PageSet. Con eso la
página alojada quedó funcionando y el formulario de tarjeta ya se muestra.

Ahora nos encontramos con que **3D-Secure no se está ejecutando**. Todas las
transacciones devuelven `IsoResponseCode: 3D1 — "3DS not supported"`, sin
`AuthenticationStatus`, y el desafío del ACS nunca aparece.

Ocurre con las dos marcas, usando las tarjetas que el anexo marca como
*Challenge*:

- Visa `4196591200000002`
- MasterCard `5158060000000003`

Descartamos que sea un parámetro nuestro: probamos los cuatro valores de
`ChallengeIndicator` (`01`, `02`, `03` y `04`), y los cuatro devuelven `3D1`,
incluido el `04` que obliga el desafío.

Adjunto el request y el response completos. Transacciones para rastrear:

- `74192d6f-ca03-429f-b0d2-6b8fad3c220f` — Visa
- `870d9fc3-c696-4109-9c1b-44d46520434c` — MasterCard

**Consulta:** ¿queda algo pendiente de habilitar en la cuenta para que 3DS2
opere? Su correo de incorporación indica que está configurada para 3DS2 con
Visa y MasterCard.

Aprovecho para recordarle dos puntos anteriores: la habilitación del
proveedor antifraude —con `fraudCheck: true` responde `FC3 · 1011 Invalid
Provider` y la transacción no llega a abrirse— y las tarjetas de prueba de
American Express, que no venían en el anexo.

Quedamos atentos.

Saludos cordiales,
**Coffee Geeks Panamá**

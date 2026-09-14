# Formulario de participantes — qué contesta qué

El formulario existe porque a varias cafeterías se les complica llenar la
ficha en el sitio. Se crea con [`crear-formulario.gs`](crear-formulario.gs):
se pega en `script.google.com`, se ejecuta `crearFormulario` y queda armado
con sus secciones y validaciones.

**Las respuestas se cargan solas.** Un disparador de Apps Script entrega cada
envío a `POST /api/formulario/participante`, que llena la ficha. La tabla de
abajo es el mapa que usa esa ruta, y sirve además para revisar a mano lo que
llegó.

### Qué hace la carga automática

- **Si el correo ya tiene cuenta**, actualiza su ficha. No toca el rol ni el
  estado: un formulario público no puede reactivar ni degradar una cuenta.
- **Si no existe**, crea la cuenta con rol `user` e `isActive: false` — no
  aparece en la página pública ni es votable. La contraseña es una cadena al
  azar que nadie conoce; la persona entra por «recuperar contraseña», que
  verifica el correo. Así un envío no crea un acceso.
- **Avisa por correo a `ADMIN_EMAIL`** con el enlace de las fotos, que no se
  guarda en la ficha.

El rol de participante lo sigue otorgando un administrador tras la firma del
contrato. El formulario acerca los datos; publicar sigue siendo decisión de
una persona.

### Lo que hay que configurar

| Dónde | Qué |
|---|---|
| Vercel, entorno Production | `FORMULARIO_TOKEN` |
| Apps Script, constante `TOKEN` | el mismo valor |

Sin la variable, la ruta responde `503` y se niega a funcionar en vez de
quedar abierta. Sin el token en el script, el formulario sigue recogiendo
respuestas en la hoja pero no las manda.

## El establecimiento

| Pregunta | Campo |
|---|---|
| Nombre del establecimiento | `cafeteriaName` |
| Correo de contacto | `email` — el de su cuenta en el sitio |
| Tipo de negocio | `businessType` — Cafetería `coffee`, Hotel `hotel`, Restaurante `rest` |
| Frase corta que los describa | `tagline` |
| Años de existencia | `yearsOfExistence` |
| Cantidad de sucursales | `branchesCount` |

## Identidad legal

| Pregunta | Campo |
|---|---|
| Razón social | `legalName` |
| RUC | `ruc` |
| Aviso de operación | `operationNotice` |
| Representante legal | `legalRepresentative` |
| Cargo del representante legal | `legalRepresentativePosition` |

## Dónde y cómo encontrarlos

| Pregunta | Campo |
|---|---|
| Provincia | `province` |
| Barrio o dirección | `neighborhood` |
| Horario de atención | `hours` |
| Teléfono de contacto | `phone` |
| Sitio web o Instagram | `web` |
| ¿Quieren recibir avisos? | `acceptsNotifications` |

El mapa (`locationLat` / `locationLng`) no se pregunta: se marca desde el
panel, que tiene el selector sobre el mapa.

## Su café

| Pregunta | Campo |
|---|---|
| ¿En qué categorías compiten? | `competitionCategory` — arreglo |
| La historia de la casa | `originStory` |
| Su espresso | `espresso` |
| Su filtrado | `filtrado` |
| Nombre de su bebida de autor | `signatureDrinkName` |
| Su bebida de autor | `signatureDrink` |
| ¿Venden café panameño? | `sellsPanamanianCoffee` |
| Nombre de la finca | `farmName` |
| Variedades de café | `coffeeVarieties` — separadas por coma |
| Marca de la máquina | `machineBrand` |
| Marca del molino | `grinderBrand` |
| ¿Tuestan su propio café? | `roastsOwnCoffee` |
| ¿Desarrollan sus perfiles? | `makesOwnProfile` |
| ¿Qué experiencias ofrecen? | `coffeeExperiences` |

**Ojo con las categorías.** Lo que se marque aquí decide en qué compite el
establecimiento, y los textos de espresso, filtrado y bebida de autor son lo
que leen los jueces. Una ficha sin esos textos aparece vacía en su página
pública.

## El equipo

| Pregunta | Campo |
|---|---|
| Cantidad total de baristas | `totalBaristas` |
| Cuántas son mujeres | `femaleBaristasCount` |
| Cuántos son hombres | `maleBaristasCount` |
| ¿Personal con discapacidad? | `hasDisabledStaff` |
| Nombre del barista principal | `mainBaristaName` |
| Su especialidad | `mainBaristaSpecialty` |
| Sus años de experiencia | `mainBaristaYearsExp` |
| Su formación | `mainBaristaTraining` |
| ¿Tiene certificación? | `mainBaristaCertified` |
| ¿Certificación SCA? | `mainBaristaSCA` |

El barista principal de estos campos **no es lo mismo** que el arreglo
`baristas`, que es el que alimenta las tarjetas con foto de la página
pública. Ese se edita desde `/perfil` con la sesión de la cafetería, o hace
falta un script.

## Formación y crecimiento

| Pregunta | Campo |
|---|---|
| Nivel de formación | `trainingLevel` — `básico`, `intermedio`, `avanzado` en minúscula |
| ¿Formación certificada? | `hasCertifiedTraining` |
| ¿Programa SCA? | `trainingSCA` |
| ¿Quién los formó? | `trainingInstructor` |
| ¿Les interesa certificarse? | `interestInCertification` |
| ¿En qué? | `certificationInterests` |
| ¿Exportar o internacionalizarse? | `wantsToInternationalize` |
| ¿A qué mercados? | `targetMarkets` |
| ¿Comité Nacional País? | `wantsToJoinCommittee` |

## Fotos

No se suben por el formulario: pesan, y subir archivos obliga al respondiente
a tener sesión de Google. Se pide un enlace a Drive, Dropbox o WeTransfer, o
que las manden por WhatsApp.

Van a `coverImage` (la portada, apaisada), `gallery`, `espressoPhoto`,
`filtradoPhoto`, `signatureDrinkPhoto` y la foto de cada barista. Se cargan
desde el panel.

**Sin `coverImage` la ficha sale con una foto de archivo de Unsplash**, que es
lo que hoy afea el listado público.

## Dos trampas del workspace

**No usar «Recopilar direcciones de correo» de Google.** En un dominio de
Workspace eso obliga a iniciar sesión, y el formulario existe justo para
quitarle fricción a quien no quiere pelear con la web. Por eso el correo va
como pregunta normal.

**Revisar que no quede restringido al dominio.** Google Workspace marca por
omisión «Restringir a usuarios de Coffee Geeks»: con eso encendido ninguna
cafetería externa puede abrir el formulario, y lo que ven es un mensaje de
permisos.

## Lo que el formulario no pregunta a propósito

`role`, `isActive` y la contraseña. El rol de participante lo otorga un
administrador después de la firma del contrato —desde el 11 de septiembre de
2026 nadie se lo puede asignar solo— y activar la ficha es lo que la hace
pública y votable. Son decisiones del equipo, no del formulario.

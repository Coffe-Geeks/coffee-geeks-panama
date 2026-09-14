/**
 * Crea el formulario de participantes de Coffee Geeks Panamá.
 *
 * Cómo usarlo:
 *   1. Entrar a https://script.google.com y crear un proyecto nuevo.
 *   2. Pegar todo este archivo, reemplazando lo que traiga.
 *   3. Ejecutar la función `crearFormulario` y autorizar cuando lo pida.
 *   4. En el registro (Ver → Registro) aparecen las dos direcciones: la de
 *      edición y la que se le manda a las cafeterías.
 *
 * Las preguntas están en el mismo orden y con los mismos nombres que la ficha
 * del sitio, para que trasladar las respuestas sea copiar y pegar sin
 * interpretar. El mapa de cada pregunta a su campo está en `campos.md`.
 */

function crearFormulario() {
  var form = FormApp.create('Coffee Geeks Panamá · Ficha del participante');

  form.setDescription(
    'Con estos datos armamos tu página dentro de coffeegeekspanama.com: la que ve el público, ' +
    'la que usan los jueces y la que aparece en la votación.\n\n' +
    'Toma unos 15 minutos. Puedes guardar y seguir después si inicias sesión con tu cuenta de Google.\n\n' +
    'Si algo no aplica a tu negocio, déjalo en blanco.'
  );
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);

  /**
   * El correo se pide como pregunta normal y NO con `setCollectEmail`.
   *
   * En un dominio de Workspace, recolectar el correo automáticamente obliga a
   * iniciar sesión con Google, y el formulario existe justo para quitarle
   * fricción a quien no quiere pelear con la web. Como pregunta, cualquiera
   * responde.
   *
   * Al publicarlo hay que revisar además que NO quede marcado «Restringir a
   * usuarios de Coffee Geeks»: con eso encendido, ninguna cafetería externa
   * puede abrirlo.
   */

  // ─────────────────────────── 1. El establecimiento
  seccion(form, 'El establecimiento', 'Lo básico: cómo se llama y qué es.');

  texto(form, 'Nombre del establecimiento', 'Tal como quieres que aparezca en la página.', true);
  texto(form, 'Correo de contacto',
        'A este correo les escribimos si falta algo. Es el mismo con el que entran al sitio.', true);
  opcion(form, 'Tipo de negocio', ['Cafetería', 'Hotel', 'Restaurante'], true);
  texto(form, 'Frase corta que los describa',
        'Una línea, la que va bajo el nombre. Ej: "Tostaduría y barra de especialidad en Casco Viejo".', false);
  numero(form, 'Años de existencia', '', false);
  numero(form, 'Cantidad de sucursales', '', false);

  // ─────────────────────────── 2. Identidad legal
  seccion(form, 'Identidad legal',
          'Solo para el contrato y la facturación. Nada de esto se publica.');

  texto(form, 'Razón social', 'Ej: Café de Panamá, S.A.', false);
  texto(form, 'RUC', '', false);
  texto(form, 'Aviso de operación', '', false);
  texto(form, 'Representante legal', '', false);
  texto(form, 'Cargo del representante legal', '', false);

  // ─────────────────────────── 3. Dónde y cómo encontrarlos
  seccion(form, 'Dónde y cómo encontrarlos', 'Esto sí se publica.');

  texto(form, 'Provincia', '', false);
  texto(form, 'Barrio o dirección', 'Ej: San Francisco, Calle 74.', true);
  texto(form, 'Horario de atención', 'Ej: Lunes a sábado de 7:00 a.m. a 6:00 p.m.', false);
  texto(form, 'Teléfono de contacto', '', false);
  texto(form, 'Sitio web o Instagram', 'La dirección completa, con https:// o con @.', false);
  siNo(form, '¿Quieren recibir avisos del concurso por correo?', '', false);

  // ─────────────────────────── 4. Su café
  seccion(form, 'Su café',
          'Esta es la parte que leen los jueces y el público. Vale la pena tomarse el tiempo.');

  casillas(form, '¿En qué categorías compiten?',
           ['Filtrado', 'Espresso', 'Bebida de Autor'],
           'Pueden marcar más de una.', false);

  parrafo(form, 'La historia de la casa',
          '¿Quiénes están detrás? ¿Cómo empezó? Dos o tres párrafos.', false);
  parrafo(form, 'Su espresso',
          'Qué café usan, de dónde viene, cómo lo preparan, qué debería notar quien lo prueba.', false);
  parrafo(form, 'Su filtrado',
          'Método, origen y perfil de taza.', false);
  texto(form, 'Nombre de su bebida de autor', 'Ej: "Geisha Pearl".', false);
  parrafo(form, 'Su bebida de autor',
          'Qué lleva, de dónde salió la idea, qué la hace suya.', false);

  siNo(form, '¿Venden café panameño?', '', false);
  texto(form, 'Nombre de la finca', 'Si trabajan con una finca en particular.', false);
  texto(form, 'Variedades de café que usan', 'Separadas por coma. Ej: Caturra, Geisha, Pacamara.', false);
  texto(form, 'Marca de la máquina de espresso', '', false);
  texto(form, 'Marca del molino', '', false);
  siNo(form, '¿Tuestan su propio café?', '', false);
  siNo(form, '¿Desarrollan sus propios perfiles de tueste?', '', false);
  parrafo(form, '¿Qué experiencias alrededor del café ofrecen?',
          'Catas, talleres, visitas, maridajes.', false);

  // ─────────────────────────── 5. El equipo
  seccion(form, 'El equipo', 'Quiénes están detrás de la barra.');

  numero(form, 'Cantidad total de baristas', '', false);
  numero(form, 'Cuántas son mujeres', '', false);
  numero(form, 'Cuántos son hombres', '', false);
  siNo(form, '¿Tienen personal con discapacidad en el equipo?', '', false);

  texto(form, 'Nombre del barista principal',
        'Quien los representa en el concurso.', false);
  texto(form, 'Su especialidad', 'Ej: latte art, filtrado, tueste.', false);
  numero(form, 'Sus años de experiencia', '', false);
  parrafo(form, 'Su formación',
          'Cursos, certificaciones, dónde aprendió.', false);
  siNo(form, '¿Tiene alguna certificación?', '', false);
  siNo(form, '¿Tiene certificación SCA?', '', false);

  // ─────────────────────────── 6. Formación
  seccion(form, 'Formación y crecimiento',
          'Nos sirve para orientar los programas de la Academia y la alianza con el ITSE.');

  opcion(form, 'Nivel de formación del equipo',
         ['Básico', 'Intermedio', 'Avanzado'], false);
  siNo(form, '¿Su formación fue certificada?', '', false);
  siNo(form, '¿Fue con el programa SCA?', '', false);
  texto(form, '¿Quién los formó?', 'Nombre del instructor o la institución.', false);
  siNo(form, '¿Les interesa certificarse?', '', false);
  texto(form, '¿En qué les interesaría certificarse?', 'Barismo, tueste, catación, gestión.', false);
  siNo(form, '¿Les interesa exportar o internacionalizarse?', '', false);
  texto(form, '¿A qué mercados?', '', false);
  siNo(form, '¿Quieren formar parte del Comité Nacional País?', '', false);

  // ─────────────────────────── 7. Fotos
  seccion(form, 'Fotos',
          'Las fotos no se suben aquí: pesan y muchos navegadores las rechazan. ' +
          'Súbelas a una carpeta de Google Drive, Dropbox o WeTransfer y pega el enlace abajo. ' +
          'Si prefieres, mándalas por WhatsApp al +507 6732-6715.');

  parrafo(form,
    'Enlace a las fotos',
    'Necesitamos: una foto de portada apaisada del local, una del barista principal, ' +
    'y una de cada bebida con la que compiten. Cuanto mejor la luz, mejor queda la página.',
    false);

  Logger.log('Formulario creado.');
  Logger.log('Para editarlo:  ' + form.getEditUrl());
  Logger.log('Para enviarlo:  ' + form.getPublishedUrl());
}

// ─────────────────────────── ayudantes

function seccion(form, titulo, ayuda) {
  form.addPageBreakItem().setTitle(titulo).setHelpText(ayuda || '');
}

function texto(form, titulo, ayuda, obligatorio) {
  form.addTextItem().setTitle(titulo).setHelpText(ayuda || '').setRequired(!!obligatorio);
}

function parrafo(form, titulo, ayuda, obligatorio) {
  form.addParagraphTextItem().setTitle(titulo).setHelpText(ayuda || '').setRequired(!!obligatorio);
}

function numero(form, titulo, ayuda, obligatorio) {
  var item = form.addTextItem().setTitle(titulo).setHelpText(ayuda || '').setRequired(!!obligatorio);
  item.setValidation(
    FormApp.createTextValidation()
      .requireNumber()
      .setHelpText('Escribe solo el número.')
      .build()
  );
}

function opcion(form, titulo, opciones, obligatorio) {
  form.addMultipleChoiceItem().setTitle(titulo).setChoiceValues(opciones).setRequired(!!obligatorio);
}

function casillas(form, titulo, opciones, ayuda, obligatorio) {
  form.addCheckboxItem().setTitle(titulo).setHelpText(ayuda || '')
      .setChoiceValues(opciones).setRequired(!!obligatorio);
}

function siNo(form, titulo, ayuda, obligatorio) {
  form.addMultipleChoiceItem().setTitle(titulo).setHelpText(ayuda || '')
      .setChoiceValues(['Sí', 'No']).setRequired(!!obligatorio);
}

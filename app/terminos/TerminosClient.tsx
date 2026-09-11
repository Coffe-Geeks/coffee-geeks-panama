"use client";

import DocumentoLegal from "@/app/components/DocumentoLegal";

/**
 * Términos y Condiciones de compra, contratación y uso.
 *
 * Cuarenta y dos secciones más tres anexos: sin índice esto no se consulta,
 * se abandona. El índice de arriba permite saltar a la sección concreta que
 * alguien vino a buscar —normalmente cancelaciones o envíos—.
 */

const INDICE: { n: string; t: string }[] = [
  { n: "1", t: "Identificación del titular" },
  { n: "2", t: "Objeto" },
  { n: "3", t: "Aceptación de los términos" },
  { n: "4", t: "Capacidad para contratar" },
  { n: "5", t: "Registro de usuario" },
  { n: "6", t: "Productos y servicios" },
  { n: "7", t: "Información de productos" },
  { n: "8", t: "Precios" },
  { n: "9", t: "Proceso de compra" },
  { n: "10", t: "Medios de pago" },
  { n: "11", t: "Autorización de pagos" },
  { n: "12", t: "Confirmación de compra" },
  { n: "13", t: "Pasaporte Coffee Geeks" },
  { n: "14", t: "Pasaporte físico" },
  { n: "15", t: "Pasaporte digital" },
  { n: "16", t: "Beneficios del Pasaporte" },
  { n: "17", t: "Tickets para eventos y gala" },
  { n: "18", t: "Condiciones de las entradas" },
  { n: "19", t: "Cambio o cancelación de eventos" },
  { n: "20", t: "Merchandising" },
  { n: "21", t: "Envíos y entrega" },
  { n: "22", t: "Experiencias" },
  { n: "23", t: "Misiones comerciales" },
  { n: "24", t: "Cancelaciones y reembolsos" },
  { n: "25", t: "Solicitud de reembolsos" },
  { n: "26", t: "Membresías" },
  { n: "27", t: "Fotografías y contenido" },
  { n: "28", t: "Protección de datos" },
  { n: "29", t: "Datos para viajes" },
  { n: "30", t: "Comunicaciones comerciales" },
  { n: "31", t: "Seguridad de la información" },
  { n: "32", t: "Reclamos y atención" },
  { n: "33", t: "Derechos del consumidor" },
  { n: "34", t: "Enlaces a terceros" },
  { n: "35", t: "Legislación aplicable" },
  { n: "36", t: "Solución de controversias" },
  { n: "37", t: "Facturación" },
  { n: "38", t: "Impuestos y cargos" },
  { n: "39", t: "Responsabilidad en experiencias" },
  { n: "40", t: "Prohibición de reventa" },
  { n: "41", t: "Programa de aliados" },
  { n: "42", t: "Disponibilidad y stock" },
];

const ANEXOS = [
  { id: "anexo-1", t: "Anexo 1 · Política de Cookies" },
  { id: "anexo-2", t: "Anexo 2 · Política de Cambios y Devoluciones" },
  { id: "anexo-3", t: "Anexo 3 · Política de Envíos" },
];

export default function TerminosClient() {
  return (
    <DocumentoLegal
      eyebrow="Legal"
      titulo="Términos y Condiciones"
      bajada="De compra, contratación y uso de la plataforma Coffee Geeks / Panamá Unique."
      actualizado="septiembre de 2026"
      migas={[{ label: "Términos y Condiciones" }]}
    >
      <style>{`
        .indice{background:#f4efe4;border-radius:16px;padding:24px 26px;margin-bottom:36px}
        .indice h4{font-family:'Barlow',sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#38050e;opacity:.6;margin:0 0 14px}
        .indice ol{list-style:none;padding:0;margin:0;columns:2;column-gap:28px}
        .indice li{break-inside:avoid;padding:3px 0}
        .indice a{font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;text-decoration:none;opacity:.85;display:flex;gap:8px}
        .indice a:hover{opacity:1;text-decoration:underline}
        .indice a b{font-variant-numeric:tabular-nums;opacity:.5;min-width:20px;text-align:right;font-weight:500}
        .indice .anexos{margin-top:16px;padding-top:14px;border-top:1px solid #cddbf2;columns:1}
        @media(max-width:600px){ .indice ol{columns:1} }
        .doc h2{scroll-margin-top:80px}
      `}</style>

      <div className="indice">
        <h4>Contenido</h4>
        <ol>
          {INDICE.map((s) => (
            <li key={s.n}>
              <a href={`#s${s.n}`}><b>{s.n}</b> {s.t}</a>
            </li>
          ))}
        </ol>
        <ol className="anexos">
          {ANEXOS.map((a) => (
            <li key={a.id}><a href={`#${a.id}`}>{a.t}</a></li>
          ))}
        </ol>
      </div>

      <h2 id="s1">1. Identificación del titular de la plataforma</h2>
      <p>
        Los presentes Términos y Condiciones regulan el acceso, navegación, registro, compra,
        contratación y utilización de los productos y servicios ofrecidos a través de la
        plataforma digital Coffee Geeks (en adelante, la <strong>“Plataforma”</strong>).
      </p>
      <p>La Plataforma es operada y administrada por:</p>
      <div className="datos">
        <dl>
          <dt>Razón social</dt>
          <dd>Panamá International Firm S.E.P By YelCaballero</dd>
          <dt>Nombre comercial</dt>
          <dd>Panamá Unique, a través de la plataforma y sitio web Coffee Geeks</dd>
          <dt>RUC</dt>
          <dd>155760730-2-2024 DV83</dd>
          <dt>Aviso de operación</dt>
          <dd>155760730-2-2024-2024-574390153</dd>
          <dt>Domicilio</dt>
          <dd>Edif. Universal, Piso 3, Calle 51 y Ave. Federico Boyd, Bella Vista, Ciudad de Panamá</dd>
          <dt>Correo</dt>
          <dd><a href="mailto:info@coffeegeekspanama.com">info@coffeegeekspanama.com</a></dd>
          <dt>Teléfono</dt>
          <dd>6732-6715</dd>
          <dt>Sitio web</dt>
          <dd>www.coffeegeekspanama.com</dd>
        </dl>
      </div>
      <p>
        En adelante, la sociedad antes identificada será denominada <strong>“Coffee Geeks
        Panamá”</strong>, <strong>“la Empresa”</strong>, <strong>“nosotros”</strong> o{" "}
        <strong>“el Proveedor”</strong>. El usuario, cliente, comprador o contratante será
        denominado <strong>“el Usuario”</strong>, <strong>“Cliente”</strong> o{" "}
        <strong>“Consumidor”</strong>.
      </p>
      <p>
        Al acceder a la Plataforma, crear una cuenta, realizar una compra, adquirir un producto,
        reservar una experiencia, inscribirse en un programa o curso, adquirir una entrada o
        contratar cualquier servicio, el Usuario declara que ha leído, comprendido y aceptado estos
        Términos y Condiciones.
      </p>

      <h2 id="s2">2. Objeto</h2>
      <p>Los presentes Términos y Condiciones establecen las reglas aplicables a:</p>
      <ul>
        <li>la utilización de la Plataforma Coffee Geeks / Panamá Unique;</li>
        <li>el registro y creación de cuentas;</li>
        <li>la compra de productos;</li>
        <li>la adquisición del Pasaporte Coffee Geeks, digital y/o físico;</li>
        <li>la compra de entradas para eventos y galas;</li>
        <li>la compra de productos de merchandising;</li>
        <li>misiones comerciales y paquetes de viaje y experiencias.</li>
      </ul>
      <div className="nota">
        <p>
          Después del concurso, diagnóstico y censo se desarrollarán capacitaciones y cursos
          alrededor del café con especializaciones, para ir creando las bases de una academia de
          formación para la industria, de la mano con los aliados estratégicos y un comité nacional.
        </p>
      </div>
      <p>
        Estos Términos constituyen el marco general aplicable a todas las operaciones comerciales
        realizadas a través de la Plataforma. Cuando determinado producto o servicio tenga
        condiciones particulares, dichas condiciones formarán parte integral de la compra y
        prevalecerán sobre estas disposiciones generales exclusivamente respecto de la materia
        específica regulada.
      </p>

      <h2 id="s3">3. Aceptación de los términos</h2>
      <p>
        Antes de completar una compra o contratación, el Usuario deberá tener acceso a estos
        Términos y Condiciones. Al marcar la casilla correspondiente, aceptar expresamente estos
        Términos, efectuar el pago o utilizar el producto o servicio adquirido, el Usuario
        manifiesta su consentimiento y aceptación.
      </p>
      <p>
        Si el Usuario no está de acuerdo con estos Términos, deberá abstenerse de utilizar la
        Plataforma o realizar compras a través de ella. Coffee Geeks podrá actualizar estos
        Términos cuando resulte necesario para reflejar cambios en la Plataforma, nuevos productos
        o servicios, modificaciones operativas o cambios en la normativa aplicable. Las
        modificaciones serán aplicables a las compras realizadas con posterioridad a su entrada en
        vigencia.
      </p>

      <h2 id="s4">4. Capacidad para contratar</h2>
      <p>El Usuario declara que:</p>
      <ul>
        <li>
          Es mayor de edad (18 años cumplidos) conforme a la legislación panameña o, cuando la
          normativa aplicable lo permita, cuenta con la autorización de su representante legal.
        </li>
        <li>Tiene capacidad legal para celebrar contratos.</li>
        <li>La información proporcionada es verdadera, completa y actualizada.</li>
        <li>Utilizará la Plataforma de manera lícita.</li>
        <li>No utilizará la Plataforma para actividades fraudulentas, ilegales o no autorizadas.</li>
        <li>Será responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
      </ul>

      <h2 id="s5">5. Registro de usuario</h2>
      <p>
        Algunos productos y servicios podrán requerir la creación de una cuenta. El Usuario deberá
        proporcionar información correcta, incluyendo, según corresponda:
      </p>
      <ul>
        <li>nombre y apellido;</li>
        <li>documento de identificación;</li>
        <li>correo electrónico;</li>
        <li>número telefónico;</li>
        <li>dirección;</li>
        <li>información de facturación;</li>
        <li>información necesaria para reservas;</li>
        <li>información requerida para viajes o experiencias;</li>
        <li>y cualquier otro dato estrictamente necesario para ejecutar la compra o prestar el servicio.</li>
      </ul>
      <p>El Usuario será responsable de mantener actualizada dicha información.</p>
      <p>
        Coffee Geeks podrá suspender o cancelar cuentas cuando existan indicios razonables de
        fraude, suplantación, uso indebido de la Plataforma o incumplimiento de estos Términos.
      </p>

      <h2 id="s6">6. Productos y servicios ofrecidos</h2>
      <p>
        Coffee Geeks podrá ofrecer productos y servicios propios, así como productos y servicios
        proporcionados por aliados comerciales, operadores, hoteles, instituciones educativas,
        agencias, proveedores de transporte, organizadores de eventos y subcontratistas.
      </p>
      <p>La Plataforma podrá actuar como:</p>
      <ul>
        <li>
          <strong>Proveedor directo:</strong> cuando Coffee Geeks sea quien presta o entrega
          directamente el producto o servicio.
        </li>
        <li>
          <strong>Intermediario o plataforma de comercialización:</strong> cuando Coffee Geeks
          facilite la contratación de un producto o servicio proporcionado por un tercero.
        </li>
        <li>
          <strong>Organizador o coordinador:</strong> cuando Coffee Geeks diseñe, coordine o
          gestione una experiencia que involucre varios proveedores.
        </li>
      </ul>
      <p>La condición aplicable a cada producto o servicio será informada en su respectiva descripción.</p>

      <h2 id="s7">7. Información de productos y servicios</h2>
      <p>
        Coffee Geeks procurará que la información publicada en la Plataforma sea clara, suficiente,
        exacta y actualizada, conforme a las obligaciones de información al consumidor establecidas
        en la Ley 45 de 2007.
      </p>
      <p>Cada producto o servicio podrá incluir, según corresponda: nombre; descripción;
        características; fotografías; precio; impuestos; disponibilidad; duración; fecha; horario;
        ubicación; restricciones; condiciones de uso; condiciones de cancelación; condiciones de
        cambio; política de devolución; y condiciones de entrega.
      </p>
      <p>Las imágenes utilizadas son referenciales cuando así se indique.</p>

      <h2 id="s8">8. Precios</h2>
      <p>
        Todos los precios serán expresados en dólares de los Estados Unidos de América (USD),
        moneda de curso legal en la República de Panamá, según se indique en la Plataforma.
      </p>
      <p>Cuando corresponda, podrán existir cargos adicionales relacionados con: envío; impuestos;
        tasas; transporte; equipaje; alojamiento; entradas; servicios adicionales; seguros; cargos
        administrativos; o servicios subcontratados.
      </p>
      <p>
        Los cargos aplicables serán informados antes de finalizar la compra, cuando sean
        determinables en ese momento. La Plataforma indicará si el precio mostrado incluye o no el
        Impuesto de Transferencia de Bienes Muebles y Servicios (ITBMS), cuando este resulte
        aplicable.
      </p>
      <p>
        Coffee Geeks procurará mantener los precios actualizados. Los precios pueden cambiar sin
        previo aviso, pero una modificación posterior no afectará una compra que ya haya sido
        debidamente confirmada, salvo las situaciones expresamente contempladas en estos Términos o
        en las condiciones particulares del servicio.
      </p>

      <h2 id="s9">9. Proceso de compra</h2>
      <p>El proceso general de compra podrá comprender:</p>
      <ul>
        <li>Selección del producto o servicio.</li>
        <li>Incorporación al carrito o formulario de reserva.</li>
        <li>Revisión de la información.</li>
        <li>Identificación del Usuario.</li>
        <li>Aceptación de estos Términos.</li>
        <li>Aceptación de las condiciones particulares, cuando correspondan.</li>
        <li>Selección del método de pago.</li>
        <li>Autorización y procesamiento del pago.</li>
      </ul>
      <p>
        La compra se considerará confirmada cuando Coffee Geeks haya recibido la confirmación del
        pago y haya enviado al Usuario la correspondiente confirmación de compra, reserva,
        inscripción o contratación.
      </p>
      <div className="nota">
        <p>
          La recepción automática de una solicitud de compra no necesariamente implica que la
          operación haya sido aceptada o confirmada.
        </p>
      </div>

      <h2 id="s10">10. Medios de pago</h2>
      <p>Coffee Geeks podrá habilitar diferentes medios de pago, incluyendo, según disponibilidad:
        tarjetas de crédito; tarjetas de débito; transferencias bancarias; billeteras digitales;
        plataformas de pago electrónico; y otros medios habilitados en la Plataforma.
      </p>
      <p>
        Los pagos podrán ser procesados por proveedores tecnológicos y financieros especializados
        (actualmente, BAC Credomatic).
      </p>
      <p>
        Coffee Geeks no almacenará información completa de tarjetas de pago cuando el procesamiento
        sea realizado directamente por un proveedor especializado, salvo cuando exista una base
        legal y medidas de seguridad que permitan dicho almacenamiento.
      </p>
      <p>El Usuario declara que está autorizado para utilizar el medio de pago seleccionado.</p>

      <h2 id="s11">11. Autorización y validación de pagos</h2>
      <p>
        Coffee Geeks podrá realizar verificaciones razonables para prevenir fraude, suplantación,
        transacciones no autorizadas o utilización indebida de los medios de pago.
      </p>
      <p>
        En caso de que una transacción sea rechazada, anulada o identificada como potencialmente
        fraudulenta, Coffee Geeks podrá suspender la operación hasta realizar las verificaciones
        correspondientes.
      </p>

      <h2 id="s12">12. Confirmación de compra</h2>
      <p>
        Una vez confirmado el pago, el Usuario podrá recibir por correo electrónico o mediante la
        Plataforma: comprobante; factura, cuando corresponda; número de pedido; código de reserva;
        código QR; entrada digital; instrucciones de acceso; información de entrega; información de
        uso; o cualquier otro documento necesario.
      </p>
      <p>El Usuario deberá conservar esta información.</p>

      <h2 id="s13">13. Pasaporte Coffee Geeks</h2>
      <p>
        El Pasaporte Coffee Geeks constituye un producto de la Plataforma destinado a identificar
        al titular y permitirle acceder a los beneficios, experiencias en los establecimientos,
        actividades o promociones que Coffee Geeks determine. El Pasaporte podrá existir en formato
        físico o digital.
      </p>
      <p>
        Las características, beneficios, vigencia, establecimientos participantes y condiciones
        particulares serán informados en la Plataforma.
      </p>
      <p>
        La adquisición del Pasaporte no implica necesariamente que todos los beneficios disponibles
        sean gratuitos. Cuando determinados beneficios requieran reserva, disponibilidad, pago
        adicional o condiciones particulares, estas serán informadas al Usuario.
      </p>

      <h2 id="s14">14. Pasaporte físico</h2>
      <p>
        Cuando el Usuario adquiera un Pasaporte físico en los establecimientos autorizados, deberá
        revisar el producto al recibirlo. El Pasaporte físico no será reembolsado en caso de
        pérdida y los sellos no son transferibles.
      </p>
      <p>
        En caso de pérdida, robo o daño, el Usuario deberá comunicarlo de inmediato a Coffee Geeks
        al correo <a href="mailto:info@coffeegeekspanama.com">info@coffeegeekspanama.com</a> o al
        teléfono 6732-6715, para que la Empresa pueda tomar las medidas razonables que correspondan.
      </p>

      <h2 id="s15">15. Pasaporte digital</h2>
      <p>El Pasaporte Digital podrá ser activado mediante: correo electrónico; cuenta de Usuario;
        código; QR; enlace; aplicación; o plataforma digital.
      </p>
      <p>El Usuario será responsable de proteger sus credenciales, códigos y mecanismos de acceso.</p>
      <p>
        Cuando el Pasaporte sea personal, no podrá ser comercializado, transferido, duplicado o
        utilizado fraudulentamente. Coffee Geeks podrá suspender un Pasaporte cuando se detecte
        utilización fraudulenta o contraria a estos Términos.
      </p>

      <h2 id="s16">16. Beneficios del Pasaporte</h2>
      <p>Los beneficios asociados al Pasaporte podrán cambiar, ampliarse o actualizarse.</p>
      <p>Coffee Geeks podrá incorporar nuevos aliados, establecimientos, experiencias o beneficios.</p>
      <p>
        Cuando un beneficio sea proporcionado por un tercero, podrán aplicar las condiciones de
        dicho tercero. Los beneficios estarán sujetos a disponibilidad y, cuando corresponda, a
        reserva previa.
      </p>

      <h2 id="s17">17. Tickets para eventos y gala de premiación</h2>
      <p>
        La compra de entradas para eventos, incluyendo la Gala de Premiación de The Best Coffee
        Shops (TBCS), estará sujeta a las condiciones particulares indicadas para cada evento.
      </p>
      <p>
        La entrada podrá ser nominativa, personal, transferible, digital, física, con asiento
        asignado, de acceso general, VIP, corporativa o de cualquier otra categoría. La modalidad
        aplicable será la indicada al momento de la compra.
      </p>

      <h2 id="s18">18. Condiciones de las entradas</h2>
      <p>
        El Usuario deberá presentar la entrada, código QR, identificación o mecanismo de validación
        requerido. Una entrada utilizada previamente podrá ser rechazada.
      </p>
      <p>Coffee Geeks podrá establecer controles de seguridad, acceso y aforo.</p>
      <p>El ingreso podrá estar sujeto a horario, edad mínima e identificación.</p>

      <h2 id="s19">19. Cambio o cancelación de eventos</h2>
      <p>
        Cuando un evento sea cancelado, pospuesto, reprogramado o modificado sustancialmente,
        Coffee Geeks comunicará las alternativas disponibles de conformidad con las condiciones del
        evento y la normativa aplicable.
      </p>
      <p>
        Las condiciones específicas podrán contemplar cambio de fecha, transferencia de entrada,
        crédito, reembolso, sustitución o mantenimiento de la entrada para la nueva fecha. Los
        procedimientos y plazos serán comunicados oportunamente.
      </p>

      <h2 id="s20">20. Merchandising y productos físicos</h2>
      <p>
        Coffee Geeks podrá comercializar productos de merchandising, incluyendo, entre otros:
        gorras; camisetas; tazas; vasos; accesorios; bolsas; stickers; publicaciones; artículos
        coleccionables; productos de edición limitada; productos de colaboradores; y otros
        artículos de marca.
      </p>
      <p>La disponibilidad estará sujeta al inventario existente.</p>
      <p>
        Los colores, acabados, dimensiones o apariencia pueden presentar variaciones razonables
        respecto de las imágenes digitales.
      </p>

      <h2 id="s21">21. Envíos y entrega de productos</h2>
      <p>
        Las condiciones de envío dependerán del producto, el destino y la modalidad coordinada con
        Coffee Geeks, con un plazo estimado de aproximadamente 7 días hábiles.
      </p>
      <p>
        El Usuario deberá proporcionar información correcta para la entrega. Cuando una entrega no
        pueda completarse por información incorrecta proporcionada por el Usuario, ausencia del
        destinatario o circunstancias atribuibles al Usuario, podrán generarse costos adicionales
        de reenvío.
      </p>
      <p>Cuando el transporte sea efectuado por un tercero, los tiempos podrán depender del operador logístico.</p>

      <h2 id="s22">22. Experiencias</h2>
      <p>
        Coffee Geeks podrá comercializar experiencias relacionadas con café, cacao, gastronomía,
        fincas, turismo, cultura, productos de origen, eventos, viajes y actividades especiales.
      </p>
      <p>
        Cada experiencia podrá tener condiciones particulares respecto de duración, ubicación,
        capacidad, transporte, alojamiento, seguros, condiciones físicas, cancelación, clima y
        disponibilidad. El Usuario deberá revisar dichas condiciones antes de realizar la compra.
      </p>

      <h2 id="s23">23. Misiones comerciales</h2>
      <p>
        Coffee Geeks podrá organizar o comercializar misiones comerciales nacionales e
        internacionales, dirigidas a profesionales, empresarios, productores, compradores,
        cafeterías, hoteles, distribuidores, instituciones u otros participantes.
      </p>
      <p>
        Una misión comercial podrá incluir, según el paquete adquirido: transporte; vuelos;
        hospedaje; visitas empresariales; reuniones B2B; acceso a ferias; experiencias; traducción;
        coordinación; acompañamiento; visitas a fincas; visitas a tostadores; visitas a cafeterías;
        reuniones con compradores; y actividades de networking.
      </p>
      <p>
        Los componentes incluidos serán exclusivamente los descritos en el paquete adquirido, según
        coordinación entre las partes.
      </p>

      <h2 id="s24">24. Cancelaciones y reembolsos</h2>
      <p>Las condiciones de cancelación dependerán de la naturaleza del producto o servicio adquirido.</p>
      <p>
        Antes de finalizar una compra, Coffee Geeks procurará informar si el producto o servicio
        permite cancelación, permite cambio, permite reembolso, permite crédito, tiene penalidad,
        es no reembolsable o está sujeto a condiciones especiales.
      </p>
      <p>
        Cuando una compra tenga una condición particular de cancelación, esta deberá mostrarse al
        Usuario antes del pago. Nada de lo dispuesto en estos Términos pretende limitar derechos
        irrenunciables reconocidos al consumidor por la legislación aplicable.
      </p>

      <h2 id="s25">25. Solicitud de reembolsos</h2>
      <p>
        Las solicitudes deberán realizarse mediante los canales oficiales de atención, indicando:
        nombre; número de pedido o reserva; producto o servicio adquirido; fecha de compra; motivo
        de la solicitud; y documentación de respaldo cuando corresponda.
      </p>
      <p>
        El plazo de procesamiento dependerá del tipo de operación y del medio de pago utilizado.
        Cuando el reembolso sea procesado por un tercero financiero, el tiempo efectivo de
        acreditación podrá depender de dicho proveedor.
      </p>

      <h2 id="s26">26. Membresías y beneficios</h2>
      <p>
        Cuando Coffee Geeks ofrezca membresías, el Usuario será informado sobre precio, duración,
        beneficios, renovación, cancelación, condiciones de uso y cualquier limitación.
      </p>
      <p>
        La membresía no implica que Coffee Geeks garantice la disponibilidad permanente de todos
        los beneficios si estos dependen de terceros, cupos o fechas específicas.
      </p>

      <h2 id="s27">27. Fotografías y contenido de eventos</h2>
      <p>
        En determinados eventos y experiencias podrán realizarse fotografías, grabaciones
        audiovisuales o transmisiones. Cuando corresponda, Coffee Geeks informará sobre la
        utilización de imágenes y solicitará las autorizaciones requeridas por la legislación
        aplicable, especialmente cuando se trate de usos que excedan la documentación ordinaria del
        evento.
      </p>

      <h2 id="s28">28. Protección de datos personales</h2>
      <p>
        Coffee Geeks reconoce la importancia de la privacidad y se compromete a tratar los datos
        personales conforme a la legislación aplicable en la República de Panamá, incluyendo la Ley
        81 de 2019 sobre Protección de Datos Personales y su reglamentación mediante el Decreto
        Ejecutivo No. 285 de 2021.
      </p>
      <p>La Política de Privacidad de Coffee Geeks deberá informar de manera específica:</p>
      <ul>
        <li>qué datos se recopilan;</li>
        <li>para qué se utilizan;</li>
        <li>cuál es la base jurídica aplicable;</li>
        <li>con quién pueden compartirse;</li>
        <li>cuánto tiempo pueden conservarse;</li>
        <li>cómo se protegen;</li>
        <li>
          los derechos del titular, incluyendo los derechos de acceso, rectificación, cancelación y
          oposición (derechos ARCO), así como el derecho a la portabilidad cuando resulte aplicable;
        </li>
        <li>mecanismos para ejercerlos;</li>
        <li>y los canales de contacto.</li>
      </ul>
      <p>
        La Ley 81 y su reglamentación contemplan expresamente los tratamientos realizados mediante
        actividades comerciales por Internet dirigidas al mercado panameño.
      </p>

      <h2 id="s29">29. Datos necesarios para viajes y experiencias</h2>
      <p>
        Cuando el Usuario contrate un viaje, hospedaje, misión comercial o experiencia que requiera
        información adicional, Coffee Geeks podrá solicitar los datos estrictamente necesarios para
        ejecutar la reserva o prestación.
      </p>
      <p>
        Cuando resulte necesario transferir información a hoteles, aerolíneas, operadores,
        proveedores de transporte, agencias, organizadores u otros proveedores, dicha transferencia
        deberá realizarse conforme a la legislación aplicable en materia de protección de datos.
      </p>

      <h2 id="s30">30. Comunicaciones comerciales</h2>
      <p>
        El Usuario podrá recibir comunicaciones relacionadas con compras, reservas, eventos,
        cursos, promociones, beneficios, novedades, experiencias, productos y contenidos de Coffee
        Geeks.
      </p>
      <p>
        Las comunicaciones promocionales deberán permitir, cuando corresponda, mecanismos para que
        el Usuario pueda gestionar su preferencia o solicitar no recibir comunicaciones comerciales.
      </p>
      <p>
        La normativa panameña sobre comercio electrónico —Ley 51 de 22 de julio de 2008— contempla
        obligaciones relacionadas con la identificación de las comunicaciones comerciales y
        mecanismos para rechazar futuros envíos.
      </p>

      <h2 id="s31">31. Seguridad de la información</h2>
      <p>
        Coffee Geeks implementará medidas razonables de carácter técnico y organizativo destinadas
        a proteger la información bajo su responsabilidad. No obstante, ningún sistema electrónico
        puede garantizar seguridad absoluta.
      </p>
      <p>El Usuario deberá mantener protegidas sus contraseñas, dispositivos y mecanismos de acceso.</p>

      <h2 id="s32">32. Reclamos y atención al cliente</h2>
      <p>
        El Usuario podrá presentar consultas, solicitudes, reclamos o incidencias mediante el correo
        electrónico <a href="mailto:info@coffeegeekspanama.com">info@coffeegeekspanama.com</a>.
      </p>
      <p>
        Para facilitar la atención, el Usuario deberá proporcionar el número de pedido, reserva o
        transacción cuando exista.
      </p>

      <h2 id="s33">33. Derechos del consumidor</h2>
      <p>
        Estos Términos se interpretarán de conformidad con la legislación vigente de la República
        de Panamá. Coffee Geeks reconoce los derechos que correspondan a los consumidores conforme
        a las normas de protección al consumidor aplicables.
      </p>
      <p>
        La Ley 45 de 2007 establece, entre otros aspectos, obligaciones de información del proveedor
        respecto de las características, precio y condiciones determinantes de los bienes y
        servicios, así como los mecanismos de reclamo ante la Autoridad de Protección al Consumidor
        y Defensa de la Competencia (ACODECO).
      </p>

      <h2 id="s34">34. Enlaces a terceros</h2>
      <p>
        La Plataforma podrá contener enlaces hacia páginas, plataformas o servicios de terceros.
        Coffee Geeks no controla necesariamente el contenido, políticas o prácticas de dichos
        terceros. El Usuario deberá revisar las condiciones aplicables antes de contratar
        directamente con ellos.
      </p>

      <h2 id="s35">35. Legislación aplicable</h2>
      <p>
        Estos Términos y las relaciones comerciales derivadas de la utilización de la Plataforma se
        regirán por las leyes de la República de Panamá, sin perjuicio de las normas imperativas que
        resulten aplicables a determinadas operaciones.
      </p>

      <h2 id="s36">36. Solución de controversias</h2>
      <p>
        Coffee Geeks procurará resolver de buena fe cualquier controversia mediante comunicación
        directa con el Usuario. Cuando una controversia no pueda resolverse de manera directa, las
        partes podrán acudir a los mecanismos administrativos, de conciliación, mediación, arbitraje
        o jurisdiccionales que resulten legalmente aplicables, incluyendo los tribunales competentes
        de la República de Panamá.
      </p>
      <p>Nada de lo establecido en esta cláusula limita los derechos que la legislación panameña reconoce al consumidor.</p>

      <h2 id="s37">37. Facturación</h2>
      <p>
        Cuando corresponda, Coffee Geeks emitirá la factura o comprobante correspondiente conforme
        a las disposiciones fiscales aplicables. El Usuario deberá proporcionar información correcta
        para la emisión del documento fiscal.
      </p>

      <h2 id="s38">38. Impuestos y cargos</h2>
      <p>
        Los impuestos, tasas o cargos aplicables serán informados durante el proceso de compra
        cuando corresponda.
      </p>
      <p>
        En viajes, experiencias y servicios prestados por terceros podrán existir impuestos, tasas
        locales, cargos aeroportuarios, cargos de alojamiento u otros conceptos que sean informados
        previamente o que sean impuestos directamente por las autoridades o proveedores
        correspondientes.
      </p>

      <h2 id="s39">39. Responsabilidad del usuario durante experiencias</h2>
      <p>
        El Usuario deberá respetar las instrucciones de seguridad, las normas del establecimiento,
        las instrucciones de los guías, las reglas del evento, las condiciones del operador, la
        legislación local y los derechos de otros participantes.
      </p>
      <p>
        Coffee Geeks podrá solicitar el retiro de una persona cuando su conducta represente un
        riesgo para sí misma, para terceros o para la integridad de la actividad, sin perjuicio de
        los derechos que correspondan al consumidor.
      </p>

      <h2 id="s40">40. Prohibición de reventa no autorizada</h2>
      <p>
        Salvo autorización expresa, los productos, entradas, membresías, beneficios, códigos y
        experiencias adquiridas en la Plataforma no podrán ser revendidos con fines comerciales.
      </p>
      <p>
        Coffee Geeks podrá invalidar operaciones cuando existan indicios razonables de reventa
        especulativa, fraude o uso comercial no autorizado.
      </p>

      <h2 id="s41">41. Programa de aliados</h2>
      <p>
        Coffee Geeks podrá establecer alianzas con establecimientos, productores, hoteles,
        restaurantes, cafeterías, fincas, instituciones y otras organizaciones.
      </p>
      <p>
        La participación de un aliado no significa necesariamente que dicho tercero sea propietario,
        socio o representante legal de Coffee Geeks. Cada aliado será responsable de los servicios
        que directamente preste, dentro del marco contractual correspondiente.
      </p>

      <h2 id="s42">42. Disponibilidad y stock</h2>
      <p>Los productos físicos están sujetos a inventario.</p>

      <h2>Aceptación electrónica</h2>
      <p>
        El Usuario reconoce que la aceptación electrónica de estos Términos, realizada mediante
        mecanismos habilitados en la Plataforma, constituye una manifestación válida de su voluntad
        respecto de la contratación realizada, en los términos permitidos por la legislación
        aplicable.
      </p>
      <p>
        La legislación panameña sobre comercio electrónico —Ley 51 de 22 de julio de 2008,
        publicada en Gaceta Oficial 26090— contempla obligaciones y responsabilidades para los
        prestadores de servicios comerciales a través de Internet.
      </p>

      <h3>Aceptación del usuario</h3>
      <ul className="casillas">
        <li>He leído y acepto los Términos y Condiciones de Compra, Contratación y Uso de Coffee Geeks / Panamá Unique.</li>
        <li>He leído y acepto la Política de Privacidad.</li>
        <li>Declaro que la información proporcionada es verdadera y que tengo capacidad para realizar la compra o contratación.</li>
        <li>Cuando corresponda, acepto las condiciones particulares del producto, evento, curso, experiencia, viaje o servicio seleccionado.</li>
      </ul>

      <h2 id="anexo-1">Anexo 1 · Política de Cookies</h2>
      <p><em>Última actualización: 1 de septiembre de 2026</em></p>

      <h3>1. Introducción</h3>
      <p>
        Coffee Geeks utiliza cookies y tecnologías similares en su sitio web, plataformas digitales,
        aplicaciones, sistemas de compra y demás canales digitales que puedan estar asociados a sus
        servicios. Esta política complementa los Términos y Condiciones y la Política de Privacidad.
      </p>

      <h3>2. Qué son las cookies</h3>
      <p>
        Las cookies son pequeños archivos de información que pueden almacenarse en el dispositivo
        del usuario cuando visita un sitio web. Permiten, entre otras funciones, recordar
        preferencias, facilitar la navegación, mantener sesiones iniciadas, procesar compras,
        analizar el uso del sitio y mejorar la experiencia.
      </p>

      <h3>3. Tipos de cookies</h3>
      <ul>
        <li>
          <strong>Estrictamente necesarias.</strong> Para el funcionamiento básico del sitio:
          navegación, seguridad, carrito de compras, inicio de sesión, procesamiento de pedidos,
          gestión de membresías, acceso a contenidos y prevención de actividades fraudulentas.
        </li>
        <li>
          <strong>Funcionales.</strong> Recuerdan preferencias como idioma, configuración u opciones
          seleccionadas.
        </li>
        <li>
          <strong>Analíticas.</strong> Permiten obtener información estadística sobre la utilización
          de la plataforma para comprender cómo interactúan los usuarios y mejorar su funcionamiento.
        </li>
        <li>
          <strong>De publicidad o marketing.</strong> Cuando corresponda y de acuerdo con las
          autorizaciones aplicables, podrán utilizarse tecnologías destinadas a medir campañas,
          mostrar contenido relevante o comprender la interacción con comunicaciones comerciales.
        </li>
      </ul>

      <h3>4. Cookies de terceros</h3>
      <p>
        Algunas funcionalidades pueden depender de proveedores tecnológicos externos, que podrían
        utilizar cookies de acuerdo con sus propias políticas de privacidad. Entre estos terceros
        pueden encontrarse proveedores de procesamiento de pagos, comercio electrónico, analítica,
        publicidad, mapas, registro de eventos y herramientas de comunicación.
      </p>
      <p>
        Coffee Geeks procurará utilizar proveedores confiables y aplicar medidas razonables para
        proteger la información bajo su responsabilidad. Cada proveedor tercero será responsable de
        las tecnologías que administre directamente.
      </p>

      <h3>5. Administración de cookies</h3>
      <p>
        El usuario podrá administrar determinadas cookies mediante las herramientas disponibles en
        el sitio web y mediante la configuración de su navegador. La desactivación de determinadas
        cookies puede afectar el funcionamiento de algunas funcionalidades.
      </p>

      <h3>6. Datos personales</h3>
      <p>
        Cuando el uso de cookies implique el tratamiento de datos personales, Coffee Geeks realizará
        dicho tratamiento conforme a su Política de Privacidad y a la legislación aplicable. La Ley
        81 de 2019 establece reglas sobre el tratamiento de datos personales y contempla, entre
        otras bases, el consentimiento y la necesidad del tratamiento para ejecutar obligaciones
        contractuales.
      </p>

      <h3>7. Actualizaciones</h3>
      <p>
        Coffee Geeks podrá actualizar esta Política cuando sea necesario para reflejar cambios
        tecnológicos, comerciales, legales o regulatorios. La versión vigente será la publicada en
        coffeegeekspanama.com.
      </p>

      <h3>8. Contacto</h3>
      <div className="datos">
        <dl>
          <dt>Correo</dt>
          <dd><a href="mailto:info@coffeegeekspanama.com">info@coffeegeekspanama.com</a></dd>
          <dt>Sitio web</dt>
          <dd>coffeegeekspanama.com</dd>
          <dt>Dirección</dt>
          <dd>Edif. Universal, Piso 3, Calle 51 y Ave. Federico Boyd, Bella Vista, Ciudad de Panamá, República de Panamá</dd>
        </dl>
      </div>

      <h2 id="anexo-2">Anexo 2 · Política de Cambios y Devoluciones</h2>
      <p><em>Última actualización: 1 de septiembre de 2026</em></p>

      <h3>1. Objeto</h3>
      <p>
        Establece las condiciones generales aplicables a cambios, cancelaciones, devoluciones y
        reembolsos relacionados con productos y servicios adquiridos a través de Coffee Geeks.
      </p>
      <p>
        Debido a que Coffee Geeks comercializa diferentes categorías de productos y servicios, las
        condiciones aplicables podrán variar según la naturaleza de la compra. Estas condiciones se
        interpretarán siempre de conformidad con la legislación aplicable y no limitarán derechos
        que legalmente correspondan al consumidor.
      </p>

      <h3>2. Productos físicos</h3>
      <p>
        Los productos físicos comercializados directamente por Coffee Geeks podrán estar sujetos a
        cambio o devolución cuando corresponda conforme a la legislación aplicable y a las
        condiciones específicas publicadas para el producto.
      </p>
      <p>
        El producto deberá, cuando corresponda, encontrarse en condiciones razonables para su
        evaluación, acompañado de comprobante de compra y demás elementos que permitan verificar la
        transacción.
      </p>
      <p>No se considerarán como cambios ordinarios aquellos casos en los que exista:</p>
      <ul>
        <li>uso indebido;</li>
        <li>deterioro atribuible al consumidor;</li>
        <li>manipulación incorrecta;</li>
        <li>modificación no autorizada;</li>
        <li>daño ocasionado después de la entrega.</li>
      </ul>
      <p>
        Lo anterior no afectará los derechos derivados de defectos, vicios, garantías u otras
        obligaciones que legalmente correspondan.
      </p>

      <h3>3. Productos digitales</h3>
      <p>
        Los productos digitales, contenidos descargables, accesos digitales, membresías, pasaportes
        digitales y otros productos cuyo acceso haya sido habilitado podrán estar sujetos a
        condiciones particulares.
      </p>
      <p>
        Cuando el producto haya sido entregado, activado, utilizado o puesto a disposición del
        cliente, las posibilidades de cancelación o devolución dependerán de la naturaleza del
        producto, de las condiciones informadas previamente y de la legislación aplicable.
      </p>

      <h3>4. Eventos y entradas</h3>
      <p>
        Las entradas estarán sujetas a las condiciones particulares del evento correspondiente.
        Cuando un evento sea cancelado, reprogramado o modificado, Coffee Geeks comunicará las
        alternativas disponibles.
      </p>
      <p>
        La ausencia voluntaria del comprador a un evento no generará automáticamente derecho a
        devolución cuando las condiciones de compra hayan establecido que la entrada es no
        reembolsable y ello sea legalmente válido.
      </p>

      <h3>5. Viajes y misiones comerciales</h3>
      <p>
        Las compras relacionadas con viajes, misiones comerciales y experiencias podrán involucrar
        servicios prestados por terceros. En estos casos, las condiciones de cancelación,
        modificación y devolución de cada servicio podrán depender de las políticas del proveedor
        correspondiente.
      </p>
      <p>
        Coffee Geeks comunicará al cliente las condiciones aplicables antes o durante el proceso de
        contratación, según corresponda.
      </p>

      <h3>6. Servicios prestados por terceros</h3>
      <p>
        Cuando Coffee Geeks actúe como plataforma de comercialización, intermediación, coordinación
        o gestión de un servicio prestado por un tercero, el proveedor tercero podrá ser responsable
        directo de la ejecución material del servicio. Esto puede incluir hoteles, aerolíneas,
        transportistas, operadores turísticos, restaurantes, coffee shops, instructores,
        conferencistas, recintos, empresas de logística, proveedores tecnológicos, agencias y
        operadores de experiencias.
      </p>
      <p>
        Coffee Geeks no será responsable por incumplimientos exclusivamente imputables al tercero
        cuando legalmente dicha responsabilidad corresponda al proveedor que presta directamente el
        servicio. Esta disposición no limita las obligaciones que legalmente correspondan a Coffee
        Geeks por su propia actuación, comercialización, información, cobro o coordinación.
      </p>

      <h3>7. Procedimiento</h3>
      <p>
        Las solicitudes deberán enviarse a{" "}
        <a href="mailto:info@coffeegeekspanama.com">info@coffeegeekspanama.com</a>, indicando:
      </p>
      <ul>
        <li>nombre;</li>
        <li>número de pedido o comprobante;</li>
        <li>producto o servicio adquirido;</li>
        <li>fecha de compra;</li>
        <li>motivo de la solicitud;</li>
        <li>evidencia correspondiente, cuando aplique.</li>
      </ul>
      <p>Coffee Geeks evaluará la solicitud y comunicará la respuesta conforme a las condiciones aplicables.</p>

      <h3>8. Reembolsos</h3>
      <p>
        Cuando corresponda realizar un reembolso, este se efectuará mediante el medio disponible y
        permitido para la transacción original, sujeto a los procedimientos del proveedor de pagos.
      </p>
      <p>
        Cuando la devolución de una suma sea legalmente procedente, Coffee Geeks no sustituirá
        unilateralmente dicha devolución por un mecanismo distinto que prive al consumidor de un
        derecho reconocido por la legislación aplicable. La Ley 45 de 2007 contempla reglas
        específicas sobre devolución de sumas pagadas.
      </p>

      <h3>9. Proveedores de pago</h3>
      <p>
        Los pagos pueden ser procesados mediante plataformas financieras o proveedores de pago
        externos. Coffee Geeks no controla los procesos internos de autorización, retención,
        reversión o procesamiento de dichas entidades.
      </p>
      <p>
        Cuando un inconveniente sea atribuible exclusivamente al proveedor de pago, Coffee Geeks
        podrá solicitar al cliente la información necesaria para gestionar el caso.
      </p>

      <h3>10. Contacto</h3>
      <div className="datos">
        <dl>
          <dt>Titular</dt>
          <dd>Coffee Geeks — Panamá International Firm S.E.P By YelCaballero</dd>
          <dt>Correo</dt>
          <dd><a href="mailto:info@coffeegeekspanama.com">info@coffeegeekspanama.com</a></dd>
          <dt>Teléfono</dt>
          <dd>6732-6715</dd>
        </dl>
      </div>

      <h2 id="anexo-3">Anexo 3 · Política de Envíos</h2>
      <p><em>Última actualización: 1 de septiembre de 2026</em></p>

      <h3>1. Alcance</h3>
      <p>
        Regula el envío y entrega de productos físicos adquiridos a través de Coffee Geeks. No
        aplica a productos exclusivamente digitales, salvo que expresamente se indique lo contrario.
      </p>

      <h3>2. Cobertura</h3>
      <p>
        Coffee Geeks podrá ofrecer envíos nacionales e internacionales dependiendo del producto,
        destino y disponibilidad logística. Las zonas de cobertura, tarifas y tiempos estimados
        podrán variar según las empresas de logística aliadas.
      </p>

      <h3>3. Costos</h3>
      <p>El costo de envío será informado al cliente durante el proceso de compra cuando corresponda.</p>

      <h3>4. Tiempo de preparación</h3>
      <p>
        Los tiempos indicados en la plataforma son estimaciones y pueden variar dependiendo del
        producto y de la disponibilidad. Los productos personalizados o de edición especial podrán
        requerir tiempos adicionales de aproximadamente 7 días.
      </p>

      <h3>5. Proveedores logísticos</h3>
      <p>
        Coffee Geeks podrá utilizar empresas de mensajería, paquetería, transporte y logística
        independientes. Una vez entregado el paquete al operador logístico, determinados aspectos
        del transporte quedarán bajo responsabilidad del proveedor encargado de la entrega.
      </p>
      <p>Coffee Geeks realizará las gestiones razonables que correspondan ante retrasos, pérdida o incidencias reportadas.</p>

      <h3>6. Dirección incorrecta</h3>
      <p>
        El cliente será responsable de proporcionar información correcta y suficiente para la
        entrega. Cuando un pedido no pueda entregarse debido a información incorrecta proporcionada
        por el cliente, podrán generarse costos adicionales de reenvío.
      </p>

      <h3>7. Entrega</h3>
      <p>
        El pedido podrá ser entregado al cliente, a una persona autorizada o mediante el mecanismo
        establecido por el operador logístico. El cliente deberá revisar el estado del paquete
        cuando sea recibido.
      </p>

      <h3>8. Productos dañados</h3>
      <p>
        Si el producto presenta daños atribuibles al transporte, el cliente deberá comunicarlo a
        Coffee Geeks lo antes posible y proporcionar evidencia cuando sea requerida. Coffee Geeks
        gestionará el reclamo correspondiente con el proveedor logístico y determinará la solución
        aplicable conforme a la naturaleza del caso y la legislación vigente.
      </p>

      <h3>9. Retrasos</h3>
      <p>Los tiempos de entrega son estimados y pueden verse afectados por:</p>
      <ul>
        <li>condiciones climáticas;</li>
        <li>alta demanda;</li>
        <li>días festivos;</li>
        <li>restricciones de movilidad;</li>
        <li>situaciones de fuerza mayor;</li>
        <li>procedimientos aduaneros;</li>
        <li>restricciones del país de destino;</li>
        <li>incidencias del operador logístico.</li>
      </ul>

      <h3>10. Envíos internacionales</h3>
      <p>
        En los envíos internacionales pueden existir impuestos, aranceles, tasas, gastos de gestión
        o requisitos aduaneros establecidos por el país de destino. Salvo que se indique
        expresamente lo contrario, dichos cargos podrán ser responsabilidad del destinatario. Coffee
        Geeks no controla las decisiones de autoridades aduaneras extranjeras.
      </p>

      <h3>11. Responsabilidad de terceros</h3>
      <p>
        Coffee Geeks no será responsable por hechos exclusivamente imputables al operador logístico,
        autoridades aduaneras, empresas de transporte u otros terceros independientes. No obstante,
        Coffee Geeks prestará la colaboración razonable para gestionar incidencias relacionadas con
        pedidos realizados a través de su plataforma.
      </p>

      <h3>12. Contacto</h3>
      <div className="datos">
        <dl>
          <dt>Titular</dt>
          <dd>Panamá International Firm S.E.P By YelCaballero</dd>
          <dt>Correo</dt>
          <dd>
            <a href="mailto:info@coffeegeekspanama.com">info@coffeegeekspanama.com</a> o{" "}
            <a href="mailto:info@panamainternationalfirm.com">info@panamainternationalfirm.com</a>
          </dd>
          <dt>Teléfono</dt>
          <dd>6732-6715</dd>
        </dl>
      </div>
    </DocumentoLegal>
  );
}

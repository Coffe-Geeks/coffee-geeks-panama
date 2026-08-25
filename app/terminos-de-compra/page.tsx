import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Compra · Coffee Geeks Panamá",
  description:
    "Términos y Condiciones de Compra de los productos y servicios ofrecidos por Coffee Geeks Panamá, operado por Panamá International Firm by YelCaballero, S.EP.",
};

// Contenido legal provisto por EL ORGANIZADOR (Panamá International Firm). Se
// publica en URL fija y se enlaza desde el pie de página, accesible antes de
// confirmar cualquier pago, conforme lo exige la pasarela de pagos afiliada.
const SECCIONES: { t: string; p: string[] }[] = [
  {
    t: "1. Aceptación de los términos",
    p: [
      "El acceso y uso del sitio web coffeegeekspanama.com (en adelante, “la Plataforma”) y la compra de cualquier producto o servicio ofrecido en él implican la aceptación plena y sin reservas de los presentes Términos y Condiciones de Compra (en adelante, los “Términos”), así como de la Política de Cancelaciones, Devoluciones y Reembolsos y de la Política de Privacidad, documentos que se entienden incorporados por referencia. Si el usuario no está de acuerdo con estos Términos, debe abstenerse de utilizar la Plataforma o de realizar compras a través de ella.",
    ],
  },
  {
    t: "2. Quién opera esta Plataforma",
    p: [
      "Coffee Geeks Panamá (coffeegeekspanama.com) es operada por Panamá International Firm by YelCaballero, S.EP. (PIF), sociedad panameña inscrita a Ficha 2024, Documento 155760730 de la Sección Mercantil del Registro Público de Panamá, representada por Yelsica H. Caballero, cédula de identidad 4-762-865. En estos Términos, a esta empresa la llamamos simplemente “EL ORGANIZADOR”.",
      "EL ORGANIZADOR es titular de las marcas registradas ante la Dirección General del Registro de la Propiedad Industrial (DIGERPI) de Panamá bajo las cuales opera de cara al usuario: PANAMA COFFEE GEEKS (Registro N.º 324604, Clase 41, 25/09/2025, renovación 25/09/2035) y PANAMA UNIQUE (Registro N.º 324606, Clase 35, 25/09/2025, renovación 25/09/2035), ambas propiedad de Panamá International Firm by YelCaballero, S.EP.",
      "PANAMA COFFEE GEEKS: marca bajo la cual se presta el concurso “El Camino a la Gran Taza”, la Academia y las experiencias de café, a través del sitio coffeegeekspanama.com. PANAMA UNIQUE: marca bajo la cual EL ORGANIZADOR comercializa productos y experiencias de retail a través del sitio panamaunique.com, en conjunto con la marca COFFEE GEEKS.",
      "¿Dudas o reclamos? Escríbenos a info@coffeegeekspanama.com · WhatsApp/Tel: 6825-6583 / 6934-5115 · Ciudad de Panamá, República de Panamá.",
    ],
  },
  {
    t: "3. Objeto",
    p: [
      "A través de la Plataforma, EL ORGANIZADOR ofrece en venta, entre otros: productos físicos disponibles en la Tienda (bajo las marcas PANAMA UNIQUE y COFFEE GEEKS): café, mercancía oficial, accesorios y artículos relacionados; servicios y módulos educativos de la Specialty Coffee Academy: cursos, talleres y certificaciones bajo estándares de la Specialty Coffee Association (SCA) u otros organismos indicados en cada curso; experiencias, entradas a eventos, galas y activaciones vinculadas al concurso “El Camino a la Gran Taza” y al Pasaporte Digital asociado; y cualquier otro producto o servicio que EL ORGANIZADOR incorpore en el futuro a su catálogo en línea.",
    ],
  },
  {
    t: "4. Catálogo, precios y disponibilidad",
    p: [
      "Todos los productos y servicios se ofrecen con su descripción, imagen referencial y precio expresado en Balboas/Dólares de los Estados Unidos de América (USD/PAB), moneda de curso legal en Panamá.",
      "Los precios publicados incluyen o excluyen el Impuesto de Transferencia de Bienes Muebles y Servicios (ITBMS), según se indique expresamente en cada producto o al momento del pago; en caso de no indicarse, se entenderá que el ITBMS aplicable se añadirá en el resumen de compra previo a la confirmación del pago.",
      "EL ORGANIZADOR se reserva el derecho de modificar precios, promociones y disponibilidad del catálogo en cualquier momento, sin que ello afecte los pedidos ya confirmados y pagados. Las imágenes de los productos son referenciales; pueden existir variaciones menores de empaque, cosecha o presentación respecto al producto entregado.",
    ],
  },
  {
    t: "5. Proceso de compra",
    p: [
      "El usuario selecciona el o los productos/servicios de su interés y los añade al carrito de compras habilitado en la Plataforma. Antes de confirmar el pago, el sistema mostrará un resumen del pedido con el detalle de productos, cantidades, precio unitario, impuestos aplicables, costos de envío (si corresponden) y el monto total a pagar.",
      "El usuario debe registrar o confirmar sus datos de contacto y facturación (nombre completo, correo electrónico, teléfono y, cuando aplique, dirección de entrega). La compra se entiende perfeccionada una vez que la pasarela de pagos confirma la aprobación de la transacción y EL ORGANIZADOR emite la confirmación de pedido por correo electrónico.",
      "EL ORGANIZADOR podrá rechazar o cancelar un pedido, notificando al usuario y reembolsando cualquier monto cobrado, en casos de indicios de fraude, error evidente de precio, falta de disponibilidad del producto o incumplimiento de estos Términos.",
    ],
  },
  {
    t: "6. Medios de pago y seguridad de la pasarela de pagos",
    p: [
      "Los pagos en la Plataforma se procesan a través de una pasarela de pago electrónico afiliada a BAC Credomatic (FAC E-commerce / PowerTranz) u otro proveedor de procesamiento que EL ORGANIZADOR determine, conforme a los siguientes lineamientos:",
      "Se aceptan tarjetas de crédito y débito de las marcas habilitadas (Visa, Mastercard, American Express y otras que se incorporen), cuyos logotipos se muestran en el proceso de pago. El sitio cuenta con certificado de seguridad TLS 1.2/1.3, que garantiza la comunicación cifrada entre el navegador del usuario y los servidores de la Plataforma.",
      "El número de tarjeta, fecha de vencimiento y código de seguridad (CVV) se ingresan directamente en el formulario seguro de la pasarela de pagos; EL ORGANIZADOR no almacena estos datos en sus propios servidores. Cuando corresponda, se aplicará el protocolo de autenticación 3D Secure para transacciones con tarjeta, como capa adicional de verificación del titular.",
      "Toda anulación, devolución o contracargo procesado por la pasarela de pagos podrá generar una comisión conforme a las tarifas vigentes de BAC Credomatic, la cual no es reembolsable por EL ORGANIZADOR. El comercio (EL ORGANIZADOR) mantiene disponible en el sitio, de forma visible, sus datos de contacto de atención al cliente (nombre, dirección, teléfono y correo electrónico), conforme lo exige la entidad procesadora de pagos.",
      "Los cargos por compras realizadas en esta Plataforma serán procesados y aparecerán en el estado de cuenta del titular de la tarjeta a nombre de PANAMÁ INTERNATIONAL FIRM (PIF), sociedad que opera las marcas Coffee Geeks Panamá y Panama Unique.",
    ],
  },
  {
    t: "7. Facturación",
    p: [
      "Toda compra realizada a través de la Plataforma generará el comprobante fiscal correspondiente conforme a la normativa de la Dirección General de Ingresos (DGI) de Panamá, el cual será enviado al correo electrónico registrado por el usuario.",
    ],
  },
  {
    t: "8. Entrega de productos y prestación de servicios",
    p: [
      "8.1 Productos físicos (Tienda). Los tiempos de entrega estimados se indicarán en la Plataforma al momento de la compra y podrán variar según la ubicación de entrega dentro o fuera de la República de Panamá. El riesgo de pérdida o daño del producto se transfiere al Consumidor en el momento de la entrega al transportista o en el punto de retiro acordado.",
      "8.2 Servicios educativos (Academia). El acceso a los cursos, módulos o certificaciones se otorgará conforme al calendario publicado para cada programa; el usuario recibirá las instrucciones de acceso o asistencia por correo electrónico.",
      "8.3 Experiencias, eventos y Pasaporte Digital. La confirmación de compra de una entrada, cupo o experiencia no garantiza cambios de fecha u horario salvo lo previsto en la Política de Cancelaciones, Devoluciones y Reembolsos. El Pasaporte Digital es una herramienta de gamificación del concurso “El Camino a la Gran Taza”; su uso no constituye, por sí mismo, una compra sujeta a estos Términos, salvo en lo relativo al tratamiento de datos personales del usuario.",
    ],
  },
  {
    t: "9. Identificación del comprador y aclaración sobre el pasaporte",
    p: [
      "Para prevenir fraude, validar la mayoría de edad cuando corresponda, o gestionar la entrega de premios del concurso, EL ORGANIZADOR podrá solicitar al usuario un documento de identificación vigente: cédula de identidad personal (nacionales panameños o residentes) o pasaporte (extranjeros y turistas).",
      "Se deja constancia expresa de que, para los efectos de estos Términos, el pasaporte es aceptado únicamente como documento de identidad de carácter turístico y de viaje del titular, y que su presentación ante EL ORGANIZADOR no lo habilita, sustituye ni tiene efecto alguno como documento válido para trámites de cruce de fronteras, control migratorio, residencia u otros actos de competencia exclusiva de las autoridades migratorias de la República de Panamá o de cualquier otro país.",
      "EL ORGANIZADOR tratará dichos documentos de identificación únicamente para los fines aquí descritos y conforme a su Política de Privacidad y a la Ley 81 de 2019, sin conservarlos más allá del plazo necesario para dicha verificación, salvo obligación legal de conservación distinta.",
    ],
  },
  {
    t: "10. Mayoría de edad y capacidad legal",
    p: [
      "La compra de productos y servicios a través de la Plataforma está dirigida a personas mayores de 18 años con plena capacidad legal para contratar. Los menores de edad podrán utilizar la Plataforma únicamente bajo la supervisión y con la autorización expresa de su padre, madre o tutor legal, quien asumirá la responsabilidad de la transacción.",
    ],
  },
  {
    t: "11. Cancelaciones, devoluciones y reembolsos",
    p: [
      "Las condiciones específicas de cancelación, devolución y reembolso de cada tipo de producto o servicio se rigen por la Política de Cancelaciones, Devoluciones y Reembolsos de EL ORGANIZADOR, publicada en la Plataforma y que forma parte integral de estos Términos.",
    ],
  },
  {
    t: "12. Propiedad intelectual",
    p: [
      "Todos los contenidos de la Plataforma (textos, logotipos, diseños, fotografías, metodología del concurso, materiales de la Academia y demás elementos) son propiedad de EL ORGANIZADOR o de sus licenciantes y aliados, y están protegidos por la legislación panameña e internacional en materia de propiedad intelectual. Las marcas PANAMA COFFEE GEEKS y PANAMA UNIQUE están registradas ante la DIGERPI de Panamá conforme al detalle indicado en la Sección 2. Queda prohibida su reproducción, distribución o uso comercial sin autorización previa y por escrito.",
    ],
  },
  {
    t: "13. Protección de datos personales",
    p: [
      "El tratamiento de los datos personales suministrados por los usuarios para efectos de la compra, registro en el concurso o suscripción al boletín informativo se rige por la Política de Privacidad de EL ORGANIZADOR, elaborada conforme a la Ley 81 de 26 de marzo de 2019 sobre protección de datos personales de la República de Panamá. El usuario podrá ejercer sus derechos de acceso, rectificación, cancelación y oposición conforme a los canales indicados en dicha Política.",
    ],
  },
  {
    t: "14. Limitación de responsabilidad",
    p: [
      "EL ORGANIZADOR actúa como plataforma que conecta al consumidor con productos propios y con experiencias ofrecidas por cafeterías, productores y aliados participantes del concurso; en el caso de experiencias prestadas directamente por terceros participantes, la responsabilidad por la calidad del servicio en el establecimiento corresponde principalmente a dicho tercero, sin perjuicio del deber de diligencia de EL ORGANIZADOR en la curaduría de sus aliados.",
      "EL ORGANIZADOR no será responsable por retrasos o incumplimientos derivados de causas de fuerza mayor o caso fortuito, incluyendo fallas de la pasarela de pagos, del proveedor de hosting, de transportistas o de las telecomunicaciones, ajenas a su control razonable. En ningún caso la responsabilidad de EL ORGANIZADOR frente al Consumidor excederá el monto efectivamente pagado por el producto o servicio que dio origen al reclamo.",
    ],
  },
  {
    t: "15. Modificaciones a los Términos",
    p: [
      "EL ORGANIZADOR podrá actualizar estos Términos en cualquier momento para reflejar cambios normativos, operativos o comerciales. La versión vigente será siempre la publicada en la Plataforma, con indicación de su fecha de última actualización. Las compras ya confirmadas se regirán por los Términos vigentes al momento de la transacción.",
    ],
  },
  {
    t: "16. Ley aplicable y jurisdicción",
    p: [
      "Estos Términos se rigen por las leyes de la República de Panamá. Para cualquier controversia derivada de su interpretación o aplicación, las partes se someten a los tribunales ordinarios competentes de la República de Panamá, sin perjuicio de los mecanismos de protección al consumidor disponibles ante la Autoridad de Protección al Consumidor y Defensa de la Competencia (ACODECO).",
    ],
  },
  {
    t: "17. Contacto",
    p: [
      "¿Necesitas ayuda con tu compra? Escríbenos a info@coffeegeekspanama.com o por WhatsApp al 6825-6583 / 6934-5115. Estamos en Ciudad de Panamá, República de Panamá.",
    ],
  },
];

export default function TerminosDeCompraPage() {
  return (
    <main className="relative min-h-screen py-16 px-4">
      <div className="absolute inset-0 -z-10 fixed">
        <Image src="/background.webp" alt="" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>

      <div className="z-10 max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
          ← Volver al inicio
        </Link>

        <div className="p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">Términos y Condiciones de Compra</h1>
          <p className="text-white/50 text-sm">Productos y servicios ofrecidos por Coffee Geeks Panamá · coffeegeekspanama.com</p>
          <p className="text-white/40 text-xs mt-1 mb-8">Versión 1.0 · Última actualización: 25 de agosto de 2026</p>

          <div className="flex flex-col gap-7">
            {SECCIONES.map((s) => (
              <section key={s.t}>
                <h2 className="text-white font-semibold text-lg mb-2">{s.t}</h2>
                {s.p.map((par, i) => (
                  <p key={i} className="text-white/80 text-sm leading-relaxed mb-2">
                    {par}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/15 text-white/50 text-xs">
            Ver también:{" "}
            <Link href="/cancelaciones" className="underline hover:text-white">
              Política de Cancelaciones, Devoluciones y Reembolsos
            </Link>{" "}
            ·{" "}
            <Link href="/privacidad" className="underline hover:text-white">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

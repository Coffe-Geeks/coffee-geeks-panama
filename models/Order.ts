import mongoose, { Schema, model, models } from "mongoose";

/**
 * Pedido de la tienda.
 *
 * Guarda una foto del producto en el momento de la compra (nombre, precio,
 * variante) en vez de solo referenciarlo: si mañana cambia el precio o se
 * borra el producto, el pedido histórico debe seguir siendo fiel a lo que
 * el cliente compró y pagó.
 *
 * De la tarjeta no se guarda absolutamente nada. PowerTranz aloja el
 * formulario y aquí solo quedan sus identificadores de transacción, que es
 * lo que sostiene el alcance PCI en SAQ A.
 */

export const ESTADOS_PEDIDO = [
  "pendiente",   // creado, aún sin pagar
  "pagado",      // cobro aprobado por la pasarela
  "rechazado",   // la pasarela o el antifraude lo denegaron
  "cancelado",   // anulado por el comercio o por expiración
  "enviado",     // despachado al cliente
  "entregado",   // recibido
] as const;

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

const ItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "StoreProduct", required: true },
    // Id de la variante comprada; hace falta para descontar su existencia
    variantId: { type: String, default: "" },
    // Copia del producto al momento de comprar
    name: { type: String, required: true },
    variant: { type: String, default: "" },
    sku: { type: String, default: "" },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
    requiresShipping: { type: Boolean, default: true },
  },
  { _id: true }
);

const DireccionSchema = new Schema(
  {
    line1: { type: String, default: "", trim: true },
    line2: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    province: { type: String, default: "", trim: true },
    country: { type: String, default: "Panamá", trim: true },
    notes: { type: String, default: "", trim: true },
  },
  { _id: false }
);

/**
 * Rastro de la transacción en PowerTranz. Ningún campo aquí es un dato de
 * tarjeta: son referencias que permiten conciliar contra el Portal del
 * Comercio y auditar por qué se aprobó o se denegó un cobro.
 */
const PagoSchema = new Schema(
  {
    provider: { type: String, default: "powertranz" },
    // Identificadores que enviamos nosotros
    transactionIdentifier: { type: String, default: "" },
    orderIdentifier: { type: String, default: "" },
    // Lo que devuelve la pasarela
    spiToken: { type: String, default: "" },
    isoResponseCode: { type: String, default: "" },
    responseMessage: { type: String, default: "" },
    approved: { type: Boolean, default: false },
    cardBrand: { type: String, default: "" },
    // Resultado de la autenticación 3DS/SafeKey: Y, A, U, N o R
    authenticationStatus: { type: String, default: "" },
    // Antifraude Kount: A aprobado, D denegado
    fraudResponseCode: { type: String, default: "" },
    fraudScore: { type: String, default: "" },
    paidAt: { type: Date, default: null },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    // Número legible para el cliente y para soporte: CG-260903-0007
    orderNumber: { type: String, required: true, unique: true, index: true },

    // Puede comprar alguien sin cuenta; por eso el usuario es opcional
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, default: "", trim: true },
    },

    items: { type: [ItemSchema], required: true },

    // Importes en USD, la única moneda habilitada hoy por BAC
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },

    requiresShipping: { type: Boolean, default: true },
    shippingAddress: { type: DireccionSchema, default: () => ({}) },

    status: { type: String, enum: ESTADOS_PEDIDO, default: "pendiente", index: true },
    payment: { type: PagoSchema, default: () => ({}) },

    // Notas internas del equipo, nunca visibles para el cliente
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Los pedidos se consultan casi siempre por fecha y por estado
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customer.email": 1, createdAt: -1 });

if (models && models.Order) {
  delete models.Order;
}

const Order = model("Order", OrderSchema);
export default Order;

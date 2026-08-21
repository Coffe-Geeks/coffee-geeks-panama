import { Schema, model, models } from "mongoose";

// Registro de visitantes (puerta de entrada del sitio). No son cuentas
// de usuario: es la captura de contacto de la industria para el email
// marketing. Se consulta desde el panel privado (pestaña Data).
const VisitorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    // Solo dígitos (la validación vive en el endpoint); puede venir vacío
    phone: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

// Un registro por correo: si la misma persona se registra otra vez
// (otro navegador, otro dispositivo) se actualiza en vez de duplicarse.
VisitorSchema.index({ email: 1 }, { unique: true });

const Visitor = models.Visitor || model("Visitor", VisitorSchema);
export default Visitor;

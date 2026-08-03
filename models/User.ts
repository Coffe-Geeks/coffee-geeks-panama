import mongoose, { Schema, model, models } from "mongoose";
// Model updated with new roles: juez_local, juez_internacional

const BaristaSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  photo: { type: String, default: "" },
  isHighlighted: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "El correo electrónico es obligatorio"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "El correo electrónico no es válido",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "cafeteria", "juez_local", "juez_internacional"],
      default: "user",
    },
    // ── Campos exclusivos del rol cafetería ──
    businessType: {
      type: String,
      enum: ["coffee", "hotel", "rest"],
      default: "coffee",
    },
    isActive: { type: Boolean, default: false },
    cafeteriaName: { type: String, trim: true, default: "" },
    neighborhood: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    hours: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    web: { type: String, trim: true, default: "" },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    locationLat: { type: Number, default: null },
    locationLng: { type: Number, default: null },
    legalRepresentative: { type: String, trim: true, default: "" },
    ruc: { type: String, trim: true, default: "" },
    competitionCategory: {
      type: [String],
      enum: ["Filtrado", "Espresso", "Bebida de Autor"],
      default: [],
    },
    baristas: { type: [BaristaSchema], default: [] },
    advancedToRound2: { type: Boolean, default: false },

    // ── Campos Detallados (Solo Admin/Participante Detallado) ──
    legalRepresentativePosition: { type: String, default: "" },
    yearsOfExistence: { type: Number, default: 0 },
    legalName: { type: String, default: "" },
    operationNotice: { type: String, default: "" },
    province: { type: String, default: "" },
    branchesCount: { type: Number, default: 1 },
    sellsPanamanianCoffee: { type: Boolean, default: false },
    farmName: { type: String, default: "" },
    coffeeVarieties: { type: [String], default: [] },
    machineBrand: { type: String, default: "" },
    grinderBrand: { type: String, default: "" },
    roastsOwnCoffee: { type: Boolean, default: false },
    makesOwnProfile: { type: Boolean, default: false },
    coffeeExperiences: { type: String, default: "" },
    wantsToInternationalize: { type: Boolean, default: false },
    targetMarkets: { type: String, default: "" },
    totalBaristas: { type: Number, default: 0 },
    acceptsNotifications: { type: Boolean, default: true },

    // Detalle de Baristas
    mainBaristaName: { type: String, default: "" },
    mainBaristaTraining: { type: String, default: "" },
    mainBaristaSpecialty: { type: String, default: "" },
    mainBaristaYearsExp: { type: Number, default: 0 },
    mainBaristaCertified: { type: Boolean, default: false },
    mainBaristaSCA: { type: Boolean, default: false },
    femaleBaristasCount: { type: Number, default: 0 },
    maleBaristasCount: { type: Number, default: 0 },
    trainingLevel: { 
      type: String, 
      enum: ["", "básico", "intermedio", "avanzado"], 
      default: "" 
    },
    hasCertifiedTraining: { type: Boolean, default: false },
    trainingSCA: { type: Boolean, default: false },
    trainingInstructor: { type: String, default: "" },
    interestInCertification: { type: Boolean, default: false },
    certificationInterests: { type: [String], default: [] },
    wantsToJoinCommittee: { type: Boolean, default: false },
    hasDisabledStaff: { type: Boolean, default: false },

  },
  {
    timestamps: true,
  }
);

// Delete the password when returning the generic object to frontend
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Force model re-registration in development to pick up schema changes
if (models && models.User) {
  delete models.User;
}

const User = model("User", UserSchema);
export default User;

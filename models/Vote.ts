import mongoose, { Schema, model, models } from "mongoose";

const VoteSchema = new Schema(
  {
    voterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voterRole: {
      type: String,
      required: true,
      enum: ["user", "juez_local", "juez_internacional", "admin"],
    },
    cafeteriaId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    baristaId: {
      type: String,
      default: "",
    },
    round: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    // Criterios técnicos (jueces): quedan en null en los votos del público
    scoreExperience: {
      type: Number,
      default: null,
    },
    scorePresence: {
      type: Number,
      default: null,
    },
    scoreCup: {
      type: Number,
      default: null,
    },
    // Voto simplificado del público: barista favorito (1–5) y su bebida
    // favorita entre las que presenta la cafetería. Los votos de jueces
    // dejan estos campos vacíos.
    scoreBarista: {
      type: Number,
      default: null,
    },
    favoriteDrink: {
      type: String,
      enum: ["", "espresso", "filtrado", "signature"],
      default: "",
    },
  },
  { timestamps: true }
);

// Asegurarse de que un usuario solo vote una vez por cafetería en cada ronda
VoteSchema.index({ voterId: 1, cafeteriaId: 1, round: 1 }, { unique: true });

// Prevenir error de modelo sobrescrito en desarrollo con Next.js
if (models.Vote) {
  delete models.Vote;
}

const Vote = model("Vote", VoteSchema);
export default Vote;

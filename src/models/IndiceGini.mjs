//import axios from "axios";
import mongoose from "mongoose";

const indiceGiniSchema = new mongoose.Schema({
  pais: { type: String, required: true },
  anio: { type: Number, required: true },
  gini: { type: Number, required: true },
  area: { type: Number, default: 0 },
  population: { type: Number, default: 0 }, // nuevo
  creador: { type: String, default: "Romano Rodrigo" }
}, { collection: "Grupo-16" });

export default mongoose.model("IndiceGini", indiceGiniSchema);



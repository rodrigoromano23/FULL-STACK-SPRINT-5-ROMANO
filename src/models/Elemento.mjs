
import mongoose from "mongoose";

const options = { 
  collection: "Grupo-16", // misma colección
  timestamps: true
};

// Schema base, con discriminatorKey
const elementoSchema = new mongoose.Schema({
  creador: { type: String, required: true, index: true }
}, { ...options, discriminatorKey: "tipo" });  //  clave de discriminador

// Superhéroe
const superheroeSchema = new mongoose.Schema({
  nombreSuperheroe: { type: String, required: true },
  nombreReal: { type: String, required: true },
  edad: { type: Number, min: 0 },
  planetaOrigen: { type: String, default: "Desconocido" },
  debilidad: String,
  poderes: { type: [String], default: [] },
  aliados: { type: [String], default: [] },
  enemigos: { type: [String], default: [] }
}, options);

// País
const paisSchema = new mongoose.Schema({
  nameOfficial: { type: String, required: true },
  capital: { type: String, default: "Sin capital" },
  borders: { type: [String], default: [] },
  area: { type: Number, default: 0 },
  population: { type: Number, default: 0 },
  gini: {
    type: Map,
    of: Number,   // cada clave = año, valor = índice Gini
    default: {}
  },
  timezones: { type: [String], default: ["Sin timezone"] }
}, options);

// Modelo base
const Elemento = mongoose.model("Elemento", elementoSchema);

// Discriminadores (Mongoose agrega automáticamente el campo "tipo")
export const SuperHero = Elemento.discriminator("superheroe", superheroeSchema);
export const Pais = Elemento.discriminator("pais", paisSchema);










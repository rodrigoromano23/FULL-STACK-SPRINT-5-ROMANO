


import mongoose from "mongoose";

const options = { 
  collection: "Grupo-16", 
  timestamps: true
};

// Schema base
const elementoSchema = new mongoose.Schema({
  creador: { type: String, required: true, index: true }
}, { ...options, discriminatorKey: "tipo" });

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
  nameOfficial: { 
    type: String, 
    required: [true, "El nombre oficial es obligatorio"],
    minlength: [3, "El nombre oficial debe tener al menos 3 caracteres"],
    maxlength: [90, "El nombre oficial no puede superar los 90 caracteres"]
  },
  capital: { 
    type: [String], 
    default: ["Sin capital"],
    validate: {
      validator: function(arr) {
        return arr.every(c => typeof c === "string" && c.length >= 3 && c.length <= 90);
      },
      message: "Cada capital debe tener entre 3 y 90 caracteres"
    }
  },
  borders: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(arr) {
        return arr.every(code => /^[A-Z]{3}$/.test(code));
      },
      message: "Cada código de frontera debe tener exactamente 3 letras mayúsculas (ej: ARG, BRA)"
    }
  },
  area: { 
    type: Number, 
    min: [0, "El área debe ser un número positivo"]
  },
  population: { 
    type: Number, 
    min: [0, "La población debe ser un número entero positivo"],
    validate: {
      validator: Number.isInteger,
      message: "La población debe ser un número entero"
    }
  },
  gini: {
    type: Map,
    of: {
      type: Number,
      min: [0, "El índice Gini no puede ser menor a 0"],
      max: [100, "El índice Gini no puede ser mayor a 100"]
    },
    default: {}
  },
  timezones: { type: [String], default: ["Sin timezone"] }
}, options);

// Modelo base
const Elemento = mongoose.model("Elemento", elementoSchema);

// Discriminadores
export const SuperHero = Elemento.discriminator("superheroe", superheroeSchema);
export const Pais = Elemento.discriminator("pais", paisSchema);











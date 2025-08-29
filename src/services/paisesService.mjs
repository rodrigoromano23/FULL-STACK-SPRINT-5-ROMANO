
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
// /src/services/paisesService.mjs
import Pais from "../models/Pais.mjs";
import { fetchPaisesAmerica } from "../utils/apiClient.mjs";

const CREADOR = "ROMANO_2025"; // reemplazar por tu nombre real

/**
 * Pobla la base de datos con los países hispanohablantes de América.
 * Usa upsert para no duplicar países ya existentes.
 */
export async function poblarPaises() {
  try {
    const paises = await fetchPaisesAmerica();

    // Agregar creador personalizado
    const paisesConCreador = paises.map((pais) => ({
      ...pais,
      creador: CREADOR,
    }));

    // Guardar o actualizar en MongoDB
    for (const pais of paisesConCreador) {
      await Pais.updateOne(
        { nameOfficial: pais.nameOfficial }, // 👈 corregido
        { $set: pais },
        { upsert: true }
      );
    }

    console.log(`✅ Se poblaron ${paisesConCreador.length} países hispanohablantes en la DB.`);
    return paisesConCreador;
  } catch (error) {
    console.error("❌ Error al poblar países:", error);
    throw error;
  }
}

/**
 * Devuelve todos los países almacenados en la base de datos.
 */
export async function listarPaises() {
  return await Pais.find();
}

/**
 * Agrega un país manualmente a la base de datos.
 */
export async function agregarPais(pais) {
  const nuevoPais = new Pais({ ...pais, creador: CREADOR });
  return await nuevoPais.save();
}

/**
 * Edita un país existente por su ID.
 */
export async function editarPais(id, datos) {
  return await Pais.findByIdAndUpdate(id, datos, { new: true });
}

/**
 * Elimina un país de la base de datos por su ID.
 */
export async function eliminarPais(id) {
  return await Pais.findByIdAndDelete(id);
}

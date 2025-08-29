// src/database.mjs

import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Usamos una variable de entorno para la URI de conexión a la base de datos
// Esto es una buena práctica para no exponer datos sensibles directamente en el código
// Asegúrate de que tu archivo .env contenga una línea como esta:
// MONGODB_URI=mongodb://127.0.0.1:27017/nombre_de_tu_db
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Conecta a la base de datos de MongoDB.
 */
const connectDB = async () => {
  try {
    // Intentamos conectar usando la URI proporcionada
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión a la base de datos exitosa.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    // Salimos del proceso si la conexión falla
    process.exit(1);
  }
};

// Exportamos la función para poder usarla en app.mjs
export default connectDB;
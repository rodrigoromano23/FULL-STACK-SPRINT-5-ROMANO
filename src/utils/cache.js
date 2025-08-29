// utils/cache.js
let cache = {
  paises: null,
  expiracion: null,
};

const DURACION_CACHE_MS = 1000 * 60 * 60 * 6; // 6 horas

export const obtenerPaisesConCache = async (callback) => {
  const ahora = Date.now();

  if (cache.paises && cache.expiracion > ahora) {
    // ⚡ Retornar cache si aún es válido
    console.log("Cache activo, retornando datos en memoria");
    return cache.paises;
  }

  // Cache vacío o expirado → llamar al callback para obtener datos
  console.log("Cache expirado, llamando a la API/DB");
  const paises = await callback();

  cache.paises = paises;
  cache.expiracion = ahora + DURACION_CACHE_MS;

  return paises;
};


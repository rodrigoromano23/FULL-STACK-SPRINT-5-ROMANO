

//---- nuevo -------------
// /src/utils/apiClient.mjs
import fetch from "node-fetch";


 // Obtener todos los países de América que hablen español
 
export async function fetchPaisesAmerica() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/region/america");
    const data = await res.json();

    // Filtrar solo los que tienen idioma español
    const paisesEsp = data.filter(
      (pais) => pais.languages && pais.languages.spa
    );

    // Limpiar y adaptar propiedades al modelo Pais
    const paisesLimpios = paisesEsp.map((pais) => ({
      nameOfficial: pais.name?.official || pais.name?.common, // igual que en el modelo
      capital: pais.capital ? pais.capital[0] : "N/A",
      borders: pais.borders || [],
      area: pais.area || 0,
      population: pais.population || 0,
      gini: pais.gini ? Object.values(pais.gini)[0] : null,
      timezone: pais.timezones ? pais.timezones[0] : "N/A", // tu modelo espera un string, no array
      creador: "ROMANO_2025", // puedes poner un valor por defecto
    }));

    return paisesLimpios;
  } catch (error) {
    console.error("Error al obtener países:", error);
    throw error;
  }
}
//-----------------------------------------------------



//_------------------------------------------------------
//-------------------------------------------------------
//--------------------------------------------------------
// controllers/paisesController.mjs
import fetch from "node-fetch"; // npm i node-fetch
//import Pais from "../models/Pais.mjs";
import { Pais } from "../models/Elemento.mjs";
//import { SuperHero } from "../models/Elemento.mjs";
import axios from "axios";
//ruta del cache
import { obtenerPaisesConCache } from "../utils/cache.js";
// luego tus funciones de CRUD de superhéroes
// para el gini------------------------------------
import NodeCache from "node-cache";
// luego tus funciones como importarPaisesController, dashboardController, etc.
import IndiceGini from "../models/IndiceGini.mjs";

// Nombre del creador
//const CREADOR = "Romano Rodrigo";

/* ============================================================
   Helpers
============================================================ */
// utils/limpiarPais.mjs






// 🔹 Función utilitaria para limpiar un país
const limpiarPais = (pais) => ({
  nameOfficial: pais.name.official,
  capital: pais.capital ? pais.capital[0] : "Sin capital",
  borders: pais.borders || [],
  area: pais.area || 0,
  population: pais.population || 0,
  gini: pais.gini ? Object.values(pais.gini)[0] : null,
  timezone: pais.timezones ? pais.timezones[0] : "Sin timezone",
  creador: CREADOR
});

// 🔹 Importar países hispanohablantes y guardarlos en Mongo
const API_URL = "https://restcountries.com/v3.1/region/america";
const CREADOR = "ROMANO"; // 👈 ajusta si necesitas

// Función auxiliar: importar países hispanohablantes
export const importarPaises = async () => {
  const response = await axios.get(API_URL);
  const paisesApi = response.data;

  // Filtrar países que tienen "spa" en sus lenguajes
  const paisesHispanos = paisesApi.filter(
    (p) => p.languages && p.languages.spa
  );

  let count = 0;

  for (const p of paisesHispanos) {
    // Evitar duplicados
    const existe = await Pais.findOne({ nameOfficial: p.name.official, creador: CREADOR });
    if (!existe) {
      await Pais.create({
        creador: CREADOR,
        nameOfficial: p.name.official,
        capital: p.capital ? p.capital[0] : "Sin capital",
        borders: p.borders || [],
        area: p.area || 0,
        population: p.population || 0,
        gini: p.gini ? Object.values(p.gini)[0] : null,
        timezones: p.timezones || ["Sin timezone"]
      });
      count++;
    }
  }

  return count;
};

// -------------------- Controladores --------------------

// ✅ Para importar manualmente
export const importarPaisesController = async (req, res, next) => {
  try {
    const cantidad = await importarPaises();
    res.send(`Se importaron ${cantidad} países correctamente para ${CREADOR}.`);
  } catch (err) {
    next(err);
  }
};


/* ============================================================
   Dashboard Controllers
============================================================ */

export const dashboardController = async (req, res, next) => {
  try {
    const paginaActual = parseInt(req.query.page) || 1;
    const limite = 4; // cantidad de paises por página

    // ⚡ Obtenemos los paises con cache
    let paises = await obtenerPaisesConCache(async () => {
      // traer desde MongoDB y convertir a array plano
      const resultado = await Pais.find({ creador: "ROMANO" }).lean();
      return resultado || [];
    });

    // filtrar por búsqueda si viene
    if (req.query.nombre) {
      const nombre = req.query.nombre;
      paises = paises.filter((p) =>
        p.nameOfficial.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    // total de páginas
    const totalPaises = paises.length;
    const totalPaginas = Math.ceil(totalPaises / limite);

    // paginación
    const inicio = (paginaActual - 1) * limite;
    const fin = paginaActual * limite;
    const paisesPaginados = paises.slice(inicio, fin);

    res.render("dashboard", {
      title: "Dashboard",
      paises: paisesPaginados,
      currentPage: paginaActual,
      totalPaginas,
    });
  } catch (err) {
    next(err);
  }
};


// POST /dashboard/agregar


// POST /dashboard/agregar
export const agregarPaisController = async (req, res, next) => {
  try {
    const { nameOfficial, capital, borders, area, population, gini, timezone } = req.body;

    const nuevoPais = new Pais({
      nameOfficial,
      capital: capital ? capital.split(",").map(c => c.trim()) : [],
      borders: borders ? borders.split(",").map(b => b.trim()) : [],
      area: Number(area) || 0,
      population: Number(population) || 0,
      gini: gini === "" ? null : Number(gini),
      timezones: timezone ? timezone.split(",").map(t => t.trim()) : [],
      creador: CREADOR
    });

    await nuevoPais.save();

    res.redirect("/paises/dashboard");
  } catch (err) {
    if (err.name === "ValidationError") {
      // Recolecto errores amigables
      const errores = {};
      for (const campo in err.errors) {
        errores[campo] = err.errors[campo].message;
      }

      return res.render("agregarPais", { 
        title: "Agregar País",
        errores,
        datos: req.body   // 👈 conserva lo escrito
      });
    }
    next(err);
  }
};


// POST /paises/editar/:id
export const editarPaisController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nameOfficial, capital, borders, area, population, gini, timezones } = req.body;

    const update = {
      nameOfficial: nameOfficial?.trim(),
      capital: capital ? capital.split(",").map(c => c.trim()) : [],
      borders: borders ? borders.split(",").map(s => s.trim()).filter(Boolean) : [],
      area: Number(area) || 0,
      population: Number(population) || 0,
      gini: gini === "" ? null : Number(gini),
      timezones: timezones ? timezones.split(",").map(s => s.trim()).filter(Boolean) : ["Sin timezone"],
      creador: CREADOR
    };

    await Pais.findOneAndUpdate(
      { _id: id, creador: CREADOR },
      update,
      { new: true, runValidators: true } // 👈 IMPORTANTE: aplica validaciones
    );

    res.redirect("/dashboard");
  } catch (err) {
    if (err.name === "ValidationError") {
      const errores = {};
      for (const campo in err.errors) {
        errores[campo] = err.errors[campo].message;
      }

      return res.render("editarPais", { 
        title: "Editar País",
        errores,
        pais: { ...req.body, _id: req.params.id } // 👈 conserva valores previos
      });
    }
    next(err);
  }
};

// POST /dashboard/eliminar/:id
export const eliminarPaisController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Pais.findByIdAndDelete(id);
    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
};

// POST /dashboard/buscar


//-------------funcion buscarpais controller-----------------------



export const buscarPaisesController = async (req, res, next) => {
  try {
    const { name, capital, borders, region, minPopulation, maxPopulation } = req.query;

    let filtro = {};

    if (name) {
      filtro.nameOfficial = { $regex: name, $options: "i" };
    }
    if (capital) {
      filtro.capital = { $regex: capital, $options: "i" };
    }
    if (borders) {
      filtro.borders = { $regex: borders, $options: "i" };
    }
    if (region) {
      filtro.region = { $regex: region, $options: "i" };
    }
    if (minPopulation || maxPopulation) {
      filtro.population = {};
      if (minPopulation) filtro.population.$gte = Number(minPopulation);
      if (maxPopulation) filtro.population.$lte = Number(maxPopulation);
    }

    const paises = await Pais.find(filtro);

    res.render("resultado", { paises, title: "Resultados de búsqueda" });
  } catch (err) {
    next(err);
  }
};


// ----inicio-----------------

export const mostrarLandingController = (req, res) => {
    res.render("landing", { title: "Bienvenido" }); // nombre del archivo EJS sin extensión
};

//-------------funsion render-----------------------
//-------------------------------------------------

export const renderAgregarPaisController = (req, res, next) => {
  try {
    res.render('agregarPais', { 
      title: 'Agregar País', 
      datos: {},        
      errores: {}       
    });
  } catch (err) {
    next(err);
  }
};
//------------------------------------------------------------------------
//renderpaiseditar----------------------------------------------------
// GET /paises/editar/:id  -> Renderiza el formulario con los datos actuales
/*export const renderEditarPaisController = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Busco SOLO mis países (creador: ROMANO)
    const pais = await Pais.findOne({ _id: id, creador: CREADOR });
    if (!pais) return res.status(404).send("País no encontrado");

    res.render("editarPais", { title: "Editar País", pais });
  } catch (err) {
    next(err);
  }
};*/
export const renderEditarPaisController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Busco SOLO mis países (creador: ROMANO)
    const pais = await Pais.findOne({ _id: id, creador: CREADOR }).lean();
    if (!pais) return res.status(404).send("País no encontrado");

    // Si se pasó por errores, pasarlos; si no, vacíos
    res.render("editarPais", { 
      title: "Editar País", 
      pais, 
      datos: {}, 
      errores: {} 
    });
  } catch (err) {
    next(err);
  }
};

//-------------------------------------------------------------
//-------------------------------------------------------------
//gini---------------------------------------------------------
const cache = new NodeCache({ stdTTL: 3600 }); // cache 1 hora


export const acercaController = async (req, res, next) => {
  try {
    const paisesGini = await IndiceGini.find({ creador: "Romano Rodrigo" }).lean();
    res.render("acerca", { title: 'paisesGini' });
  } catch (err) {
    next(err);
  }
};
//----------ginixaño-----------------------------


// datos gini---------------------------------------------
//---------------------------------------------------------
export const importarDatosGini = async (req, res, next) => {
  try {
    // Traemos todos los países
    const paises = await Pais.find({}, "nameOfficial gini population").lean();

    // Evitamos duplicados y normalizamos datos
    const labels = [];
    const giniData = [];
    const populationData = [];
    const seen = new Set();

    paises.forEach(p => {
      const name = p.nameOfficial || "Desconocido";
      if (p.gini != null && !seen.has(name)) {
        labels.push(name);
        giniData.push(Number(p.gini));         // Forzamos número
        populationData.push(Number(p.population) || 0);
        seen.add(name);
      }
    });

    // Log para depuración
    console.log({ labels, giniData, populationData });

    res.render("acerca", {
      title: "Acerca de Proyecto",
      labels,
      giniData,
      populationData
    });
  } catch (err) {
    next(err);
  }
};

//---exportar CSV----------------------------------
//---------------------------------------------------

export const exportarCSV = async (req, res, next) => {
  try {
    // Obtenemos filtros desde la query, si los hay
    const filtros = {};

    // Ejemplo: filtro por región o nombre (puedes ajustarlo según tu app)
    if(req.query.region) filtros.region = req.query.region;
    if(req.query.name) filtros.nameOfficial = { $regex: req.query.name, $options: 'i' };

    // Traemos los datos filtrados
    const paises = await Pais.find(filtros, "nameOfficial gini population").lean();

    // Convertimos a CSV
    const fields = ["nameOfficial", "gini", "population"];
    const parser = new Parser({ fields });
    const csv = parser.parse(paises);

    // Configuramos cabeceras para descarga
    res.header('Content-Type', 'text/csv');
    res.attachment('paises_filtrados.csv');
    return res.send(csv);

  } catch(err) {
    next(err);
  }
};














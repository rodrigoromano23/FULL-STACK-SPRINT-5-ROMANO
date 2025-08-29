/*// src/routes/paisesRoutes.mjs*/

import express from "express";
import {
  dashboardController,
  agregarPaisController,
  editarPaisController,
  eliminarPaisController,
  importarPaisesController,
  buscarPaisesController,
  mostrarLandingController,
  renderAgregarPaisController,
  renderEditarPaisController,
  importarDatosGini,
  exportarCSV
  
} from "../controllers/paisesController.mjs";

//import { getGiniPorAnio } from "../controllers/paisesController.mjs";

const router = express.Router();

// -------------------- Rutas API --------------------
/*router.get("/inicializar-datos", inicializarDatos);
router.get("/paises", getPaises);
router.post("/paises/agregar", agregarPais);
router.post("/paises/editar/:id", editarPais);
router.post("/paises/eliminar/:id", eliminarPais);*/

// -------------------- Rutas Vistas --------------------
router.get("/", mostrarLandingController);
router.get("/dashboard", dashboardController);
router.get("/importar", importarPaisesController);
router.get('/paises/agregar', renderAgregarPaisController);
router.post("/paises/agregar", agregarPaisController);
router.post("/paises/editar/:id", editarPaisController);
router.get("/paises/editar/:id", renderEditarPaisController);
router.get("/eliminar/:id", eliminarPaisController);
router.get("/paises/buscar", buscarPaisesController);

router.get("/acerca/gini", importarDatosGini);
// Nueva ruta para datos del gráfico
router.get("/exportar-csv", exportarCSV);

export default router;



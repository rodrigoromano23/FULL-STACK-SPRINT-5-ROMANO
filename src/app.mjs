
import express from "express";
import expressLayouts from "express-ejs-layouts";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./database.mjs";
import paisesRoutes from "./routes/paisesRoutes.mjs";
//import indexRoutes from "./routes/index.mjs"; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de EJS y layouts (antes de las rutas)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Middleware para datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Conexión a MongoDB
connectDB()
  .then(() => console.log("✅ Conexión a MongoDB exitosa"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas principales
app.use("/", paisesRoutes); // raíz para landing / países
// app.use("/", indexRoutes); // si quieres rutas adicionales

// 404 - Página no encontrada
app.use((req, res) => {
  res.status(404).render("404", { title: "Página no encontrada" });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express funcionando en http://localhost:${PORT}`);
});





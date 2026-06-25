import express from "express";
import cors from "cors";
import { pool } from "./config/db";
import { initDb } from "./config/initDb";
import authRoutes from "./routes/authRoutes";
import recursoReadRoutes from "./routes/recursoReadRoutes";
import recursoCreateRoutes from "./routes/recursoCreateRoutes";
import recursoUpdateRoutes from "./routes/recursoUpdateRoutes";
import recursoDeleteRoutes from "./routes/recursoDeleteRoutes";
import reservaCreateRoutes from "./routes/reservaCreateRoutes";
import reservaReadRoutes from "./routes/reservaReadRoutes";
import reservaUpdateRoutes from "./routes/reservaUpdateRoutes";
import reservaDeleteRoutes from "./routes/reservaDeleteRoutes";

const API_PREFIX = process.env.API_PREFIX || "/api";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/recursos/leer`, recursoReadRoutes);
app.use(`${API_PREFIX}/recursos/crear`, recursoCreateRoutes);
app.use(`${API_PREFIX}/recursos/actualizar`, recursoUpdateRoutes);
app.use(`${API_PREFIX}/recursos/eliminar`, recursoDeleteRoutes);
app.use(`${API_PREFIX}/reservas/crear`, reservaCreateRoutes);
app.use(`${API_PREFIX}/reservas/leer`, reservaReadRoutes);
app.use(`${API_PREFIX}/reservas/actualizar`, reservaUpdateRoutes);
app.use(`${API_PREFIX}/reservas/eliminar`, reservaDeleteRoutes);

initDb().catch((error) => {
  console.error("Error inicializando la base de datos:", error);
});

app.get(`${API_PREFIX}`, async (_req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("ERROR COMPLETO:", error);

    res.status(500).json({
      error: String(error),
    });
  }
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = Number(process.env.PORT || 3000);

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`- GET    http://localhost:${PORT}${API_PREFIX}/recursos/leer`);
    console.log(`- POST   http://localhost:${PORT}${API_PREFIX}/recursos/crear`);
    console.log(`- PUT    http://localhost:${PORT}${API_PREFIX}/recursos/actualizar`);
    console.log(`- PATCH  http://localhost:${PORT}${API_PREFIX}/recursos/actualizar`);
    console.log(`- DELETE http://localhost:${PORT}${API_PREFIX}/recursos/eliminar`);
  });
}
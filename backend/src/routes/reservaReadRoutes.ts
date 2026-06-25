import { Router } from "express";
import { autenticarJWT } from "../middlewares/authMiddleware";
import {
  obtenerReservas,
  obtenerHistorialReservas,
  disponibilidadRecurso,
} from "../controllers/reservaController";

const router = Router();

router.get("/", autenticarJWT, obtenerReservas);
router.get("/historial", autenticarJWT, obtenerHistorialReservas);
router.get("/disponibilidad", autenticarJWT, disponibilidadRecurso);

export default router;

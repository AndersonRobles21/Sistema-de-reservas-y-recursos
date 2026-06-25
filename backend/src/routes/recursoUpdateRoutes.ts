import { Router } from "express";
import { autenticarJWT, requireAdmin } from "../middlewares/authMiddleware";
import { actualizarRecurso } from "../controllers/recursoController";

const router = Router();

router.put("/", autenticarJWT, requireAdmin, actualizarRecurso);
router.patch("/", autenticarJWT, requireAdmin, actualizarRecurso);

export default router;

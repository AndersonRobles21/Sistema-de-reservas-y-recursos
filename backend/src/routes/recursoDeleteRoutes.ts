import { Router } from "express";
import { autenticarJWT, requireAdmin } from "../middlewares/authMiddleware";
import { eliminarRecurso } from "../controllers/recursoController";

const router = Router();

router.delete("/", autenticarJWT, requireAdmin, eliminarRecurso);

export default router;

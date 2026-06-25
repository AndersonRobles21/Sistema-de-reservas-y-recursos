import { Router } from "express";
import { autenticarJWT, requireAdmin } from "../middlewares/authMiddleware";
import { crearRecurso } from "../controllers/recursoController";

const router = Router();

router.post("/", autenticarJWT, requireAdmin, crearRecurso);

export default router;

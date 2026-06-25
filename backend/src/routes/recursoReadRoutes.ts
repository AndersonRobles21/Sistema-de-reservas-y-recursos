import { Router } from "express";
import { obtenerRecursos } from "../controllers/recursoController";

const router = Router();

router.get("/", obtenerRecursos);

export default router;

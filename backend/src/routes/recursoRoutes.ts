import { Router } from "express";
import { obtenerRecursos,
  crearRecurso
} from "../controllers/recursoController";

const router = Router();

router.get("/", obtenerRecursos);
router.post("/", crearRecurso);

export default router;
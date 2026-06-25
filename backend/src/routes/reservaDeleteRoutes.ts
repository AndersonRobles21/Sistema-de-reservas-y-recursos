import { Router } from "express";
import { autenticarJWT } from "../middlewares/authMiddleware";
import { cancelarReserva } from "../controllers/reservaController";

const router = Router();

router.delete("/", autenticarJWT, cancelarReserva);

export default router;

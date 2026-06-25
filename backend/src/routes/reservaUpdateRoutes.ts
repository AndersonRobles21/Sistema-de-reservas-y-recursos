import { Router } from "express";
import { autenticarJWT } from "../middlewares/authMiddleware";
import { modificarReserva } from "../controllers/reservaController";

const router = Router();

router.patch("/", autenticarJWT, modificarReserva);

export default router;

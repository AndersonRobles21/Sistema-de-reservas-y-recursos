import { Router } from "express";
import { autenticarJWT } from "../middlewares/authMiddleware";
import { crearReserva } from "../controllers/reservaController";

const router = Router();

router.post("/", autenticarJWT, crearReserva);

export default router;

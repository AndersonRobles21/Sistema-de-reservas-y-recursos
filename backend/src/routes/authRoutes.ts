import { Router } from "express";
import { loginUsuario, registrarUsuario } from "../controllers/authController";

const router = Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

export default router;

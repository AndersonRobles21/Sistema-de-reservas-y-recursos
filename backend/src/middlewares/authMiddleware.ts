import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret123";

export interface UsuarioAutenticado {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioAutenticado;
    }
  }
}

export function autenticarJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ mensaje: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as UsuarioAutenticado;
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as UsuarioAutenticado | undefined;

  if (!user || user.role !== "admin") {
    res.status(403).json({ mensaje: "Acceso denegado" });
    return;
  }

  next();
}

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret123";

export async function registrarUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, password, role } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ mensaje: "Datos incompletos" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuarioRole = role === "admin" ? "admin" : "usuario";

    const resultado = await pool.query(
      `INSERT INTO cba_usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo AS email, rol AS role`,
      [nombre, email, passwordHash, usuarioRole]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error && error.message.includes("duplicate key value")) {
      res.status(409).json({ mensaje: "El correo ya está registrado" });
      return;
    }

    res.status(500).json({ mensaje: "No se pudo registrar el usuario" });
  }
}

export async function loginUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ mensaje: "Email y password son obligatorios" });
      return;
    }

    const usuario = await pool.query(
      `SELECT id, nombre, correo AS email, password, rol AS role FROM cba_usuarios WHERE correo = $1`,
      [email]
    );

    if (usuario.rowCount === 0) {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
      return;
    }

    const usuarioData = usuario.rows[0];
    const passwordMatch = await bcrypt.compare(password, usuarioData.password);

    if (!passwordMatch) {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: usuarioData.id, email: usuarioData.email, role: usuarioData.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ token, usuario: { id: usuarioData.id, nombre: usuarioData.nombre, email: usuarioData.email, role: usuarioData.role } });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en autenticación" });
  }
}

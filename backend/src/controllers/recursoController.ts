import { Request, Response } from "express";
import { pool } from "../config/db";

export async function crearRecurso(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { nombre, descripcion, capacidad } = req.body;

    const resultado = await pool.query(
      `
      INSERT INTO cba_recursos
      (nombre, descripcion, capacidad)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [nombre, descripcion, capacidad]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear recurso",
    });
  }
}

export async function obtenerRecursos(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const resultado = await pool.query(`SELECT * FROM cba_recursos`);

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener recursos",
    });
  }
}

export async function actualizarRecurso(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id, nombre, descripcion, capacidad } = req.body;

    if (!id) {
      res.status(400).json({ mensaje: "El id del recurso es obligatorio" });
      return;
    }

    const resultado = await pool.query(
      `
      UPDATE cba_recursos
      SET nombre = $1, descripcion = $2, capacidad = $3
      WHERE id = $4
      RETURNING *
      `,
      [nombre, descripcion, capacidad, id]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Recurso no encontrado" });
      return;
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar recurso",
    });
  }
}

export async function eliminarRecurso(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ mensaje: "El id del recurso es obligatorio" });
      return;
    }

    const resultado = await pool.query(
      `DELETE FROM cba_recursos WHERE id = $1`,
      [id]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ mensaje: "Recurso no encontrado" });
      return;
    }

    res.status(200).json({ mensaje: "Recurso eliminado" });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar recurso",
    });
  }
}
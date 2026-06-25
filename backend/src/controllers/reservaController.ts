import { Request, Response } from "express";
import { pool } from "../config/db";
import { UsuarioAutenticado } from "../middlewares/authMiddleware";

async function obtenerHorarioId(horaInicio: string, horaFin: string): Promise<string> {
  const seleccion = await pool.query(
    `SELECT id FROM cba_horarios WHERE hora_inicio = $1 AND hora_fin = $2 LIMIT 1`,
    [horaInicio, horaFin]
  );

  if (seleccion.rowCount && seleccion.rowCount > 0) {
    return seleccion.rows[0].id;
  }

  const insercion = await pool.query(
    `INSERT INTO cba_horarios (hora_inicio, hora_fin) VALUES ($1, $2) RETURNING id`,
    [horaInicio, horaFin]
  );

  return insercion.rows[0].id;
}

function validarConflicto(
  recursoId: string,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  reservaId?: string
): Promise<boolean> {
  const consulta = `
    SELECT 1 FROM cba_reservas r
    JOIN cba_horarios h ON h.id = r.horario_id
    WHERE r.recurso_id = $1
      AND r.fecha = $2
      AND r.estado = 'activa'
      AND (h.hora_inicio < $4 AND h.hora_fin > $3)
      ${reservaId ? "AND r.id <> $5" : ""}
    LIMIT 1
  `;

  const valores = reservaId
    ? [recursoId, fecha, horaInicio, horaFin, reservaId]
    : [recursoId, fecha, horaInicio, horaFin];

  return pool
    .query(consulta, valores)
    .then((resultado) => {
      const rowCount = resultado?.rowCount ?? 0;
      return rowCount > 0;
    });
}

export async function crearReserva(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as UsuarioAutenticado;
    const { recurso_id, fecha, hora_inicio, hora_fin } = req.body;

    if (!recurso_id || !fecha || !hora_inicio || !hora_fin) {
      res.status(400).json({ mensaje: "Datos de reserva incompletos" });
      return;
    }

    if (hora_inicio >= hora_fin) {
      res.status(400).json({ mensaje: "La hora de inicio debe ser anterior a la hora de fin" });
      return;
    }

    const horarioId = await obtenerHorarioId(hora_inicio, hora_fin);
    const conflicto = await validarConflicto(recurso_id, fecha, hora_inicio, hora_fin);
    if (conflicto) {
      res.status(409).json({ mensaje: "El recurso ya está reservado en ese horario" });
      return;
    }

    const resultado = await pool.query(
      `INSERT INTO cba_reservas
        (recurso_id, usuario_id, horario_id, fecha, estado)
       VALUES ($1, $2, $3, $4, 'activa')
       RETURNING *`,
      [recurso_id, user.id, horarioId, fecha]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear reserva" });
  }
}

export async function obtenerReservas(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as UsuarioAutenticado;
    const esAdmin = user.role === "admin";
    const consulta = esAdmin
      ? `SELECT r.*, u.nombre AS usuario_nombre, rec.nombre AS recurso_nombre, h.hora_inicio, h.hora_fin
         FROM cba_reservas r
         JOIN cba_usuarios u ON u.id = r.usuario_id
         JOIN cba_recursos rec ON rec.id = r.recurso_id
         JOIN cba_horarios h ON h.id = r.horario_id
         WHERE r.estado = 'activa'
         ORDER BY r.fecha, h.hora_inicio`
      : `SELECT r.*, u.nombre AS usuario_nombre, rec.nombre AS recurso_nombre, h.hora_inicio, h.hora_fin
         FROM cba_reservas r
         JOIN cba_usuarios u ON u.id = r.usuario_id
         JOIN cba_recursos rec ON rec.id = r.recurso_id
         JOIN cba_horarios h ON h.id = r.horario_id
         WHERE r.estado = 'activa' AND r.usuario_id = $1
         ORDER BY r.fecha, h.hora_inicio`;

    const resultado = esAdmin
      ? await pool.query(consulta)
      : await pool.query(consulta, [user.id]);

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener reservas" });
  }
}

export async function obtenerHistorialReservas(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as UsuarioAutenticado;
    const esAdmin = user.role === "admin";
    const consulta = esAdmin
      ? `SELECT r.*, u.nombre AS usuario_nombre, rec.nombre AS recurso_nombre, h.hora_inicio, h.hora_fin
         FROM cba_reservas r
         JOIN cba_usuarios u ON u.id = r.usuario_id
         JOIN cba_recursos rec ON rec.id = r.recurso_id
         JOIN cba_horarios h ON h.id = r.horario_id
         ORDER BY r.created_at DESC`
      : `SELECT r.*, u.nombre AS usuario_nombre, rec.nombre AS recurso_nombre, h.hora_inicio, h.hora_fin
         FROM cba_reservas r
         JOIN cba_usuarios u ON u.id = r.usuario_id
         JOIN cba_recursos rec ON rec.id = r.recurso_id
         JOIN cba_horarios h ON h.id = r.horario_id
         WHERE r.usuario_id = $1
         ORDER BY r.created_at DESC`; 

    const resultado = esAdmin
      ? await pool.query(consulta)
      : await pool.query(consulta, [user.id]);

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener historial de reservas" });
  }
}

export async function disponibilidadRecurso(req: Request, res: Response): Promise<void> {
  try {
    const { recurso_id, fecha } = req.query;

    if (!recurso_id || !fecha) {
      res.status(400).json({ mensaje: "Recurso y fecha son obligatorios" });
      return;
    }

    const resultado = await pool.query(
      `SELECT h.hora_inicio, h.hora_fin
       FROM cba_reservas r
       JOIN cba_horarios h ON h.id = r.horario_id
       WHERE r.recurso_id = $1 AND r.fecha = $2 AND r.estado = 'activa'
       ORDER BY h.hora_inicio`,
      [String(recurso_id), String(fecha)]
    );

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener disponibilidad" });
  }
}

export async function modificarReserva(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as UsuarioAutenticado;
    const { id, recurso_id, horario_id, fecha } = req.body;

    if (!id || !recurso_id || !horario_id || !fecha) {
      res.status(400).json({ mensaje: "Datos de reserva incompletos" });
      return;
    }

    const reserva = await pool.query(`SELECT usuario_id FROM cba_reservas WHERE id = $1`, [String(id)]);
    if (reserva.rowCount === 0) {
      res.status(404).json({ mensaje: "Reserva no encontrada" });
      return;
    }

    const puedeModificar = user.role === "admin" || reserva.rows[0].usuario_id === user.id;
    if (!puedeModificar) {
      res.status(403).json({ mensaje: "No autorizado para modificar esta reserva" });
      return;
    }

    const conflicto = await validarConflicto(String(recurso_id), fecha, String(horario_id), String(id));
    if (conflicto) {
      res.status(409).json({ mensaje: "El recurso ya está reservado en ese horario" });
      return;
    }

    const resultado = await pool.query(
      `UPDATE cba_reservas
       SET recurso_id = $1, horario_id = $2, fecha = $3
       WHERE id = $4
       RETURNING *`,
      [recurso_id, horario_id, fecha, String(id)]
    );

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al modificar reserva" });
  }
}

export async function cancelarReserva(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as UsuarioAutenticado;
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ mensaje: "El id de la reserva es obligatorio" });
      return;
    }

    const reserva = await pool.query(`SELECT usuario_id FROM cba_reservas WHERE id = $1`, [String(id)]);
    if (reserva.rowCount === 0) {
      res.status(404).json({ mensaje: "Reserva no encontrada" });
      return;
    }

    const puedeCancelar = user.role === "admin" || reserva.rows[0].usuario_id === user.id;
    if (!puedeCancelar) {
      res.status(403).json({ mensaje: "No autorizado para cancelar esta reserva" });
      return;
    }

    await pool.query(`UPDATE cba_reservas SET estado = 'cancelado' WHERE id = $1`, [String(id)]);
    res.status(200).json({ mensaje: "Reserva cancelada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cancelar reserva" });
  }
}

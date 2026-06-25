import { pool } from "./db";

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_usuarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre VARCHAR(100) NOT NULL,
      correo VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_recursos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre VARCHAR(200) NOT NULL,
      descripcion TEXT,
      capacidad INTEGER,
      estado VARCHAR(50) NOT NULL DEFAULT 'disponible'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_horarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cba_reservas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      usuario_id UUID NOT NULL REFERENCES cba_usuarios(id) ON DELETE CASCADE,
      recurso_id UUID NOT NULL REFERENCES cba_recursos(id) ON DELETE CASCADE,
      horario_id UUID NOT NULL REFERENCES cba_horarios(id) ON DELETE CASCADE,
      fecha DATE NOT NULL,
      estado VARCHAR(20) NOT NULL DEFAULT 'activa',
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `);
}

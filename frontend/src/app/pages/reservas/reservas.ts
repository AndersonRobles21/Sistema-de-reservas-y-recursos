import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiBaseUrl;

export interface Recurso {
  id?: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
}

export interface Reserva {
  id?: string;
  recurso_id: string;
  recurso_nombre?: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  descripcion?: string;
  usuario_nombre?: string;
}

@Component({
  standalone: true,
  selector: 'app-reservas',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css'],
})
export class ReservasComponent {
  recursos: Recurso[] = [];
  reservas: Reserva[] = [];
  historial: Reserva[] = [];
  recurso_id = '';
  fecha = '';
  hora_inicio = '09:00';
  hora_fin = '10:00';
  descripcion = '';
  editId: string | null = null;
  errorMessage = '';
  isLoading = false;
  token = '';

  constructor() {
    this.token = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? window.localStorage.getItem('token') ?? ''
      : '';
    this.cargarRecursos();
    this.cargarReservas();
  }

  get isEditing(): boolean {
    return this.editId !== null;
  }

  get authHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async cargarRecursos(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await fetch(`${API_BASE}/recursos/leer`);
      if (!response.ok) throw new Error('No se pudo cargar recursos');
      this.recursos = await response.json();
    } catch (error) {
      this.errorMessage = String(error);
    } finally {
      this.isLoading = false;
    }
  }

  async cargarReservas(): Promise<void> {
    if (!this.token) return;
    this.isLoading = true;
    try {
      const response = await fetch(`${API_BASE}/reservas/leer`, {
        headers: this.authHeaders,
      });
      if (!response.ok) throw new Error('No se pudo cargar reservas');
      this.reservas = await response.json();
      const historialResponse = await fetch(`${API_BASE}/reservas/historial`, {
        headers: this.authHeaders,
      });
      if (!historialResponse.ok) throw new Error('No se pudo cargar historial');
      this.historial = await historialResponse.json();
    } catch (error) {
      this.errorMessage = String(error);
    } finally {
      this.isLoading = false;
    }
  }

  prepararEdicion(reserva: Reserva): void {
    this.editId = reserva.id ?? null;
    this.recurso_id = reserva.recurso_id;
    this.fecha = reserva.fecha;
    this.hora_inicio = reserva.hora_inicio;
    this.hora_fin = reserva.hora_fin;
    this.descripcion = reserva.descripcion ?? '';
    this.errorMessage = '';
  }

  async guardarReserva(): Promise<void> {
    if (!this.token) {
      this.errorMessage = 'Debe iniciar sesión para reservar.';
      return;
    }

    if (!this.recurso_id || !this.fecha || !this.hora_inicio || !this.hora_fin) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.hora_inicio >= this.hora_fin) {
      this.errorMessage = 'La hora de inicio debe ser anterior a la hora de fin';
      return;
    }

    const payload = {
      id: this.editId,
      recurso_id: this.recurso_id,
      fecha: this.fecha,
      hora_inicio: this.hora_inicio,
      hora_fin: this.hora_fin,
      descripcion: this.descripcion,
    };
    const url = this.isEditing ? `${API_BASE}/reservas/actualizar` : `${API_BASE}/reservas/crear`;
    const method = this.isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: this.authHeaders,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.mensaje || 'Error guardando la reserva');
      }
      await this.cargarReservas();
      this.resetForm();
    } catch (error) {
      this.errorMessage = String(error);
    }
  }

  async eliminarReserva(id: string | undefined): Promise<void> {
    if (!id || !confirm('¿Cancelar esta reserva?')) return;
    this.errorMessage = '';
    try {
      const response = await fetch(`${API_BASE}/reservas/eliminar`, {
        method: 'DELETE',
        headers: this.authHeaders,
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.mensaje || 'Error cancelando la reserva');
      }
      await this.cargarReservas();
      if (this.editId === id) this.resetForm();
    } catch (error) {
      this.errorMessage = String(error);
    }
  }

  async verDisponibilidad(): Promise<void> {
    if (!this.recurso_id || !this.fecha) return;
    try {
      const response = await fetch(
        `${API_BASE}/reservas/disponibilidad?recurso_id=${this.recurso_id}&fecha=${this.fecha}`,
        { headers: this.authHeaders }
      );
      if (!response.ok) throw new Error('Error consultando disponibilidad');
      const bloqueos = await response.json();
      alert(
        bloqueos.length > 0
          ? `Horarios ocupados: ${bloqueos.map((item: any) => `${item.hora_inicio} - ${item.hora_fin}`).join(', ')}`
          : 'No hay reservas para ese recurso en la fecha seleccionada.'
      );
    } catch (error) {
      this.errorMessage = String(error);
    }
  }

  resetForm(): void {
    this.editId = null;
    this.recurso_id = '';
    this.fecha = '';
    this.hora_inicio = '09:00';
    this.hora_fin = '10:00';
    this.descripcion = '';
    this.errorMessage = '';
  }
}

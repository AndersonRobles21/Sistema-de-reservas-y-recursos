import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiBaseUrl}/recursos`;

export interface Recurso {
  id?: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
}

@Component({
  standalone: true,
  selector: 'app-recursos',
  imports: [CommonModule, FormsModule],
  templateUrl: './recursos.html',
  styleUrls: ['./recursos.css'],
})
export class RecursosComponent {
  recursos: Recurso[] = [];
  nombre = '';
  descripcion = '';
  capacidad = 1;
  editId: string | null = null;
  errorMessage = '';
  isLoading = false;
  token = '';
  userRole = '';

  constructor() {
    this.token = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? window.localStorage.getItem('token') ?? ''
      : '';
    const user = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? window.localStorage.getItem('user')
      : null;
    this.userRole = user ? JSON.parse(user).role : '';
    this.cargarRecursos();
  }

  get isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  get authHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  get isEditing(): boolean {
    return this.editId !== null;
  }

  async cargarRecursos(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const response = await fetch(`${API_BASE}/leer`);
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de recursos');
      }
      this.recursos = await response.json();
    } catch (error) {
      this.errorMessage = String(error);
    } finally {
      this.isLoading = false;
    }
  }

  prepararEdicion(recurso: Recurso): void {
    this.editId = recurso.id ?? null;
    this.nombre = recurso.nombre;
    this.descripcion = recurso.descripcion;
    this.capacidad = recurso.capacidad;
    this.errorMessage = '';
  }

  async guardarRecurso(): Promise<void> {
    this.errorMessage = '';

    if (!this.nombre || !this.descripcion || this.capacidad <= 0) {
      this.errorMessage = 'Todos los campos son obligatorios y la capacidad debe ser mayor que 0.';
      return;
    }

    const payload = {
      id: this.editId,
      nombre: this.nombre,
      descripcion: this.descripcion,
      capacidad: this.capacidad,
    };

    const url = this.isEditing ? `${API_BASE}/actualizar` : `${API_BASE}/crear`;
    const method = this.isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: this.authHeaders,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar el recurso.');
      }

      await this.cargarRecursos();
      this.resetForm();
    } catch (error) {
      this.errorMessage = String(error);
    }
  }

  async eliminarRecurso(id: string | undefined): Promise<void> {
    if (!id || !confirm('¿Eliminar este recurso?')) {
      return;
    }

    this.errorMessage = '';

    try {
      const response = await fetch(`${API_BASE}/eliminar`, {
        method: 'DELETE',
        headers: this.authHeaders,
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el recurso.');
      }

      await this.cargarRecursos();
      if (this.editId === id) {
        this.resetForm();
      }
    } catch (error) {
      this.errorMessage = String(error);
    }
  }

  resetForm(): void {
    this.editId = null;
    this.nombre = '';
    this.descripcion = '';
    this.capacidad = 1;
    this.errorMessage = '';
  }
}

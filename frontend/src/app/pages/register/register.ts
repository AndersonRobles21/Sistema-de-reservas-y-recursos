import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiBaseUrl;

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  async registrar(): Promise<void> {
    this.errorMessage = '';

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: this.nombre, email: this.email, password: this.password }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.mensaje || 'Error registrando al usuario');
      }

      await this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = String(error);
    }
  }
}

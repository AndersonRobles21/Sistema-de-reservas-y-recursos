import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

const API_BASE = environment.apiBaseUrl;

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  async login(): Promise<void> {
    this.errorMessage = '';

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      const body = await response.text();
      let payload: { mensaje?: string; error?: string; token?: string; usuario?: unknown } | null = null;

      try {
        payload = body ? JSON.parse(body) : null;
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(payload?.mensaje || payload?.error || body || 'Error de autenticación');
      }

      const result = payload;
      if (!result?.token || !result?.usuario) {
        throw new Error('Respuesta inesperada del servidor');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.usuario));
      this.router.navigate(['/reservas']);
    } catch (error) {
      this.errorMessage = String(error);
    }
  }
}
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

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.mensaje || 'Error de autenticación');
      }

      const result = await response.json();
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.usuario));
      this.router.navigate(['/reservas']);
    } catch (error) {
      this.errorMessage = String(error);
    }
  }
}

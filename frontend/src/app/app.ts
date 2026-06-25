import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private readonly router = inject(Router);

  get isLoggedIn(): boolean {
    return isBrowser() ? !!window.localStorage.getItem('token') : false;
  }

  get userName(): string | null {
    if (!isBrowser()) {
      return null;
    }

    try {
      const user = JSON.parse(window.localStorage.getItem('user') ?? 'null');
      return user?.nombre || null;
    } catch {
      return null;
    }
  }

  logout(): void {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

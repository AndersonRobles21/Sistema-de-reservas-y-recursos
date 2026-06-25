import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = isBrowser() ? window.localStorage.getItem('token') : null;
  return token ? true : router.parseUrl('/login');
};

import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuarioRaw = localStorage.getItem('usuario');

  if (!usuarioRaw) {
    router.navigate(['/login']);
    return false;
  }

  const usuario = JSON.parse(usuarioRaw);
  const rol = usuario.rol?.toLowerCase(); // normalizamos
  const url = state.url;

  // CLIENTE
  const rutasCliente = [
    '/home',
    '/productos',
    '/mascotas',
    '/carreola',
    '/perfil',
    '/detalle',
    '/pago'
  ];

  // ADMIN
  const rutasAdmin = [
    '/admin',
    '/admin/productos',
    '/admin/mascotas',
    '/admin/categorias',
    '/admin/usuarios',
    '/admin/pagos'
  ];

  if (rol === 'cliente') {
    const esPermitido = rutasCliente.some(r => url.startsWith(r));
    if (esPermitido) return true;
  }

  if (rol === 'administrador') {
    const esPermitido = rutasAdmin.some(r => url.startsWith(r));
    if (esPermitido) return true;
  }

  router.navigate(['/login']);
  return false;
};

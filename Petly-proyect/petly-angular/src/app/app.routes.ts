import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },

  {
    path: 'verificar-correo',
    loadComponent: () => import('./pages/verificar-correo/verificar-correo.component').then(m => m.VerificarCorreoComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // 🟢 CLIENTE
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/productos/productos.component').then(m => m.ProductosComponent)
  },
  {
    path: 'mascotas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mascotas/mascotas.component').then(m => m.MascotasComponent)
  },
  {
    path: 'carreola',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/carreola/carreola.component').then(m => m.CarreolaComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: 'detalle/:tipo/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/detalle/detalle.component').then(m => m.DetalleComponent)
  },
  {
    path: 'pago',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pago/pago.component').then(m => m.PagoComponent)
  },

  // 🔴 ADMINISTRADOR
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },
  {
    path: 'admin/productos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin-productos/admin-productos.component').then(m => m.AdminProductosComponent)
  },
  {
    path: 'admin/mascotas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin-mascotas/admin-mascotas.component').then(m => m.AdminMascotasComponent)
  },
  {
    path: 'admin/categorias',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin-categorias/admin-categorias.component').then(m => m.AdminCategoriasComponent)
  },
  {
    path: 'admin/usuarios',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent)
  },
  {
    path: 'admin/pagos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin-pagos/admin-pagos.component').then(m => m.AdminPagosComponent)
  }
];

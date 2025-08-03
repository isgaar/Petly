import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },

  {
    path: 'verificar-correo',
    loadComponent: () =>
      import('./pages/verificar-correo/verificar-correo.component').then(m => m.VerificarCorreoComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  {
  path: 'home',
  loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },

  {
  path: 'productos',
  loadComponent: () =>
    import('./pages/productos/productos.component').then(m => m.ProductosComponent)
  }

];

import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' }, // redirección automática
  { path: 'register', component: RegisterComponent },
  // Puedes agregar luego el login aquí:
  // { path: 'login', component: LoginComponent },
];

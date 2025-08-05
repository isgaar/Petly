// src/app/pages/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identificador: ['', Validators.required], // correo o curp
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const rol = JSON.parse(usuario).rol;
      if (rol === 'Administrador') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  iniciarSesion() {
    if (this.loginForm.invalid) return;

    const payload = this.loginForm.value;

    this.http.post('http://localhost:3000/api/auth/login', payload).subscribe({
      next: (res: any) => {
        if (res?.usuario) {
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          alert(res.mensaje);

          const rol = res.usuario.rol;
          if (rol === 'Administrador') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.error = 'No se recibió información del usuario';
        }
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Usuario no encontrado. Redirigiendo al registro...');
          this.router.navigate(['/register'], {
            queryParams: { correo: payload.identificador }
          });
        } else {
          this.error = err.error?.mensaje || 'Error al iniciar sesión';
        }
      }
    });
  }
}

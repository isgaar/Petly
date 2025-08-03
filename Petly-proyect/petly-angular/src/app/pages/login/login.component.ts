// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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

  iniciarSesion() {
    if (this.loginForm.invalid) return;

    const payload = this.loginForm.value;

    this.http.post('http://localhost:3000/api/auth/login', payload).subscribe({
      next: (res: any) => {
        alert(res.mensaje);
        this.router.navigate(['/']); // redirigir al home o dashboard
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/verificar-correo'], { queryParams: { correo: payload.identificador } });
        } else {
          this.error = err.error?.mensaje || 'Error al iniciar sesión';
        }
      }
    });
  }
}

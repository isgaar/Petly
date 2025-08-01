// src/app/pages/verificar-correo/verificar-correo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verificar-correo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verificar-correo.component.html',
  styleUrls: ['./verificar-correo.component.scss']
})
export class VerificarCorreoComponent {
  verificarForm: FormGroup;
  correo = '';
  mensaje = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.verificarForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.route.queryParams.subscribe(params => {
      this.correo = params['correo'] || '';
    });
  }

  verificar() {
    if (this.verificarForm.invalid || !this.correo) return;

    const payload = {
      correo: this.correo,
      codigo: this.verificarForm.value.codigo
    };

    this.http.post('http://localhost:3000/api/auth/verificar-codigo', payload).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al verificar el código';
      }
    });
  }
}

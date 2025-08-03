import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RegisterService } from '../../services/register.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  step = 1;
  mostrarErrores = false;


  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private registerService: RegisterService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      curp: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(18)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    });
  }

  nextStep() {
  if (this.step === 1) {
    this.mostrarErrores = true;

    if (this.validarPaso1()) {
      this.step = 2;
      this.mostrarErrores = false; // ocultamos errores en paso 2
    }
  }
}




  previousStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  validarPaso1(): boolean {
    return this.registerForm.get('nombre')?.valid === true &&
           this.registerForm.get('primerApellido')?.valid === true &&
           this.registerForm.get('segundoApellido')?.valid === true &&
           this.registerForm.get('curp')?.valid === true;
  }

  registrar() {
    this.mostrarErrores = true;
    const pass = this.registerForm.value.contrasena;
    const confirm = this.registerForm.value.confirmarContrasena;

    if (this.registerForm.valid && pass === confirm) {
      const payload = { ...this.registerForm.value };
      delete payload.confirmarContrasena; // no se envía al backend

      this.registerService.registrarUsuario(payload).subscribe({
        next: (res) => {
          alert(res.mensaje);
          this.router.navigate(['/verificar-correo'], { queryParams: { correo: this.registerForm.value.correo } });
        },
        error: (err) => {
          alert('Error: ' + err.error.mensaje);
        }
      });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // ← se añade ActivatedRoute
import { RegisterService } from '../../services/register.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  step = 1;
  mostrarErrores = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private route: ActivatedRoute // ← se inyecta
  ) {
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

  ngOnInit(): void {
    // Rellena el campo 'correo' si viene como parámetro
    const correoParam = this.route.snapshot.queryParamMap.get('correo');
    if (correoParam) {
      this.registerForm.patchValue({ correo: correoParam });
    }
  }

  nextStep() {
    if (this.step === 1) {
      this.mostrarErrores = true;
      if (this.validarPaso1()) {
        this.step = 2;
        this.mostrarErrores = false;
      }
    }
  }

  previousStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }
validarPaso1(): boolean {
  const nombreCtrl = this.registerForm.get('nombre');
  const primerApellidoCtrl = this.registerForm.get('primerApellido');
  const segundoApellidoCtrl = this.registerForm.get('segundoApellido');
  const curpCtrl = this.registerForm.get('curp');

  return !!nombreCtrl?.valid &&
         !!primerApellidoCtrl?.valid &&
         !!segundoApellidoCtrl?.valid &&
         !!curpCtrl?.valid;
}


  registrar() {
    this.mostrarErrores = true;
    const pass = this.registerForm.value.contrasena;
    const confirm = this.registerForm.value.confirmarContrasena;

    if (this.registerForm.valid && pass === confirm) {
      const payload = { ...this.registerForm.value };
      delete payload.confirmarContrasena;

      this.registerService.registrarUsuario(payload).subscribe({
        next: (res) => {
          alert(res.mensaje);
          this.router.navigate(['/verificar-correo'], {
            queryParams: { correo: this.registerForm.value.correo }
          });
        },
        error: (err) => {
          alert('Error: ' + err.error.mensaje);
        }
      });
    }
  }
}

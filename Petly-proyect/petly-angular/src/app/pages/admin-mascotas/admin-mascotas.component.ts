import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MascotasService } from '../../services/mascotas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-mascotas',
  templateUrl: './admin-mascotas.component.html',
  styleUrls: ['./admin-mascotas.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule, RouterModule]
})
export class AdminMascotasComponent implements OnInit {
  mascotas: any[] = [];
  categorias: any[] = [];
  mostrarFormulario = false;
  mensaje = '';
  error = '';
  filtro = '';
  editandoMascota: any = null;
  imagenSeleccionada: File | null = null;
  backendURL = 'http://localhost:3000'; // 🔗 Ruta base del backend

  mascotaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mascotasService: MascotasService,
    private http: HttpClient,
    private router: Router
  ) {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      tipo: ['', Validators.required],
      descripcion: ['', Validators.required]
      // ya no se usa campo imagen directamente
    });
  }

  ngOnInit() {
    this.cargarMascotas();
    this.cargarCategorias();
  }

  cargarMascotas() {
    this.mascotasService.obtenerMascotas().subscribe({
      next: (data) => this.mascotas = data,
      error: () => this.error = 'Error al cargar mascotas'
    });
  }

  cargarCategorias() {
  this.mascotasService.obtenerCategorias('mascota').subscribe({
    next: (data) => this.categorias = data,
    error: () => this.error = 'Error al cargar categorías'
  });
}


  mostrarFormularioAgregar() {
    this.mostrarFormulario = true;
    this.editandoMascota = null;
    this.imagenSeleccionada = null;
    this.mascotaForm.reset();
    this.mensaje = '';
    this.error = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  registrarMascota() {
    if (this.mascotaForm.invalid) return;

    const formData = new FormData();
    formData.append('nombre', this.mascotaForm.value.nombre);
    formData.append('edad', this.mascotaForm.value.edad);
    formData.append('tipo', this.mascotaForm.value.tipo);
    formData.append('descripcion', this.mascotaForm.value.descripcion);
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    if (this.editandoMascota) {
      this.mascotasService.editarMascota(this.editandoMascota.id, formData).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.mostrarFormulario = false;
          this.editandoMascota = null;
          this.cargarMascotas();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al actualizar mascota';
        }
      });
    } else {
      this.mascotasService.agregarMascota(formData).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.mostrarFormulario = false;
          this.cargarMascotas();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al registrar';
        }
      });
    }
  }

  eliminarMascota(id: number) {
    this.mascotasService.eliminarMascota(id).subscribe({
      next: () => this.cargarMascotas(),
      error: () => this.error = 'No se pudo eliminar'
    });
  }

  editarMascota(mascota: any) {
    this.mascotaForm.patchValue({
      nombre: mascota.nombre,
      edad: mascota.edad,
      tipo: mascota.tipo,
      descripcion: mascota.descripcion
    });
    this.editandoMascota = mascota;
    this.imagenSeleccionada = null;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  agregarCategoriaPrompt() {
    const nombre = prompt('Nombre de la nueva categoría:');
    if (nombre) {
      this.mascotasService.agregarCategoria({ nombre }).subscribe({
        next: () => this.cargarCategorias(),
        error: () => this.error = 'No se pudo agregar categoría'
      });
    }
  }

  get mascotasFiltradas() {
    const f = this.filtro.toLowerCase();
    return this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(f) ||
      m.tipo.toLowerCase().includes(f)
    );
  }
}

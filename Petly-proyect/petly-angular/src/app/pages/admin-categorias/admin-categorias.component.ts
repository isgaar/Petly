import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MascotasService } from '../../services/mascotas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  templateUrl: './admin-categorias.component.html',
  styleUrls: ['./admin-categorias.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class AdminCategoriasComponent implements OnInit {
  categoriaForm: FormGroup;
  categorias: any[] = [];
  mensaje = '';
  error = '';
  editandoCategoria: any = null;
  filtroTipo: string = '';

  constructor(private fb: FormBuilder, private mascotasService: MascotasService) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['mascota', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.mascotasService.obtenerCategorias(this.filtroTipo).subscribe({
      next: (data) => this.categorias = data,
      error: () => this.error = 'Error al cargar categorías'
    });
  }

  guardarCategoria() {
    if (this.categoriaForm.invalid) return;

    const datos = {
      nombre: this.categoriaForm.value.nombre,
      tipo: this.categoriaForm.value.tipo
    };

    if (this.editandoCategoria) {
      this.mascotasService.editarCategoria(this.editandoCategoria.id, datos).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.editandoCategoria = null;
          this.categoriaForm.reset({ tipo: 'mascota' });
          this.cargarCategorias();
        },
        error: () => this.error = 'Error al actualizar categoría'
      });
    } else {
      this.mascotasService.agregarCategoria(datos).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.categoriaForm.reset({ tipo: 'mascota' });
          this.cargarCategorias();
        },
        error: () => this.error = 'Error al agregar categoría'
      });
    }
  }

  editar(categoria: any) {
    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      tipo: categoria.tipo
    });
    this.editandoCategoria = categoria;
    this.mensaje = '';
    this.error = '';
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.mascotasService.eliminarCategoria(id).subscribe({
        next: () => this.cargarCategorias(),
        error: () => this.error = 'Error al eliminar categoría'
      });
    }
  }

  cancelarEdicion() {
    this.editandoCategoria = null;
    this.categoriaForm.reset({ tipo: 'mascota' });
    this.mensaje = '';
    this.error = '';
  }
}

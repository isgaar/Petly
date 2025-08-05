import { Component, OnInit } from '@angular/core';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 AÑADE ESTO

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule] // 👈 AÑADE FormsModule
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  mostrarFormulario = false;
  esEdicion = false;
  usuarioSeleccionadoId: number | null = null;
  filtro = '';

  usuarioForm: FormGroup;

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      segundo_apellido: ['', Validators.required],
      curp: ['', [Validators.required, Validators.minLength(18)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['Cliente', Validators.required] // 👈 En mayúscula
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  get usuariosFiltrados(): Usuario[] {
    const f = this.filtro.toLowerCase();
    return this.usuarios.filter(u =>
      `${u.nombre} ${u.primer_apellido} ${u.segundo_apellido}`.toLowerCase().includes(f) ||
      u.correo.toLowerCase().includes(f)
    );
  }

  mostrarFormularioAgregar(): void {
    this.usuarioForm.reset({ rol: 'Cliente' }); // 👈 Por defecto en mayúscula
    this.mostrarFormulario = true;
    this.esEdicion = false;
    this.usuarioSeleccionadoId = null;
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioForm.patchValue({
      ...usuario,
      rol: this.capitalizarRol(usuario.rol)
    });
    this.usuarioSeleccionadoId = usuario.id_usuario || null;
    this.mostrarFormulario = true;
    this.esEdicion = true;
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuariosService.eliminarUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.usuarioForm.reset();
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid) return;

    const usuarioData = {
      ...this.usuarioForm.value,
      rol: this.capitalizarRol(this.usuarioForm.value.rol)
    };

    if (this.esEdicion && this.usuarioSeleccionadoId) {
      this.usuariosService.actualizarUsuario(this.usuarioSeleccionadoId, usuarioData).subscribe(() => {
        this.cargarUsuarios();
        this.cancelar();
      });
    } else {
      this.usuariosService.crearUsuario(usuarioData).subscribe(() => {
        this.cargarUsuarios();
        this.cancelar();
      });
    }
  }

  private capitalizarRol(rol: string): string {
    // Transforma 'cliente' → 'Cliente'
    return rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase();
  }
}

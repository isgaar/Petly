import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule, RouterModule  ],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {
  productoForm: FormGroup;
  productos: any[] = [];
  categorias: any[] = [];
  backendURL = 'http://localhost:3000';
  mostrarFormulario = false;
  mensaje = '';
  error = '';
  filtro: string = '';
  selectedFile!: File;
  editandoProducto: any = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]]
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  obtenerProductos(): void {
    this.http.get<any[]>('http://localhost:3000/api/productos').subscribe({
      next: (data) => this.productos = data,
      error: () => this.error = 'No se pudo cargar la lista de productos'
    });
  }

  obtenerCategorias(): void {
    this.http.get<any[]>('http://localhost:3000/api/mascotas/categorias?tipo=producto').subscribe({
      next: (data) => this.categorias = data,
      error: () => this.error = 'No se pudo cargar las categorías'
    });
  }

  mostrarFormularioAgregar(): void {
    this.mostrarFormulario = true;
    this.editandoProducto = null;
    this.selectedFile = undefined as any;
    this.productoForm.reset();
    this.mensaje = '';
    this.error = '';
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) return;

    const formData = new FormData();
    formData.append('nombre', this.productoForm.value.nombre);
    formData.append('descripcion', this.productoForm.value.descripcion);
    formData.append('precio', this.productoForm.value.precio);
    formData.append('tipo', this.productoForm.value.tipo);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    const url = this.editandoProducto
      ? `http://localhost:3000/api/productos/${this.editandoProducto.id}`
      : 'http://localhost:3000/api/productos';

    const method = this.editandoProducto ? 'put' : 'post';

    this.http[method](url, formData).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje;
        this.mostrarFormulario = false;
        this.obtenerProductos();
        this.editandoProducto = null;
        this.productoForm.reset();
        this.selectedFile = undefined as any;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al guardar producto';
      }
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Eliminar este producto?')) {
      this.http.delete(`http://localhost:3000/api/productos/${id}`).subscribe({
        next: () => this.obtenerProductos(),
        error: () => this.error = 'No se pudo eliminar el producto'
      });
    }
  }

  editarProducto(producto: any): void {
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      tipo: producto.tipo,
      precio: producto.precio
    });
    this.editandoProducto = producto;
    this.mostrarFormulario = true;
    this.selectedFile = undefined as any;
    this.mensaje = '';
    this.error = '';
  }

  get productosFiltrados() {
  const f = this.filtro.toLowerCase();
  return this.productos.filter(p =>
    (p.nombre?.toLowerCase().includes(f) || '') ||
    (p.tipo?.toLowerCase().includes(f) || '')
  );
}



}

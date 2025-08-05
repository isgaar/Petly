import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductoService } from '../../services/producto.service';
import { CarreolaService } from '../../services/carreola.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  backendURL = 'http://localhost:3000'; // 🔗 Ruta base del backend

  constructor(
    private productoService: ProductoService,
    private carreolaService: CarreolaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  agregarProducto(idProducto: number): void {
    const usuario = localStorage.getItem('usuario');
if (!usuario) return alert('Debes iniciar sesión primero');
const id_usuario = JSON.parse(usuario).id;


    this.carreolaService.agregarACarreola({
      id_usuario,
      tipo: 'producto',
      id_item: idProducto,
      cantidad: 1
    }).subscribe({
      next: () => alert('Producto agregado a la carreola'),
      error: (err) => alert('Error: ' + err.error.mensaje)
    });
  }

  verDetalle(id: number): void {
    console.log('Funcionalidad futura: ver detalle de producto', id);
  }
}

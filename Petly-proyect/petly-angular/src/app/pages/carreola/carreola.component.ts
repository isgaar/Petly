import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CarreolaService } from '../../services/carreola.service';
import { ProductoService } from '../../services/producto.service';
import { MascotasService } from '../../services/mascotas.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-carreola',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './carreola.component.html',
  styleUrls: ['./carreola.component.scss']
})
export class CarreolaComponent implements OnInit {
  carreola: any[] = [];
  productos: any[] = [];
  mascotas: any[] = [];
  backendURL = 'http://localhost:3000';
  nombreUsuario: string = '';
  id_usuario: number = 0;
  totalProductos = 0;
  totalMascotas = 0;
  totalGeneral = 0;

  constructor(
    private carreolaService: CarreolaService,
    private productoService: ProductoService,
    private mascotasService: MascotasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) return alert('Debes iniciar sesión para ver tu carreola');

    const datosUsuario = JSON.parse(usuario);
    this.id_usuario = datosUsuario.id;
    this.nombreUsuario = datosUsuario.nombre;

    this.carreolaService.obtenerCarreolaPorUsuario(this.id_usuario).subscribe({
      next: (data) => {
        this.carreola = data;
        this.separarItems();
      },
      error: (err) => console.error('Error al cargar carreola:', err)
    });
  }

  separarItems(): void {
    this.carreola.forEach(item => {
      if (item.tipo === 'producto') {
        this.productoService.getProductoPorId(item.id_item).subscribe(prod => {
          this.productos.push({ ...prod, cantidad: item.cantidad });
          this.actualizarTotales();
        });
      } else if (item.tipo === 'mascota') {
        this.mascotasService.getMascotaPorId(item.id_item).subscribe(mascota => {
          this.mascotas.push(mascota);
          this.actualizarTotales();
        });
      }
    });
  }

  actualizarTotales(): void {
    this.totalProductos = this.productos.reduce((acc, prod) => acc + (prod.cantidad || 1), 0);
    this.totalMascotas = this.mascotas.length;
    const totalProductosPrecio = this.productos.reduce((acc, prod) => acc + (prod.precio * (prod.cantidad || 1)), 0);
    this.totalGeneral = totalProductosPrecio; // Mascotas no tienen costo
  }

  eliminarItem(idCarreola: number): void {
    if (confirm('¿Eliminar este elemento de tu carreola?')) {
      this.carreolaService.eliminarDeCarreola(idCarreola).subscribe({
        next: () => {
          this.carreola = [];
          this.productos = [];
          this.mascotas = [];
          this.ngOnInit(); // recarga
        },
        error: (err) => alert('Error al eliminar: ' + err.error.mensaje)
      });
    }
  }

  vaciarCarreola(): void {
    if (confirm('¿Seguro que deseas vaciar tu carreola?')) {
      const usuario = localStorage.getItem('usuario');
      if (!usuario) return;

      const id_usuario = JSON.parse(usuario).id;

      this.carreolaService.vaciarCarreola(id_usuario).subscribe({
        next: () => {
          this.carreola = [];
          this.productos = [];
          this.mascotas = [];
          this.actualizarTotales();
          alert('Carreola vaciada con éxito');
        },
        error: (err) => {
          console.error('Error al vaciar carreola:', err);
          alert('Error al vaciar la carreola');
        }
      });
    }
  }

  procederAlPago(): void {
    localStorage.setItem('totalPago', this.totalGeneral.toString());
    this.router.navigate(['/pago']);
  }
}

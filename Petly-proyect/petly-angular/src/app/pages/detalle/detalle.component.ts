import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { MascotasService } from '../../services/mascotas.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  tipo!: string;
  id!: number;
  detalle: any;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private mascotasService: MascotasService
  ) {}

  ngOnInit(): void {
    this.tipo = this.route.snapshot.paramMap.get('tipo')!;
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.tipo === 'producto') {
      this.productoService.getProductoPorId(this.id).subscribe({
        next: (data) => this.detalle = data,
        error: () => this.error = 'Producto no encontrado'
      });
    } else if (this.tipo === 'mascota') {
      this.mascotasService.getMascotaPorId(this.id).subscribe({
        next: (data) => this.detalle = data,
        error: () => this.error = 'Mascota no encontrada'
      });
    } else {
      this.error = 'Ruta no válida';
    }
  }
}

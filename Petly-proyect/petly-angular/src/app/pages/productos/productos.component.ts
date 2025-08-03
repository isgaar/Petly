import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent {
  productos = [
    {
      nombre: 'Croquetas premium',
      descripcion: 'Alimento balanceado para perro adulto.',
      precio: 399,
      imagen: 'assets/productos/croquetas.jpg'
    },
    {
      nombre: 'Juguete mordedor',
      descripcion: 'Ideal para la dentición de cachorros.',
      precio: 89,
      imagen: 'assets/productos/juguete.jpg'
    }
    // Aquí podrías cargar desde backend más adelante
  ];
}

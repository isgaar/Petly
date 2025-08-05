// src/app/pages/admin-pagos/admin-pagos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-admin-pagos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-pagos.component.html',
  styleUrls: ['./admin-pagos.component.scss']
})
export class AdminPagosComponent implements OnInit {
  pagos: any[] = [];
  backendURL = 'http://localhost:3000';
  mensaje = '';
  error = '';

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.pagoService.obtenerPagos().subscribe({
      next: (res) => {
        this.pagos = res;
        this.mensaje = '';
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al cargar pagos';
        console.error(err);
      }
    });
  }

  cambiarEstatus(pago: any, nuevoEstatus: string): void {
    this.pagoService.cambiarEstatusPago(pago.id_pago, nuevoEstatus).subscribe({
      next: () => {
        pago.estatus = nuevoEstatus;
        this.mensaje = 'Estatus actualizado correctamente';
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al actualizar el estatus';
        this.mensaje = '';
      }
    });
  }
}

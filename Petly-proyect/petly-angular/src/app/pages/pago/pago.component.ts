import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagoService } from '../../services/pago.service';
import jsPDF from 'jspdf';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  nombreUsuario = '';
  total = 0;
  clabe = '002010123456789012'; // tu cuenta simulada
  comprobante!: File;
  mensaje = '';
  error = '';
  id_usuario!: number;

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) return;

    const user = JSON.parse(usuario);
    this.nombreUsuario = user.nombre;
    this.id_usuario = user.id;

    const totalStorage = localStorage.getItem('totalPago');
    this.total = totalStorage ? parseFloat(totalStorage) : 0;
  }

  descargarRecibo() {
    const doc = new jsPDF();
    doc.text('Recibo de Pago', 10, 10);
    doc.text(`Nombre: ${this.nombreUsuario}`, 10, 20);
    doc.text(`Total: $${this.total}`, 10, 30);
    doc.text(`Cuenta CLABE: ${this.clabe}`, 10, 40);
    doc.text(`Referencia: ${this.id_usuario}-${Date.now()}`, 10, 50);
    doc.save('recibo_pago.pdf');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.comprobante = input.files?.[0]!;
  }

  subirComprobante() {
    if (!this.comprobante || !this.id_usuario) return;

    const formData = new FormData();
    formData.append('comprobante', this.comprobante);
    formData.append('id_usuario', this.id_usuario.toString());
    formData.append('total', this.total.toString());

    this.pagoService.subirComprobante(formData).subscribe({
      next: res => {
        this.mensaje = res.mensaje;
        this.error = '';
      },
      error: err => {
        this.error = err.error?.mensaje || 'Error al subir comprobante';
        this.mensaje = '';
      }
    });
  }
}

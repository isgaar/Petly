import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
    }
  }

  irAProductos(): void {
    this.router.navigate(['/admin/productos']);
  }

  irAMascotas(): void {
    this.router.navigate(['/admin/mascotas']);
  }

  irAUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  irACategorias(): void {
    this.router.navigate(['/admin/categorias']);
  }

  irAPagos(): void {
  this.router.navigate(['/admin/pagos']);
  }


  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      // Si no hay sesión activa, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }

  irAMascotas(): void {
    this.router.navigate(['/mascotas']);
  }

  irACarreola(): void {
    this.router.navigate(['/carreola']);
  }

  irAPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}

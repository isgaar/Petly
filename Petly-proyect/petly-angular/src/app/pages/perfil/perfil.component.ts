import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  nombreUsuario = '';
  id_usuario!: number;
  pagos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const usuarioRaw = localStorage.getItem('usuario');
    if (!usuarioRaw) return;

    const usuario = JSON.parse(usuarioRaw);
    this.nombreUsuario = usuario.nombre;
    this.id_usuario = usuario.id;

    this.http.get<any[]>('http://localhost:3000/api/pagos').subscribe({
      next: data => {
        this.pagos = data.filter(p => p.id_usuario === this.id_usuario);
      },
      error: err => {
        console.error('Error al cargar pagos:', err);
      }
    });
  }
}

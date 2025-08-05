import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { MascotasService } from '../../services/mascotas.service';
import { CarreolaService } from '../../services/carreola.service';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.scss']
  
})
export class MascotasComponent implements OnInit {
  mascotas: any[] = [];

  constructor(
    private mascotasService: MascotasService,
    private carreolaService: CarreolaService,
    private router: Router
    
  ) {}
backendURL = 'http://localhost:3000';

  ngOnInit(): void {
    this.mascotasService.obtenerMascotas().subscribe({
      next: (res) => this.mascotas = res,
      error: (err) => console.error('Error al cargar mascotas:', err)
    });
  }

  agregarMascota(idMascota: number): void {
    const usuario = localStorage.getItem('usuario');
if (!usuario) return alert('Debes iniciar sesión primero');
const id_usuario = JSON.parse(usuario).id;


    this.carreolaService.agregarACarreola({
      id_usuario,
      tipo: 'mascota',
      id_item: idMascota
    }).subscribe({
      next: () => alert('Mascota agregada a la carreola'),
      error: (err) => alert('Error: ' + err.error.mensaje)
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/detalle/mascota', id]);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private apiUrl = 'http://localhost:3000/api/mascotas';

  constructor(private http: HttpClient) {}

  obtenerMascotas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  agregarMascota(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  eliminarMascota(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMascotaPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  editarMascota(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }



  agregarCategoria(categoria: { nombre: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorias`, categoria);
  }

  editarCategoria(id: number, categoria: { nombre: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/categorias/${id}`, categoria);
}

eliminarCategoria(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/categorias/${id}`);
}

obtenerCategorias(tipo?: string): Observable<any[]> {
  const url = tipo ? `${this.apiUrl}/categorias?tipo=${tipo}` : `${this.apiUrl}/categorias`;
  return this.http.get<any[]>(url);
}


}

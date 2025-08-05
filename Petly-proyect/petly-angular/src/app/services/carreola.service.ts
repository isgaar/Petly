import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarreolaService {
  private apiUrl = 'http://localhost:3000/api/carreola';

  constructor(private http: HttpClient) {}

  agregarACarreola(data: {
    id_usuario: number,
    tipo: 'producto' | 'mascota',
    id_item: number,
    cantidad?: number
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  obtenerCarreolaPorUsuario(id_usuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id_usuario}`);
  }

  eliminarDeCarreola(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

  vaciarCarreola(id_usuario: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/vaciar/${id_usuario}`);
}


}

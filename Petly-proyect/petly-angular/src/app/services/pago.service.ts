// src/app/services/pago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiURL = 'http://localhost:3000/api/pagos';

  constructor(private http: HttpClient) {}

  generarPago(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/generar`, payload);
  }

  subirComprobante(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/comprobante`, formData);
  }

  obtenerPagos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL);
  }

  cambiarEstatusPago(id_pago: number, nuevoEstatus: string): Observable<any> {
    // ✅ se envía todo por el body, no en la URL
    return this.http.put(`${this.apiURL}/estatus`, {
      id_pago,
      estatus: nuevoEstatus
    });
  }
}

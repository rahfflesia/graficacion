import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/';

  private proyectosUrl = 'proyectos/';
  private proyectosCrearUrl = 'crear';

  crearProyecto(proyecto: any): Observable<any> {
    return this.http.post(this.baseUrl + this.proyectosUrl + this.proyectosCrearUrl, proyecto);
  }
}

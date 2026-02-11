import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procesos, Usuario } from '../models/proceso.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcesosService {
    private apiUrl = 'http://localhost:8080/api/procesos';

    constructor(private http: HttpClient) { }

    getProcesos(): Observable<Procesos[]> {
        return this.http.get<Procesos[]>(`${this.apiUrl}/procesos`);    
    }

    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);    
    }
}
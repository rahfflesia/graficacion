import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RolesService {

  private apiUrl = 'http://localhost:3000/roles';

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get(this.apiUrl);
  }

  createRol(rol: any) {
    return this.http.post(this.apiUrl, rol);
  }

  deleteRol(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

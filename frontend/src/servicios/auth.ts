import { inject, Injectable } from '@angular/core';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private servicioUsuario = inject(Usuario);

  estaAutenticado() {
    if (!this.servicioUsuario.obtenerUsuario()) return false;
    else return true;
  }
}

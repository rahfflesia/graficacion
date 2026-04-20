import { Injectable, signal } from '@angular/core';
import { DatosUsuario } from '../models/proceso.interface';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  datosSesionUsuario = signal<DatosUsuario | null>(null);

  guardarUsuario(datosUsuario: any) {
    this.datosSesionUsuario.set(datosUsuario);
    localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));

    if (datosUsuario?.token) {
      localStorage.setItem('token', datosUsuario.token);
    }

    const idusuario =
      datosUsuario?.usuario?.idusuario ??
      datosUsuario?.idusuario;

    if (idusuario !== undefined && idusuario !== null) {
      localStorage.setItem('idusuario', idusuario.toString());
    }
  }

  obtenerUsuario() {
    if (this.datosSesionUsuario() !== null) {
      return this.datosSesionUsuario();
    }

    const datosGuardados = localStorage.getItem('datosUsuario');
    if (!datosGuardados) return null;

    const datosUsuario = JSON.parse(datosGuardados);
    this.datosSesionUsuario.set(datosUsuario);
    return datosUsuario;
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerIdUsuario(): string | null {
    return localStorage.getItem('idusuario');
  }

  borrarUsuario() {
    this.datosSesionUsuario.set(null);
    localStorage.removeItem('datosUsuario');
    localStorage.removeItem('token');
    localStorage.removeItem('idusuario');
  }
}
import { Injectable, signal } from '@angular/core';
import { DatosUsuario } from '../models/proceso.interface';

const SESSION_KEY = 'sesion_usuario';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  datosSesionUsuario = signal<DatosUsuario | null>(null);

  guardarUsuario(datosUsuario: DatosUsuario) {
    this.datosSesionUsuario.set(datosUsuario);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(datosUsuario));
  }

  obtenerUsuario() {
    // Si el signal está vacío (ej: se recargó la página), intentar recuperar del sessionStorage
    if (this.datosSesionUsuario() === null) {
      const datosGuardados = sessionStorage.getItem(SESSION_KEY);
      if (datosGuardados) {
        const datosUsuario = JSON.parse(datosGuardados) as DatosUsuario;
        this.datosSesionUsuario.set(datosUsuario);
      }
    }
    return this.datosSesionUsuario();
  }

  borrarUsuario() {
    this.datosSesionUsuario.set(null);
    sessionStorage.removeItem(SESSION_KEY);
  }
}


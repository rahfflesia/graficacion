import { Injectable, signal } from '@angular/core';
import { DatosUsuario } from '../models/proceso.interface';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  datosSesionUsuario = signal<DatosUsuario | null>(null);

  guardarUsuario(datosUsuario: DatosUsuario) {
    this.datosSesionUsuario.set(datosUsuario);
  }

  obtenerUsuario() {
    if (this.datosSesionUsuario() === null) return null;
    return this.datosSesionUsuario();
  }

  borrarUsuario() {
    this.datosSesionUsuario.set(null);
  }
}

import { Injectable, signal } from '@angular/core';
import { DatosUsuario } from '../models/proceso.interface';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  datosSesionUsuario = signal<DatosUsuario | null>(null);
  private readonly claveUsuario = 'datosSesionUsuario';

  guardarUsuario(datosUsuario: DatosUsuario) {
    this.datosSesionUsuario.set(datosUsuario);
    localStorage.setItem(this.claveUsuario, JSON.stringify(datosUsuario));
  }

  obtenerUsuario() {
    const usuarioEnMemoria = this.datosSesionUsuario();
    if (this.esUsuarioValido(usuarioEnMemoria)) return usuarioEnMemoria;

    const usuarioGuardado = localStorage.getItem(this.claveUsuario);
    if (!usuarioGuardado) return null;

    try {
      const usuario = JSON.parse(usuarioGuardado) as DatosUsuario;

      if (!this.esUsuarioValido(usuario)) {
        this.borrarUsuario();
        return null;
      }

      this.datosSesionUsuario.set(usuario);
      return usuario;
    } catch {
      this.borrarUsuario();
      return null;
    }
  }

  borrarUsuario() {
    this.datosSesionUsuario.set(null);
    localStorage.removeItem(this.claveUsuario);
  }

  private esUsuarioValido(usuario: DatosUsuario | null): usuario is DatosUsuario {
    return !!usuario?.usuario?.idusuario;
  }
}

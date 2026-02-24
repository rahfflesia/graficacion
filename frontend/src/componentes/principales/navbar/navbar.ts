import { Component, inject } from '@angular/core';
import { Usuario } from '../../../servicios/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private ServicioUsuario = inject(Usuario);
  private router = inject(Router);

  cerrarSesion() {
    this.ServicioUsuario.borrarUsuario();
    this.router.navigate(['/login']);
  }
}

import { Component, inject } from '@angular/core';
import { Usuario } from '../../../servicios/usuario';
import { Router } from '@angular/router';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private ServicioUsuario = inject(Usuario);
  private router = inject(Router);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  cerrarSesion() {
    this.api.cerrarSesion().subscribe({
      next: () => {
        this.ServicioUsuario.borrarUsuario();
        this.toastr.success('Sesión cerrada correctamente');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);

        this.ServicioUsuario.borrarUsuario();
        this.toastr.error('Ha ocurrido un error al intentar cerrar la sesión', '', {
          toastClass: 'toastr-error',
        });
        this.router.navigate(['/login']);
      },
    });
  }
}
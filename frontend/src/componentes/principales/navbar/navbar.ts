import { Component, inject } from '@angular/core';
import { Usuario } from '../../../servicios/usuario';
import { Router } from '@angular/router';
import { Auth } from '../../../servicios/auth';
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
    this.ServicioUsuario.borrarUsuario();
    this.api.cerrarSesion().subscribe({
      // Acá la respuesta no la ocupo para nada
      next: () => {
        this.toastr.success('Sesión cerrada correctamente');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al intentar cerrar la sesión', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.router.navigate(['/login']);
  }
}

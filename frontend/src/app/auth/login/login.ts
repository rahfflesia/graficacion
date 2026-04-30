import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../../servicios/api';
import { SesionUsuario } from '../../../models/proceso.interface';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../servicios/usuario';
import { ModalCarga } from '../../../componentes/modales/modal-carga/modal-carga';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ModalCarga],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private ServicioUsuario = inject(Usuario);

  esModalCargaVisible = signal<boolean>(false);

  formularioInicioSesion = this.formBuilder.group({
    correo: ['', [Validators.required]],
    contrasena: ['', [Validators.required]],
  });

  iniciarSesion() {
    const datosInicioSesion: SesionUsuario = {
      correo: this.formularioInicioSesion.get('correo')?.value!,
      contrasena: this.formularioInicioSesion.get('contrasena')?.value!,
    };

    this.esModalCargaVisible.set(true);

    this.api.iniciarSesion(datosInicioSesion).subscribe({
      next: (datosUsuario) => {
        console.log('Datos del usuario', datosUsuario);
        this.ServicioUsuario.guardarUsuario(datosUsuario);

        this.toastr.success('Sesión iniciada');
        this.esModalCargaVisible.set(false);

        this.router.navigate(['/proyectos']);
      },
      error: (error) => {
        this.toastr.error('Ocurrió un error al iniciar sesión', '', {
          toastClass: 'toastr-error',
        });
        this.esModalCargaVisible.set(false);
        console.error(error);
      },
    });
  }
}

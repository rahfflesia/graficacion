import { Component, inject, signal } from '@angular/core';
import { Api } from '../../../servicios/api';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegistroUsuario } from '../../../models/proceso.interface';
import { Router } from '@angular/router';
import { ModalCarga } from '../../../componentes/modales/modal-carga/modal-carga';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, ModalCarga],
  templateUrl: './registro.html',
  styleUrl: '../login/login.css',
})
export class Registro {
  private api = inject(Api);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  esModalCargaVisible = signal<boolean>(false);
  formularioRegistro = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    confirmarContrasena: ['', [Validators.required, this.sonContrasenasDiferentes()]],
  });

  registrarUsuario() {
    const datosRegistro: RegistroUsuario = {
      nombre: this.formularioRegistro.get('nombre')?.value!,
      correo: this.formularioRegistro.get('correo')?.value!,
      contrasena: this.formularioRegistro.get('contrasena')?.value!,
    };

    this.esModalCargaVisible.set(true);

    this.api.registrarUsuario(datosRegistro).subscribe({
      // No hago nada con el usuario aún no sé si debería almacenarlo en un servicio con los datos del usuario
      // O algo parecido
      next: (usuarioRegistrado) => {
        this.toastr.success('Usuario registrado exitosamente');
        this.esModalCargaVisible.set(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastr.error('Ocurrió un error en el registro', '', {
          toastClass: 'toastr-error',
        });
        this.esModalCargaVisible.set(false);
        console.error(error);
      },
    });
  }

  sonContrasenasDiferentes(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Si no uso el operador ternario ni siquiera compila el componente
      const contrasena = this.formularioRegistro
        ? this.formularioRegistro.get('contrasena')?.value!
        : '';
      return control.value !== contrasena
        ? { contrasenasDiferentes: { value: control.value } }
        : null;
    };
  }
}

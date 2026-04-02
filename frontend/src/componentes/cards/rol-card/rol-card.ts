import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatosFormularioRol, Rol } from '../../../models/rol.interface';
import { LowerCasePipe } from '@angular/common';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'rol-card',
  imports: [LowerCasePipe, ReactiveFormsModule],
  templateUrl: './rol-card.html',
  styleUrl: './rol-card.css',
})
export class RolCard {
  @Input() rol: Rol | undefined;
  @Output() modificarRol = new EventEmitter<Rol>();
  @Output() eliminarRol = new EventEmitter<Rol>();

  private api = inject(Api);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);

  estaEditando = false;
  estaBorrando = false;
  formularioRoles = this.formBuilder.group({
    nombreRol: ['', [Validators.required]],
    tipoRol: ['Interno', [Validators.required]],
  });

  obtenerControlFormularioEditarRol(nombreControl: string) {
    return this.formularioRoles.get(nombreControl);
  }

  mostarMenuBorrado() {
    this.estaBorrando = true;
  }

  ocultarMenuBorrado() {
    this.estaBorrando = false;
  }

  mostarMenuEdicion() {
    this.estaEditando = true;
    this.formularioRoles.get('nombreRol')?.setValue(this.rol?.nombre!);
    this.formularioRoles.get('tipoRol')?.setValue(this.rol?.tipo!);
  }

  ocultarMenuEdicion() {
    this.estaEditando = false;
  }

  borrarRol() {
    this.api.eliminarRol(this.rol?.idrol!).subscribe({
      next: (rolEliminado) => {
        this.toastr.success('Rol eliminado correctamente');
        this.eliminarRol.emit(rolEliminado);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al eliminar el rol', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.ocultarMenuBorrado();
  }

  editarRol() {
    const datosRol: DatosFormularioRol = {
      nombre: this.formularioRoles.get('nombreRol')?.value!,
      tipo: this.formularioRoles.get('tipoRol')?.value! as 'Interno' | 'Externo',
    };
    this.api.editarRol(this.rol?.idrol!, datosRol).subscribe({
      next: (rolEditado) => {
        this.toastr.success('Rol editado correctamente');
        this.modificarRol.emit(rolEditado);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ocurrió un error al editar el rol', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.ocultarMenuEdicion();
  }
}

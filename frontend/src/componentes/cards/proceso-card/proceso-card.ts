import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatosEditarProceso, Proceso } from '../../../models/procesos.interface';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'proceso-card',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './proceso-card.html',
  styleUrl: './proceso-card.css',
})
export class ProcesoCard {
  @Input() proceso: Proceso | undefined;
  @Output() borrarProceso = new EventEmitter<Proceso>();
  @Output() editarProceso = new EventEmitter<Proceso>();
  estaBorrando = false;
  estaEditando = false;
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);
  formularioEdicionProceso = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  mostrarMenuBorrarProceso() {
    this.estaBorrando = true;
  }

  ocultarMenuBorrarProceso() {
    this.estaBorrando = false;
  }

  mostrarMenuEdicion() {
    this.estaEditando = true;
    this.formularioEdicionProceso.get('nombre')?.setValue(this.proceso?.nombre!);
    this.formularioEdicionProceso.get('descripcion')?.setValue(this.proceso?.descripcion!);
  }

  ocultarMenuEdicion() {
    this.estaEditando = false;
    this.formularioEdicionProceso.reset();
  }

  eliminarProceso() {
    this.api.eliminarProceso(this.proceso?.idproceso!).subscribe({
      next: (procesoEliminado) => {
        this.toastr.success('Proceso eliminado correctamente');
        this.borrarProceso.emit(procesoEliminado);
        this.ocultarMenuBorrarProceso();
      },
      error: (error) => {
        this.toastr.error('Ocurrió un error al eliminar el proceso', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
        this.ocultarMenuBorrarProceso();
      },
    });
  }

  editar() {
    const datosProcesoEditar: DatosEditarProceso = {
      nombreProceso: this.formularioEdicionProceso.get('nombre')?.value!,
      descripcionProceso: this.formularioEdicionProceso.get('descripcion')?.value!,
    };
    this.api.editarProceso(this.proceso?.idproceso!, datosProcesoEditar).subscribe({
      next: (procesoEditado) => {
        this.toastr.success('Proceso editado correctamente');
        this.editarProceso.emit(procesoEditado);
        this.ocultarMenuEdicion();
      },
      error: (error) => {
        this.toastr.error('Ocurrió un error al editar el proceso', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
        this.ocultarMenuEdicion();
      },
    });
  }
}

import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { Api } from '../../../servicios/api';
import { Proyectos } from '../../../models/proceso.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-eliminar',
  imports: [],
  templateUrl: './modal-eliminar.html',
  styleUrl: './modal-eliminar.css',
})
export class ModalEliminar {
  private api = inject(Api);
  private toastr = inject(ToastrService);
  @Input() proyectoAEliminar: Proyectos | undefined;
  @Input() toggler: boolean = false;

  @Output() confirmar = new EventEmitter<Proyectos>();
  @Output() cancelar = new EventEmitter<void>();

  confirmarAccion(proyectoEliminar: Proyectos) {
    this.confirmar.emit(proyectoEliminar);
  }

  cancelarAccion() {
    this.cancelar.emit();
  }

  eliminarProyecto() {
    if (this.proyectoAEliminar?.idproyecto === undefined) {
      console.log('El id del proyecto que estás intentando eliminar es undefined');
      return;
    }

    this.api.eliminarProyecto(this.proyectoAEliminar?.idproyecto).subscribe({
      next: (proyectoEliminado: Proyectos) => {
        this.confirmarAccion(proyectoEliminado);
        this.cancelarAccion();
        this.toastr.success('Proyecto eliminado correctamente');
      },
      error: (error) => {
        this.cancelarAccion();
        this.toastr.error('No se ha podido eliminar el proyecto', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
      },
    });
  }
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SeguimientoTransaccional } from '../../../models/seguimientoTransaccional';
import { DatePipe } from '@angular/common';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'seguimiento-transaccional-card',
  imports: [DatePipe],
  templateUrl: './seguimiento-transaccional-card.html',
  styleUrl: './seguimiento-transaccional-card.css',
})
export class SeguimientoTransaccionalCard {
  @Input() seguimiento: SeguimientoTransaccional | null = null;

  @Output() editar = new EventEmitter<SeguimientoTransaccional>();
  @Output() eliminar = new EventEmitter<number>();

  private api = inject(Api);
  private toastr = inject(ToastrService);

  estaModoEliminarActivado = false;

  activarModoEliminar() {
    this.estaModoEliminarActivado = true;
  }

  desactivarModoEliminar() {
    this.estaModoEliminarActivado = false;
  }

  eliminarSeguimiento() {
    const idSeguimiento = this.seguimiento?.idseguimiento;

    if (!idSeguimiento) {
      console.error('El id de seguimiento no se encuentra definido');
      return;
    }

    this.api.eliminarSeguimientoTransaccional(idSeguimiento).subscribe({
      next: (seguimientoEliminado) => {
        console.log(seguimientoEliminado);
        this.toastr.success('Seguimiento transaccional eliminado correctamente');
        this.eliminar.emit(seguimientoEliminado.idseguimiento);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('', 'Ha ocurrido un error al eliminar el seguimiento transaccional', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  editarSeguimiento() {
    if (!this.seguimiento) return;
    this.editar.emit(this.seguimiento);
  }
}

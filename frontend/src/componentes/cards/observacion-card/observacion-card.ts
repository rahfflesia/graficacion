import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Observacion } from '../../../models/observacion';
import { DatePipe } from '@angular/common';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { ModalEditarObservacion } from '../../modales/modal-editar-observacion/modal-editar-observacion';
import { Participante } from '../../../models/participantesProyecto.interface';

@Component({
  selector: 'observacion-card',
  imports: [DatePipe, ModalEditarObservacion],
  templateUrl: './observacion-card.html',
  styleUrl: './observacion-card.css',
})
export class ObservacionCard {
  private api = inject(Api);
  private toastr = inject(ToastrService);

  @Input() observacion: Observacion | null = null;
  @Input() listaParticipantesProyecto: Participante[] = [];

  @Output() eliminar = new EventEmitter<Observacion>();
  @Output() editar = new EventEmitter<Observacion>();

  esMenuBorrarVisible = false;
  esModalEditarObservacionVisible = false;
  esListaObservadosVisible = false;

  mostrarMenuBorrar() {
    this.esMenuBorrarVisible = true;
  }

  ocultarMenuBorrar() {
    this.esMenuBorrarVisible = false;
  }

  mostrarModalEditar() {
    this.esModalEditarObservacionVisible = true;
  }

  ocultarModalEditar() {
    this.esModalEditarObservacionVisible = false;
  }

  mostrarListaObservados() {
    this.esListaObservadosVisible = true;
  }

  ocultarListaObservados() {
    this.esListaObservadosVisible = false;
  }

  eliminarObservacion() {
    const idObservacion = this.observacion?.idobservacion;

    if (!idObservacion) {
      console.error('El id de la observación no se encuentra definido');
      return;
    }

    this.api.eliminarObservacion(idObservacion).subscribe({
      next: (observacionEliminada) => {
        this.toastr.success('Observación eliminada correctamente');
        this.eliminar.emit(observacionEliminada);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al eliminar la observación', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }
}

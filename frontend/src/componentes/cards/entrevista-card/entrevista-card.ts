import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Entrevista } from '../../../models/entrevista';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { ModalEditarEntrevista } from '../../modales/modal-editar-entrevista/modal-editar-entrevista';

@Component({
  selector: 'entrevista-card',
  imports: [ModalEditarEntrevista],
  templateUrl: './entrevista-card.html',
  styleUrl: './entrevista-card.css',
})
export class EntrevistaCard {
  private api = inject(Api);
  private toastr = inject(ToastrService);

  @Input() entrevista: Entrevista | null = null;
  @Input() listaParticipantes: Participante[] = [];

  @Output() editar = new EventEmitter<Entrevista>();
  @Output() eliminar = new EventEmitter<Entrevista>();
  @Output() entrevistaEditada = new EventEmitter<Entrevista>();

  esModalEditarEntrevistaVisible = false;
  estaModoEliminarActivo = false;

  eliminarEntrevista() {
    const idEntrevista = this.entrevista?.entrevista.identrevista;

    if (!idEntrevista) {
      console.error('El id de la entrevista no se encuentra definido');
      return;
    }

    this.api.eliminarEntrevista(idEntrevista).subscribe({
      next: (entrevistaEliminada) => {
        this.toastr.success('Entrevista eliminada correctamente');
        this.eliminar.emit(entrevistaEliminada);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al eliminar la entrevista', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  mostrarModalEditarEntrevista() {
    this.esModalEditarEntrevistaVisible = true;
  }

  ocultarModalEditarEntrevista() {
    this.esModalEditarEntrevistaVisible = false;
  }

  activarModoEliminar() {
    this.estaModoEliminarActivo = true;
  }

  desactivarModoEliminar() {
    this.estaModoEliminarActivo = false;
  }
}

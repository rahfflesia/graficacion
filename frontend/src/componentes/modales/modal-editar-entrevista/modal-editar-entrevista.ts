import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormEntrevistas } from '../../forms/form-entrevistas/form-entrevistas';
import { Entrevista } from '../../../models/entrevista';
import { Participante } from '../../../models/participantesProyecto.interface';

@Component({
  selector: 'modal-editar-entrevista',
  imports: [FormEntrevistas],
  templateUrl: './modal-editar-entrevista.html',
  styleUrl: './modal-editar-entrevista.css',
})
export class ModalEditarEntrevista {
  @Input() toggler = false;
  @Input() entrevista: Entrevista | null = null;
  @Input() participantes: Participante[] = [];

  copiaParticipantes: Participante[] = [];
  esModalAgregarParticipanteVisible = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() entrevistaEditada = new EventEmitter<Entrevista>();

  mostrarModalAgregarParticipante() {
    this.esModalAgregarParticipanteVisible = true;
  }

  cerrarModalAgregarParticipante() {
    this.esModalAgregarParticipanteVisible = false;
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}

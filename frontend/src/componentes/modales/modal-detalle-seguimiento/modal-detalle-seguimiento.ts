import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SeguimientoTransaccional } from '../../../models/seguimientoTransaccional';
import { ParticipanteCard } from '../../cards/participante-card/participante-card';

@Component({
  selector: 'modal-detalle-seguimiento',
  imports: [DatePipe, ParticipanteCard],
  templateUrl: './modal-detalle-seguimiento.html',
  styleUrl: './modal-detalle-seguimiento.css',
})
export class ModalDetalleSeguimiento {
  @Input() seguimiento: SeguimientoTransaccional | null = null;
  @Input() toggler: boolean = false;

  @Output() cerrar = new EventEmitter<void>();

  obtenerTextoTipoTransaccion(tipo?: string) {
    switch (tipo) {
      case 'Autom_tica':
        return 'Automática';
      case 'Sistema_externo':
        return 'Sistema externo';
      default:
        return tipo;
    }
  }

  obtenerTextoEstado(estado?: string) {
    switch (estado) {
      case 'En_proceso':
        return 'En proceso';
      default:
        return estado;
    }
  }
}

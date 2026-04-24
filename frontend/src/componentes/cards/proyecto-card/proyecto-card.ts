import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Proyectos } from '../../../models/proceso.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'proyecto-card',
  imports: [DatePipe],
  templateUrl: './proyecto-card.html',
  styleUrl: './proyecto-card.css',
})
export class ProyectoCard {
  @Input() datosProyecto!: Proyectos;

  @Output() eliminar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();
  @Output() configurar = new EventEmitter<void>();
  @Output() crearDiagrama = new EventEmitter<void>();

  eliminarProyecto() {
    this.eliminar.emit();
  }

  editarProyecto() {
    this.editar.emit();
  }

  configurarProyecto() {
    this.configurar.emit();
  }

  crearDiagramaProyecto() {
    this.crearDiagrama.emit();
  }

  obtenerColorFondo(estado: string) {
    switch (estado) {
      case 'Activo':
        return '#e0f7ff';
      case 'Pausado':
        return '#fffaa2';
      case 'Cancelado':
        return '#c4c4c4';
      // Sé que se ve raro pero así lo mapea prisma
      case 'En_revisi_n':
        return '#b5ffb2';
    }
    return '#ffcdcd';
  }

  obtenerColorFuente(estado: string) {
    switch (estado) {
      case 'Activo':
        return '#0085db';
      case 'Pausado':
        return '#bca837';
      case 'Cancelado':
        return '#515151';
      // Sé que se ve raro pero así lo mapea prisma
      case 'En_revisi_n':
        return '#11741e';
    }
    return '#ff0000';
  }
}

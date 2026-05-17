import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Proyectos } from '../../../models/proceso.interface';

@Component({
  selector: 'proyecto-card',
  imports: [],
  templateUrl: './proyecto-card.html',
  styleUrl: './proyecto-card.css',
})
export class ProyectoCard {
  @Input() datosProyecto!: Proyectos;

  @Output() eliminar = new EventEmitter<void>();
  @Output() configurar = new EventEmitter<void>();
  @Output() crearDiagrama = new EventEmitter<void>();
  @Output() generarEspecificaciones = new EventEmitter<void>();

  esMenuOpcionesVisible = false;

  mostrarMenuOpciones() {
    this.esMenuOpcionesVisible = true;
  }

  ocultarMenuOpciones() {
    this.esMenuOpcionesVisible = false;
  }

  eliminarProyecto() {
    this.eliminar.emit();
    this.ocultarMenuOpciones();
  }

  configurarProyecto() {
    this.configurar.emit();
    this.ocultarMenuOpciones();
  }

  crearDiagramaProyecto() {
    this.crearDiagrama.emit();
    this.ocultarMenuOpciones();
  }

  generarEspecificacionesProyecto() {
    this.generarEspecificaciones.emit();
    this.ocultarMenuOpciones();
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

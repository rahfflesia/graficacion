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

  eliminarProyecto() {
    this.eliminar.emit();
  }

  editarProyecto() {
    this.editar.emit();
  }
}

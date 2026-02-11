import { Component, Input } from '@angular/core';

@Component({
  selector: 'proyecto-card',
  imports: [],
  templateUrl: './proyecto-card.html',
  styleUrl: './proyecto-card.css',
})
export class ProyectoCard {
  @Input() datosProyecto: any;
}

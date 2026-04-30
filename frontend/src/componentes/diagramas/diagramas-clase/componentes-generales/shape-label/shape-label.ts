import { Component, input } from '@angular/core';
import { NgDiagramNodeSelectedDirective, NgDiagramNodeTemplate, type Node } from 'ng-diagram';

@Component({
  selector: 'shape-label',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [],
  templateUrl: './shape-label.html',
  styleUrl: './shape-label.css',
})
export class ShapeLabel implements NgDiagramNodeTemplate {
  node = input.required<Node>();
  estaModoEdicionActivado = false;

  activarModoEdicion() {
    this.estaModoEdicionActivado = true;
  }

  desactivarModoEdicion() {
    this.estaModoEdicionActivado = false;
  }
}

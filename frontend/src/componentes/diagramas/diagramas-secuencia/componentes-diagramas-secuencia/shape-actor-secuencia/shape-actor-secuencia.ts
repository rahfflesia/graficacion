import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeResizeAdornmentComponent,
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-actor-secuencia',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [FormsModule, NgDiagramNodeResizeAdornmentComponent, NgDiagramPortComponent],
  templateUrl: './shape-actor-secuencia.html',
  styleUrl: './shape-actor-secuencia.css',
})
export class ShapeActorSecuencia implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  estaEditandoNombre = false;

  activarEdicionNombre() {
    this.estaEditandoNombre = true;
  }

  desactivarEdicionNombre() {
    if (!this.node().data.nombreParticipante?.trim()) {
      this.node().data.nombreParticipante = 'Actor';
    }

    this.estaEditandoNombre = false;
  }
}

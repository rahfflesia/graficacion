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
  selector: 'shape-linea-vida',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [FormsModule, NgDiagramNodeResizeAdornmentComponent, NgDiagramPortComponent],
  templateUrl: './shape-linea-vida.html',
  styleUrl: './shape-linea-vida.css',
})
export class ShapeLineaVida implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  estaEditandoNombre = false;

  activarEdicionNombre() {
    this.estaEditandoNombre = true;
  }

  desactivarEdicionNombre() {
    if (!this.node().data.nombreParticipante?.trim()) {
      this.node().data.nombreParticipante = 'Participante';
    }

    this.estaEditandoNombre = false;
  }
}

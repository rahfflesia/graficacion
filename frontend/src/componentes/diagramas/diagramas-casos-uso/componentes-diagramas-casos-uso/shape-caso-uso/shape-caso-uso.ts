import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeResizeAdornmentComponent,
  NgDiagramNodeSelectedDirective,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-caso-uso',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramPortComponent, FormsModule, NgDiagramNodeResizeAdornmentComponent],
  templateUrl: './shape-caso-uso.html',
  styleUrl: './shape-caso-uso.css',
})
export class ShapeCasoUso {
  node: any = input.required<Node>();
  estaModoEdicionCasoUsoActivo = false;

  activarModoEdicionCasoUso() {
    this.estaModoEdicionCasoUsoActivo = true;
  }

  desactivarModoEdicionCasoUso() {
    this.estaModoEdicionCasoUsoActivo = false;
  }
}

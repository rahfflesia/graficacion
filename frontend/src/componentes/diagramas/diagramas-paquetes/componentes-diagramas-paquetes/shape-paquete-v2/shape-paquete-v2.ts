import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
  NgDiagramNodeResizeAdornmentComponent,
} from 'ng-diagram';

@Component({
  selector: 'app-shape-paquete-v2',
  imports: [NgDiagramPortComponent, FormsModule, NgDiagramNodeResizeAdornmentComponent],
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  templateUrl: './shape-paquete-v2.html',
  styleUrl: './shape-paquete-v2.css',
})
export class ShapePaqueteV2 implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  estaModoEdicionActivado = false;

  activarModoEdicion() {
    this.estaModoEdicionActivado = true;
  }

  desactivarModoEdicion() {
    this.estaModoEdicionActivado = false;
  }
}

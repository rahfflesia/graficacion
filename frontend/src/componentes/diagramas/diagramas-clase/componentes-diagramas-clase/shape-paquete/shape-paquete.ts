import { Component, input } from '@angular/core';
import {
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  type Node,
  NgDiagramPortComponent,
} from 'ng-diagram';

@Component({
  selector: 'shape-paquete',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramPortComponent],
  templateUrl: './shape-paquete.html',
  styleUrl: './shape-paquete.css',
})
export class ShapePaquete implements NgDiagramNodeTemplate {
  node = input.required<Node>();
}

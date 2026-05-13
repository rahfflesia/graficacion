import { Component, input } from '@angular/core';
import {
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-paquete',
  imports: [NgDiagramPortComponent],
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  templateUrl: './shape-paquete.html',
  styleUrl: './shape-paquete.css',
})
export class ShapePaquete implements NgDiagramNodeTemplate {
  node = input.required<Node>();
}

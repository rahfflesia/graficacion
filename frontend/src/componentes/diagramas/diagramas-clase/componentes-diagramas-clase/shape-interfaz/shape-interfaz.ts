import { Component, input } from '@angular/core';
import {
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-interfaz',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramPortComponent],
  templateUrl: './shape-interfaz.html',
  styleUrl: './shape-interfaz.css',
})
export class ShapeInterfaz implements NgDiagramNodeTemplate {
  node = input.required<Node>();
}

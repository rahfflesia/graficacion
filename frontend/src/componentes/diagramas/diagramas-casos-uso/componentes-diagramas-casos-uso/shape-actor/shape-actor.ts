import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'app-shape-actor',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramPortComponent, FormsModule],
  templateUrl: './shape-actor.html',
  styleUrl: './shape-actor.css',
})
export class ShapeActor implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  estaModoEdicionActorActivado = false;

  activarModoEdicionActor() {
    this.estaModoEdicionActorActivado = true;
  }

  desactivarModoEdicionActor() {
    this.estaModoEdicionActorActivado = false;
  }
}

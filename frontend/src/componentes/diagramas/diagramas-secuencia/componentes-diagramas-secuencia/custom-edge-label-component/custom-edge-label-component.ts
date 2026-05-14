import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Edge,
  NgDiagramBaseEdgeComponent,
  NgDiagramBaseEdgeLabelComponent,
  NgDiagramEdgeTemplate,
} from 'ng-diagram';

@Component({
  selector: 'custom-edge-label-component',
  imports: [NgDiagramBaseEdgeComponent, NgDiagramBaseEdgeLabelComponent, FormsModule],
  templateUrl: './custom-edge-label-component.html',
  styleUrl: './custom-edge-label-component.css',
})
export class CustomEdgeLabelComponent implements NgDiagramEdgeTemplate {
  edge: any = input.required<Edge>();
  estaModoEdicionLabelActivado = false;

  activarModoEdicionLabel() {
    this.estaModoEdicionLabelActivado = true;
  }

  desactivarModoEdicionLabel() {
    this.estaModoEdicionLabelActivado = false;
  }
}

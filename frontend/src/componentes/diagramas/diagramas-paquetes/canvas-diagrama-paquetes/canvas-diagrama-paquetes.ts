import { Component, inject, Injector, OnInit } from '@angular/core';
import {
  NgDiagramComponent,
  initializeModel,
  provideNgDiagram,
  NgDiagramMinimapComponent,
  NgDiagramNodeTemplateMap,
  NgDiagramEdgeTemplateMap,
  NgDiagramModelService,
  type EdgeDrawEndedEvent,
} from 'ng-diagram';
import { ShapePaquete } from '../componentes-diagramas-paquetes/shape-paquete/shape-paquete';
import { ShapeLabel } from '../../diagramas-clase/componentes-generales/shape-label/shape-label';
import { EdgeDependencia } from '../componentes-diagramas-paquetes/edge-dependencia/edge-dependencia';

@Component({
  selector: 'canvas-diagrama-paquetes',
  imports: [NgDiagramComponent, NgDiagramMinimapComponent],
  templateUrl: './canvas-diagrama-paquetes.html',
  styleUrl: './canvas-diagrama-paquetes.css',
  providers: [provideNgDiagram()],
})
export class CanvasDiagramaPaquetes implements OnInit {
  private modelService = inject(NgDiagramModelService);
  private injector = inject(Injector);

  estaAbiertoMenuLateral = false;

  nodos = this.modelService.nodes;
  enlaces = this.modelService.edges;
  metadatos = this.modelService.metadata;

  nodeTemplateMap = new NgDiagramNodeTemplateMap([
    ['paquete', ShapePaquete],
    ['etiqueta', ShapeLabel],
  ]);

  edgeTemplateMap = new NgDiagramEdgeTemplateMap([
    ['dependencia', EdgeDependencia],
  ]);

  model = initializeModel({
    nodes: [],
    edges: [],
  });

  ngOnInit(): void {
    if (this.cargarDiagramaPaquetes()) {
      console.log('Se ha encontrado un diagrama guardado, se cargará el diagrama');
    }
  }

  abrirMenuLateral() {
    this.estaAbiertoMenuLateral = true;
  }

  cerrarMenuLateral() {
    this.estaAbiertoMenuLateral = false;
  }

  agregarForma(tipoForma: string) {
    const idShape = (this.nodos().length + 1).toString();
    this.modelService.addNodes([
      {
        id: idShape,
        position: { x: 500, y: 350 },
        type: tipoForma,
        data: {},
      },
    ]);
  }

  onDragStart(event: DragEvent, tipoForma: string) {
    event.dataTransfer?.setData('text/plain', tipoForma);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const tipo = event.dataTransfer?.getData('text/plain');
    if (!tipo) {
      console.error('No se encontró el tipo de la forma');
      return;
    }
    this.agregarForma(tipo);
  }

  guardarDiagramaPaquetes() {
    const jsonString = this.model.toJSON();
    localStorage.setItem('diagrama-paquetes', jsonString);
  }

  cargarDiagramaPaquetes() {
    const diagrama = localStorage.getItem('diagrama-paquetes');
    if (diagrama) {
      const diagramaParseado = JSON.parse(diagrama);
      this.model = initializeModel(diagramaParseado, this.injector);
      return true;
    }
    return false;
  }

  onEdgeDrawEnded(event: EdgeDrawEndedEvent) {
    if (event.success && event.edge) {
      this.model.updateEdges((edges) =>
        edges.map((e) =>
          e.id === event.edge!.id ? { ...e, type: 'dependencia' } : e
        )
      );
    }
  }
}

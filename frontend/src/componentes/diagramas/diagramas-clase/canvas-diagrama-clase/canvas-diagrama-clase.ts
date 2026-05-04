import { Component, inject, Injector, OnInit, signal } from '@angular/core';
import {
  NgDiagramComponent,
  initializeModel,
  provideNgDiagram,
  NgDiagramMinimapComponent,
  NgDiagramNodeTemplateMap,
  NgDiagramModelService,
} from 'ng-diagram';
import { ShapeClase } from '../componentes-diagramas-clase/shape-clase/shape-clase';
import { ShapeInterfaz } from '../componentes-diagramas-clase/shape-interfaz/shape-interfaz';
import { ShapeEnum } from '../componentes-diagramas-clase/shape-enum/shape-enum';
import { ShapeLabel } from '../componentes-generales/shape-label/shape-label';
import { ShapePaquete } from '../componentes-diagramas-clase/shape-paquete/shape-paquete';
import { ActivatedRoute } from '@angular/router';
import { DiagramaClase } from '../../../../models/diagramas';
import { Api } from '../../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'canvas-diagrama-clase',
  imports: [NgDiagramComponent, NgDiagramMinimapComponent],
  templateUrl: './canvas-diagrama-clase.html',
  styleUrl: './canvas-diagrama-clase.css',
  providers: [provideNgDiagram()],
})
export class CanvasDiagramaClase implements OnInit {
  private modelService = inject(NgDiagramModelService);
  private injector = inject(Injector);
  private router = inject(ActivatedRoute);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  datosDiagrama = signal<DiagramaClase | null>(null);

  estaAbiertoMenuLateral = false;
  esDiagramaExistente = false;

  idproyecto: number | null = null;

  nodos = this.modelService.nodes;
  enlaces = this.modelService.edges;
  metadatos = this.modelService.metadata;

  nodeTemplateMap = new NgDiagramNodeTemplateMap([
    ['diagramaClase', ShapeClase],
    ['diagramaInterfaz', ShapeInterfaz],
    ['diagramaEnum', ShapeEnum],
    ['etiqueta', ShapeLabel],
    ['paquete', ShapePaquete],
  ]);

  model = initializeModel({
    nodes: [],
    edges: [],
  });

  ngOnInit(): void {
    this.idproyecto = parseInt(this.router.snapshot.paramMap.get('idproyecto')!);

    this.api.obtenerDiagrama({ idproyecto: this.idproyecto!, tipo: 'clase' }).subscribe({
      next: (diagrama) => {
        if (diagrama.contenido) {
          const diagramaParseado = JSON.parse(diagrama.contenido);
          this.model = initializeModel(diagramaParseado, this.injector);
          this.esDiagramaExistente = true;
        } else {
          console.log('No se encontró un diagrama asociado (es la primera vez que lo crea)');
        }

        if (diagrama) this.datosDiagrama.set(diagrama);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  abrirMenuLateral() {
    this.estaAbiertoMenuLateral = true;
  }

  cerrarMenuLateral() {
    this.estaAbiertoMenuLateral = false;
  }

  agregarForma(
    tipoForma: string,
    origen: 'click' | 'drag',
    coordenadas?: { x: number; y: number },
  ) {
    const idShape = (this.nodos().length + 1).toString();
    this.modelService.addNodes([
      {
        id: idShape,
        position: origen === 'drag' && coordenadas ? coordenadas : { x: 100, y: 200 },
        type: tipoForma,
        data: {
          etiqueta: 'Texto de prueba',
          nombre: 'Nombre',
          atributos: ['Atributo 1', 'Atributo 2'],
          metodos: ['métodoUno()', 'métodoDos()'],
          valores: ['valor1', 'valor2'],
        },
      },
    ]);
  }

  onDragStart(event: DragEvent, tipoForma: string) {
    event.dataTransfer?.setData('text/plain', tipoForma);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    const x = event.clientX;
    const y = event.clientY;
    const tipo = event.dataTransfer?.getData('text/plain');

    if (!tipo) {
      console.error('No se encontró el tipo de la forma');
      return;
    }

    this.agregarForma(tipo, 'drag', { x: x, y: y });
  }

  crearDiagramaClase() {
    const jsonString = this.model.toJSON();

    if (!this.idproyecto) {
      console.error('El id del proyecto no se encuentra definido');
      return;
    }

    const datosDiagrama: DiagramaClase = {
      idproyecto: this.idproyecto,
      tipo: 'clase',
      nombre: 'diagrama_clase',
      contenido: jsonString,
    };

    this.api.crearDiagrama(datosDiagrama).subscribe({
      next: () => {
        this.toastr.success('Se ha guardado el diagrama');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al guardar el diagrama', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  editarDiagramaClase() {
    const jsonString = this.model.toJSON();

    if (!this.idproyecto || !this.datosDiagrama()) {
      return;
    }

    const datosDiagrama: DiagramaClase = {
      ...this.datosDiagrama()!,
      contenido: jsonString,
    };

    delete datosDiagrama.iddiagrama;

    this.api.editarDiagrama(this.datosDiagrama()?.iddiagrama!, datosDiagrama).subscribe({
      next: () => {
        this.toastr.success('Diagrama guardado correctamente');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al guardar el diagrama', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }
}

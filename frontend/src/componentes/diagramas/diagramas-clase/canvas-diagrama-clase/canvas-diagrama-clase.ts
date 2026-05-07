import { Component, inject, Injector, OnInit, signal } from '@angular/core';
import {
  NgDiagramComponent,
  initializeModel,
  provideNgDiagram,
  NgDiagramMinimapComponent,
  NgDiagramNodeTemplateMap,
  NgDiagramModelService,
  type NgDiagramConfig,
} from 'ng-diagram';
import { ShapeClase } from '../componentes-diagramas-clase/shape-clase/shape-clase';
import { ShapeInterfaz } from '../componentes-diagramas-clase/shape-interfaz/shape-interfaz';
import { ShapeEnum } from '../componentes-diagramas-clase/shape-enum/shape-enum';
import { ShapeLabel } from '../componentes-generales/shape-label/shape-label';
import { ShapePaquete } from '../componentes-diagramas-clase/shape-paquete/shape-paquete';
import { ActivatedRoute, Router } from '@angular/router';
import { DiagramaClase } from '../../../../models/diagramas';
import { Api } from '../../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { ShapeActor } from '../../diagramas-casos-uso/componentes-diagramas-casos-uso/shape-actor/shape-actor';
import { ShapeCasoUso } from '../../diagramas-casos-uso/componentes-diagramas-casos-uso/shape-caso-uso/shape-caso-uso';
import { ShapeBoundary } from '../../diagramas-casos-uso/componentes-diagramas-casos-uso/shape-boundary/shape-boundary';
import { FormsModule } from '@angular/forms';
import { ModalEliminarDiagrama } from '../../../modales/modal-eliminar-diagrama/modal-eliminar-diagrama';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'canvas-diagrama-clase',
  imports: [
    NgDiagramComponent,
    NgDiagramMinimapComponent,
    FormsModule,
    ModalEliminarDiagrama,
    DatePipe,
  ],
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
  private routerRutas = inject(Router);

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
    ['actor', ShapeActor],
    ['casoUso', ShapeCasoUso],
    ['boundary', ShapeBoundary],
  ]);

  nombreDiagrama = 'Sin nombre';
  estaEdicionNombreDiagramaActiva = false;

  nombreProyecto = '';

  model = initializeModel({
    nodes: [],
    edges: [],
  });

  intervalId = 0;

  tipoDiagramaSeleccionado = signal<string | null>(null);

  // Vacío porque no tengo acceso aún
  config: NgDiagramConfig = {};

  esModalEliminarDiagramaVisible = false;

  ultimoModeloGuardado = '';

  ngOnInit(): void {
    this.idproyecto = parseInt(this.router.snapshot.paramMap.get('idproyecto')!);
    const tipo = this.router.snapshot.paramMap.get('tipo');

    this.tipoDiagramaSeleccionado.set(tipo);

    // Aquí hago la declaración porque ya tengo acceso al tipo
    this.config = {
      edgeRouting: {
        defaultRouting: this.tipoDiagramaSeleccionado() === 'casos_uso' ? 'polyline' : 'orthogonal',
      },
    };

    this.api
      .obtenerDiagrama({
        idproyecto: this.idproyecto!,
        tipo: this.tipoDiagramaSeleccionado() as 'paquetes' | 'casos_uso' | 'secuencia' | 'clase',
      })
      .subscribe({
        next: (diagrama) => {
          if (diagrama && diagrama.contenido) {
            const diagramaParseado = JSON.parse(diagrama.contenido);
            this.model = initializeModel(diagramaParseado, this.injector);
            this.esDiagramaExistente = true;
            // Detector de cambios para realizar autoguardado
            // Instancia del componente cuando ya es existente
          } else {
            console.log('No se encontró un diagrama asociado (es la primera vez que lo crea)');
          }

          if (diagrama) {
            this.datosDiagrama.set(diagrama);
            this.nombreDiagrama = diagrama.nombre;
          }
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Ha ocurrido un error', '', {
            toastClass: 'toastr-error',
          });
        },
      });

    this.api.obtenerDatosProyecto(this.idproyecto).subscribe({
      next: (datosProyecto) => {
        this.nombreProyecto = datosProyecto.nombre;
        console.log(datosProyecto);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al obtener los datos del proyecto', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  activarEdicionNombreDiagrama() {
    this.estaEdicionNombreDiagramaActiva = true;
  }

  desactivarEdicionNombreDiagrama() {
    if (!this.nombreDiagrama.trim()) {
      this.nombreDiagrama = this.datosDiagrama()?.nombre ?? 'Sin nombre';
    }

    this.estaEdicionNombreDiagramaActiva = false;
  }

  abrirMenuLateral() {
    this.estaAbiertoMenuLateral = true;
  }

  cerrarMenuLateral() {
    this.estaAbiertoMenuLateral = false;
  }

  mostrarModalEliminarDiagrama() {
    this.esModalEliminarDiagramaVisible = true;
  }

  ocultarModalEliminarDiagrama() {
    this.esModalEliminarDiagramaVisible = false;
  }

  agregarForma(
    tipoForma: string,
    origen: 'click' | 'drag',
    coordenadas?: { x: number; y: number },
  ) {
    const idShape = crypto.randomUUID();
    this.modelService.addNodes([
      tipoForma === 'boundary'
        ? {
            id: idShape,
            position: origen === 'drag' && coordenadas ? coordenadas : { x: 100, y: 200 },
            type: tipoForma,
            data: {
              etiqueta: 'Texto de prueba',
              nombre: 'Nombre',
              atributos: ['Atributo 1', 'Atributo 2'],
              metodos: ['métodoUno()', 'métodoDos()'],
              valores: ['valor1', 'valor2'],
              textoActor: 'Texto de prueba',
              textoCasoUso: 'Texto caso de uso',
              nombreBoundary: 'Nombre',
            },
            // Propiedad para poder agrupar componentes dentro del boundary
            isGroup: true,
          }
        : {
            id: idShape,
            position: origen === 'drag' && coordenadas ? coordenadas : { x: 100, y: 200 },
            type: tipoForma,
            data: {
              etiqueta: 'Texto de prueba',
              nombre: 'Nombre',
              atributos: ['Atributo 1', 'Atributo 2'],
              metodos: ['métodoUno()', 'métodoDos()'],
              valores: ['valor1', 'valor2'],
              textoActor: 'Texto de prueba',
              textoCasoUso: 'Texto caso de uso',
            },
          },
    ]);
  }

  onDragStart(event: DragEvent, tipoForma: string) {
    event.dataTransfer?.setData('text/plain', tipoForma);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const x = event.clientX;
    const y = event.clientY;
    const tipo = event.dataTransfer?.getData('text/plain');

    if (!tipo) {
      console.error('No se encontró el tipo de la forma');
      return;
    }

    this.agregarForma(tipo, 'drag', { x: x, y: y });
  }

  onDragover(event: DragEvent) {
    event.preventDefault();
  }

  crearDiagrama() {
    const jsonString = this.model.toJSON();

    if (!this.idproyecto) {
      console.error('El id del proyecto no se encuentra definido');
      return;
    }

    const datosDiagrama: DiagramaClase = {
      idproyecto: this.idproyecto,
      tipo: this.tipoDiagramaSeleccionado() as 'clase' | 'paquetes' | 'casos_uso' | 'secuencia',
      nombre: this.nombreDiagrama,
      contenido: jsonString,
    };

    this.api.crearDiagrama(datosDiagrama).subscribe({
      next: (datosDiagrama) => {
        this.toastr.success('Se ha guardado el diagrama');
        this.esDiagramaExistente = true;
        this.datosDiagrama.set(datosDiagrama);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al guardar el diagrama', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  editarDiagrama() {
    const jsonString = this.model.toJSON();

    if (!this.idproyecto || !this.datosDiagrama()) {
      return;
    }

    const { iddiagrama, ...resto } = this.datosDiagrama()!;

    const datosDiagrama: DiagramaClase = {
      ...resto,
      nombre: this.nombreDiagrama,
      contenido: jsonString,
      ultimaedicion: new Date().toISOString(),
    };

    this.api.editarDiagrama(iddiagrama!, datosDiagrama).subscribe({
      next: (datosDiagramaEditado) => {
        this.toastr.success('Diagrama guardado correctamente');
        this.datosDiagrama.set(datosDiagramaEditado);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al guardar el diagrama', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  eliminarDiagrama() {
    if (this.esDiagramaExistente) {
      const idDiagrama = this.datosDiagrama()?.iddiagrama;

      if (!idDiagrama) {
        console.error('Ha ocurrido un error al eliminar el diagrama');
        return;
      }

      this.api.eliminarDiagrama(idDiagrama).subscribe({
        next: () => {
          this.toastr.success('Diagrama eliminado correctamente');
          this.ocultarModalEliminarDiagrama();
          this.routerRutas.navigateByUrl('/proyectos');
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Ha ocurrido un error al eliminar el diagrama', '', {
            toastClass: 'toastr-error',
          });
        },
      });
    }
  }
}

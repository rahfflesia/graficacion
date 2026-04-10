import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import { Cuestionario, DatosFormularioCuestionario, Pregunta } from '../../../models/cuestionario';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'seccion-cuestionarios',
  imports: [ReactiveFormsModule],
  templateUrl: './seccion-cuestionarios.html',
  styleUrl: './seccion-cuestionarios.css',
})
export class SeccionCuestionarios {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  subproceso: Subproceso | undefined = undefined;
  participantes = signal<Participante[]>([]);
  cuestionariosExistentes = signal<Cuestionario[]>([]);

  formularioCuestionario = this.formBuilder.group({
    nombreCuestionario: ['', [Validators.required]],
    descripcionCuestionario: ['', [Validators.required]],
    idPersona: ['', [Validators.required]],
    preguntas: this.formBuilder.array([], [Validators.required]),
  });

  constructor() {
    const datosNavegacion = this.router.currentNavigation();
    if (!datosNavegacion?.extras.state) return;

    const datosTecnica = datosNavegacion.extras.state['datosTecnica'];
    if (!datosTecnica) return;

    this.participantes.set(datosTecnica.participantes ?? []);
    this.subproceso = datosTecnica.subproceso;

    this.cargarCuestionariosExistentes();
  }

  get preguntasFormArray(): FormArray {
    return this.formularioCuestionario.get('preguntas') as FormArray;
  }

  agregarPregunta() {
    const grupoPregunta = this.formBuilder.group({
      textoPregunta: ['', [Validators.required]],
      tipoPregunta: ['Abierta', [Validators.required]],
      opciones: this.formBuilder.array([]),
    });

    this.preguntasFormArray.push(grupoPregunta);
  }

  eliminarPregunta(indice: number) {
    this.preguntasFormArray.removeAt(indice);
  }

  obtenerOpcionesFormArray(indicePregunta: number): FormArray {
    const pregunta = this.preguntasFormArray.at(indicePregunta) as FormGroup;
    return pregunta.get('opciones') as FormArray;
  }

  agregarOpcion(indicePregunta: number) {
    const opciones = this.obtenerOpcionesFormArray(indicePregunta);
    opciones.push(this.formBuilder.control('', Validators.required));
  }

  eliminarOpcion(indicePregunta: number, indiceOpcion: number) {
    const opciones = this.obtenerOpcionesFormArray(indicePregunta);
    opciones.removeAt(indiceOpcion);
  }

  obtenerTipoPregunta(indicePregunta: number): string {
    const pregunta = this.preguntasFormArray.at(indicePregunta) as FormGroup;
    return pregunta.get('tipoPregunta')?.value ?? 'Abierta';
  }

  alCambiarTipoPregunta(indicePregunta: number) {
    const tipo = this.obtenerTipoPregunta(indicePregunta);
    const opciones = this.obtenerOpcionesFormArray(indicePregunta);

    if (tipo !== 'Opción múltiple') {
      opciones.clear();
    } else if (opciones.length === 0) {
      this.agregarOpcion(indicePregunta);
      this.agregarOpcion(indicePregunta);
    }
  }

  cargarCuestionariosExistentes() {
    if (!this.subproceso?.idsubproceso) return;
    this.api.obtenerCuestionarios(this.subproceso.idsubproceso).subscribe({
      next: (cuestionarios) => {
        this.cuestionariosExistentes.set(cuestionarios);
      },
      error: (error) => {
        console.error('Error al cargar cuestionarios:', error);
      },
    });
  }

  crearCuestionario() {
    const preguntas: Pregunta[] = this.preguntasFormArray.controls.map((control) => {
      const grupo = control as FormGroup;
      return {
        textoPregunta: grupo.get('textoPregunta')?.value,
        tipoPregunta: grupo.get('tipoPregunta')?.value,
        opciones: (grupo.get('opciones') as FormArray).controls.map((c) => c.value),
      };
    });

    const datosCuestionario: DatosFormularioCuestionario = {
      idSubproceso: this.subproceso?.idsubproceso!,
      nombre: this.formularioCuestionario.value.nombreCuestionario!,
      descripcion: this.formularioCuestionario.value.descripcionCuestionario!,
      idCreador: parseInt(this.formularioCuestionario.value.idPersona!),
      preguntas,
    };

    this.api.crearCuestionario(datosCuestionario).subscribe({
      next: () => {
        this.toastr.success('Cuestionario creado exitosamente');
        this.formularioCuestionario.reset();
        this.preguntasFormArray.clear();
        this.cargarCuestionariosExistentes();
      },
      error: (error) => {
        console.error('Error al crear cuestionario:', error);
        this.toastr.error('Error al crear el cuestionario', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  eliminarCuestionario(idCuestionario: number) {
    this.api.eliminarCuestionario(idCuestionario).subscribe({
      next: () => {
        this.toastr.success('Cuestionario eliminado');
        this.cargarCuestionariosExistentes();
      },
      error: (error) => {
        console.error('Error al eliminar cuestionario:', error);
        this.toastr.error('Error al eliminar el cuestionario', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }
}

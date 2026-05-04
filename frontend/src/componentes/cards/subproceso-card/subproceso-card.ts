import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Subproceso } from '../../../models/subprocesos.interface';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Proceso } from '../../../models/procesos.interface';
import { TecnicaRecoleccion } from '../../../models/tecnicasRecoleccion.interface';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';

@Component({
  selector: 'subproceso-card',
  imports: [ReactiveFormsModule],
  templateUrl: './subproceso-card.html',
  styleUrl: './subproceso-card.css',
})
export class SubprocesoCard {
  @Input() subproceso: Subproceso | undefined;
  @Input() procesosProyecto: Proceso[] = [];
  @Input() tecnicasRecoleccion: TecnicaRecoleccion[] = [];
  @Input() participantes: Participante[] = [];

  @Output() editar = new EventEmitter<Subproceso>();
  @Output() eliminar = new EventEmitter<Subproceso>();

  private api = inject(Api);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  formularioEditarSubproceso = this.formBuilder.group({
    nombreSubproceso: ['', [Validators.required]],
    descripcionSubproceso: ['', [Validators.required]],
    procesoAsociado: ['', [Validators.required]],
    tecnicasAsociadas: this.formBuilder.array([], [this.tieneTecnicaSeleccionada()]),
  });

  estaBorrando = false;
  estaEditando = false;

  get tecnicasAsociadasSubproceso() {
    return this.formularioEditarSubproceso.get('tecnicasAsociadas') as FormArray;
  }

  obtenerControlFormularioEditarSubproceso(nombreControl: string) {
    return this.formularioEditarSubproceso.get(nombreControl);
  }

  mostrarMenuBorrar() {
    this.estaBorrando = true;
  }

  cerrarMenuBorrar() {
    this.estaBorrando = false;
  }

  mostrarMenuEditar() {
    this.estaEditando = true;

    const nombreSubproceso = this.subproceso?.nombresubproceso;
    const descripcionSubproceso = this.subproceso?.descripcionsubproceso;
    const idProcesoAsociado = this.subproceso?.idproceso.toString();

    if (!nombreSubproceso || !descripcionSubproceso || !idProcesoAsociado) {
      console.error('Alguno(s) de los datos necesarios no se encuentran definidos');
      return;
    }

    this.formularioEditarSubproceso.patchValue({
      nombreSubproceso: nombreSubproceso,
      descripcionSubproceso: descripcionSubproceso,
      procesoAsociado: idProcesoAsociado,
    });

    this.cargarTecnicas();
  }

  cerrarMenuEditar() {
    this.estaEditando = false;
  }

  editarSubproceso() {
    const { nombreSubproceso, descripcionSubproceso, procesoAsociado } =
      this.formularioEditarSubproceso.value;
    const tecnicasSeleccionadas = this.obtenerTecnicasAsociadasEditadas();

    if (!procesoAsociado) {
      console.error('El proceso asociado al subproceso no se encuentra definido');
      return;
    }

    if (!nombreSubproceso) {
      console.error('El nombre del subproceso no puede ser null o undefined');
      return;
    }

    if (!descripcionSubproceso) {
      console.error('La descripción del subproceso no puede ser null o undefined');
      return;
    }

    if (!this.subproceso?.idsubproceso) {
      console.error('El id del subproceso es null o undefined');
      return;
    }

    const idProcesoAsociado = parseInt(procesoAsociado);
    const datosEditadosSubproceso = {
      nombreSubproceso,
      descripcionSubproceso,
      idProcesoAsociado,
      tecnicasSeleccionadas,
    };

    this.api.editarSubproceso(this.subproceso?.idsubproceso, datosEditadosSubproceso).subscribe({
      next: (subprocesoEditado) => {
        this.editar.emit(subprocesoEditado);
        this.toastr.success('Subproceso editado correctamente');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al editar el subproceso', '', {
          toastClass: 'toastr-error',
        });
      },
    });

    this.cerrarMenuEditar();
  }

  eliminarSubproceso() {
    const idSubproceso = this.subproceso?.idsubproceso;
    if (!idSubproceso) {
      console.error('El id del subproceso es null o undefined');
      return;
    }
    this.api.eliminarSubproceso(idSubproceso).subscribe({
      next: (subprocesoEliminado) => {
        this.toastr.success('El subproceso se eliminó correctamente');
        this.eliminar.emit(subprocesoEliminado);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al eliminar el subproceso', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.cerrarMenuBorrar();
  }

  // Para que haga bien el cálculo el array debe de estar ordenado por id, ya lo traigo así desde el backend nada más no lo vayan a modificar
  obtenerTecnicasAsociadas() {
    const tecnicasAsociadas = this.subproceso?.tecnicasasociadas;

    if (!tecnicasAsociadas) {
      console.error('Las técnicas asociadas no se encuentran definidas');
      return;
    }

    let arrayControles = [];
    // Checo cuales técnicas ya son aplicadas al proceso
    for (let i = 0; i < this.tecnicasRecoleccion.length; i++) {
      for (let j = 0; j < tecnicasAsociadas.length; j++) {
        if (
          this.tecnicasRecoleccion[i].idtecnicarecoleccion ===
          tecnicasAsociadas[j].idtecnicarecoleccion
        ) {
          arrayControles[i] = new FormControl(true);
        }
      }
    }

    // Relleno los huecos vacíos del arreglo con chekcbox no seleccionadas
    for (let i = 0; i < this.tecnicasRecoleccion.length; i++) {
      if (!(arrayControles[i] instanceof FormControl)) {
        arrayControles[i] = new FormControl(false);
      }
    }

    return arrayControles;
  }

  cargarTecnicas() {
    if (this.tecnicasAsociadasSubproceso.length < 1) {
      const checkboxesTecnicasAsociadas = this.obtenerTecnicasAsociadas();
      checkboxesTecnicasAsociadas?.map((control) => this.tecnicasAsociadasSubproceso.push(control));
    }
  }

  tieneTecnicaSeleccionada(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let boolean = false;
      control.value.forEach((checkbox: boolean) => {
        if (checkbox) {
          boolean = true;
        }
      });
      return boolean ? null : { sinTecnicaSeleccionada: true };
    };
  }

  obtenerNombreTecnica(index: number) {
    return this.tecnicasRecoleccion[index].nombre;
  }

  obtenerTecnicasAsociadasEditadas() {
    let tecnicasSeleccionadas: TecnicaRecoleccion[] = [];
    const checkboxesTecnicas = this.formularioEditarSubproceso.value.tecnicasAsociadas;
    checkboxesTecnicas?.forEach((boolean, index) => {
      if (boolean) tecnicasSeleccionadas.push(this.tecnicasRecoleccion[index]);
    });
    return tecnicasSeleccionadas;
  }

  goToSeccionTecnicaSeleccionada(nombreTecnica: string) {
    // La única ruta que funciona es la de observaciones de momento
    const datosTecnica = {
      participantes: this.participantes,
      subproceso: this.subproceso,
      // La id del proyecto es la misma para todos por lo que no importa, con tomar la de un elemento está bien
      idproyecto: this.procesosProyecto[0].idproyecto,
    };
    localStorage.setItem('datosTecnicaActual', JSON.stringify(datosTecnica));

    switch (nombreTecnica) {
      case 'Entrevista':
        this.router.navigate(['/entrevistas'], { state: { datosTecnica } });
        break;
      case 'Observacion':
        this.router.navigate(['/observaciones'], { state: { datosTecnica } });
        break;
      case 'Cuestionario':
        this.router.navigate(['/cuestionarios'], { state: { datosTecnica } });
        break;
      case 'Historia de usuario':
        this.router.navigate(['/historiasusuario'], { state: { datosTecnica } });
        break;
      case 'Focus group':
        this.router.navigate(['/focusgroup']);
        break;
      case 'Análisis de documento':
        this.router.navigate(['/analisisdocumento']);
        break;
      case 'Seguimiento transaccional':
        this.router.navigate(['/seguimientotransaccional']);
        break;
      default:
        console.error('Valor inválido');
    }
  }
}

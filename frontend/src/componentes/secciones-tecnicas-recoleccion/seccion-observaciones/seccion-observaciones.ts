import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import { DatosFormularioObservacion, Observacion } from '../../../models/observacion';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { ModalCarga } from '../../modales/modal-carga/modal-carga';
import { ObservacionCard } from '../../cards/observacion-card/observacion-card';
import { editar, eliminar } from '../../../crud-helpers/crudHelpers';

@Component({
  selector: 'seccion-observaciones',
  imports: [ReactiveFormsModule, ModalCarga, ObservacionCard],
  templateUrl: './seccion-observaciones.html',
  styleUrl: './seccion-observaciones.css',
})
export class SeccionObservaciones implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  datosTecnica = signal<{ subproceso: Subproceso; participantes: Participante[] } | null>(null);
  subproceso: Subproceso | undefined = undefined;

  formularioObservaciones = this.formBuilder.group({
    nombreObservacion: ['', [Validators.required]],
    descripcionObservacion: ['', [Validators.required]],
    idPersona: ['', [Validators.required]],
    fechaHoraCaptura: ['', [Validators.required]],
    nombreLugar: ['', [Validators.required]],
    observados: [''],
    checkboxFechaHora: [false],
    checkboxesParticipantes: this.formBuilder.array([]),
    campoBusqueda: [
      '',
      [this.estaListaParticipantesVacia(), this.estaObservadorEnListaObservados()],
    ],
  });

  tipoObservacionSeleccionada = signal<'Pasiva' | 'Activa'>('Pasiva');
  participantes = signal<Participante[]>([]);
  observaciones = signal<Observacion[]>([]);
  estanCargandoObservaciones = true;
  participantesFiltrados: { participante: Participante; indiceOriginal: number }[] = [];
  listaParticipantesAgregados: Participante[] = [];

  constructor() {
    const datosNavegacion = this.router.currentNavigation();
    if (!datosNavegacion?.extras.state) return;
    const datosTecnica = datosNavegacion?.extras.state['datosTecnica'];
    this.datosTecnica.set(datosTecnica);

    this.seleccionarOpcion('Pasiva');
    this.actualizarValidezCheckbox();
    // Aquí usé el operador de non null assertion, tengo que cambiar eso, no olvidar!!
    if (
      this.datosTecnica()?.participantes === undefined ||
      this.datosTecnica()?.participantes === null
    ) {
      console.error('La lista de participantes del proyecto no se encuentra definida');
      return;
    }

    this.participantes.set(this.datosTecnica()?.participantes!);
    this.subproceso = this.datosTecnica()?.subproceso;

    // Por cada participante creo un checkbox y lo establezco en falso
    const checkboxParticipante = this.participantes().map(() => new FormControl(false));
    checkboxParticipante.forEach((control) => this.checkboxFormArray.push(control));
  }

  ngOnInit(): void {
    const idSubproceso = this.subproceso?.idsubproceso;
    if (!idSubproceso) {
      console.error('La id del subproceso no está definida');
      return;
    }
    this.api.obtenerObservaciones(idSubproceso).subscribe({
      next: (observaciones) => {
        this.observaciones.set(observaciones);
        this.estanCargandoObservaciones = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al obtener las observaciones', '', {
          toastClass: 'toastr-error',
        });
        this.estanCargandoObservaciones = false;
      },
    });
  }

  get checkboxFormArray() {
    return this.formularioObservaciones.get('checkboxesParticipantes') as FormArray;
  }

  obtenerControlFormularioObservaciones(nombreControl: string) {
    return this.formularioObservaciones.get(nombreControl);
  }

  filtrarParticipantes() {
    if (!this.participantes()) {
      console.error('La lista de participantes no se encuentra definida');
      return;
    }

    const valorCampoBusqueda = this.formularioObservaciones.value.campoBusqueda ?? '';

    this.participantesFiltrados = this.participantes()
      .map((participante, index) => ({ participante, indiceOriginal: index }))
      .filter(({ participante }) => {
        const nombreCompleto = `${participante.nombre} ${participante.apellidouno} ${participante.apellidodos ?? ''}`;
        return nombreCompleto.toLowerCase().includes(valorCampoBusqueda.toLowerCase());
      });
  }

  estaCheckboxFechaHoraSeleccionado() {
    const valorCheckbox = this.formularioObservaciones.value.checkboxFechaHora;
    if (valorCheckbox === null || valorCheckbox === undefined) {
      console.error('El valor del checkbox no se encuentra definido');
      return;
    }
    return valorCheckbox;
  }

  actualizarValidezCheckbox() {
    const inputFechaHoraCaptura = this.formularioObservaciones.get('fechaHoraCaptura');
    if (this.estaCheckboxFechaHoraSeleccionado()) {
      inputFechaHoraCaptura?.enable();
      console.log('El input de fecha y hora se encuentra habilitado');
    } else {
      inputFechaHoraCaptura?.disable();
      console.log('El input de fecha y hora se encuentra deshabilitado');
    }
    inputFechaHoraCaptura?.setValue('');
    this.formularioObservaciones.updateValueAndValidity();
  }

  seleccionarOpcion(nombreOpcion: 'Pasiva' | 'Activa') {
    const inputObservados = this.formularioObservaciones.get('observados');
    const inputBusqueda = this.obtenerControlFormularioObservaciones('campoBusqueda');
    switch (nombreOpcion) {
      case 'Pasiva':
        inputObservados?.disable();
        inputObservados?.setValue('');

        // Deshabilito el campo de búsqueda para que no afecte las validaciones del formulario
        inputBusqueda?.disable();
        inputBusqueda?.setValue('');
        break;
      case 'Activa':
        inputObservados?.enable();
        inputObservados?.setValue('');

        inputBusqueda?.enable();
        inputBusqueda?.setValue('');
        this.listaParticipantesAgregados = [];
        break;
    }
    this.tipoObservacionSeleccionada.set(nombreOpcion);
    this.formularioObservaciones.updateValueAndValidity();
    inputBusqueda?.updateValueAndValidity();
  }

  // Estos métodos interactuan con el arreglo donde almaceno los observados, lo especifico para que no se confundan
  // por los nombres
  agregarParticipante(objetoParticipante: { participante: Participante; indiceOriginal: number }) {
    const campoBusqueda = this.obtenerControlFormularioObservaciones('campoBusqueda');
    const participante = this.participantes()[objetoParticipante.indiceOriginal];
    const checkboxesParticipantes = this.formularioObservaciones.value
      .checkboxesParticipantes as Boolean[];
    const checkboxSeleccionada = checkboxesParticipantes[objetoParticipante.indiceOriginal];
    if (checkboxSeleccionada) this.listaParticipantesAgregados.push(participante);
    else {
      const indiceParticipanteAEliminar = this.listaParticipantesAgregados.findIndex(
        (participante) => participante.idpersona === objetoParticipante.participante.idpersona,
      );
      this.eliminarParticipante(indiceParticipanteAEliminar);
    }
    campoBusqueda?.updateValueAndValidity();
  }

  eliminarParticipante(indice: number, participante?: Participante) {
    // Aquí borro en el array de participantes agregados
    this.listaParticipantesAgregados.splice(indice, 1);
    const campoBusqueda = this.obtenerControlFormularioObservaciones('campoBusqueda');
    campoBusqueda?.updateValueAndValidity();
    campoBusqueda?.markAsDirty();

    if (participante) {
      // Acá modifico el valor de la checkbox usando el indice original para eliminar bugs visuales con los checkbox
      const checkboxesParticipantes = this.checkboxFormArray.controls;
      const indiceOriginalParticipante = this.participantes().findIndex(
        (participanteListaOriginal) =>
          participante.idpersona === participanteListaOriginal.idpersona,
      );
      checkboxesParticipantes[indiceOriginalParticipante].setValue(false);
    }
  }

  crearObservacion() {
    const datosObservacion: DatosFormularioObservacion = {
      idsubproceso: this.subproceso?.idsubproceso!,
      nombre: this.formularioObservaciones.value.nombreObservacion!,
      descripcion: this.formularioObservaciones.value.descripcionObservacion!,
      idobservador: parseInt(this.formularioObservaciones.value.idPersona!),
      lugar: this.formularioObservaciones.value.nombreLugar!,
      tipo: this.tipoObservacionSeleccionada(),
      listaobservados: this.listaParticipantesAgregados,
      fechahoracaptura: new Date(this.formularioObservaciones.value.fechaHoraCaptura!),
    };

    this.api.crearObservacion(datosObservacion).subscribe({
      next: (observacion) => {
        this.observaciones.update((observaciones) => [observacion, ...observaciones]);
        this.toastr.success('Observacion creada correctamente');
        console.log(this.observaciones());
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al crear la observación', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  estaListaParticipantesVacia(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.listaParticipantesAgregados) return null;
      return this.listaParticipantesAgregados.length < 1 &&
        this.tipoObservacionSeleccionada() === 'Activa'
        ? { listaVacia: true }
        : null;
    };
  }

  estaObservadorEnListaObservados(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.formularioObservaciones) return null;
      const idObservador = parseInt(this.obtenerControlFormularioObservaciones('idPersona')?.value);
      const estaObservadorEnLista = this.listaParticipantesAgregados.some(
        (participante) => idObservador === participante.idpersona,
      );
      return estaObservadorEnLista ? { observadorEnListaObservados: true } : null;
    };
  }

  eliminarObservacion(observacionEliminada: Observacion) {
    eliminar(this.observaciones, observacionEliminada, 'idobservacion');
  }

  editarObservacion(observacionEditada: Observacion) {
    editar(this.observaciones, observacionEditada, 'idobservacion');
  }
}

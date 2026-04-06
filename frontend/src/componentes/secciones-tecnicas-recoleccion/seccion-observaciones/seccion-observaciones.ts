import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import { DatosFormularioObservacion } from '../../../models/observacion';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'seccion-observaciones',
  imports: [ReactiveFormsModule],
  templateUrl: './seccion-observaciones.html',
  styleUrl: './seccion-observaciones.css',
})
export class SeccionObservaciones {
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
    observados: ['', [Validators.required]],
    checkboxFechaHora: [false],
    checkboxesParticipantes: this.formBuilder.array([]),
  });

  tipoObservacionSeleccionada = signal<'Pasiva' | 'Activa'>('Pasiva');
  participantes = signal<Participante[]>([]);
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

  get checkboxFormArray() {
    return this.formularioObservaciones.get('checkboxesParticipantes') as FormArray;
  }

  filtrarNombres(nuevoValor: string) {
    if (!this.participantes()) {
      console.error('La lista de participantes no se encuentra definida');
      return;
    }

    this.participantesFiltrados = this.participantes()
      .map((participante, index) => ({ participante, indiceOriginal: index }))
      .filter(({ participante }) => {
        const nombreCompleto = `${participante.nombre} ${participante.apellidouno} ${participante.apellidodos ?? ''}`;
        return nombreCompleto.toLowerCase().includes(nuevoValor.toLowerCase());
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
    switch (nombreOpcion) {
      case 'Pasiva':
        inputObservados?.disable();
        inputObservados?.setValue('');
        break;
      case 'Activa':
        inputObservados?.enable();
        inputObservados?.setValue('');
        break;
    }
    this.tipoObservacionSeleccionada.set(nombreOpcion);
    this.formularioObservaciones.updateValueAndValidity();
  }

  // Estos métodos interactuan con el arreglo donde almaceno los observados, lo especifico para que no se confundan
  // por los nombres
  agregarParticipante(objetoParticipante: { participante: Participante; indiceOriginal: number }) {
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
  }

  eliminarParticipante(indice: number) {
    this.listaParticipantesAgregados.splice(indice, 1);
  }

  crearObservacion() {
    const datosObservacion: DatosFormularioObservacion = {
      idSubproceso: this.subproceso?.idsubproceso!,
      nombre: this.formularioObservaciones.value.nombreObservacion!,
      descripcion: this.formularioObservaciones.value.descripcionObservacion!,
      idObservador: parseInt(this.formularioObservaciones.value.idPersona!),
      lugar: this.formularioObservaciones.value.nombreLugar!,
      tipo: this.tipoObservacionSeleccionada(),
      listaObservados: this.listaParticipantesAgregados,
      fechaHoraCaptura: this.formularioObservaciones.value.fechaHoraCaptura!,
    };

    this.api.crearObservacion(datosObservacion).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
      },
      error: (error) => {
        console.error('Ha ocurrido un error' + JSON.stringify(error));
      },
    });
  }
}

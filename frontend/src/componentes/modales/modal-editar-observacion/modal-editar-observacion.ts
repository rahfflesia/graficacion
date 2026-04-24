import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Observacion } from '../../../models/observacion';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-editar-observacion',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-editar-observacion.html',
  styleUrl: '../../secciones-tecnicas-recoleccion/seccion-observaciones/seccion-observaciones.css',
})
export class ModalEditarObservacion implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  @Input() observacion: Observacion | null = null;
  @Input() listaParticipantesProyecto: Participante[] = [];
  @Input() toggler = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Observacion>();

  formularioObservaciones = this.fb.group({
    nombreObservacion: ['', [Validators.required]],
    descripcionObservacion: ['', [Validators.required]],
    idPersona: ['', [Validators.required]],
    fechaHoraCaptura: ['', [Validators.required]],
    nombreLugar: ['', [Validators.required]],
    observados: [''],
    checkboxFechaHora: [false],
    checkboxesParticipantes: this.fb.array([]),
    campoBusqueda: [
      '',
      [this.estaListaParticipantesVacia(), this.estaObservadorEnListaObservados()],
    ],
  });

  tipoObservacionSeleccionada = signal<'Pasiva' | 'Activa'>('Pasiva');
  participantesProyecto = signal<Participante[]>([]);
  participantesFiltrados: { participante: Participante; indiceOriginal: number }[] = [];
  listaObservados: Participante[] = [];

  ngOnInit(): void {
    this.formularioObservaciones.patchValue({
      nombreObservacion: this.observacion?.nombre,
      descripcionObservacion: this.observacion?.descripcion,
      idPersona: this.observacion?.idobservador.toString(),
      nombreLugar: this.observacion?.lugar,
    });

    // Esto es muy redundante
    this.participantesProyecto.set(this.listaParticipantesProyecto);

    const checkboxParticipante = this.participantesProyecto().map(() => new FormControl(false));
    checkboxParticipante.forEach((control) => this.checkboxFormArray.push(control));

    this.listaObservados = [...(this.observacion?.listaparticipantes ?? [])];

    this.seleccionarOpcion(this.observacion?.tipo ?? 'Pasiva');

    this.actualizarValidezCheckbox();

    this.participantesProyecto().forEach((participante, index) => {
      const esParticipanteObservado = this.listaObservados.some(
        (observado) => participante.idpersona === observado.idpersona,
      );

      if (esParticipanteObservado) {
        const checkboxes = this.checkboxFormArray;
        checkboxes.controls[index].setValue(true);
      }
    });
  }

  get checkboxFormArray() {
    return this.formularioObservaciones.get('checkboxesParticipantes') as FormArray;
  }

  obtenerControlFormularioObservaciones(nombreControl: string) {
    return this.formularioObservaciones.get(nombreControl);
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
        break;
    }
    this.tipoObservacionSeleccionada.set(nombreOpcion);
    this.formularioObservaciones.updateValueAndValidity();
    inputBusqueda?.updateValueAndValidity();
  }

  filtrarParticipantes() {
    if (!this.participantesProyecto()) {
      console.error('La lista de participantes no se encuentra definida');
      return;
    }

    const valorCampoBusqueda = this.formularioObservaciones.value.campoBusqueda ?? '';

    this.participantesFiltrados = this.participantesProyecto()
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

  agregarParticipante(objetoParticipante: { participante: Participante; indiceOriginal: number }) {
    const campoBusqueda = this.obtenerControlFormularioObservaciones('campoBusqueda');
    const participante = this.participantesProyecto()[objetoParticipante.indiceOriginal];
    const checkboxesParticipantes = this.formularioObservaciones.value
      .checkboxesParticipantes as Boolean[];
    const checkboxSeleccionada = checkboxesParticipantes[objetoParticipante.indiceOriginal];
    if (checkboxSeleccionada) this.listaObservados.push(participante);
    else {
      const indiceParticipanteAEliminar = this.listaObservados.findIndex(
        (participante) => participante.idpersona === objetoParticipante.participante.idpersona,
      );
      this.eliminarParticipante(indiceParticipanteAEliminar);
    }
    campoBusqueda?.updateValueAndValidity();
  }

  eliminarParticipante(indice: number, participante?: Participante) {
    // Aquí borro en el array de participantes agregados
    this.listaObservados.splice(indice, 1);
    const campoBusqueda = this.obtenerControlFormularioObservaciones('campoBusqueda');
    campoBusqueda?.updateValueAndValidity();
    campoBusqueda?.markAsDirty();

    if (participante) {
      // Acá modifico el valor de la checkbox usando el indice original para eliminar bugs visuales con los checkbox
      const checkboxesParticipantes = this.checkboxFormArray.controls;
      const indiceOriginalParticipante = this.participantesProyecto().findIndex(
        (participanteListaOriginal) =>
          participante.idpersona === participanteListaOriginal.idpersona,
      );
      checkboxesParticipantes[indiceOriginalParticipante].setValue(false);
    }
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

  editarObservacion() {
    const idObservacion = this.observacion?.idobservacion;

    if (!idObservacion) {
      console.error('El id de la observación no se encuentra definido');
      return;
    }

    const observacionEditada: Observacion = {
      nombre: this.formularioObservaciones.value.nombreObservacion!,
      descripcion: this.formularioObservaciones.value.descripcionObservacion!,
      idobservador: parseInt(this.formularioObservaciones.value.idPersona!),
      lugar: this.formularioObservaciones.value.nombreLugar!,
      tipo: this.tipoObservacionSeleccionada(),
      fechahoracaptura: new Date(this.formularioObservaciones.value.fechaHoraCaptura!),
      listaparticipantes: this.listaObservados,
    };

    this.api.editarObservacion(idObservacion, observacionEditada).subscribe({
      next: (observacionEditada) => {
        this.toastr.success('Observación editada correctamente');
        this.editar.emit(observacionEditada);
        this.cerrar.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al editar la observación', '', {
          toastClass: 'toastr-error',
        });
        this.cerrar.emit();
      },
    });
  }

  estaListaParticipantesVacia(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.listaObservados) return null;
      return this.listaObservados.length < 1 && this.tipoObservacionSeleccionada() === 'Activa'
        ? { listaVacia: true }
        : null;
    };
  }

  estaObservadorEnListaObservados(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.formularioObservaciones) return null;
      const idObservador = parseInt(this.obtenerControlFormularioObservaciones('idPersona')?.value);
      const estaObservadorEnLista = this.listaObservados.some(
        (participante) => idObservador === participante.idpersona,
      );
      return estaObservadorEnLista ? { observadorEnListaObservados: true } : null;
    };
  }
}

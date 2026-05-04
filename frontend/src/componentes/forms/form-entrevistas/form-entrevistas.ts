import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Api } from '../../../servicios/api';
import { Entrevista } from '../../../models/entrevista';
import { ToastrService } from 'ngx-toastr';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';

@Component({
  selector: 'form-entrevistas',
  imports: [ReactiveFormsModule],
  templateUrl: './form-entrevistas.html',
  styleUrl: './form-entrevistas.css',
})
export class FormEntrevistas implements OnInit, OnChanges {
  @Input() participantes: Participante[] = [];
  @Input() subproceso: Subproceso | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() entrevista: Entrevista | null = null;
  @Input() toggler: boolean = false;

  @Output() entrevistaCreada = new EventEmitter<Entrevista>();
  @Output() entrevistaEditada = new EventEmitter<Entrevista>();
  @Output() abrirModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  formularioEntrevistas = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    idEntrevistador: ['', Validators.required],
    fechaHoraInicio: [
      '',
      [Validators.required, this.esFechaFutura(), this.esFechaInicioInvalida()],
    ],
    fechaHoraFinalizacion: ['', [Validators.required, this.esFechaFutura()]],
    lugar: ['', Validators.required],
    checkboxesEntrevistados: this.fb.array([]),
    // Campo del input de busqueda
    busqueda: [
      '',
      [this.estaListaEntrevistadosVacia(), this.estaEntrevistadoEnListaEntrevistados()],
    ],
  });

  formularioPreguntaEntrevista = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', Validators.required],
  });

  participantesFiltrados = signal<{ participante: Participante; indiceOriginal: number }[]>([]);

  preguntasEntrevista: { nombre: string; descripcion: string }[] = [];
  entrevistados: Participante[] = [];

  estaModoEdicionActivado = false;
  indicePreguntaEditar: number | null = null;

  ngOnInit(): void {
    this.inicializarCheckboxesEntrevistados();
    this.seleccionarEntrevistadorPorDefecto();

    if (this.modo === 'editar' && this.entrevista) {
      this.cargarDatosEntrevista();
    }
  }

  obtenerControlFormularioPreguntaEntrevista(nombreControl: string) {
    return this.formularioPreguntaEntrevista.get(nombreControl);
  }

  cargarDatosEntrevista() {
    if (!this.entrevista) return;

    this.entrevistados = [];
    this.preguntasEntrevista = [];
    this.checkboxFormArray.controls.forEach((control) => control.setValue(false));

    const datosEntrevista = this.entrevista.entrevista;

    const dInicio = new Date(datosEntrevista.fechahorainicio);
    const dFinalizacion = new Date(datosEntrevista.fechahorafinalizacion);

    const fechaHoraInicio = new Date(dInicio.getTime() - dInicio.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, -1);
    const fechaHoraFinalizacion = new Date(
      dFinalizacion.getTime() - dFinalizacion.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, -1);

    this.formularioEntrevistas.patchValue({
      nombre: datosEntrevista.nombre,
      descripcion: datosEntrevista.descripcion,
      fechaHoraInicio: fechaHoraInicio,
      fechaHoraFinalizacion: fechaHoraFinalizacion,
      lugar: datosEntrevista.lugar,
      idEntrevistador: datosEntrevista.identrevistador.toString(),
    });

    const arrayEntrevistados = [...(this.entrevista.entrevistados ?? [])];
    const arrayPreguntasEntrevista = [...(this.entrevista.preguntasentrevista ?? [])];

    this.entrevistados = arrayEntrevistados;
    this.actualizarValidezBusqueda();

    this.preguntasEntrevista = arrayPreguntasEntrevista;

    this.participantes.forEach((participante, index) => {
      const esParticipanteEntrevistado = this.entrevistados.some(
        (entrevistado) => participante.idpersona === entrevistado.idpersona,
      );

      if (esParticipanteEntrevistado) {
        const checkboxes = this.checkboxFormArray;
        checkboxes.controls[index].setValue(true);
      }
    });

    this.formularioEntrevistas.markAsPristine();
    this.formularioEntrevistas.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participantes'] !== undefined && !changes['participantes'].firstChange) {
      this.inicializarCheckboxesEntrevistados();
      this.seleccionarEntrevistadorPorDefecto();
    }

    if (
      changes['toggler'] !== undefined &&
      changes['toggler'].currentValue === true &&
      this.entrevista
    ) {
      this.cargarDatosEntrevista();
    }
  }

  get checkboxFormArray() {
    return this.formularioEntrevistas.get('checkboxesEntrevistados') as FormArray;
  }

  inicializarCheckboxesEntrevistados() {
    this.checkboxFormArray.clear();
    const checkboxEntrevistados = this.participantes.map(() => new FormControl(false));
    checkboxEntrevistados.forEach((control) => this.checkboxFormArray.push(control));
  }

  seleccionarEntrevistadorPorDefecto() {
    const controlEntrevistador = this.obtenerControlFormularioEntrevistas('idEntrevistador');

    if (controlEntrevistador?.value || this.participantes.length < 1) return;

    controlEntrevistador?.setValue(this.participantes[0].idpersona.toString());
    this.actualizarValidezBusqueda();
  }

  obtenerControlFormularioEntrevistas(nombreControl: string) {
    return this.formularioEntrevistas.get(nombreControl);
  }

  crearEntrevista() {
    // Copia para no mutar el formulario
    const copiaDatosEntrevista = { ...this.formularioEntrevistas.value };
    const datosFinalesEntrevista: Entrevista = {
      preguntasentrevista: this.preguntasEntrevista,
      entrevista: {
        nombre: copiaDatosEntrevista.nombre!,
        descripcion: copiaDatosEntrevista.descripcion!,
        identrevistador: parseInt(copiaDatosEntrevista.idEntrevistador!),
        fechahorainicio: copiaDatosEntrevista.fechaHoraInicio!,
        fechahorafinalizacion: copiaDatosEntrevista.fechaHoraFinalizacion!,
        lugar: copiaDatosEntrevista.lugar!,
        idsubproceso: this.subproceso?.idsubproceso!,
      },
      entrevistados: this.entrevistados,
    };

    console.log(datosFinalesEntrevista);

    this.api.crearEntrevista(datosFinalesEntrevista).subscribe({
      next: (entrevista) => {
        this.toastr.success('Entrevista creada correctamente');
        this.entrevistaCreada.emit(entrevista);
        console.log(entrevista);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al crear la entrevista', '', {
          toastClass: 'toastr-error',
        });
      },
    });

    this.entrevistados = [];
    this.preguntasEntrevista = [];
    this.formularioEntrevistas.reset();
    this.checkboxFormArray.controls.forEach((control) => control.setValue(false));
    this.seleccionarEntrevistadorPorDefecto();
    this.formularioEntrevistas.updateValueAndValidity();
  }

  eliminarParticipante(indice: number, participante?: Participante) {
    // Aquí borro en el array de participantes agregados
    this.entrevistados.splice(indice, 1);
    const campoBusqueda = this.obtenerControlFormularioEntrevistas('busqueda');
    campoBusqueda?.updateValueAndValidity();
    campoBusqueda?.markAsDirty();

    if (participante) {
      // Acá modifico el valor de la checkbox usando el indice original para eliminar bugs visuales con los checkbox
      const checkboxesParticipantes = this.checkboxFormArray.controls;
      const indiceOriginalParticipante = this.participantes.findIndex(
        (participanteListaOriginal) =>
          participante.idpersona === participanteListaOriginal.idpersona,
      );
      checkboxesParticipantes[indiceOriginalParticipante].setValue(false);
    }
  }

  agregarPregunta() {
    const formularioPreguntaEntrevista = this.formularioPreguntaEntrevista as FormGroup;
    this.preguntasEntrevista.push(formularioPreguntaEntrevista.value);
    formularioPreguntaEntrevista.reset();
    console.log(this.preguntasEntrevista);
  }

  eliminarPreguntaCuestionario(index: number) {
    this.preguntasEntrevista.splice(index, 1);
  }

  cargarDatosPregunta(index: number) {
    this.estaModoEdicionActivado = true;
    this.indicePreguntaEditar = index;
    const datosPregunta = this.preguntasEntrevista[index];
    const formularioPreguntaEntrevista = this.formularioPreguntaEntrevista;
    formularioPreguntaEntrevista.setValue({
      nombre: datosPregunta.nombre,
      descripcion: datosPregunta.descripcion,
    });
  }

  desactivarModoEdicionPregunta() {
    this.estaModoEdicionActivado = false;
    this.indicePreguntaEditar = null;
    this.formularioPreguntaEntrevista.reset();
  }

  editarPregunta() {
    const formularioPreguntaEntrevista = this.formularioPreguntaEntrevista as FormGroup;
    const nuevosDatos = formularioPreguntaEntrevista.value;
    if (this.indicePreguntaEditar !== null && this.indicePreguntaEditar !== undefined)
      this.preguntasEntrevista[this.indicePreguntaEditar] = nuevosDatos;
    // Reset
    this.desactivarModoEdicionPregunta();
  }

  filtrarParticipantes() {
    const campoBusqueda = this.formularioEntrevistas.value.busqueda ?? '';
    const resultados = this.participantes
      .map((participante, index) => ({ participante, indiceOriginal: index }))
      .filter(({ participante }) => {
        const nombreCompleto = `${participante.nombre} ${participante.apellidouno} ${participante.apellidodos ?? ''}`;
        return nombreCompleto.toLowerCase().includes(campoBusqueda?.toLowerCase());
      });
    this.participantesFiltrados.set(resultados);
  }

  agregarParticipante(objetoParticipante: { participante: Participante; indiceOriginal: number }) {
    const campoBusqueda = this.obtenerControlFormularioEntrevistas('busqueda');
    const participante = this.participantes[objetoParticipante.indiceOriginal];
    const checkboxesParticipantes = this.formularioEntrevistas.value
      .checkboxesEntrevistados as Boolean[];
    const checkboxSeleccionada = checkboxesParticipantes[objetoParticipante.indiceOriginal];
    if (checkboxSeleccionada) this.entrevistados.push(participante);
    else {
      const indiceParticipanteAEliminar = this.entrevistados.findIndex(
        (entrevistado) => entrevistado.idpersona === objetoParticipante.participante.idpersona,
      );
      this.eliminarParticipante(indiceParticipanteAEliminar);
    }
    campoBusqueda?.updateValueAndValidity();
    console.log(this.entrevistados);
  }

  editarEntrevista() {
    const idEntrevista = this.entrevista?.entrevista.identrevista;

    if (!idEntrevista) {
      console.error('El id de la entrevista no se encuentra definida');
      return;
    }

    const datosEntrevista = this.entrevista?.entrevista;
    const datosFormularioEntrevista = this.formularioEntrevistas.value;

    const entrevistaEditar: Entrevista = {
      entrevista: {
        idsubproceso: datosEntrevista?.idsubproceso!,
        nombre: datosFormularioEntrevista.nombre!,
        descripcion: datosFormularioEntrevista.descripcion!,
        identrevistador: parseInt(datosFormularioEntrevista.idEntrevistador!),
        lugar: datosFormularioEntrevista.lugar!,
        fechahorafinalizacion: datosFormularioEntrevista.fechaHoraFinalizacion!,
        fechahorainicio: datosFormularioEntrevista.fechaHoraInicio!,
      },
      entrevistados: this.entrevistados,
      preguntasentrevista: this.preguntasEntrevista,
    };

    this.api.editarEntrevista(idEntrevista, entrevistaEditar).subscribe({
      next: (entrevistaEditada) => {
        this.toastr.success('Entrevista editada correctamente');
        this.entrevistaEditada.emit(entrevistaEditada);

        this.formularioEntrevistas.reset();
        this.entrevistados = [];
        this.preguntasEntrevista = [];
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al editar la entrevista');
      },
    });
  }

  esFechaFutura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const ahora = new Date();
      const valorInputFecha = new Date(control.value);

      return valorInputFecha > ahora ? { fechaFutura: true } : null;
    };
  }

  esFechaInicioInvalida(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.formularioEntrevistas || !control.value) return null;

      const fechaFinalizacion = new Date(
        this.obtenerControlFormularioEntrevistas('fechaHoraFinalizacion')?.value,
      );
      const fechaInicio = new Date(control.value);

      return fechaInicio > fechaFinalizacion ? { inicioMayorQueFinal: true } : null;
    };
  }

  actualizarValidezFechaInicio() {
    this.obtenerControlFormularioEntrevistas('fechaHoraInicio')?.updateValueAndValidity();
  }

  estaListaEntrevistadosVacia(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.entrevistados) return null;
      return this.entrevistados.length < 1 ? { listaEntrevistadosVacia: true } : null;
    };
  }

  estaEntrevistadoEnListaEntrevistados(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.entrevistados || !this.formularioEntrevistas) return null;
      const idEntrevistador = parseInt(
        this.obtenerControlFormularioEntrevistas('idEntrevistador')?.value,
      );
      const estaEntrevistadorEnListaEntrevistados = this.entrevistados.some(
        (entrevistado) => entrevistado.idpersona === idEntrevistador,
      );
      return estaEntrevistadorEnListaEntrevistados
        ? { entrevistadorEnListaEntrevistados: true }
        : null;
    };
  }

  actualizarValidezBusqueda() {
    this.obtenerControlFormularioEntrevistas('busqueda')?.updateValueAndValidity();
  }
}

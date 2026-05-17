import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
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
import { Api } from '../../../servicios/api';
import { ProyectoEditar, Proyectos } from '../../../models/proceso.interface';
import { ToastrService } from 'ngx-toastr';
import { DatosProceso, Proceso } from '../../../models/procesos.interface';
import { ProcesoCard } from '../../cards/proceso-card/proceso-card';
import { DatosFormularioRol, Rol } from '../../../models/rol.interface';
import { RolCard } from '../../cards/rol-card/rol-card';
import {
  DatosFormularioParticipante,
  Participante,
  RolParticipanteProyecto,
} from '../../../models/participantesProyecto.interface';
import { ParticipanteCard } from '../../cards/participante-card/participante-card';
import { TecnicaRecoleccion } from '../../../models/tecnicasRecoleccion.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import { SubprocesoCard } from '../../cards/subproceso-card/subproceso-card';
import { crear, editar, eliminar } from '../../../crud-helpers/crudHelpers';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'modal-configuracion-proyecto',
  imports: [ReactiveFormsModule, ProcesoCard, RolCard, ParticipanteCard, SubprocesoCard, DatePipe],
  templateUrl: './modal-configuracion-proyecto.html',
  styleUrl: './modal-configuracion-proyecto.css',
})
export class ModalConfiguracionProyecto implements OnChanges {
  @Input() toggler: boolean = false;
  @Input() proyectoSeleccionado: Proyectos | undefined = undefined;
  @Output() cerrar = new EventEmitter<void>();
  @Output() proyectoEditado = new EventEmitter<Proyectos>();
  formBuilder = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private espaciosEnBlancoRegex: RegExp = /\S/;

  // Con esto controlo si le muestro el mensaje de eliminar proceso o no
  // Me parece mejor que terminar como con 20 modales por todos los cruds
  sonOpcionesBorrarProcesoVisibles = false;

  procesos = signal<Proceso[]>([]);
  roles = signal<Rol[]>([]);
  participantes = signal<Participante[]>([]);
  primerRol = computed(() => this.roles()[0].idrol.toString());
  tecnicasRecoleccion = signal<TecnicaRecoleccion[]>([]);
  tecnicasSeleccionadasIds = signal<Set<number>>(new Set());
  subprocesos = signal<Subproceso[]>([]);

  participantesFiltrados: Participante[] = [];
  rolesFiltrados: Rol[] = [];
  subprocesosFiltrados: Subproceso[] = [];
  procesosFiltrados: Proceso[] = [];

  formularioProcesos = this.formBuilder.group({
    nombreProceso: ['', Validators.required],
    descripcionProceso: ['', Validators.required],
  });
  formularioSubprocesos = this.formBuilder.group({
    nombreSubproceso: ['', Validators.required],
    descripcionSubproceso: ['', Validators.required],
    idProcesoAsociado: ['', Validators.required],
    tecnicasAsociadas: this.formBuilder.array([], [this.tieneTecnicaSeleccionada()]),
  });
  formularioRoles = this.formBuilder.group({
    nombreRol: ['', Validators.required],
    tipoRol: ['Interno', Validators.required],
  });
  formularioParticipantes = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    apellidoUno: ['', [Validators.required]],
    apellidoDos: [''],
    correo: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    idrol: ['', [Validators.required]],
  });
  formularioEditarProyecto = this.formBuilder.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
        Validators.pattern(this.espaciosEnBlancoRegex),
      ],
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(this.espaciosEnBlancoRegex),
      ],
    ],
    estadoProyecto: ['', [Validators.required]],
  });

  opcionSeleccionada = signal<
    'Editar proyecto' | 'Procesos' | 'Subprocesos' | 'Roles' | 'Participantes' | 'Detalles'
  >('Procesos');

  get tecnicasAsociadas() {
    return this.formularioSubprocesos.get('tecnicasAsociadas') as FormArray;
  }

  obtenerControlFormularioProcesos(nombreControl: string) {
    return this.formularioProcesos.get(nombreControl);
  }

  obtenerControlFormularioSubprocesos(nombreControl: string) {
    return this.formularioSubprocesos.get(nombreControl);
  }

  obtenerControlFormularioRoles(nombreControl: string) {
    return this.formularioRoles.get(nombreControl);
  }

  obtenerControlFormularioParticipantes(nombreControl: string) {
    return this.formularioParticipantes.get(nombreControl);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cambioProyecto = changes['proyectoSeleccionado'];
    const modalAbierto = changes['toggler']?.currentValue === true;

    if ((cambioProyecto || modalAbierto) && this.proyectoSeleccionado !== undefined) {
      this.cargarFormularioEditarProyecto();
      this.cargarDatosProyecto();
    }
  }

  cargarFormularioEditarProyecto() {
    this.formularioEditarProyecto.get('nombre')?.setValue(this.proyectoSeleccionado?.nombre!);
    this.formularioEditarProyecto
      .get('descripcion')
      ?.setValue(this.proyectoSeleccionado?.descripcion!);
    this.formularioEditarProyecto
      .get('estadoProyecto')
      ?.setValue(this.proyectoSeleccionado?.estado ?? 'Activo');
  }

  cargarDatosProyecto() {
    this.api.obtenerDatosGeneralesProyecto(this.proyectoSeleccionado?.idproyecto!).subscribe({
      next: (datosProyecto) => {
        this.procesos.set(datosProyecto.procesos);
        this.roles.set(datosProyecto.roles);
        this.participantes.set(datosProyecto.participantes);
        this.formularioParticipantes.get('idrol')?.setValue(this.primerRol());
        this.tecnicasRecoleccion.set(datosProyecto.tecnicasRecoleccion);
        this.subprocesos.set(datosProyecto.subprocesos);
        this.cargarTecnicas();
        this.seleccionarProcesoPorDefecto();

        // Copias para realizar el filtrado, no puedo utilizar el mismo array porque lo estaría modificando
        this.participantesFiltrados = [...this.participantes()];
        this.rolesFiltrados = [...this.roles()];
        this.subprocesosFiltrados = [...this.subprocesos()];
        this.procesosFiltrados = [...this.procesos()];
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ocurrió un error al obtener los datos del proyecto', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  cerrarModalConfigurarProyecto() {
    this.cerrar.emit();
  }

  seleccionarSeccion(
    opcion: 'Editar proyecto' | 'Procesos' | 'Subprocesos' | 'Roles' | 'Participantes' | 'Detalles',
  ) {
    this.opcionSeleccionada.update((opcionPrevia) => (opcionPrevia = opcion));

    // Opción para actualizar el valor del select de los roles
    if (opcion === 'Participantes')
      this.formularioParticipantes.get('idrol')?.setValue(this.primerRol());
  }

  obtenerControlFormularioEditarProyecto(nombreControl: string) {
    return this.formularioEditarProyecto.get(nombreControl);
  }

  editarProyecto() {
    if (!this.proyectoSeleccionado?.idproyecto || this.formularioEditarProyecto.invalid) return;

    const datosProyectoEditar: ProyectoEditar = {
      nombre: this.formularioEditarProyecto.get('nombre')?.value ?? '',
      descripcion: this.formularioEditarProyecto.get('descripcion')?.value ?? '',
      estado:
        (this.formularioEditarProyecto.get('estadoProyecto')?.value as
          | 'Activo'
          | 'Cancelado'
          | 'Pausado'
          | 'En_revisi_n') ?? 'Activo',
    };

    this.api.editarProyecto(this.proyectoSeleccionado.idproyecto, datosProyectoEditar).subscribe({
      next: (respuesta) => {
        this.proyectoEditado.emit(respuesta);
        this.toastr.success('Proyecto editado correctamente');
      },
      error: (error) => {
        this.toastr.error('No se pudo editar el proyecto', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
      },
    });
  }

  limpiarFormularioProceso() {
    this.formularioProcesos.reset();
  }

  mostrarMenuBorrarProceso() {
    this.sonOpcionesBorrarProcesoVisibles = true;
  }

  ocultarMenuBorrarProceso() {
    this.sonOpcionesBorrarProcesoVisibles = false;
  }

  crearProceso() {
    const proceso: DatosProceso = {
      idProyecto: this.proyectoSeleccionado?.idproyecto,
      nombreProceso: this.formularioProcesos.get('nombreProceso')?.value!,
      descripcionProceso: this.formularioProcesos.get('descripcionProceso')?.value!,
    };
    this.api.crearProceso(proceso).subscribe({
      next: (procesoCreado) => {
        this.toastr.success('Proceso creado correctamente');
        crear(this.procesos, procesoCreado);
        this.procesosFiltrados = [...this.procesos()];
      },
      error: (error) => {
        this.toastr.error('Ha ocurrido un error al crear el proceso', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
      },
    });
    this.limpiarFormularioProceso();
  }

  borrarProceso(procesoEliminado: Proceso) {
    eliminar(this.procesos, procesoEliminado, 'idproceso');
    this.procesosFiltrados = [...this.procesos()];
  }

  editarProceso(procesoEditado: Proceso) {
    editar(this.procesos, procesoEditado, 'idproceso');
    this.procesosFiltrados = [...this.procesos()];
  }

  crearRol() {
    const rol: DatosFormularioRol = {
      nombre: this.formularioRoles.get('nombreRol')?.value!,
      tipo: this.formularioRoles.get('tipoRol')?.value! as 'Interno' | 'Externo',
      idproyecto: this.proyectoSeleccionado?.idproyecto!,
    };
    this.api.crearRol(rol).subscribe({
      next: (rolCreado) => {
        this.toastr.success('Rol creado correctamente');
        crear(this.roles, rolCreado);
        this.rolesFiltrados = [...this.roles()];
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al crear el rol', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.formularioRoles.reset();
    this.formularioRoles.get('tipoRol')?.setValue('Interno');
  }

  eliminarRol(rolEliminado: Rol) {
    eliminar(this.roles, rolEliminado, 'idrol');
    this.rolesFiltrados = [...this.roles()];
  }

  editarRol(rolEditado: Rol) {
    editar(this.roles, rolEditado, 'idrol');
    this.rolesFiltrados = [...this.roles()];
  }

  registrarParticipante() {
    const datosParticipante: DatosFormularioParticipante = {
      ...this.formularioParticipantes.value,
      idrol: Number(this.formularioParticipantes.get('idrol')?.value),
      idproyecto: this.proyectoSeleccionado?.idproyecto,
    } as DatosFormularioParticipante;

    this.api.registrarParticipante(datosParticipante).subscribe({
      next: (participanteRegistrado) => {
        this.toastr.success('Participante registrado exitosamente');
        crear(this.participantes, participanteRegistrado);
        this.participantesFiltrados = [...this.participantes()];
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al registrar el participante', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.formularioParticipantes.reset();
    this.formularioParticipantes.get('idrol')?.setValue(this.primerRol());
  }

  editarParticipante(participanteEditado: Participante) {
    editar(this.participantes, participanteEditado, 'idpersona');
    this.participantesFiltrados = [...this.participantes()];
  }

  eliminarParticipante(participanteEliminado: RolParticipanteProyecto) {
    eliminar(this.participantes, participanteEliminado, 'idrolpersonaproyecto');
    this.participantesFiltrados = [...this.participantes()];
  }

  cargarTecnicas() {
    this.tecnicasAsociadas.clear();
    const controlesTecnica = this.tecnicasRecoleccion().map(() => new FormControl(false));
    controlesTecnica.forEach((control) => this.tecnicasAsociadas.push(control));
    this.tecnicasAsociadas.updateValueAndValidity();
  }

  cargarTecnicas() {
    this.tecnicasAsociadas.clear();
    const controlesTecnica = this.tecnicasRecoleccion().map(() => new FormControl(false));
    controlesTecnica.forEach((control) => this.tecnicasAsociadas.push(control));
    this.tecnicasSeleccionadasIds.set(new Set());
    this.actualizarValidacionTecnicas();
  }

  actualizarValidacionTecnicas() {
    this.tecnicasAsociadas.updateValueAndValidity();
    this.formularioSubprocesos.updateValueAndValidity();
  }

  seleccionarProcesoPorDefecto() {
    const controlProceso = this.formularioSubprocesos.get('idProcesoAsociado');

    if (controlProceso?.value || this.procesos().length < 1) return;

    controlProceso?.setValue(this.procesos()[0].idproceso.toString());
  }

  obtenerTecnicasSeleccionadas() {
    return this.tecnicasRecoleccion().filter((tecnica) =>
      this.tecnicasSeleccionadasIds().has(tecnica.idtecnicarecoleccion),
    );
  }

  hayTecnicaSeleccionada() {
    return this.tecnicasSeleccionadasIds().size > 0;
  }

  estaTecnicaSeleccionada(tecnica: TecnicaRecoleccion) {
    return this.tecnicasSeleccionadasIds().has(tecnica.idtecnicarecoleccion);
  }

  cambiarTecnicaSeleccionada(tecnica: TecnicaRecoleccion, evento: Event) {
    const input = evento.target as HTMLInputElement;
    const tecnicasActuales = new Set(this.tecnicasSeleccionadasIds());

    if (input.checked) {
      tecnicasActuales.add(tecnica.idtecnicarecoleccion);
    } else {
      tecnicasActuales.delete(tecnica.idtecnicarecoleccion);
    }

    this.tecnicasSeleccionadasIds.set(tecnicasActuales);
    this.actualizarValidacionTecnicas();
  }

  puedeCrearSubproceso() {
    const { nombreSubproceso, descripcionSubproceso, idProcesoAsociado } =
      this.formularioSubprocesos.value;

    return Boolean(
      nombreSubproceso?.trim() &&
        descripcionSubproceso?.trim() &&
        idProcesoAsociado &&
        this.hayTecnicaSeleccionada(),
    );
  }

  tieneTecnicaSeleccionada(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let boolean = false;
      control.value.forEach((checkbox: any) => {
        if (checkbox) {
          boolean = true;
        }
      });
      return !boolean ? { sinTecnicaSeleccionada: true } : null;
    };
  }

  obtenerNombreCheckbox(indice: number) {
    return this.tecnicasRecoleccion()[indice].nombre;
  }

  crearSubproceso() {
    const { nombreSubproceso, descripcionSubproceso, idProcesoAsociado } =
      this.formularioSubprocesos.value;
    const tecnicasSeleccionadas = this.obtenerTecnicasSeleccionadas();

    if (!idProcesoAsociado || !nombreSubproceso || !descripcionSubproceso) {
      console.error('Alguna propiedad del formulario no está definida');
      return;
    }

    if (tecnicasSeleccionadas.length === 0) {
      this.tecnicasAsociadas.markAsDirty();
      console.error('No hay ninguna técnica seleccionada');
      return;
    }

    const datosSubproceso = {
      nombreSubproceso,
      descripcionSubproceso,
      idProcesoAsociado: parseInt(idProcesoAsociado),
      tecnicasSeleccionadas,
    };

    this.api.crearSubproceso(datosSubproceso).subscribe({
      next: (subprocesoCreado) => {
        this.toastr.success('Subproceso creado correctamente');
        crear(this.subprocesos, subprocesoCreado);
        this.subprocesosFiltrados = [...this.subprocesos()];
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al crear el subproceso', '', {
          toastClass: 'toastr-error',
        });
      },
    });

  }

  limpiarFormularioSubproceso() {
    this.formularioSubprocesos.get('nombreSubproceso')?.reset();
    this.formularioSubprocesos.get('descripcionSubproceso')?.reset();
    this.formularioSubprocesos.get('idProcesoAsociado')?.reset();
    this.cargarTecnicas();
    this.seleccionarProcesoPorDefecto();
    this.formularioSubprocesos.markAsPristine();
    this.formularioSubprocesos.markAsUntouched();
    this.formularioSubprocesos.updateValueAndValidity();
  }

  eliminarSubproceso(subprocesoEliminado: Subproceso) {
    eliminar(this.subprocesos, subprocesoEliminado, 'idsubproceso');
    this.subprocesosFiltrados = [...this.subprocesos()];
  }

  editarSubproceso(subprocesoEditado: Subproceso) {
    editar(this.subprocesos, subprocesoEditado, 'idsubproceso');
    this.subprocesosFiltrados = [...this.subprocesos()];
  }

  filtrarParticipantes(nombre: string) {
    this.participantesFiltrados = this.participantes().filter((participante) => {
      const nombreCompleto = `${participante.nombre} ${participante.apellidouno} ${participante.apellidodos}`;
      return nombreCompleto.toLowerCase().includes(nombre.toLowerCase());
    });
  }

  filtrarRoles(nombreRol: string) {
    this.rolesFiltrados = this.roles().filter((rol) =>
      rol.nombre.toLowerCase().includes(nombreRol.toLowerCase()),
    );
  }

  filtrarSubprocesos(nombreSubproceso: string) {
    this.subprocesosFiltrados = this.subprocesos().filter((subproceso) =>
      subproceso.nombresubproceso.toLowerCase().includes(nombreSubproceso.toLowerCase()),
    );
  }

  filtrarProcesos(nombreProceso: string) {
    this.procesosFiltrados = this.procesos().filter((proceso) =>
      proceso.nombre.toLowerCase().includes(nombreProceso.toLowerCase()),
    );
  }
}

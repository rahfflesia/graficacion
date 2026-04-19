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
import { Proyectos } from '../../../models/proceso.interface';
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

@Component({
  selector: 'modal-configuracion-proyecto',
  imports: [ReactiveFormsModule, ProcesoCard, RolCard, ParticipanteCard, SubprocesoCard],
  templateUrl: './modal-configuracion-proyecto.html',
  styleUrl: './modal-configuracion-proyecto.css',
})
export class ModalConfiguracionProyecto implements OnChanges {
  @Input() toggler: boolean = false;
  @Input() proyectoSeleccionado: Proyectos | undefined = undefined;
  @Output() cerrar = new EventEmitter<void>();
  formBuilder = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  // Con esto controlo si le muestro el mensaje de eliminar proceso o no
  // Me parece mejor que terminar como con 20 modales por todos los cruds
  sonOpcionesBorrarProcesoVisibles = false;

  procesos = signal<Proceso[]>([]);
  roles = signal<Rol[]>([]);
  participantes = signal<Participante[]>([]);
  primerRol = computed(() => this.roles()[0].idrol.toString());
  tecnicasRecoleccion = signal<TecnicaRecoleccion[]>([]);
  subprocesos = signal<Subproceso[]>([]);

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

  opcionSeleccionada = signal<'Procesos' | 'Subprocesos' | 'Roles' | 'Participantes' | 'Detalles'>(
    'Procesos',
  );

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
    const proyecto = changes['proyectoSeleccionado'];
    if (proyecto && this.proyectoSeleccionado !== undefined) {
      this.api.obtenerDatosGeneralesProyecto(this.proyectoSeleccionado?.idproyecto!).subscribe({
        next: (datosProyecto) => {
          this.procesos.set(datosProyecto.procesos);
          this.roles.set(datosProyecto.roles);
          this.participantes.set(datosProyecto.participantes);
          this.formularioParticipantes.get('idrol')?.setValue(this.primerRol());
          this.tecnicasRecoleccion.set(datosProyecto.tecnicasRecoleccion);
          this.subprocesos.set(datosProyecto.subprocesos);
          this.cargarTecnicas();
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Ocurrió un error al obtener los datos del proyecto', '', {
            toastClass: 'toastr-error',
          });
        },
      });
    }
  }

  cerrarModalConfigurarProyecto() {
    this.cerrar.emit();
  }

  seleccionarSeccion(opcion: 'Procesos' | 'Subprocesos' | 'Roles' | 'Participantes' | 'Detalles') {
    this.opcionSeleccionada.update((opcionPrevia) => (opcionPrevia = opcion));

    // Opción para actualizar el valor del select de los roles
    if (opcion === 'Participantes')
      this.formularioParticipantes.get('idrol')?.setValue(this.primerRol());
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
  }

  editarProceso(procesoEditado: Proceso) {
    editar(this.procesos, procesoEditado, 'idproceso');
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
  }

  // Hay mucha lógica duplicada con esto de los cruds, después le haré un refactor
  editarRol(rolEditado: Rol) {
    editar(this.roles, rolEditado, 'idrol');
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

  eliminarParticipante(participanteEliminado: RolParticipanteProyecto) {
    eliminar(this.participantes, participanteEliminado, 'idrolpersonaproyecto');
  }

  cargarTecnicas() {
    if (this.tecnicasAsociadas.length < 1) {
      const controlesTecnica = this.tecnicasRecoleccion().map(() => new FormControl(false));
      controlesTecnica.forEach((control) => this.tecnicasAsociadas.push(control));
    }
  }

  obtenerTecnicasSeleccionadas() {
    let tecnicasSeleccionadas: TecnicaRecoleccion[] = [];
    const checkboxesTecnicasAsociadas = this.formularioSubprocesos.value
      .tecnicasAsociadas as Boolean[];
    checkboxesTecnicasAsociadas.forEach((boolean, index) => {
      if (boolean) tecnicasSeleccionadas.push(this.tecnicasRecoleccion()[index]);
    });
    return tecnicasSeleccionadas;
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
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al crear el subproceso', '', {
          toastClass: 'toastr-error',
        });
      },
    });

    this.formularioSubprocesos.reset();
  }

  eliminarSubproceso(subprocesoEliminado: Subproceso) {
    eliminar(this.subprocesos, subprocesoEliminado, 'idsubproceso');
  }

  editarSubproceso(subprocesoEditado: Subproceso) {
    editar(this.subprocesos, subprocesoEditado, 'idsubproceso');
  }
}

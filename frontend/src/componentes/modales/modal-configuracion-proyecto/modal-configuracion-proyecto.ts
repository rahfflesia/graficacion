import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../../servicios/api';
import { Proyectos } from '../../../models/proceso.interface';
import { ToastrService } from 'ngx-toastr';
import { DatosProceso, Proceso } from '../../../models/procesos.interface';
import { ProcesoCard } from '../../cards/proceso-card/proceso-card';
import { DatosFormularioRol, Rol } from '../../../models/rol.interface';
import { RolCard } from '../../cards/rol-card/rol-card';

@Component({
  selector: 'modal-configuracion-proyecto',
  imports: [ReactiveFormsModule, ProcesoCard, RolCard],
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

  formularioProcesos = this.formBuilder.group({
    nombreProceso: ['', Validators.required],
    descripcionProceso: ['', Validators.required],
  });
  formularioSubprocesos = this.formBuilder.group({
    nombreSubproceso: ['', Validators.required],
    descripcionSubproceso: ['', Validators.required],
    subprocesoAsociado: ['', Validators.required],
  });
  formularioRoles = this.formBuilder.group({
    nombreRol: ['', Validators.required],
    tipoRol: ['Interno', Validators.required],
  });

  procesos = signal<Proceso[]>([]);
  roles = signal<Rol[]>([]);

  opcionSeleccionada = signal<'Procesos' | 'Subprocesos' | 'Roles' | 'Participantes' | 'Detalles'>(
    'Procesos',
  );

  ngOnChanges(changes: SimpleChanges): void {
    const proyecto = changes['proyectoSeleccionado'];
    if (proyecto && this.proyectoSeleccionado !== undefined) {
      this.api.obtenerDatosGeneralesProyecto(this.proyectoSeleccionado?.idproyecto!).subscribe({
        next: (datosProyecto) => {
          console.log(
            'Intentando obtener datos del siguiente proyecto ' +
              JSON.stringify(this.proyectoSeleccionado),
          );
          this.procesos.set(datosProyecto.procesos);
          this.roles.set(datosProyecto.roles);
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
        this.procesos.update((procesosActuales) => [procesoCreado, ...procesosActuales]);
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
    this.procesos.update((procesos) =>
      procesos.filter((proceso) => proceso.idproceso !== procesoEliminado.idproceso),
    );
  }

  editarProceso(procesoEditado: Proceso) {
    this.procesos().map((proceso, index) => {
      if (procesoEditado.idproceso === proceso.idproceso) {
        this.procesos()[index] = procesoEditado;
        return;
      }

      // Igual acá no supe muy bien que poner lol
      console.log('No se encontró un proceso con ese id');
      return;
    });
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
        this.roles.update((roles) => [rolCreado, ...roles]);
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
    this.roles.update((roles) => roles.filter((rol) => rol.idrol !== rolEliminado.idrol));
  }

  // Hay mucha lógica duplicada con esto de los cruds, después le haré un refactor
  editarRol(rolEditado: Rol) {
    this.roles().map((rol, index) => {
      if (rolEditado.idrol === rol.idrol) {
        this.roles()[index] = rolEditado;
        return;
      }

      // Igual acá no supe muy bien que poner lol
      console.log('No se encontró un rol con ese id');
      return;
    });
  }
}

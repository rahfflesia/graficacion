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
import { ProyectoEditar, Proyectos } from '../../../models/proceso.interface';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-editar-proyecto',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-editar-proyecto.html',
  styleUrl: './modal-editar-proyecto.css',
})
export class ModalEditarProyecto implements OnChanges {
  @Input() proyectoEditar: Proyectos | undefined;
  @Input() toggler: boolean = false;

  @Output() cancelar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Proyectos>();

  private api = inject(Api);
  private formBuilder = inject(FormBuilder);
  private espaciosEnBlancoRegex: RegExp = /\S/;
  private toastr = inject(ToastrService);
  nuevoNombreProyecto = signal('');
  nuevaDescripcionProyecto = signal('');
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
  });

  ngOnChanges(changes: SimpleChanges): void {
    // Cada vez que cambie el proyecto seleccionado actualizo los campos
    const proyecto = changes['proyectoEditar'];
    if (proyecto) {
      this.formularioEditarProyecto.get('nombre')?.setValue(this.proyectoEditar?.nombre!);
      this.formularioEditarProyecto.get('descripcion')?.setValue(this.proyectoEditar?.descripcion!);
    }
  }

  cancelarEdicion() {
    this.cancelar.emit();
  }

  editarProyecto() {
    const datosProyectoEditar: ProyectoEditar = {
      nombre: this.formularioEditarProyecto.get('nombre')?.value ?? 'Nombre por defecto',
      descripcion:
        this.formularioEditarProyecto.get('descripcion')?.value ?? 'Descripción por defecto',
    };

    this.api.editarProyecto(this.proyectoEditar!.idproyecto, datosProyectoEditar).subscribe({
      next: (respuesta) => {
        this.editar.emit(respuesta);
        this.cancelarEdicion();
        this.toastr.success('Proyecto editado correctamente');
      },
      error: (error) => {
        this.toastr.error('No se pudo editar el proyecto', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
        this.cancelarEdicion();
      },
    });
    this.formularioEditarProyecto.reset();
  }
}

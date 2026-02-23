import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../../servicios/api';
import { Proyectos } from '../../../models/proceso.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-crear-proyecto',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-crear-proyecto.html',
  styleUrl: './modal-crear-proyecto.css',
})
export class ModalCrearProyecto {
  @Input() toggler: boolean = false;
  private formBuilder = inject(FormBuilder);
  private api = inject(Api);
  private espaciosEnBlancoRegex: RegExp = /\S/;
  private toastr = inject(ToastrService);
  formularioCrearPoyecto = this.formBuilder.group({
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

  @Output() cerrar = new EventEmitter<void>();
  @Output() crearNuevoProyecto = new EventEmitter<Proyectos>();

  cerrarModalCrearProyecto() {
    this.cerrar.emit();
    this.formularioCrearPoyecto.reset();
  }

  crearProyecto() {
    const proyecto = {
      idUsuario: 1,
      nombre: this.formularioCrearPoyecto.value.nombre ?? 'Proyecto',
      descripcion: this.formularioCrearPoyecto.value.descripcion ?? 'Descripcion del proyecto',
    };

    this.api.crearProyecto(proyecto).subscribe({
      next: (respuesta) => {
        this.toastr.success('Proyecto creado correctamente');
        this.cerrar.emit();
        this.crearNuevoProyecto.emit(respuesta);
      },
      error: (error) => {
        this.toastr.error('No se pudo eliminar el proyecto', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
        this.cerrar.emit();
      },
    });
    this.formularioCrearPoyecto.reset(); // Lo necesito para que queden vacíos los campos al crear un nuevo proyecto
  }
}

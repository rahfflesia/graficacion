import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../../servicios/api';

@Component({
  selector: 'modal-crear-proyecto',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-crear-proyecto.html',
  styleUrl: './modal-crear-proyecto.css',
})
export class ModalCrearProyecto {
  private formBuilder = inject(FormBuilder);
  private api = inject(Api);
  formularioCrearPoyecto = this.formBuilder.group({
    nombre: [''],
    descripcion: [''],
  });

  @Output() cerrar = new EventEmitter<void>();

  cerrarModalCrearProyecto() {
    this.cerrar.emit();
  }

  crearProyecto() {
    const proyecto = {
      nombre: this.formularioCrearPoyecto.value.nombre,
      descripcion: this.formularioCrearPoyecto.value.descripcion,
    };
    this.api.crearProyecto(proyecto).subscribe({
      next: (respuesta) => {
        alert('Proyecto creado correctamente');
        this.cerrar.emit();
      },
      error: (error) => {
        alert(JSON.stringify(error));
      },
    });
  }
}

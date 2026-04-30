import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'modal-crear-diagrama-clase',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-crear-diagrama-clase.html',
  styleUrl: './modal-crear-diagrama-clase.css',
})
export class ModalCrearDiagramaClase {
  @Input() toggler = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() crearDiagramaClase = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  formularioDiagramaClase = this.fb.group({
    nombre: ['', [Validators.required]],
    atributos: this.fb.array([]),
    metodos: this.fb.array([]),
  });

  formularioAtributos = this.fb.group({
    nombreAtributo: ['', [Validators.required]],
  });

  formularioMetodos = this.fb.group({
    nombreMetodo: ['', [Validators.required]],
  });

  get obtenerArrayAtributos() {
    return this.formularioDiagramaClase.get('atributos') as FormArray;
  }

  get obtenerArrayMetodos() {
    return this.formularioDiagramaClase.get('metodos') as FormArray;
  }

  agregarAtributo() {
    const controlAtributo = new FormControl(this.formularioAtributos.value.nombreAtributo);
    const arrayAtributos = this.obtenerArrayAtributos;
    arrayAtributos.push(controlAtributo);
    this.formularioAtributos.reset();
  }

  agregarMetodo() {
    const controlMetodo = new FormControl(this.formularioMetodos.value.nombreMetodo);
    const arrayMetodos = this.obtenerArrayMetodos;
    arrayMetodos.push(controlMetodo);
    this.formularioMetodos.reset();
  }
}

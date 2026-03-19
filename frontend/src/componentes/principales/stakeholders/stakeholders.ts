import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StakeholdersService } from '../../../services/stakeholders.service';
import { Stakeholder } from '../../../models/stakeholder.interface';

@Component({
  selector: 'app-stakeholders',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './stakeholders.html',
  styleUrl: './stakeholders.css'
})
export class Stakeholders implements OnInit {

  form!: FormGroup;
  stakeholders: Stakeholder[] = [];
  idProyecto = 2; // temporal para pruebas

  constructor(
    private fb: FormBuilder,
    private stakeholdersService: StakeholdersService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      influencia: ['', Validators.required],
      interes: ['', Validators.required],
      contacto: ['', Validators.required]
    });

    this.loadStakeholders();
  }

  loadStakeholders(): void {
    this.stakeholdersService.getStakeholdersByProyecto(this.idProyecto)
      .subscribe({
        next: (data) => {
          this.stakeholders = data;
        },
        error: (error) => {
          console.error('Error al cargar stakeholders:', error);
        }
      });
  }

  save(): void {
    if (this.form.invalid) return;

    const stakeholder: Stakeholder = {
      ...this.form.value,
      idproyecto: this.idProyecto
    };

    this.stakeholdersService.createStakeholder(stakeholder)
      .subscribe({
        next: () => {
          this.form.reset();
          this.loadStakeholders();
        },
        error: (error) => {
          console.error('Error al guardar stakeholder:', error);
        }
      });
  }

  deleteStakeholder(id: number): void {
    this.stakeholdersService.deleteStakeholder(id)
      .subscribe({
        next: () => {
          this.loadStakeholders();
        },
        error: (error) => {
          console.error('Error al eliminar stakeholder:', error);
        }
      });
  }
}
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

  loadStakeholders() {
    this.stakeholdersService.getStakeholders()
      .subscribe(data => this.stakeholders = data);
  }

  save() {
    if (this.form.invalid) return;

    const stakeholder: Stakeholder = {
      ...this.form.value,
      idproyecto: 1 
    };

    this.stakeholdersService.createStakeholder(stakeholder)
      .subscribe(() => {
        this.form.reset();
        this.loadStakeholders();
      });
  }
}

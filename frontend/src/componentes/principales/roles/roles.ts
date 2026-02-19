import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolesService } from '../../../services/roles.service';
import { Rol } from '../../../models/rol.interface';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit {

  form!: FormGroup;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['Interno', Validators.required]
    });

    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.getRoles()
      .subscribe(data => this.roles = data);
  }

  save() {
    if (this.form.invalid) return;

    const rol: Rol = {
      ...this.form.value,
      idproyecto: 1
    };

    this.rolesService.createRol(rol)
      .subscribe(() => {
        this.form.reset({ tipo: 'Interno' });
        this.loadRoles();
      });
  }

  delete(id: number) {
  this.rolesService.deleteRol(id)
    .subscribe(() => this.loadRoles());
  }

}

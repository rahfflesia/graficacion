import { Component, OnInit } from '@angular/core';
import { Procesos, Usuario } from '../../../models/proceso.interface';
import { ProcesosService } from '../../../services/procesos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-procesos-principales',
  imports: [CommonModule],
  templateUrl: './procesos-principales.html',
  styleUrl: './procesos-principales.css',
})
export class ProcesosPrincipales  {
  procesos: Procesos[] = [];
  usuario: Usuario[] = [];
  
  constructor(private procesosService: ProcesosService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }
  cargarDatos(): void {
    this.procesosService.getUsuarios().subscribe(data =>{
      this.usuario = data;
    
    });
      this.procesosService.getProcesos().subscribe(data =>{
        this.procesos = data;
      });
  }

  
}
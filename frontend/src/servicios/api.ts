import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DatosUsuario,
  ProyectoCreado,
  ProyectoEditar,
  Proyectos,
  RegistroUsuario,
  SesionUsuario,
  Usuario,
} from '../models/proceso.interface';
import { DatosEditarProceso, DatosProceso, Proceso } from '../models/procesos.interface';
import { DatosGeneralesProyecto } from '../models/datosGeneralesProyecto.interface';
import { DatosFormularioRol, Rol } from '../models/rol.interface';
import {
  DatosEditarParticipante,
  DatosFormularioParticipante,
  Participante,
  RolParticipanteProyecto,
} from '../models/participantesProyecto.interface';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/';

  private registroUrl = 'registro/';
  private reigstroRegistrarUrl = 'registrar/';

  private loginUrl = 'login/';
  private loginIniciarSesionUrl = 'iniciar-sesion/';

  private proyectosUrl = 'proyectos/';
  private proyectosCrearUrl = 'crear';
  private proyectosObtenerTodosUrl = 'obtenertodos/';
  private proyectosEliminarUrl = 'eliminar/';
  private proyectosEditarUrl = 'editar/';
  private proyectoObtenerDatosUrl = 'obtenerdatos/';

  private procesosUrl = 'procesos/';
  private procesosCrearUrl = 'crear/';
  private procesosEliminarUrl = 'eliminar/';
  private procesosEditarUrl = 'editar/';

  private rolesUrl = 'roles/';
  private rolesObtenerRolesProyectoUrl = 'obtener/';
  private rolesCrearUrl = 'crear/';
  private rolesEliminarUrl = 'eliminar/';
  private rolesEditarUrl = 'editar/';

  private participantesUrl = 'participantes/';
  private participantesRegistrarUrl = 'registrar/';
  private participantesObtenerUrl = 'obtener/';
  private participantesEliminarUrl = 'eliminar/';
  private participantesEditarUrl = 'editar/';

  registrarUsuario(datosRegistro: RegistroUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      this.baseUrl + this.registroUrl + this.reigstroRegistrarUrl,
      datosRegistro,
    );
  }

  iniciarSesion(datosInicioSesion: SesionUsuario): Observable<DatosUsuario> {
    return this.http.post<DatosUsuario>(
      this.baseUrl + this.loginUrl + this.loginIniciarSesionUrl,
      datosInicioSesion,
    );
  }

  crearProyecto(proyecto: ProyectoCreado): Observable<Proyectos> {
    return this.http.post<Proyectos>(
      this.baseUrl + this.proyectosUrl + this.proyectosCrearUrl,
      proyecto,
    );
  }

  obtenerProyectos(idUsuario: number): Observable<Proyectos[]> {
    return this.http.get<Proyectos[]>(
      this.baseUrl + this.proyectosUrl + this.proyectosObtenerTodosUrl + idUsuario,
    );
  }

  eliminarProyecto(idProyecto: number): Observable<Proyectos> {
    return this.http.delete<Proyectos>(
      this.baseUrl + this.proyectosUrl + this.proyectosEliminarUrl + idProyecto,
    );
  }

  editarProyecto(idProyecto: number, proyectoEditar: ProyectoEditar): Observable<Proyectos> {
    return this.http.put<Proyectos>(
      this.baseUrl + this.proyectosUrl + this.proyectosEditarUrl + idProyecto,
      proyectoEditar,
    );
  }

  obtenerDatosGeneralesProyecto(idProyecto: number): Observable<DatosGeneralesProyecto> {
    return this.http.get<DatosGeneralesProyecto>(
      this.baseUrl + this.proyectosUrl + this.proyectoObtenerDatosUrl + idProyecto,
    );
  }

  crearProceso(proceso: DatosProceso): Observable<Proceso> {
    return this.http.post<Proceso>(
      this.baseUrl + this.procesosUrl + this.procesosCrearUrl,
      proceso,
    );
  }

  eliminarProceso(idProceso: number): Observable<Proceso> {
    return this.http.delete<Proceso>(
      this.baseUrl + this.procesosUrl + this.procesosEliminarUrl + idProceso,
    );
  }

  editarProceso(idProceso: number, proceso: DatosEditarProceso): Observable<Proceso> {
    return this.http.put<Proceso>(
      this.baseUrl + this.procesosUrl + this.procesosEditarUrl + idProceso,
      proceso,
    );
  }

  crearRol(datosCrearRol: DatosFormularioRol): Observable<Rol> {
    return this.http.post<Rol>(this.baseUrl + this.rolesUrl + this.rolesCrearUrl, datosCrearRol);
  }

  obtenerRolesProyecto(idProyecto: number): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.baseUrl + this.rolesObtenerRolesProyectoUrl + idProyecto);
  }

  eliminarRol(idRol: number): Observable<Rol> {
    return this.http.delete<Rol>(this.baseUrl + this.rolesUrl + this.rolesEliminarUrl + idRol);
  }

  editarRol(idRol: number, datosEditarRol: DatosFormularioRol): Observable<Rol> {
    console.log(datosEditarRol);
    return this.http.put<Rol>(
      this.baseUrl + this.rolesUrl + this.rolesEditarUrl + idRol,
      datosEditarRol,
    );
  }

  obtenerParticipantesProyecto(idProyecto: number): Observable<Participante[]> {
    return this.http.get<Participante[]>(
      this.baseUrl + this.participantesUrl + this.participantesObtenerUrl + idProyecto,
    );
  }

  registrarParticipante(datosParticipante: DatosFormularioParticipante): Observable<Participante> {
    return this.http.post<Participante>(
      this.baseUrl + this.participantesUrl + this.participantesRegistrarUrl,
      datosParticipante,
    );
  }

  eliminarParticipante(idParticipanteProyecto: number): Observable<RolParticipanteProyecto> {
    return this.http.delete<RolParticipanteProyecto>(
      this.baseUrl + this.participantesUrl + this.participantesEliminarUrl + idParticipanteProyecto,
    );
  }

  editarParticipante(
    idParticipanteProyecto: number,
    datosParticipanteEditar: DatosEditarParticipante,
  ): Observable<Participante> {
    return this.http.put<Participante>(
      this.baseUrl + this.participantesUrl + this.participantesEditarUrl + idParticipanteProyecto,
      datosParticipanteEditar,
    );
  }
}

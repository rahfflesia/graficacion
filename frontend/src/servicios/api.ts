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
import { TecnicaRecoleccion } from '../models/tecnicasRecoleccion.interface';
import { DatosFormularioSubproceso, Subproceso } from '../models/subprocesos.interface';
import { DatosFormularioObservacion, Observacion } from '../models/observacion';
import { DatosFormularioCuestionario, Cuestionario, DatosRespuestaCuestionario, RespuestaCuestionario } from '../models/cuestionario';
import { DatosFormularioHistoriaUsuario, HistoriaUsuario } from '../models/historiaUsuario';
import { DatosEntrevista, Entrevista } from '../models/entrevista';

import { DatosFormularioFocusGroup, FocusGroup } from '../models/focusGroup';
import { DatosFormularioAnalisis, AnalisisDocumento } from '../models/analisisDocumento';
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

  private tecnicasRecoleccionUrl = 'tecnicasrecoleccion/';
  private tecnicasRecoleccionObtenerUrl = 'obtener/';

  private subprocesosUrl = 'subprocesos/';
  private subprocesosCrearUrl = 'crear/';
  private subprocesosEliminarUrl = 'eliminar/';
  private subprocesosEditarUrl = 'editar/';

  private logoutUrl = 'logout/';

  private observacionesUrl = 'observaciones/';
  private observacionesCrearUrl = 'crear/';
  private observacionesObtenerUrl = 'obtener/';
  private observacionesEliminarUrl = 'eliminar/';
  private observacionesEditarUrl = 'editar/';

  private cuestionariosUrl = 'cuestionarios/';
  private cuestionariosCrearUrl = 'crear/';
  private cuestionariosObtenerUrl = 'obtener/';
  private cuestionariosEliminarUrl = 'eliminar/';
  private cuestionariosEditarUrl = 'editar/';

  private respuestasCuestionariosUrl = 'respuestas-cuestionarios/';
  private respuestasCuestionariosResponderUrl = 'responder/';
  private respuestasCuestionariosObtenerUrl = 'obtener/';
  private respuestasCuestionariosEliminarUrl = 'eliminar/';

  private historiasUsuarioUrl = 'historiasusuario/';
  private historiasUsuarioCrearUrl = 'crear/';
  private historiasUsuarioObtenerUrl = 'obtener/';
  private historiasUsuarioEliminarUrl = 'eliminar/';
  private historiasUsuarioEditarUrl = 'editar/';
  
  private entrevistasUrl = 'entrevistas/';
  private entrevistasCrearUrl = 'crear/';
  private entrevistasObtenerUrl = 'obtener/';
  private entrevistasEliminarUrl = 'eliminar/';
  private entrevistasEditarUrl = 'editar/';

  private focusGroupsUrl = 'focusgroups/';
  private focusGroupsCrearUrl = 'crear/';
  private focusGroupsObtenerUrl = 'obtener/';
  private focusGroupsEliminarUrl = 'eliminar/';
  private focusGroupsEditarUrl = 'editar/';

  private analisisDocumentosUrl = 'analisis-documentos/';
  private analisisDocumentosCrearUrl = 'crear/';
  private analisisDocumentosObtenerUrl = 'obtener/';
  private analisisDocumentosEliminarUrl = 'eliminar/';
  private analisisDocumentosEditarUrl = 'editar/';

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

  obtenerSesionActual(): Observable<DatosUsuario> {
    return this.http.get<DatosUsuario>(this.baseUrl + this.loginUrl + 'sesion/');
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
    return this.http.get<Rol[]>(
      this.baseUrl + this.rolesUrl + this.rolesObtenerRolesProyectoUrl + idProyecto,
    );
  }

  eliminarRol(idRol: number): Observable<Rol> {
    return this.http.delete<Rol>(this.baseUrl + this.rolesUrl + this.rolesEliminarUrl + idRol);
  }

  editarRol(idRol: number, datosEditarRol: DatosFormularioRol): Observable<Rol> {
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

  obtenerTecnicasRecoleccion(): Observable<TecnicaRecoleccion> {
    return this.http.get<TecnicaRecoleccion>(
      this.baseUrl + this.tecnicasRecoleccionUrl + this.tecnicasRecoleccionObtenerUrl,
    );
  }

  crearSubproceso(datosSubproceso: DatosFormularioSubproceso): Observable<Subproceso> {
    return this.http.post<Subproceso>(
      this.baseUrl + this.subprocesosUrl + this.subprocesosCrearUrl,
      datosSubproceso,
    );
  }

  eliminarSubproceso(idSubproceso: number): Observable<Subproceso> {
    return this.http.delete<Subproceso>(
      this.baseUrl + this.subprocesosUrl + this.subprocesosEliminarUrl + idSubproceso,
    );
  }

  editarSubproceso(
    idSubproceso: number,
    datosSubproceso: DatosFormularioSubproceso,
  ): Observable<Subproceso> {
    return this.http.put<Subproceso>(
      this.baseUrl + this.subprocesosUrl + this.subprocesosEditarUrl + idSubproceso,
      datosSubproceso,
    );
  }

  cerrarSesion(): Observable<any> {
    return this.http.post(this.baseUrl + this.logoutUrl, {});
  }

  crearObservacion(datosObservacion: DatosFormularioObservacion): Observable<Observacion> {
    return this.http.post<Observacion>(
      this.baseUrl + this.observacionesUrl + this.observacionesCrearUrl,
      datosObservacion,
    );
  }

  obtenerObservaciones(idSubproceso: number): Observable<Observacion[]> {
    return this.http.get<Observacion[]>(
      this.baseUrl + this.observacionesUrl + this.observacionesObtenerUrl + idSubproceso,
    );
  }

  eliminarObservacion(idObservacion: number): Observable<Observacion> {
    return this.http.delete<Observacion>(
      this.baseUrl + this.observacionesUrl + this.observacionesEliminarUrl + idObservacion,
    );
  }

  editarObservacion(idObservacion: number, datosObservacion: Observacion): Observable<Observacion> {
    return this.http.put<Observacion>(
      this.baseUrl + this.observacionesUrl + this.observacionesEditarUrl + idObservacion,
      datosObservacion,
    );
  }

  crearCuestionario(datosCuestionario: DatosFormularioCuestionario): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + this.cuestionariosUrl + this.cuestionariosCrearUrl,
      datosCuestionario,
    );
  }

  obtenerCuestionarios(idSubproceso: number): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(
      this.baseUrl + this.cuestionariosUrl + this.cuestionariosObtenerUrl + idSubproceso,
    );
  }

  eliminarCuestionario(idCuestionario: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl + this.cuestionariosUrl + this.cuestionariosEliminarUrl + idCuestionario,
    );
  }

  editarCuestionario(
    idCuestionario: number,
    datosCuestionario: DatosFormularioCuestionario,
  ): Observable<any> {
    return this.http.put(
      this.baseUrl + this.cuestionariosUrl + this.cuestionariosEditarUrl + idCuestionario,
      datosCuestionario,
    );
  }

  responderCuestionario(datos: DatosRespuestaCuestionario): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + this.respuestasCuestionariosUrl + this.respuestasCuestionariosResponderUrl,
      datos,
    );
  }

  obtenerRespuestasCuestionario(idCuestionario: number): Observable<RespuestaCuestionario[]> {
    return this.http.get<RespuestaCuestionario[]>(
      this.baseUrl +
        this.respuestasCuestionariosUrl +
        this.respuestasCuestionariosObtenerUrl +
        idCuestionario,
    );
  }

  eliminarRespuestaCuestionario(idRespuesta: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl +
        this.respuestasCuestionariosUrl +
        this.respuestasCuestionariosEliminarUrl +
        idRespuesta,
    );
  }

  crearEntrevista(datosEntrevista: Entrevista): Observable<Entrevista> {
    return this.http.post<Entrevista>(
      this.baseUrl + this.entrevistasUrl + this.entrevistasCrearUrl,
      datosEntrevista,
    );
  }

  editarEntrevista(idEntrevista: number, datosEntrevista: Entrevista): Observable<Entrevista> {
    return this.http.put<Entrevista>(
      this.baseUrl + this.entrevistasUrl + this.entrevistasEditarUrl + idEntrevista,
      datosEntrevista,
    );
  }

  eliminarEntrevista(idEntrevista: number): Observable<Entrevista> {
    return this.http.delete<Entrevista>(
      this.baseUrl + this.entrevistasUrl + this.entrevistasEliminarUrl + idEntrevista,
    );
  }

  obtenerEntrevistas(idSubproceso: number): Observable<Entrevista[]> {
    return this.http.get<Entrevista[]>(
      this.baseUrl + this.entrevistasUrl + this.entrevistasObtenerUrl + idSubproceso,
    );
  }

  crearFocusGroup(datos: DatosFormularioFocusGroup): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + this.focusGroupsUrl + this.focusGroupsCrearUrl,
      datos,
    );
  }

  obtenerFocusGroups(idSubproceso: number): Observable<FocusGroup[]> {
    return this.http.get<FocusGroup[]>(
      this.baseUrl + this.focusGroupsUrl + this.focusGroupsObtenerUrl + idSubproceso,
    );
  }

  eliminarFocusGroup(idFocusGroup: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl + this.focusGroupsUrl + this.focusGroupsEliminarUrl + idFocusGroup,
    );
  }

  editarFocusGroup(idFocusGroup: number, datos: DatosFormularioFocusGroup): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + this.focusGroupsUrl + this.focusGroupsEditarUrl + idFocusGroup,
      datos,
    );
  }

  crearAnalisisDocumento(datos: DatosFormularioAnalisis): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + this.analisisDocumentosUrl + this.analisisDocumentosCrearUrl,
      datos,
    );
  }

  obtenerAnalisisDocumentos(idSubproceso: number): Observable<AnalisisDocumento[]> {
    return this.http.get<AnalisisDocumento[]>(
      this.baseUrl + this.analisisDocumentosUrl + this.analisisDocumentosObtenerUrl + idSubproceso,
    );
  }

  eliminarAnalisisDocumento(idAnalisis: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl + this.analisisDocumentosUrl + this.analisisDocumentosEliminarUrl + idAnalisis,
    );
  }

  editarAnalisisDocumento(idAnalisis: number, datos: DatosFormularioAnalisis): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + this.analisisDocumentosUrl + this.analisisDocumentosEditarUrl + idAnalisis,
      datos,
    );
  }

  crearHistoriaUsuario(datos: DatosFormularioHistoriaUsuario) {
    return this.http.post<HistoriaUsuario>(
      this.baseUrl + this.historiasUsuarioUrl + this.historiasUsuarioCrearUrl,
      datos,
    );
  }

  obtenerHistoriasUsuario(idsubproceso: number) {
    return this.http.get<HistoriaUsuario[]>(
      this.baseUrl + this.historiasUsuarioUrl + this.historiasUsuarioObtenerUrl + idsubproceso,
    );
  }

  editarHistoriaUsuario(id: number, datos: Partial<DatosFormularioHistoriaUsuario>) {
    return this.http.put<HistoriaUsuario>(
      this.baseUrl + this.historiasUsuarioUrl + this.historiasUsuarioEditarUrl + id,
      datos,
    );
  }

  eliminarHistoriaUsuario(id: number) {
    return this.http.delete(
      this.baseUrl + this.historiasUsuarioUrl + this.historiasUsuarioEliminarUrl + id,
    );
  }
}

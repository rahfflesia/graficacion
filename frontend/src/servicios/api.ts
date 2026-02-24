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
}

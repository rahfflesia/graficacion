import { Subprocesos } from '../componentes/principales/subprocesos/subprocesos';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contraseña: string;
  rol: number;
}

export interface Procesos {
  id: number;
  nombre: string;
  descripcion: string;
  creador: number;
  fechacreacion: Date;
  subprocesos: Subprocesos[];
}

export interface Proyectos {
  idproyecto: number;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  idUsuario: number;
}

// Esta es la interfaz que utilizo para crear el proyecto en el modal
export interface ProyectoCreado {
  nombre: string;
  descripcion: string;
  idUsuario: number;
}

// Interfaz que envío al editar el proyecto
export interface ProyectoEditar {
  nombre: string;
  descripcion: string;
}

export interface Roles {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface RolesUsuario {}

export interface TecnicasRecoleccion {
  id: number;
  nombre: string;
  descripcion: string;
}

// Esta interfaz la utilizo para enviar los datos al registrar al usuario
export interface RegistroUsuario {
  nombre: string;
  contrasena: string;
  correo: string;
}

export interface SesionUsuario {
  correo: string;
  contrasena: string;
}

// Interfaz que utilizo para guardar los datos del usuario en el servicio
export interface DatosUsuario {
  idusuario: number;
  nombre: string;
  correo: string;
  pfp: string;
}

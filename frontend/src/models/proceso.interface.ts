import { Subprocesos } from "../componentes/principales/subprocesos/subprocesos";

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
    fechaCreacion: Date;
    subprocesos: Subprocesos[];
}

export interface Proyectos{
    id: number;
    nombre: string;
    descripcion: string;
    creador: number;
    fechaCreacion: Date;
    procesos: Procesos[];
}

export interface Roles {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface RolesUsuario {
    
}

export interface TecnicasRecoleccion {
    id: number;
    nombre: string;
    descripcion: string;
}



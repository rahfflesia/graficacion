export interface DatosFormularioHistoriaUsuario {
  idsubproceso: number;
  idcreador: number;
  rolusuario: string;
  necesidad: string;
  beneficio: string;
  criteriosaceptacion: string[];
  prioridad: string;
}

export interface HistoriaUsuario extends DatosFormularioHistoriaUsuario {
  idhistoriausuario: number;
  fechacreacion: string;
}
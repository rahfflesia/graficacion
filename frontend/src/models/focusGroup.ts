export interface DatosFormularioFocusGroup {
  idsubproceso: number;
  nombre: string;
  descripcion: string;
  idmoderador: number;
  lugar: string;
  fechahora?: string;
  temas: string[];
  participantes: number[];
}

export interface FocusGroup {
  idfocusgroup: number;
  idsubproceso: number;
  nombre: string;
  descripcion: string;
  idmoderador: number;
  lugar: string;
  fechahora: string;
  temasfocusgroup: TemaFocusGroup[];
  participantesfg: ParticipanteFG[];
  personas: ModeradorFG;
}

export interface TemaFocusGroup {
  idtema: number;
  idfocusgroup: number;
  tema: string;
}

export interface ParticipanteFG {
  idfocusgroup: number;
  idpersona: number;
  personas: {
    idpersona: number;
    nombre: string;
    apellidouno: string;
    apellidodos: string | null;
  };
}

export interface ModeradorFG {
  idpersona: number;
  nombre: string;
  apellidouno: string;
  apellidodos: string | null;
}

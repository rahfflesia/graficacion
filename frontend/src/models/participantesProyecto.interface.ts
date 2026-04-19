interface DatosFormularioParticipante {
  nombre: string;
  apellidoUno: string;
  apellidoDos: string | null;
  correo: string;
  telefono: string;
  idrol: number;
  idproyecto: number;
}

interface Participante {
  nombre: string;
  apellidouno: string;
  apellidodos: string | null;
  correo: string;
  telefono: string;
  nombrerol?: string;
  idpersona: number;
  idrol?: number;
  idrolpersonaproyecto?: number;
  tiporol: string;
}

interface RolParticipanteProyecto {
  idrolpersonaproyecto: number;
  idpersona: number;
  idrol: number;
  idproyecto: number;
  tipo: string | 'Persona';
}

interface DatosEditarParticipante {
  nombre: string;
  apellidouno: string;
  apellidodos: string | null;
  correo: string;
  telefono: string;
  idrol: number;
  idrolpersonaproyecto: number;
  idpersona: number;
}

export type {
  DatosFormularioParticipante,
  Participante,
  RolParticipanteProyecto,
  DatosEditarParticipante,
};

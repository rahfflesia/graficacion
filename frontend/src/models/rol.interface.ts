interface Rol {
  idrol: number;
  nombre: string;
  tipo: 'Interno' | 'Externo';
  idproyecto: number;
}

interface DatosFormularioRol {
  nombre: string;
  tipo: 'Interno' | 'Externo';
  idproyecto?: number;
}

export type { Rol, DatosFormularioRol };

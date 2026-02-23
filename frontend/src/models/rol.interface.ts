export type TipoRol = 'Interno' | 'Externo';

export interface Rol {
  idrol?: number;
  nombre: string;
  tipo: TipoRol;
  idproyecto: number;
}

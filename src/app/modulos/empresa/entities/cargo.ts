import { Empresa } from './empresa'
import { Competencia } from './competencia';

export class Cargo {
  id: string;
  descripcion: string;
  nombre: string;
  empresa: Empresa;
  ficha: string;
  competenciasList: Competencia[];
}

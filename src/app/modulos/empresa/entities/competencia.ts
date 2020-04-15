import { Empresa } from './empresa'

export class Competencia {
  id: string;
  descripcion: string;
  nombre: string;
  competencia: Competencia;
  competenciaList:Competencia[];
  empresa: Empresa;
}

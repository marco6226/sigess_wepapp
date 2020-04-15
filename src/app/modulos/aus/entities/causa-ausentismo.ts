
import { Empresa } from 'app/modulos/empresa/entities/empresa'

export class CausaAusentismo {
  id: string;
  tipo: string;
  nombre: string;
  requiereSoporte: boolean;
  requiereCie: boolean;
  empresa: Empresa;
}
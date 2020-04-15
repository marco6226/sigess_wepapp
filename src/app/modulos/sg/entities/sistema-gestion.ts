import { SistemaGestionPK } from './sistema-gestion-pk'
import { Elemento } from './elemento'

export class SistemaGestion {
  sistemaGestionPK: SistemaGestionPK;
  nombre: string;
  codigo: string;
  descripcion: string;
  ekEmpEmpresaId: string;
  elementoList: Elemento[] = [];
}

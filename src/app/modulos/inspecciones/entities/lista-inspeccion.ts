import { ListaInspeccionPK } from './lista-inspeccion-pk'
import { OpcionCalificacion } from './opcion-calificacion'
import { ElementoInspeccion } from './elemento-inspeccion'
import { Formulario } from 'app/modulos/comun/entities/formulario';


export class ListaInspeccion {
  listaInspeccionPK: ListaInspeccionPK = new ListaInspeccionPK();
  nombre: string;
  codigo: string;
  tipoLista:string;
  descripcion: string;
  elementoInspeccionList: ElementoInspeccion[];
  opcionCalificacionList: OpcionCalificacion[] = [];
  formulario: Formulario;
  usarTipoHallazgo:boolean;
  usarNivelRiesgo:boolean;
}

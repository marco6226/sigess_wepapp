
import { CausaRaiz } from 'app/modulos/sec/entities/causa-raiz'
import { Desviacion } from 'app/modulos/sec/entities/desviacion'
import { CausaInmediata } from './causa-inmediata';
import { AnalisisCosto } from './analisis-costo';
import { Documento } from '../../ado/entities/documento';
import { CausaAdministrativa } from './sistema-causa-administrativa';
import { Tarea } from './tarea';

export class AnalisisDesviacion {
  id: string;
  analisisCosto:AnalisisCosto;
  observacion: string;
  jerarquia: string;
  fechaElaboracion: Date;
  tareaId: string;
  causaRaizList: CausaRaiz[];
  causaInmediataList: CausaInmediata[];
  causasAdminList: CausaAdministrativa[];
  desviacionesList: Desviacion[];
  documentosList:Documento[];
  tareaDesviacionList:Tarea[]; participantes: string;
  tareaAsignada:  boolean;
}

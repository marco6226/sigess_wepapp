

import { ElementoInspeccion } from './elemento-inspeccion'
import { OpcionCalificacion } from './opcion-calificacion'
import { NivelRiesgo } from 'app/modulos/core/entities/nivel-riesgo'
  
import { Documento } from 'app/modulos/ado/entities/documento'
import { TipoHallazgo } from './tipo-hallazgo';

export class Calificacion {
  id: string;
  recomendacion: string;
  elementoInspeccion: ElementoInspeccion;
  opcionCalificacion: OpcionCalificacion;
  nivelRiesgo: NivelRiesgo;
  documentosList: Documento[];
  tipoHallazgo:TipoHallazgo;
}


import { Tarjeta } from './tarjeta'
import { Implicacion } from './implicacion'
import { Area } from 'app/modulos/empresa/entities/area'
import { CausaRaiz } from 'app/modulos/sec/entities/causa-raiz';
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { Documento } from '../../ado/entities/documento';

export class Observacion {
  id: string;
  tipoObservacion: string;
  afecta: string[];
  descripcion: string;
  recomendacion: string;
  personasobservadas: string;
  personasabordadas: string;
  nivelRiesgo: string;
  fechaObservacion: Date;
  aceptada: Boolean;
  motivo: string;
  fechaRespuesta: Date;
  area: Area;
  implicacionList: Implicacion[];
  causaRaizList: CausaRaiz[];
  causaRaizAprobadaList: CausaRaiz[];
  tarjeta: Tarjeta;
  usuarioReporta:Usuario;
  usuarioRevisa:Usuario;
  documentoList:Documento[];
}
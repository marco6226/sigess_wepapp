import { SistemaGestion } from './sistema-gestion'
import { IndicadoresEvaluacion } from './indicadores-evaluacion'
import { IndicadoresElemento } from './indicadores-elemento'
import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { Sede } from 'app/modulos/empresa/entities/sede'
import { Area } from 'app/modulos/empresa/entities/area'

export class Evaluacion {
  id: string;
  nombre: string;
  descripcion: string;
  codigo: string;

  nombreResponsable:string;
  emailResponsable:string;
  ciudad:string;
  direccion:string;
  telefono:string;
  actividadEconomica:string;
  numeroTrabajadores:number;
  nombreEvaluador:string;
  licenciaEvaluador:string;
  nombreSGE:string;
  numeroPreguntas:number;
  numeroRespuestas:number;

  empresa: Empresa;
  sede: Sede;
  sistemaGestion: SistemaGestion;
  fechaInicio: Date;
  fechaFinalizacion: Date;
  indicadoresEvaluacion: IndicadoresEvaluacion;
  indicadoresElemento: IndicadoresElemento[];

}

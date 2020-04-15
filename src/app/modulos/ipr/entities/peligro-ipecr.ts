
import { Probabilidad } from 'app/modulos/core/entities/probabilidad'
import { Consecuencia } from 'app/modulos/core/entities/consecuencia'
import { NivelRiesgo } from 'app/modulos/core/entities/nivel-riesgo'
import { Fuente } from './fuente'
import { Efecto } from './efecto'
import { Control } from './control'
import { Peligro } from './peligro'
import { Ipecr } from './ipecr'

export class PeligroIpecr {
  id: string;
  proceso: string;
  zonaLugar: string;
  tarea: string;
  actividad: string;
  rutinario: string;
  nivelDeficiencia: number;
  nivelExposicion: number;
  valorProbabilidad: number;
  valorRiesgo: number;
  numeroExpuestos: number;
  peorConsecuencia: string;
  probabilidad: Probabilidad;
  consecuencia: Consecuencia;
  nivelRiesgo: NivelRiesgo;
  fuenteList: Fuente[];
  efectoList: Efecto[];
  controlList: Control[];
  necesidadControlList: Control[];
  peligro: Peligro;
  ipecr: Ipecr;

}
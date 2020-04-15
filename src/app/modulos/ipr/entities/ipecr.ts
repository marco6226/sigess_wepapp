
import { PeligroIpecr } from './peligro-ipecr'
import { ParticipanteIpecr } from './participante-ipecr'
import { Area } from 'app/modulos/empresa/entities/area'
import { Cargo } from 'app/modulos/empresa/entities/cargo'

export class Ipecr {
  id: string;
  rutinario: boolean;
  ejecucion: string;
  actividad: string;
  descripcion: string;
  proceso: string;
  numTrabajadoresPropios: number;
  numTrabajadoresExternos: number;
  fechaElaboracion: Date;
  peligroIpecrList: PeligroIpecr[];
  areaList: Area[];
  cargo: Cargo;
  participanteIpecrList: ParticipanteIpecr[];
  grupoExpSimilarList: string[];

  areasStr:string;
  grupoExpSimilarStr:string;
  fechaElaboracionStr:string;
}

import { Arl } from 'app/modulos/comun/entities/arl';
import { Ciiu } from 'app/modulos/comun/entities/ciiu';

export class Empresa {
  id: string;
  nombreComercial: string;
  razonSocial: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  numeroSedes: Number;
  arl: Arl;
  ciiu: Ciiu;
  logo:string;
  empresasContratistasList: Empresa[];
  tipo_persona?: string;
  actividades_contratadas?: string;
  localidad?: string;
  division?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  calificacion?: string;
  estado?: string;
  vigencia?: string;
}


export interface EmpresaAlidada {
  // nombreComercial: string;
  razonSocial: string;
  nit: string;
  // direccion: string;
  telefono: string;
  email: string;
  // web: string;
  // numeroSedes: Number;
  // arl: Arl;
  // ciiu: Ciiu;
  // logo:string;
  // empresasContratistasList: Empresa[];
}
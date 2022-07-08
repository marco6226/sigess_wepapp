import { Empleado } from "app/modulos/empresa/entities/empleado";

export interface FactorCausal{
    id: number;
    nombre: string;
    seccion?: seccion[];
    causa_Raiz?: Causa_Raiz[];
}

export interface seccion{
  tipoDesempeno: string;
  desempeno: Desempeno[];
}

export interface Desempeno{
    id: number;
    pregunta: string;
    dq:string;
    // areas: areaInvolucrada[];
    areas?: IdentificacionFC[];
    selected: boolean|null|undefined
  }

export interface areaInvolucrada{
    area: string
  }

/// procedimientos

export interface IdentificacionFC{
    id: number;
    factor: string;
    subProd: SubClasificacion[];
    selectable: boolean;
  }
  
export interface SubClasificacion{
  id: number;
  subProd: string;  
  causa: Causa[];
}

export interface Causa{
    id: number;
    ProcedimientoFC: string;
    esCausa: boolean;
  }

export interface Causa_Raiz{
  label: string;
  expanded: boolean;
  type: string;
  data: {name:string};
  children?: Causa_Raiz[]
}

export interface Incapacidad{
  id?:number;
  cie10?: string;
  diagnostico?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  tipo?: string;
  diasAusencia?: number;
}

export interface listFactores{
  pregunta?: string;
  nombre?: string;
  metodologia?: string;
  accion?: string;
}

export interface listPlanAccion{
  nombreFC?: string;
  causaRaiz?: planCausaRaiz[];
}

export interface planCausaRaiz{
  // id: number;
  causaRaiz: string;
  especifico: PlanEspecifico;
  razonable?: PlanRazonable;
  medible?: PlanMedible;
  eficaz?: PlanEficaz;
  revisado?: PlanRevisado;
  
}

export interface PlanEspecifico{
  nombreAccionCorrectiva: string;
  accionCorrectiva: string;
  fechaVencimiento: Date;
  responsableEmpresa: Empleado;
  responsableExterno: String;
  isComplete: boolean;
}

export interface PlanRazonable{
  justificacion?: string;
  isComplete: boolean;
}

export interface PlanMedible{
  responsableEmpresa: Empleado
  responsableExterno: String
  fechaVencimiento: Date;
  planVerificacion: string;
  isComplete: boolean;
}

export interface PlanEficaz{
  responsableEmpresa: Empleado
  responsableExterno: String
  fechaVencimiento: Date;
  planValidacion: string;
  isComplete: boolean;
}

export interface PlanRevisado{
  revisado: string;
  isComplete: boolean;
}
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
  especifico?: PlanEspecifico;
  razonable?: PlanRazonable;
  medible?: PlanMedible;
  eficaz?: PlanEficaz;
  revisado?: PlanRevisado;
}

export interface PlanEspecifico{
  nombreAccionCorrectiva: string;
  accionCorrectiva: string;
  fechaVencimiento: Date;
}

export interface PlanRazonable{
  justificacion?: string;
}

export interface PlanMedible{
  responsable: string;
  fechaVencimiento: Date;
  planVerificacion: string;
}

export interface PlanEficaz{
  responsable: string;
  fechaVencimiento: Date;
  planValidacion: string;
}

export interface PlanRevisado{
  revisado: boolean;
}
export interface FactorCausal{
    id: number;
    nombre: string;
}

export interface Desempeno{
    id: number;
    pregunta: string;
    dq:string;
    areas: areaInvolucrada[];
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
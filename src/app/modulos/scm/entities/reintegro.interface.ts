export interface Reintegro{
    id:number;
    tipo_retorno: string;
    descripcion: string;
    permanencia: string;
    periodo_seguimiento: string;
    reintegro_exitoso: string;
    fecha_cierre: Date;
    observacion: string;
    pk_case: string;
}

export interface ReintegroCreate {
    tipo_retorno: string;
    descripcion: string;
    permanencia: string;
    periodo_seguimiento: string;
    reintegro_exitoso: string;
    fecha_cierre: Date;
    observacion: string;
    pk_case: string;
}


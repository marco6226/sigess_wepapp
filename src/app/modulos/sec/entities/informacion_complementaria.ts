export interface InformacionComplementaria{
    Peligro: DatoPeligro;
    DescripcionPeligro: DatoPeligro;
    EnventoARL: string;
    ReporteControl: string;
    FechaControl: Date;
    CopiaTrabajador: string;
    FechaCopia: Date;
}
export interface DatoPeligro{
    id:number;
    nombre:string;
}
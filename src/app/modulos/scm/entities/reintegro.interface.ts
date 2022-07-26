export interface Reintegro{
    id:number;
    reintegro: string;
    pk_case: string;
}

export interface ReintegroCreate{
    reintegro: string;
    pk_case: string;
}
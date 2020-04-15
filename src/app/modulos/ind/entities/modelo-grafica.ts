
export interface ModeloGrafica {
    title: string;
    labels: string[];
    datasets: Dataset[];
    lat?: number[];
    long?: number[];
    fichaTecnicaIndicador:FichaTecnicaIndicador;
}

export interface Dataset {
    data: number[];
    label: string;
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
}


export interface FichaTecnicaIndicador {
    proceso: string;
    nombre: string;
    descripcion: string;
    formulación: string;
    frecuenciaSeguimiento: string;
    meta: string;
  }
  
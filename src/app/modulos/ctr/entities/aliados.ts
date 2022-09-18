export interface Aliados {
    nit: string;
    razonSocial: string;
    tipo: string;
    fecha: Date;
    estado: string;
    calificacion: string;
    vigencia: string;    
}

export interface EquipoSST{
    nombre: string;
    documento: string;
    division: string;
    localidad: string;
    cargo: string;
    licenciaSST: string;
}

export interface ResponsableSST{
    nombre: string;
    correo: string;
    telefono: string;
    licenciaSST: string;
}

export interface SST{
    id?: number;
    id_empresa: number;
    responsable: string;
    nombre: string;
    correo: string;
    telefono: string;
    licenciasst: string;
    documento: string;
    division: string;
    localidad: string;
    cargo: string;
    encargado: boolean;
}

export interface AliadoInformacion{
    id?: number;
    id_empresa: number;
    actividad_contratada: string;
    division: string;
    localidad: string;
    calificacion: string;
    colider: string;
}

export const _actividadesContratadasList = [
    // { label: '--Seleccione--', value: null },
    {label: 'actividad 1', value: 'actividad1'},
    {label: 'actividad 2', value: 'actividad2'},
    {label: 'actividad 3', value: 'actividad3'},
    {label: 'actividad 4', value: 'actividad4'},
]

export const _divisionList= [
    { label: 'Almacenes Corona', value: 'Almacenes Corona' },
    { label: 'Bathrooms and Kitchen', value: 'Bathrooms and Kitchen' },
    { label: 'Comercial Corona Colombia', value: 'Comercial Corona Colombia' },
    { label: 'Funciones Transversales', value: 'Funciones Transversales' },
    { label: 'Insumos Industriales y Energias', value: 'Insumos Industriales y Energias' },
    { label: 'Mesa Servida', value: 'Mesa Servida' },
    { label: 'Superficies, materiales y pinturas', value: 'Superficies, materiales y pinturas' },
]
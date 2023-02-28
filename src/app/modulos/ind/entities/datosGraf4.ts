export class division{
    padrenombre:string;
    datos:datos;
}
export class datos{
    tipo_lesionCont:tipo_lesionCont;
    parte_cuerpoCont:parte_cuerpoCont;
    agenteCont:agenteCont;
    mecanismoCont:mecanismoCont;
    sitioCont:sitioCont;
    tipoAccidenteCont:tipoAccidenteCont;
}

export class datosmap{
    tipo_lesionCont=new Map();
    parte_cuerpoCont=new Map();
    agenteCont=new Map();
    mecanismoCont=new Map();
    sitioCont=new Map();
    tipoAccidenteCont=new Map();
}
export const tipo_lesion = [
    {value:'AMPUTACION_ENUCLEACION', label: 'Amputación o enucleación (Exclusión o pérdida del ojo)'},
    {value:'ASFIXIA', label: 'Asfixia' },
    {value:'CONMOCION_TRAUMA', label: 'Conmoción o trauma interno' },
    {value:'EFECTO_ELECTRICIDAD', label: 'Efecto de la electricidad' },
    {value:'EFECTO_RADIACION', label: 'Efecto nocivo de la radiación' },
    {value:'EFECTO_TIEMPO', label: 'Efecto del tiempo, del clima, u otro relacionado con el ambiente' },
    {value:'ENVENAMIENTO_INTOXICACION', label: 'Envenenamiento o intoxicación aguda o alergia' },
    {value:'FRACTURA', label: 'Fractura' },
    {value:'GOLPE_CONTUSION', label: 'Golpe, contusión o aplastamiento' },
    {value:'HERIDA', label: 'Herida' },
    {value:'LESIONES_MULTIPLES', label: 'Lesiones múltiples' },
    {value:'LUXACION', label: 'Luxación' },
    {value:'QUEMADURA', label: 'Quemadura' },
    {value:'TORCEDURA_ESGUINCE', label: 'Torcedura, esguince, desgarro muscular, hernia o laceraciónde músculo o tendón sin herida' },
    {value:'TRAUMA_SUPERFICIAL', label: 'Trauma superficial (Incluye rasguño, punción o pinchazo y lesión en ojo por cuerpo extraño)' },
    {value:'OTRO', label: 'Otro (Especifique)' },
];

export class tipo_lesionCont {
    AMPUTACION_ENUCLEACION:number=0;
    ASFIXIA:number=0;
    CONMOCION_TRAUMA:number=0;
    EFECTO_ELECTRICIDAD:number=0;
    EFECTO_RADIACION:number=0;
    EFECTO_TIEMPO:number=0;
    ENVENAMIENTO_INTOXICACION:number=0;
    FRACTURA:number=0;
    GOLPE_CONTUSION:number=0;
    HERIDA:number=0;
    LESIONES_MULTIPLES:number=0;
    LUXACION:number=0;
    QUEMADURA:number=0;
    TORCEDURA_ESGUINCE:number=0;
    TRAUMA_SUPERFICIAL:number=0;
    OTRO:number=0;
}

export const parte_cuerpo = [
    { value: 'ABDOMEN', label: 'Abdomen' },
    { value: 'CABEZA', label: 'Cabeza' },
    { value: 'CUELLO', label: 'Cuello' },
    { value: 'LESIONES_GENERALES', label: 'Lesiones generales u otras' },
    { value: 'MANOS', label: 'Manos' },
    { value: 'MIEMBRO_INFERIOR', label: 'Miembros inferiores' },
    { value: 'MIEMBRO_SUPERIOR', label: 'Miembros superiores' },
    { value: 'OJO', label: 'Ojos' },
    { value: 'PIES', label: 'Pies' },
    { value: 'TORAX', label: 'Tórax' },
    { value: 'TRONCO', label: 'Tronco (incluye espalda, columna vertebral, médula espinal, pélvis)' },
    { value: 'UBICACIONES_MULTIPLES', label: 'Ubicaciones múltiples' },    
]

export class parte_cuerpoCont {
    ABDOMEN:number=0;
    CABEZA:number=0;
    CUELLO:number=0;
    LESIONES_GENERALES:number=0;
    MANOS:number=0;
    MIEMBRO_INFERIOR:number=0;
    MIEMBRO_SUPERIOR:number=0;
    OJO:number=0;
    PIES:number=0;
    TORAX:number=0;
    TRONCO:number=0;
    UBICACIONES_MULTIPLES:number=0;
}

export const agente = [
    { value: 'AGUJA_MAT_CORTOPUNZANTE', label: 'Aguja/material cortopunzante' },
    { value: 'AMBIENTE_TRABAJO', label: 'Ambiente de trabajo (Incluye superficies de tránsito y de trabajo, muebles, tejados, en el exterior, interior o subterráneos)' },
    { value: 'ANIMALES', label: 'Animales (Vivos o productos animales)' },
    { value: 'APARATOS', label: 'Aparatos' },
    { value: 'ARMA_FUEGO_CORTOPUNZANTE', label: 'Arma de fuego/cortopunzante' },
    { value: 'EXPLOSIVOS', label: 'Explosivos' },
    { value: 'HERRAMIENTAS', label: 'Herramientas, implementos, o utensilios' },
    { value: 'MAQUINAS_EQUIPOS', label: 'Máquinas y/o equipos' },
    { value: 'MATERIALES_SUSTANCIAS', label: 'Materiales o sustancias' },
    { value: 'MEDIOS_TRANSPORTE', label: 'Medios de transporte' },
    { value: 'NO_CLASIFICADOS', label: 'Otros agentes no clasificados' },
    { value: 'NO_CLASIFICADOS_FALTA_DATOS', label: 'Agentes no clasificados por falta de datos' },
    { value: 'RADIACIONES', label: 'Radiaciones' },
];

export class agenteCont {
    AGUJA_MAT_CORTOPUNZANTE:number=0;
    AMBIENTE_TRABAJO:number=0;
    ANIMALES:number=0;
    APARATOS:number=0;
    ARMA_FUEGO_CORTOPUNZANTE:number=0;
    EXPLOSIVOS:number=0;
    HERRAMIENTAS:number=0;
    MAQUINAS_EQUIPOS:number=0;
    MATERIALES_SUSTANCIAS:number=0;
    MEDIOS_TRANSPORTE:number=0;
    NO_CLASIFICADOS:number=0;
    NO_CLASIFICADOS_FALTA_DATOS:number=0;
    RADIACIONES:number=0;
}

export const mecanismo = [
    { value: 'ATRAPAMIENTOS', label: 'Atrapamientos' },
    { value: 'CAIDA_OBJETOS', label: 'Caída de objetos' },
    { value: 'CAIDA_PERSONAS', label: 'Caída de personas' },
    { value: 'EXPOSICION_ELECTRICIDAD', label: 'Exposición o contacto con la electricidad' },
    { value: 'EXPOSICION_SUSTANCIAS', label: 'Exposición o contacto con sustancias nocivas, radiaciones o salpicaduras' },
    { value: 'EXPOSICION_SUSTUNIVERSAL', label: 'Exposición ocontacto con líquidos de precaución universal (líquidos/ secresiones corporales)' },
    { value: 'EXPOSICION_TEMPERATURA', label: 'Exposición o contacto con temperatura extrema' },
    { value: 'MORDEDURA_PICADURA', label: "Mordedura o picadura" },
    { value: 'PISADA_CHOQUES', label: 'Pisadas, choques, o golpes' },
    { value: 'SOBREESFUERZO_EXCESIVO', label: 'Sobreesfuerzo, esfuerzo excesivo, o falso movimiento' },    
    { value: 'OTRO', label: 'Otro (Especifique)' },
];

export class mecanismoCont {
    ATRAPAMIENTOS:number=0;
    CAIDA_OBJETOS:number=0;
    CAIDA_PERSONAS:number=0;
    EXPOSICION_ELECTRICIDAD:number=0;
    EXPOSICION_SUSTANCIAS:number=0;
    EXPOSICION_SUSTUNIVERSAL:number=0;
    EXPOSICION_TEMPERATURA:number=0;
    MORDEDURA_PICADURA:number=0;
    PISADA_CHOQUES:number=0;
    SOBREESFUERZO_EXCESIVO:number=0;
    OTRO:number=0;
}

export const sitio = [
    { value: 'ALMACENES_DEPOSITOS', label: 'Almacenes o depósitos' },
    { value: 'AREAS_PRODUCCIÓN', label: 'Áreas de producción' },
    { value: 'AREAS_RECREATIVAS', label: 'Áreas recreativas o deportivas' },
    { value: 'CORREDORES', label: 'Corredores o pasillos' },
    { value: 'ESCALERAS', label: 'Escaleras' },
    { value: 'OFICINAS', label: 'Oficinas' },
    { value: 'OTRAS_AREAS', label: 'Otras áreas comunes' },
    { value: 'PARQUEADEROS', label: 'Parqueaderos o áreas de circulación vehicular' },
    { value: 'OTRO', label: 'Otro (Especifique)' },
];

export class sitioCont {
    ALMACENES_DEPOSITOS:number=0;
    AREAS_PRODUCCIÓN:number=0;
    AREAS_RECREATIVAS:number=0;
    CORREDORES:number=0;
    ESCALERAS:number=0;
    OFICINAS:number=0;
    OTRAS_AREAS:number=0;
    PARQUEADEROS:number=0;
    OTRO:number=0;
}



export const tipoAccidente = [
    { value: 'DEPORTIVO', label: 'Deportivo' },
    { value: 'PROPIOS_TRABAJO', label: 'Propios del trabajo' },
    { value: 'RECREATIVO_CULTURAL', label: 'Recreativo o cultural' },
    { value: 'TRANSITO', label: 'Tránsito' },
    { value: 'VIOLENCIA', label: 'Violencia' },    
];


export class tipoAccidenteCont {
    DEPORTIVO:number=0;
    PROPIOS_TRABAJO:number=0;
    AREAS_RECREATIVAS:number=0;
    TRANSITO:number=0;
    VIOLENCIA:number=0;
}




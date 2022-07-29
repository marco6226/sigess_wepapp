export const tipo_reporte = [
    { value: 'ACCIDENTE', label: 'Accidente' },
    { value: 'INCIDENTE', label: 'Incidente' },
];


export const tipo_vinculacion = [
    { value: 'COOPERADO', label: 'Cooperado' },
    { value: 'ESTUDIANTE_APRENDIZ', label: 'Estudiante/Aprendiz' },
    { value: 'INDEPENDIENTE', label: 'Independiente' },
    { value: 'MISION', label: 'Misión' },
    { value: 'PLANTA', label: 'Planta' },    
];

export const perfil_educativo = [
    { value: 'Bachiller', label: 'Bachiller' },
    { value: 'Doctorado', label: 'Doctorado' },
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Maestria', label: 'Maestria' },
    { value: 'No requiere', label: 'No requiere' },
    { value: 'Practicante', label: 'Practicante' },
    { value: 'Profesional', label: 'Profesional' },
    { value: 'Técnico', label: 'Técnico' },
    { value: 'Tecnólogo', label: 'Tecnólogo' },
    
];

export const competencias = [
    {
        value: 'ESTRATEGICAS',
        label: 'Estratégicas',
        items: [
            { value: 'Habilidad Analítica', label: 'Habilidad Analítica' },
            { value: 'Liderazgo', label: 'Liderazgo' },
            { value: 'Planeación Estratégica', label: 'Planeación Estratégica' },
            { value: 'Solución de Problemas', label: 'Solución de Problemas' },
            { value: 'Toma de decisiones', label: 'Toma de decisiones' },
        ]
    },
    {
        value: 'ORGANIZACIONALES',
        label: 'Organizacionales',
        items: [
            { value: 'Calidad en el Trabajo', label: 'Calidad en el Trabajo' },
            { value: 'Comunicación', label: 'Comunicación' },
            { value: 'Conocimiento y Habilidad Técnica', label: 'Conocimiento y Habilidad Técnica' },
            { value: 'Dinamismo y Energía', label: 'Dinamismo y Energía' },
            { value: 'Iniciativa', label: 'Iniciativa' },
            { value: 'Orientación a Resultados', label: 'Orientación a Resultados' },
            { value: 'Orientación al Cliente', label: 'Orientación al Cliente' },
            { value: 'Planeación y Organización', label: 'Planeación y Organización' },
            { value: 'Prudencia', label: 'Prudencia' },
            { value: 'Relaciones Interpersonales', label: 'Relaciones Interpersonales' },
            { value: 'Trabajo en Equipo', label: 'Trabajo en Equipo' },
        ]
    },
];

export const genero = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
];
export const zona = [
    { value: 'U', label: 'Urbana' },
    { value: 'R', label: 'Rural' }
];

export const jornada_trabajo = [
    { value: 'DIURNO', label: 'Diurno' },
    { value: 'MIXTO', label: 'Mixto' },
    { value: 'NOCTURNO', label: 'Nocturno' },
    { value: 'TURNOS', label: 'Turnos' },    
];

export const tipo_identificacion = [
    { value: 'CEDULA_CIUDADANIA', label: 'Cédula de ciudadanía' },
    { value: 'CEDULA_EXTRANJERIA', label: 'Cédula de extranjería' },
    { value: 'TARJETA_IDENTIDAD', label: 'Tarjeta de identidad' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
];

export const tipo_identificacion_empresa = [
    { value: 'NI', label: 'Nit' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'NU', label: 'Número único de identificación personal' },
    { value: 'PA', label: 'Pasaporte' },
];

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

export const severidad = [
    { value: 'Leve', label: 'Leve' },
    { value: 'Grave', label: 'Grave' },
    { value: 'Severo', label: 'Severo' },    
    { value: 'Mortal', label: 'Mortal' },
   
];

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


export const lugar = [
    { value: 'DENTRO_EMPRESA', label: 'Dentro de la empresa' },
    { value: 'FUERA_EMPRESA', label: 'Fuera de la empresa' },
];

export const tipoAccidente = [
    { value: 'DEPORTIVO', label: 'Deportivo' },
    { value: 'PROPIOS_TRABAJO', label: 'Propios del trabajo' },
    { value: 'RECREATIVO_CULTURAL', label: 'Recreativo o cultural' },
    { value: 'TRANSITO', label: 'Tránsito' },
    { value: 'VIOLENCIA', label: 'Violencia' },    
];

export const locale_es = {
    firstDayOfWeek: 1,
    dayNamesCod: ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"],
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",],
    dayNamesShort: ["Dom", "Lun", "Mar", "Miér", "Juev", "Vier", "Sáb"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
};

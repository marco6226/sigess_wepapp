export const tipo_reporte = [
    { value: 'ACCIDENTE', label: 'Accidente' },
    { value: 'INCIDENTE', label: 'Incidente' },
];


export const tipo_vinculacion = [
    { value: 'PLANTA', label: 'Planta' },
    { value: 'MISION', label: 'Misión' },
    { value: 'COOPERADO', label: 'Cooperado' },
    { value: 'ESTUDIANTE_APRENDIZ', label: 'Estudiante/Aprendiz' },
    { value: 'INDEPENDIENTE', label: 'Independiente' },
];

export const perfil_educativo = [
    { value: 'Bachiller', label: 'Bachiller' },
    { value: 'Técnico', label: 'Técnico' },
    { value: 'Tecnólogo', label: 'Tecnólogo' },
    { value: 'Profesional', label: 'Profesional' },
    { value: 'Maestria', label: 'Maestria' },
    { value: 'Doctorado', label: 'Doctorado' },
    { value: 'No requiere', label: 'No requiere' },
    { value: 'Practicante', label: 'Practicante' },
    { value: 'Estudiante', label: 'Estudiante' },
];

export const competencias = [
    {
        value: 'ESTRATEGICAS',
        label: 'Estratégicas',
        items: [
            { value: 'Liderazgo', label: 'Liderazgo' },
            { value: 'Toma de decisiones', label: 'Toma de decisiones' },
            { value: 'Planeación Estratégica', label: 'Planeación Estratégica' },
            { value: 'Solución de Problemas', label: 'Solución de Problemas' },
            { value: 'Habilidad Analítica', label: 'Habilidad Analítica' }
        ]
    },
    {
        value: 'ORGANIZACIONALES',
        label: 'Organizacionales',
        items: [
            { value: 'Conocimiento y Habilidad Técnica', label: 'Conocimiento y Habilidad Técnica' },
            { value: 'Orientación a Resultados', label: 'Orientación a Resultados' },
            { value: 'Calidad en el Trabajo', label: 'Calidad en el Trabajo' },
            { value: 'Planeación y Organización', label: 'Planeación y Organización' },
            { value: 'Comunicación', label: 'Comunicación' },
            { value: 'Orientación al Cliente', label: 'Orientación al Cliente' },
            { value: 'Prudencia', label: 'Prudencia' },
            { value: 'Iniciativa', label: 'Iniciativa' },
            { value: 'Trabajo en Equipo', label: 'Trabajo en Equipo' },
            { value: 'Relaciones Interpersonales', label: 'Relaciones Interpersonales' },
            { value: 'Dinamismo y Energía', label: 'Dinamismo y Energía' },
        ]
    },
];

export const genero = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
];
export const zona = [
    { value: 'U', label: 'Urbana' },
    { value: 'R', label: 'Rural' }
];

export const jornada_trabajo = [
    { value: 'DIURNO', label: 'Diurno' },
    { value: 'NOCTURNO', label: 'Nocturno' },
    { value: 'MIXTO', label: 'Mixto' },
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
    { value: 'PARQUEADEROS', label: 'Parqueaderos o áreas de circulación vehicular' },
    { value: 'OFICINAS', label: 'Oficinas' },
    { value: 'OTRAS_AREAS', label: 'Otras áreas comunes' },
    { value: 'OTRO', label: 'Otro (Especifique)' },
];

export const severidad = [
    { value: 'Leve', label: 'Leve' },
    { value: 'Grave', label: 'Grave' },
    { value: 'Mortal', label: 'Mortal' },
   
];

export const tipo_lesion = [
    { value: 'FRACTURA', label: 'Fractura' },
    { value: 'LUXACION', label: 'Luxación' },
    { value: 'TORCEDURA_ESGUINCE', label: 'Torcedura, esguince, desgarro muscular, hernia o laceración de músculo o tendón sin herida' },
    { value: 'CONMOCION_TRAUMA', label: 'Conmoción o trauma interno' },
    { value: 'AMPUTACION_ENUCLEACION', label: 'Amputación o enucleación (Exclusión o pérdida del ojo)' },
    { value: 'HERIDA', label: 'Herida' },
    { value: 'TRAUMA_SUPERFICIAL', label: 'Trauma superficial (Incluye rasguño, punción o pinchazo y lesión en ojo por cuerpo extraño)' },
    { value: 'GOLPE_CONTUSION', label: 'Golpe, contusión o aplastamiento' },
    { value: 'QUEMADURA', label: 'Quemadura' },
    { value: 'ENVENAMIENTO_INTOXICACION', label: 'Envenenamiento o intoxicación aguda o alergia' },
    { value: 'EFECTO_TIEMPO', label: 'Efecto del tiempo, del clima, u otro relacionado con el ambiente' },
    { value: 'ASFIXIA', label: 'Asfixia' },
    { value: 'EFECTO_ELECTRICIDAD', label: 'Efecto de la electricidad' },
    { value: 'EFECTO_RADIACION', label: 'Efecto nocivo de la radiación' },
    { value: 'LESIONES_MULTIPLES', label: 'Lesiones múltiples' },
    { value: 'OTRO', label: 'Otro (Especifique)' },
];

export const parte_cuerpo = [
    { value: 'CABEZA', label: 'Cabeza' },
    { value: 'OJO', label: 'Ojos' },
    { value: 'CUELLO', label: 'Cuello' },
    { value: 'TRONCO', label: 'Tronco (incluye espalda, columna vertebral, médula espinal, pélvis)' },
    { value: 'TORAX', label: 'Tórax' },
    { value: 'ABDOMEN', label: 'Abdomen' },
    { value: 'MIEMBRO_SUPERIOR', label: 'Miembros superiores' },
    { value: 'MANOS', label: 'Manos' },
    { value: 'MIEMBRO_INFERIOR', label: 'Miembros inferiores' },
    { value: 'PIES', label: 'Pies' },
    { value: 'UBICACIONES_MULTIPLES', label: 'Ubicaciones múltiples' },
    { value: 'LESIONES_GENERALES', label: 'Lesiones generales u otras' },
]


export const agente = [
    { value: 'MAQUINAS_EQUIPOS', label: 'Máquinas y/o equipos' },
    { value: 'MEDIOS_TRANSPORTE', label: 'Medios de transporte' },
    { value: 'APARATOS', label: 'Aparatos' },
    { value: 'HERRAMIENTAS', label: 'Herramientas, implementos, o utensilios' },
    { value: 'MATERIALES_SUSTANCIAS', label: 'Materiales o sustancias' },
    { value: 'RADIACIONES', label: 'Radiaciones' },
    { value: 'AMBIENTE_TRABAJO', label: 'Ambiente de trabajo (Incluye superficies de tránsito y de trabajo, muebles, tejados, en el exterior, interior o subterráneos)' },
    { value: 'NO_CLASIFICADOS', label: 'Otros agentes no clasificados' },
    { value: 'ANIMALES', label: 'Animales (Vivos o productos animales)' },
    { value: 'NO_CLASIFICADOS_FALTA_DATOS', label: 'Agentes no clasificados por falta de datos' },
    { value: 'AGUJA_MAT_CORTOPUNZANTE', label: 'Aguja/material cortopunzante' },
    { value: 'ARMA_FUEGO_CORTOPUNZANTE', label: 'Arma de fuego/cortopunzante' },
    { value: 'EXPLOSIVOS', label: 'Explosivos' },
];

export const mecanismo = [
    { value: 'CAIDA_PERSONAS', label: 'Caída de personas' },
    { value: 'CAIDA_OBJETOS', label: 'Caída de objetos' },
    { value: 'PISADA_CHOQUES', label: 'Pisadas, choques, o golpes' },
    { value: 'ATRAPAMIENTOS', label: 'Atrapamientos' },
    { value: 'SOBREESFUERZO_EXCESIVO', label: 'Sobreesfuerzo, esfuerzo excesivo, o falso movimiento' },
    { value: 'EXPOSICION_TEMPERATURA', label: 'Exposición o contacto con temperatura extrema' },
    { value: 'EXPOSICION_ELECTRICIDAD', label: 'Exposición o contacto con la electricidad' },
    { value: 'EXPOSICION_SUSTUNIVERSAL', label: 'Exposición ocontacto con líquidos de precaución universal (líquidos/ secresiones corporales)' },
    { value: 'EXPOSICION_SUSTANCIAS', label: 'Exposición o contacto con sustancias nocivas, radiaciones o salpicaduras' },
    { value: 'MORDEDURA_PICADURA', label: "Mordedura o picadura" },
    { value: 'OTRO', label: 'Otro (Especifique)' },
];


export const lugar = [
    { value: 'DENTRO_EMPRESA', label: 'Dentro de la empresa' },
    { value: 'FUERA_EMPRESA', label: 'Fuera de la empresa' },
];

export const tipoAccidente = [
    { value: 'VIOLENCIA', label: 'Violencia' },
    { value: 'TRANSITO', label: 'Tránsito' },
    { value: 'DEPORTIVO', label: 'Deportivo' },
    { value: 'RECREATIVO_CULTURAL', label: 'Recreativo o cultural' },
    { value: 'PROPIOS_TRABAJO', label: 'Propios del trabajo' },
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

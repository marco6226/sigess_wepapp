import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/primeng';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Desempeno, FactorCausal, IdentificacionFC, seccion, Causa_Raiz } from './../../../entities/factor-causal';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
//import {MatTableModule} from '@angular/material/table';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-factor-causal',
  templateUrl: './factor-causal.component.html',
  styleUrls: ['./factor-causal.component.scss'],
  providers: [MessageService]
})
export class FactorCausalComponent implements OnInit, AfterViewInit {

  @Input() factorCausal: FactorCausal;
  @Input() causasRaiz: Causa_Raiz;
  @Output() dataFC = new EventEmitter<FactorCausal>();
  @Output() validators2 =new EventEmitter<boolean>();
  // @Output() dataCR = new EventEmitter<Causa_Raiz[]>();

  pasoSelect=0;
  
  selectedNode: TreeNode;

  public formDesempeno: FormGroup;
  display: boolean = false;
  displayModal: boolean;
  selectIdentificacionFC: Desempeno | null;
  // selectIdentificacionFC: IdentificacionFC | null;
  validators: boolean = true;
  steps = [
    {label: 'Dificultad de Desempeño Humano'},
    {label: 'Causa Raiz'},
  ];

  jefeForm: FormGroup;

  identificacionFC: IdentificacionFC[]=[
    {id:0, factor:"Procedimientos", selectable: null, subProd:[{id:1, subProd:"No usado /No seguido", causa:[{id:1, ProcedimientoFC:"no hay procedimiento", esCausa: false},{id:2, ProcedimientoFC:"procedimiento no disponible o incómodo de usar", esCausa: false},{id:3, ProcedimientoFC:"procedimiento difícil de usar", esCausa: false},{id:4, ProcedimientoFC:"no se requiere uso de procedimiento, pero debe exigirse", esCausa: false},]},{id:2, subProd:"Incorrecto", causa:[{id:5, ProcedimientoFC:"error tipográfico", esCausa: false},{id:6, ProcedimientoFC:"secuencia incorrecta", esCausa: false},{id:7, ProcedimientoFC:"datos incorrectos", esCausa: false},{id:8, ProcedimientoFC:"situación no cubierta", esCausa: false},{id:9, ProcedimientoFC:"uso de revisión equivocada", esCausa: false},{id:10, ProcedimientoFC:"requiere segunda verificación", esCausa: false},]},{id:3, subProd:"Seguimiento Incorrecto", causa:[{id:11, ProcedimientoFC:"formato confuso", esCausa: false},{id:12, ProcedimientoFC:"> 1 acción por paso", esCausa: false},{id:13, ProcedimientoFC:"exceso de referencias", esCausa: false},{id:14, ProcedimientoFC:"referencias a unidades múltiples", esCausa: false},{id:15, ProcedimientoFC:"límites NM", esCausa: false},{id:16, ProcedimientoFC:"detalles NM", esCausa: false},{id:17, ProcedimientoFC:"datos/cálculos incorrectos o incompletos", esCausa: false},{id:18, ProcedimientoFC:"gráficos NM", esCausa: false},{id:19, ProcedimientoFC:"no hay verificación", esCausa: false},{id:20, ProcedimientoFC:"mal uso de la verificación", esCausa: false},{id:21, ProcedimientoFC:"mal uso de segunda verificación", esCausa: false},{id:22, ProcedimientoFC:"instrucciones ambiguas", esCausa: false},{id:23, ProcedimientoFC:"identificación del equipo NM", esCausa: false},]},]},
    {id:1, factor:"Control de Calidad", selectable: null, subProd:[{id:6, subProd:"Falta de Inspección", causa:[{id:34, ProcedimientoFC:"inspección no requerida", esCausa: false},{id:35, ProcedimientoFC:"no hay punto de espera", esCausa: false},{id:36, ProcedimientoFC:"punto de espera no se respetó", esCausa: false},]},{id:7, subProd:"CC NM", causa:[{id:37, ProcedimientoFC:"instrucciones de inspección NM", esCausa: false},{id:38, ProcedimientoFC:"técnicas de inspección NM", esCausa: false},{id:39, ProcedimientoFC:"eliminación de material extraño durante el trabajo NM", esCausa: false},]},]},
    {id:2, factor:"Sistema de Administracion", selectable: null, subProd:[{id:14, subProd:"Estándares, Normas o Controles Administrativos NM (ENCA)", causa:[{id:64, ProcedimientoFC:"no hay ENCA", esCausa: false},{id:65, ProcedimientoFC:"no son suficientemente estrictos", esCausa: false},{id:66, ProcedimientoFC:"confusos o incompletos", esCausa: false},{id:67, ProcedimientoFC:"error técnico", esCausa: false},{id:68, ProcedimientoFC:"dibujos/láminas NM", esCausa: false},]},{id:15, subProd:"ENCA no Usados", causa:[{id:69, ProcedimientoFC:"comunicación de ENCA NM", esCausa: false},{id:70, ProcedimientoFC:"recientemente cambiados", esCausa: false},{id:71, ProcedimientoFC:"imposición NM", esCausa: false},{id:72, ProcedimientoFC:"imposible poner en práctica", esCausa: false},{id:73, ProcedimientoFC:"Responsabilidad NM", esCausa: false},]},{id:16, subProd:"Descuido/Relaciones de Empleados", causa:[{id:74, ProcedimientoFC:"auditorías y evaluaciones infrecuentes", esCausa: false},{id:75, ProcedimientoFC:"a & e superficiales", esCausa: false},{id:76, ProcedimientoFC:"a & e no independientes", esCausa: false},{id:77, ProcedimientoFC:"comunicación con empleados NM", esCausa: false},{id:78, ProcedimientoFC:"retroalimentación de los empleados NM", esCausa: false},]},{id:17, subProd:"Acciones Correctivas", causa:[{id:79, ProcedimientoFC:"acción correctiva NM", esCausa: false},{id:80, ProcedimientoFC:"acción correctiva no implementada", esCausa: false},{id:81, ProcedimientoFC:"tendencias NM", esCausa: false},]},]},
    {id:3, factor:"Capacitacion", selectable: null, subProd:[{id:4, subProd:"Falta de Capacitación", causa:[{id:24, ProcedimientoFC:"tarea no analizada", esCausa: false},{id:25, ProcedimientoFC:"decidió no capacitar", esCausa: false},{id:26, ProcedimientoFC:"no hay objetivo de aprendizaje", esCausa: false},{id:27, ProcedimientoFC:"inasistencia a la capacitación requerida", esCausa: false},]},{id:5, subProd:"Comprensión NM", causa:[{id:28, ProcedimientoFC:"objetivos de aprendizaje NM", esCausa: false},{id:29, ProcedimientoFC:"plan de lección NM", esCausa: false},{id:30, ProcedimientoFC:"instrucción NM", esCausa: false},{id:31, ProcedimientoFC:"práctica/repetición NM", esCausa: false},{id:32, ProcedimientoFC:"exámenes NM", esCausa: false},{id:33, ProcedimientoFC:"capacitación continua NM", esCausa: false},]},]},
    {id:4, factor:"Comunicaciones", selectable: null, subProd:[{id:8, subProd:"No hay comunicación o No es Oportuna", causa:[{id:40, ProcedimientoFC:"equipo de comunicación NM", esCausa: false},{id:41, ProcedimientoFC:"comunicación tardia", esCausa: false},]},{id:9, subProd:"Transpaso NM", causa:[{id:42, ProcedimientoFC:"no hay proceso estándar de traspaso", esCausa: false},{id:43, ProcedimientoFC:"proceso de traspaso no usado", esCausa: false},{id:44, ProcedimientoFC:"proceso de traspaso NM", esCausa: false},]},{id:10, subProd:"Comunicaciones Verbal no entendida", causa:[{id:45, ProcedimientoFC:"terminología estándar no usada", esCausa: false},{id:46, ProcedimientoFC:"terminología estándar NM", esCausa: false},{id:47, ProcedimientoFC:"repetición verbal no usada", esCausa: false},{id:48, ProcedimientoFC:"mensaje largo", esCausa: false},{id:49, ProcedimientoFC:"entorno ruidoso", esCausa: false},{id:50, ProcedimientoFC:"idioma", esCausa: false},]},]},
    {id:5, factor:"Ingenieria Humana", selectable: null, subProd:[{id:18, subProd:"Interface Hombre-Máquina", causa:[{id:82, ProcedimientoFC:"etiquetas NM", esCausa: false},{id:83, ProcedimientoFC:"colocación/distribución", esCausa: false},{id:84, ProcedimientoFC:"indicadores NM", esCausa: false},{id:85, ProcedimientoFC:"controles NM", esCausa: false},{id:86, ProcedimientoFC:"alerta de vigilancia NM", esCausa: false},{id:87, ProcedimientoFC:"diferencias entre plantas y unidades", esCausa: false},{id:88, ProcedimientoFC:"levantar exceso de peso/fuerza", esCausa: false},{id:89, ProcedimientoFC:"herramientas e instrumentos NM", esCausa: false},]},{id:19, subProd:"Entorno laboral", causa:[{id:90, ProcedimientoFC:"orden y limpieza NM", esCausa: false},{id:91, ProcedimientoFC:"calor/frío", esCausa: false},{id:92, ProcedimientoFC:"mojado/resbaloso", esCausa: false},{id:93, ProcedimientoFC:"iluminación NM", esCausa: false},{id:94, ProcedimientoFC:"ruidoso", esCausa: false},{id:95, ProcedimientoFC:"obstáculo", esCausa: false},{id:96, ProcedimientoFC:"espacio limitado", esCausa: false},{id:97, ProcedimientoFC:"guardas del equipo NM", esCausa: false},{id:98, ProcedimientoFC:"elevada radiación/contaminación", esCausa: false},]},{id:20, subProd:"Sistema Complejo", causa:[{id:99, ProcedimientoFC:"requiere decisión basada en conocimientos", esCausa: false},{id:100, ProcedimientoFC:"monitoreo de demasiados elementos", esCausa: false},]},{id:21, subProd:"Sistema No Tolerante a Fallas", causa:[{id:101, ProcedimientoFC:"errores no detectables", esCausa: false},{id:102, ProcedimientoFC:"errores no recuperables", esCausa: false},]},]},
    {id:6, factor:"Direccion de Trabajo", selectable: null, subProd:[{id:11, subProd:"Preparación", causa:[{id:51, ProcedimientoFC:"Permiso de trabajo NM", esCausa: false},{id:52, ProcedimientoFC:"Instrucciones previas al trabajo NM", esCausa: false},{id:53, ProcedimientoFC:"Recorrido NM", esCausa: false},{id:54, ProcedimientoFC:"Programación NM", esCausa: false},{id:55, ProcedimientoFC:"Candado/etiqueta NM", esCausa: false},{id:56, ProcedimientoFC:"equipo de protección personal/protección contra caídas NM", esCausa: false},]},{id:12, subProd:"Selección del Trabajador", causa:[{id:57, ProcedimientoFC:"no calificado", esCausa: false},{id:58, ProcedimientoFC:"Fatigado", esCausa: false},{id:59, ProcedimientoFC:"Molesto", esCausa: false},{id:60, ProcedimientoFC:"Abuso de drogas", esCausa: false},{id:61, ProcedimientoFC:"Selección del equipo NM", esCausa: false},{id:61, ProcedimientoFC:"Selección del equipo NM", esCausa: false},]},{id:13, subProd:"Supervisión durante el trabajo", causa:[{id:62, ProcedimientoFC:"no hay supervisión", esCausa: false},{id:63, ProcedimientoFC:"Trabajo en equipo NM", esCausa: false},]},]},
    
  ]

  questionIndividual:Desempeno[]=[
    {id:0,pregunta:'¿Estaba la persona excesivamente fatigada, impedida, molesta, aburrida, distraida o abrumada?',dq:"Dq1",areas:[this.identificacionFC[5],this.identificacionFC[6]],selected:null},
    {id:1,pregunta:'¿Debería la persona haber tenido y usado un procedimiento escrito, pero no fue así?',dq:"Dq2",areas:[this.identificacionFC[0]],selected:null},
    {id:2,pregunta:'¿Se cometió un error mientras se usaba un procedimiento?',dq:"Dq3",areas:[this.identificacionFC[0]],selected:null},
    {id:3,pregunta:'¿No estaban disponibles las alarmas o indicadores o se entendieron mal para reconocer o responder a una problema?',dq:"Dq4",areas:[this.identificacionFC[5]],selected:null},
    {id:4,pregunta:'¿Se identificaron o manejaron mal los indicadores, alarmas, controles, herramienta o equipo?',dq:"Dq5",areas:[this.identificacionFC[3]],selected:null},
    {id:5,pregunta:'¿Necesitaba la persona más habilidades o conocimientos para cumplir con un trabajo, responder a una situación o comprender la respuesta del sistema?',dq:"Dq6",areas:[this.identificacionFC[3],this.identificacionFC[6]],selected:null},
    {id:6,pregunta:'¿Fue el trabajo realizado en un ambiente adverso (tal como caliente, húmedo, obscuro, reducido o peligroso)?',dq:"Dq7",areas:[this.identificacionFC[5]],selected:null},
    {id:7,pregunta:'¿Implicaba el trabajo movimientos repetitivos, posiciones incómodas, vibraciones o levantar cosas pesadas?',dq:"Dq8",areas:[this.identificacionFC[3],this.identificacionFC[5],this.identificacionFC[6]],selected:null},    
  ]

  questionTrabajo:Desempeno[]=[
    {id:8,pregunta:'¿Tuvo algo que ver con este problema la comunicación verbal o el cambio de turno?',dq:"Dq9",areas:[this.identificacionFC[4]],selected:null},
    {id:9,pregunta:'¿Tuvo algo que ver con este problema la incapacidad de ponerse de acuerdo de quién/qué/cuándo/dónde se ejecutaria este trabajo?',dq:"Dq10",areas:[this.identificacionFC[3],this.identificacionFC[4],this.identificacionFC[6]],selected:null},
    {id:10,pregunta:'¿Fue necesaria la comunicación a través de barreras organizacionales o con otras unidades?',dq:"Dq11",areas:[this.identificacionFC[4]],selected:null}
  ]
  
  questionAdministracion:Desempeno[]=[
    
    {id:11,pregunta:'¿Se llevó a cabo la tarea con prisas o se usó un atajo?',dq:"Dq12",areas:[this.identificacionFC[2],this.identificacionFC[6]],selected:null},
    {id:12,pregunta:'¿Había sido advertida la Administración acerca de este problema o había ocurrido antes?',dq:"Dq13",areas:[this.identificacionFC[2]],selected:null},
    {id:13,pregunta:'¿No se usaron o no existían o necesitaban mejorar las Normas, Controles Administrativos o Procedimientos?',dq:"Dq14",areas:[this.identificacionFC[0],this.identificacionFC[2],this.identificacionFC[6]],selected:null},
    {id:14,pregunta:'¿Hubiera detectado este problema una revisión de control de calidad independiente?',dq:"Dq15",areas:[this.identificacionFC[1]],selected:null},
  ]

  datos: Causa_Raiz[]=[
    {label: 'Dificultad con Equipo',expanded: true,type: 'person',data: {name:''},children:[{label: 'Falla Tolerable',expanded: true,type: 'person',data: {name:'No'},},{label: 'Diseño',expanded: true,type: 'person',data: {name:''},children:[{label: 'Especificaciones de Diseño',expanded: true,type: 'person',data: {name:''},children:[{label: 'Problema no Previsto',expanded: true,type: 'person',data: {name:''},children:[{label: 'Ambiente de Trabajao no considerado',expanded: true,type: 'person',data: {name:'No'},},]},{label: 'Diseño no sigue Especificación',expanded: true,type: 'person',data: {name:'No'},},{label: 'Especificación NM',expanded: true,type: 'person',data: {name:'No'},},]},{label: 'Revisión de Diseño',expanded: true,type: 'person',data: {name:''},children:[{label: 'Revisión Independiente NM',expanded: true,type: 'person',data: {name:''},children:[{label: 'Administración del Cambio NM',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Análisis de Riesgo NM',expanded: true,type: 'person',data: {name:'No'},},]},]},]},]},{label: 'Equipos / Partes Defectuosas',expanded: true,type: 'person',data: {name:''},children:[{label: 'Abastecimientos',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Manufactura',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Almacenamiento',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Control de Calidad',expanded: true,type: 'person',data: {name:'No'},},]},]},]},]},{label: 'Mantenimiento Preventivo / Predictivo',expanded: true,type: 'person',data: {name:''},children:[{label: 'MP NM',expanded: true,type: 'person',data: {name:''},children:[{label: 'No MP p/Equipo',expanded: true,type: 'person',data: {name:'No'},},{label: 'MP NM p/Equipo',expanded: true,type: 'person',data: {name:'No'},},]},]},{label: 'Falla Repetida',expanded: true,type: 'person',data: {name:''},children:[{label: 'Sistema de Administración',expanded: true,type: 'person',data: {name:''},children:[{label: 'Acción Correctiva',expanded: true,type: 'person',data: {name:''},children:[{label: 'Acción correctiva NM',expanded: true,type: 'person',data: {name:'No'},},{label: 'Acción correctiva No Implementada',expanded: true,type: 'person',data: {name:'No'},},{label: 'Tendencias NM',expanded: true,type: 'person',data: {name:'No'},},]},]},]},]},
    {label: 'Desastre Natural / Sabotaje',type: 'person',expanded: true,data: {name:'No'},}
  ]
 
  // data1: TreeNode[] = [{label: 'Dificultad con Equipo',expanded: true,type: 'person',data: {name:''},children:[{label: 'Falla Tolerable',expanded: true,type: 'person',data: {name:'No'},},{label: 'Diseño',expanded: true,type: 'person',data: {name:''},children:[{label: 'Especificaciones de Diseño',expanded: true,type: 'person',data: {name:''},children:[{label: 'Problema no Previsto',expanded: true,type: 'person',data: {name:''},children:[{label: 'Ambiente de Trabajao no considerado',expanded: true,type: 'person',data: {name:'No'},},]},{label: 'Diseño no sigue Especificación',expanded: true,type: 'person',data: {name:'No'},},{label: 'Especificación NM',expanded: true,type: 'person',data: {name:'No'},},]},{label: 'Revisión de Diseño',expanded: true,type: 'person',data: {name:''},children:[{label: 'Revisión Independiente NM',expanded: true,type: 'person',data: {name:''},children:[{label: 'Administración del Cambio NM',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Análisis de Riesgo NM',expanded: true,type: 'person',data: {name:'No'},},]},]},]},]},{label: 'Equipos / Partes Defectuosas',expanded: true,type: 'person',data: {name:''},children:[{label: 'Abastecimientos',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Manufactura',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Almacenamiento',expanded: true,type: 'person',data: {name:'No'},children:[{label: 'Control de Calidad',expanded: true,type: 'person',data: {name:'No'},},]},]},]},]},{label: 'Mantenimiento Preventivo / Predictivo',expanded: true,type: 'person',data: {name:''},children:[{label: 'MP NM',expanded: true,type: 'person',data: {name:''},children:[{label: 'No MP p/Equipo',expanded: true,type: 'person',data: {name:'No'},},{label: 'MP NM p/Equipo',expanded: true,type: 'person',data: {name:'No'},},]},]},{label: 'Falla Repetida',expanded: true,type: 'person',data: {name:''},children:[{label: 'Sistema de Administración',expanded: true,type: 'person',data: {name:''},children:[{label: 'Acción Correctiva',expanded: true,type: 'person',data: {name:''},children:[{label: 'Acción correctiva NM',expanded: true,type: 'person',data: {name:'No'},},{label: 'Acción correctiva No Implementada',expanded: true,type: 'person',data: {name:'No'},},{label: 'Tendencias NM',expanded: true,type: 'person',data: {name:'No'},},]},]},]},]},];
  // data2: TreeNode[] = [{label: 'Desastre Natural / Sabotaje',type: 'person',data: {name:'No'},}];
  data1: TreeNode[]
  data2: TreeNode[]

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {  
    this.validator();
  }

  validator(){
    this.validators2.emit(this.validators)
  }
  ngAfterViewInit(){

    if(!this.factorCausal.seccion){
      this.addDataFC();
      console.log("------------------------------------->");
    }

    if (!this.factorCausal.causa_Raiz) {
      // this.data1=[this.datos[0]]
      // this.data2=[this.datos[1]]
      this.factorCausal.causa_Raiz=this.datos
    }
    // else{
    //   this.data1=[this.datos[0]]
    //   this.data2=[this.datos[1]]
    // }
  }

  addDataFC(){
    console.log(this.factorCausal);

    let datos: seccion[]=[
      {tipoDesempeno: 'Desempeño individual', desempeno: this.questionIndividual},
      {tipoDesempeno: 'Desempeño del equipo de trabajo', desempeno: this.questionTrabajo},
      {tipoDesempeno: 'Sistema de administración', desempeno: this.questionAdministracion},
    ]

    let temp = JSON.stringify(datos)

    this.factorCausal.seccion=JSON.parse(temp)// datos;
  }


  next(){
    console.log("hola");
    this.validacion();
    if (this.validators) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Faltan campos por responder'});
    }else{
      console.log(this.factorCausal);
      this.pasoSelect++;
    }    
    console.log(this.pasoSelect,this.steps.length);
    
  }

  back(){
    console.log(this.factorCausal);
    this.pasoSelect--;
  }

  changeSelection(id: number, selection:boolean){

    if(id < 8){
      this.factorCausal.seccion[0].desempeno[id].selected = selection;
      if(selection){
        this.showDialog(this.factorCausal.seccion[0].desempeno[id]);
      }
    }else if( id < 11){
      this.factorCausal.seccion[1].desempeno[id-8].selected  = selection;
      if(selection){
        this.showDialog(this.factorCausal.seccion[1].desempeno[id-8]);
      }
    }else{
      this.factorCausal.seccion[2].desempeno[id-11].selected  = selection;
      if(selection){
        this.showDialog(this.factorCausal.seccion[2].desempeno[id-11]);
      }      
    }
    
    this.dataFC.emit(this.factorCausal);

    this.validacion();
    this.validator();
  }

  validacion(){
    let validacion1, validacion2, validacion3 : boolean = false;

    for (let index = 0; index < this.factorCausal.seccion[0].desempeno.length; index++) {
      if(this.factorCausal.seccion[0].desempeno[index].selected==null){
        validacion1=true;
        break;
      }
    }

    for (let index = 0; index < this.factorCausal.seccion[1].desempeno.length; index++) {
      if(this.factorCausal.seccion[1].desempeno[index].selected==null){
        validacion2=true;
        break;
      }
    }

    for (let index = 0; index < this.factorCausal.seccion[2].desempeno.length; index++) {
      if(this.factorCausal.seccion[2].desempeno[index].selected==null){
        validacion3=true;
        break;
      }
    }

    if(validacion1 || validacion2 || validacion3){
      this.validators = true;
    }else{
      this.validators = false;
    }
    
    console.log(this.validators);
  }

  cx=false;
  selectedValue;
  ok(){
    console.log(this.cx);
    console.log(this.selectedValue);
    
    

  }
 
  confirm() {
    this.confirmationService.confirm({
        // message: 'Are you sure that you want to perform this action?',
        accept: () => {
            //Actual logic to perform a confirmation
        }
    });
}

  isSelectionable: boolean

    showDialog(item) {
      this.isSelectionable = false;
      console.log(item);      
      this.selectIdentificacionFC = item;
      this.display = true;      
    }
  //   showModalDialog() {
  //     this.displayModal = true;
  // }

   
    onNodeSelect(event) {
      console.log(event);

      if(event.node.data.name=='No'){
        event.node.data.name='Si'
      }else if(event.node.data.name=='Si'){
        event.node.data.name='No'
      }
      console.log(this.datos);

      // this.dataCR.emit(this.datos);
      console.log(this.factorCausal);
      this.dataFC.emit(this.factorCausal);

      // this.messageService.add({severity: 'success', summary: 'Node Selected', detail: event.node.label
    }


    confirmCheck(){
      let control: boolean = false
      this.selectIdentificacionFC.areas.forEach(element =>
         element.subProd.forEach(eleme => {
           eleme.causa.forEach(ele => {
             if (ele.esCausa) {
               control = ele.esCausa;
             }
           })
         })
      ) 

      if (control) {
    this.dataFC.emit(this.factorCausal);

        this.display=false
       } else {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se ha seleccionado ninguna identificacion del factor'});
        
       }

    }
    
    test(){
    //  console.log("---->", this.factorCausal);
     console.log("---->", this.selectIdentificacionFC);
     
      
    }
}
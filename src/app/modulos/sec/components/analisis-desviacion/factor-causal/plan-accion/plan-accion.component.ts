import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { listPlanAccion, planCausaRaiz, PlanEspecifico } from './../../../../entities/factor-causal';
import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { ConfirmationService, MessageService } from 'primeng/primeng';
import { EmpleadoBasic } from 'app/modulos/empresa/entities/empleado-basic';
import { Reporte } from 'app/modulos/rai/entities/reporte';
import { TareaService } from 'app/modulos/sec/services/tarea.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-accion',
  templateUrl: './plan-accion.component.html',
  styleUrls: ['./plan-accion.component.scss'],
  providers: [MessageService]
})
export class PlanAccionComponent implements OnInit, AfterViewInit {
  @Input() planAcciones: planCausaRaiz
  @Input() process: string;
  @Output() dataTest = new EventEmitter<any>()

  selectedValue

  datatest: PlanEspecifico

  formEspecifico: FormGroup
  formMedible: FormGroup
  formEfizaz: FormGroup
  formRevisado: FormGroup
  empleadoSelect: EmpleadoBasic;
  reporteSelect: Reporte;
  statuses = {
    0: 'N/A',
    1: 'En seguimiento',
    2: 'Abierta',
    3: 'Cerrada en el tiempo',
    4: 'Cerrada fuera de tiempo',
    5: 'Vencida',
  }
  estado: string | null;

  steps = [
    {label: 'ESPECIFICO'},
    {label: 'RAZONABLE'},
    {label: 'MEDIBLE'},
    {label: 'EFICAZ'},
    {label: 'REVISADO'},
  ];
  pasoSelect=0;
  localeES: any = locale_es;

  causasListSelect
  display: boolean = false;
  fechaActual = new Date();
  idTarea: string | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tareaService: TareaService,
    private router: Router,
  ) { 
    this.formEspecifico = fb.group({
      nombreAccionCorrectiva: [null, Validators.required],
      accionCorrectiva: [null, Validators.required],
      fechaVencimiento: [null, Validators.required],
      responsableEmpresa: [null],
      responsableExterno: [null],
    })
  }

  ngOnInit() {
    console.log(this.planAcciones);
    this.planAcciones.eficaz.fechaVencimiento = (this.planAcciones.eficaz.fechaVencimiento)? new Date(this.planAcciones.eficaz.fechaVencimiento):null;
    this.planAcciones.medible.fechaVencimiento = (this.planAcciones.medible.fechaVencimiento)? new Date(this.planAcciones.medible.fechaVencimiento):null;
    this.planAcciones.especifico.fechaVencimiento = (this.planAcciones.especifico.fechaVencimiento)? new Date(this.planAcciones.especifico.fechaVencimiento):null;
    this.validarEstado();
  }

  ngAfterViewInit(): void {
    if(this.planAcciones){
      //console.log("treae datos");
      
    }
    if(!this.planAcciones){
      //console.log("nop trae datos");
      
    }
  }

  
  selectProduct(event) {
    //console.log(event);
    this.display = true
  }


  confirmCheck(){
    this.display = false
  }

  next(){

    if (this.formEspecifico.valid) {
      this.pasoSelect++;      
    } else {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Falta diligenciar campos'});
    }
  }

  back(){
    this.pasoSelect--;
  }

  submit(){
    // //console.log(this.formEspecifico, this.planAcciones);
    // switch (this.process) {
    //   case 'ESPECIFICO':
    //     this.planAcciones.especifico.isComplete = true;
    //     break;
    //   case 'MEDIBLE':
    //     this.planAcciones.medible.isComplete = true;
    //     break;
    //   case 'EFICAZ':
    //     this.planAcciones.eficaz.isComplete = true;
    //     break;
    //   case 'RAZONABLE':
    //     this.planAcciones.razonable.isComplete = true;
    //     break;
    //   case 'REVISADO':
    //     this.planAcciones.revisado.isComplete = true;
    //     break;
    //   default:
    //     break;
    // }
    //console.log(this.planAcciones);

    this.dataTest.emit()
    // this.planAcciones.nombreFC='Hola'
    // this.planAcciones.causaRaiz='casua'
  }
  // cerrar(){
  //   this.display=false;
  //  }
  // test2(){
  //   //console.log(this.planAcciones);
  //   //console.log(this.planAcciones.especifico);
  //   console.log(this.planAcciones.especifico.fechaVencimiento)
  // }

  async validarEstado(){
    let status: number;
    switch(this.process){
      case 'ESPECIFICO':
        this.idTarea = this.planAcciones.especifico.id;
        status = await this.calcularEstado(this.idTarea);
        this.estado = this.statuses[status];
        break;
      case 'EFICAZ':
        this.idTarea = this.planAcciones.eficaz.id;
        status = await this.calcularEstado(this.idTarea);
        this.estado = this.statuses[status];
        break;
      case 'MEDIBLE':
        this.idTarea = this.planAcciones.medible.id;
        status = await this.calcularEstado(this.idTarea);
        this.estado = this.statuses[status];
        break;
      default:
        this.estado = null;
        break;
    }

  }

  async calcularEstado(id: string){
    
    let seguimientoTarea: any;
    let keys=['id', 'fecha_cierre', 'fecha_proyectada', 'tracking'];

    if(!id) return Object.keys(this.statuses).length;
     
    await this.tareaService.getSeguimientoTarea(id).then((res: []) => {
      seguimientoTarea = res.reduce((item, value, index) => {
        item[keys[index]] = value;
        return item
      }, {});
    }).catch(err => {
      console.log('Error al obtener seguimiento de la tarea: ', err);
    });

    let isFollow = (seguimientoTarea.tracking > 0) ? true : false;

    let now = moment({});
    let fechaCierre = moment(seguimientoTarea.fecha_cierre);
    let fechaProyectada = moment(seguimientoTarea.fecha_proyectada);
    // console.log(now, fechaCierre, fechaProyectada);

    if (!fechaCierre.isValid() &&  isFollow) return 1;        
    if (!fechaCierre.isValid() && fechaProyectada.isSameOrAfter(now,'day') && !isFollow) return 2;
    if (fechaCierre.isValid() && fechaProyectada.isSameOrAfter(fechaCierre,'day')) return 3;
    if (fechaCierre.isValid() && fechaProyectada.isBefore(fechaCierre,'day')) return 4;        
    if (!fechaCierre.isValid() && fechaProyectada.isBefore(now,'day') && !isFollow) return 5;
    return 0;
  }

  onVerSeguimiento(idTarea: number | null){
    if (idTarea) {
      this.confirmationService.confirm({
        icon: "pi pi-exclamation-triangle",
        message: "¿Esta acción lo dirigirá al modulo de tareas asignadas, desea continuar?",
        header: "Advertencia",
        accept: () => {
          this.router.navigate(['/app/sec/tarea/' + idTarea]);
        },
        reject: () => {},
        acceptLabel: "Si",
        rejectLabel: "No",
      });
    }else{
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo realizar la operación', life: 6000});
    }
  }
}

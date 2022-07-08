import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { listPlanAccion, planCausaRaiz, PlanEspecifico } from './../../../../entities/factor-causal';
import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { ConfirmationService, MessageService } from 'primeng/primeng';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { Reporte } from 'app/modulos/rai/entities/reporte';

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
  empleadoSelect: Empleado;
  reporteSelect: Reporte;

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



  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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
    
  }

  ngAfterViewInit(): void {
    if(this.planAcciones){
      console.log("treae datos");
      
    }
    if(!this.planAcciones){
      console.log("nop trae datos");
      
    }
  }

  
  selectProduct(event) {
    console.log(event);
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

  test(){
    // console.log(this.formEspecifico, this.planAcciones);
    // switch (this.process) {
    //   case 'ESPECIFICO':
    //     //  this.planAcciones.especifico = this.formEspecifico.value //JSON.parse(JSON.stringify(this.formEspecifico.value)) 
    //     this.formEspecifico.reset()
    //     break;
    
    //   default:
    //     break;
    // }
    // console.log(this.planAcciones);

    this.dataTest.emit()
    // this.planAcciones.nombreFC='Hola'
    // this.planAcciones.causaRaiz='casua'
  }

  test2(){
    // console.log(this.planAcciones, this.dataTest);
    
  }
  

}

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { listPlanAccion } from './../../../../entities/factor-causal';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { ConfirmationService, MessageService } from 'primeng/primeng';

@Component({
  selector: 'app-plan-accion',
  templateUrl: './plan-accion.component.html',
  styleUrls: ['./plan-accion.component.scss'],
  providers: [MessageService]
})
export class PlanAccionComponent implements OnInit {
  @Input() planAcciones: listPlanAccion
  selectedValue

  formEspecifico: FormGroup
  formMedible: FormGroup
  formEfizaz: FormGroup
  formRevisado: FormGroup


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
      responsable: [null, Validators.required]
    })
  }

  ngOnInit() {
    
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
    console.log(this.formEspecifico);
    console.log(this.planAcciones);

    // this.planAcciones.nombreFC='Hola'
    // this.planAcciones.causaRaiz='casua'
  }
  

}

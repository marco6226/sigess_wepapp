import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { listPlanAccion } from 'app/modulos/sec/entities/factor-causal';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-plan-accion-list',
  templateUrl: './plan-accion-list.component.html',
  styleUrls: ['./plan-accion-list.component.scss']
})
export class PlanAccionListComponent implements OnInit {

  @Input() planAccionList: listPlanAccion[] = []
  @Output() validacionPA = new EventEmitter<any>()
  planAccionListSelected: listPlanAccion;
  causasListSelect
  display: boolean = false;
  constructor() { }
  cols: any[];
  files: TreeNode[]
  validate: string;
  
  isRazonable: boolean = true
  isMedible: boolean = true
  isEficaz: boolean = true
  isRevisado: boolean = true

  classSelect ={'height':'2px !important'}



  ngOnInit() {

  }
  
  // value: number = 10;

  selectProduct(event) {
    // console.log(event);
    this.planAccionListSelected = event;
    this.display = true
  }
  selectProduct2(event, selection) {
    // console.log(event);
    this.validate = selection
    this.planAccionListSelected = event;
    this.display = true
  }

  confirmCheck(){
    this.display = false
  }

  test(){
    // console.log(this.planAccionList);
    this.isRevisado = false
  }
 
  tests="pi pi-sign-in"


  habilitar(){
    // console.log(this.planAccionList);
    this.display = false
    this.planAccionList.forEach(element => {
      // console.log(element);
      element.causaRaiz.forEach(elementIn => {
        // console.log(elementIn);
        if(elementIn.especifico.accionCorrectiva!=null && elementIn.especifico.accionCorrectiva != ""){
          elementIn.especifico.isComplete = true;
        }
        else{
          elementIn.especifico.isComplete = false;
        }

        if(elementIn.razonable.justificacion!=null && elementIn.razonable.justificacion != ""){
          elementIn.razonable.isComplete = true
        }
        else{
          elementIn.razonable.isComplete = false;
        }

        if(elementIn.medible.planVerificacion!=null && elementIn.medible.planVerificacion != ""){
          elementIn.medible.isComplete = true
        }
        else{
          elementIn.medible.isComplete = false;
        }

        if(elementIn.eficaz.planValidacion!=null && elementIn.eficaz.planValidacion != ""){
          elementIn.eficaz.isComplete = true
        }
        else{
          elementIn.eficaz.isComplete = false;
        }

        if(elementIn.revisado.revisado!=null && elementIn.revisado.revisado != ""){
          elementIn.revisado.isComplete = true
        }
        else{
          elementIn.revisado.isComplete = false;
        }
      });
      
    });
    this.validacionPA.emit()
  }
}


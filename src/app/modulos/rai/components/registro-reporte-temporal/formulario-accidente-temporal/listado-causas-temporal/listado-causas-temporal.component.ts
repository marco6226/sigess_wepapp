import { ConfirmationService, MessageService } from 'primeng/primeng';
import { FactorCausal, listFactores, listPlanAccion } from '../../../../../sec/entities/factor-causal';
import { Component, Injectable, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
// import { element } from 'protractor';

@Component({
  selector: 'app-listado-causas-temporal',
  templateUrl: './listado-causas-temporal.component.html',
  styleUrls: ['./listado-causas-temporal.component.scss'],
  providers: [MessageService]
})
export class ListadoCausasTemporalComponent implements OnInit {

  @Output() validacionPA = new EventEmitter<any>()
  @Output() tabIndex = new EventEmitter<number>()

  factores: listFactores[];
  @Input("factores")
  set factores2(factores: listFactores[]){
    this.factores=factores
}

  @Input() planAccionList: listPlanAccion[]=[];
  // @Input() planAccionList2: listPlanAccion[]=[];

  causasListSelect: listFactores[];


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
  }

  test(){
    console.log(this.factores);
    this.causasListSelect=[]
  }
}

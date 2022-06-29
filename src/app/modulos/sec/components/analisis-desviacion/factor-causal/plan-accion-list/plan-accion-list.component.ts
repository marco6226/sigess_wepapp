import { Component, Input, OnInit } from '@angular/core';
import { listPlanAccion } from 'app/modulos/sec/entities/factor-causal';

@Component({
  selector: 'app-plan-accion-list',
  templateUrl: './plan-accion-list.component.html',
  styleUrls: ['./plan-accion-list.component.scss']
})
export class PlanAccionListComponent implements OnInit {

  @Input() planAccionList: listPlanAccion[] = []
  planAccionListSelected: listPlanAccion;
  causasListSelect
  display: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  selectProduct(event) {
    console.log(event);
    this.planAccionListSelected = event;
    this.display = true
  }

  confirmCheck(){
    this.display = false
  }

  test(){
    console.log(this.planAccionList);
    
  }
  

}

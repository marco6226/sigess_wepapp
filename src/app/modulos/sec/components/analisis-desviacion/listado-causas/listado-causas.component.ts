import { FactorCausal, listFactores } from './../../../entities/factor-causal';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-listado-causas',
  templateUrl: './listado-causas.component.html',
  styleUrls: ['./listado-causas.component.scss']
})
export class ListadoCausasComponent implements OnInit {

  @Input() factores: listFactores[];


  constructor() { }

  ngOnInit() {
  }

  test(){
    console.log(this.factores);
    
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Desempeno } from 'app/modulos/sec/entities/factor-causal';

@Component({
  selector: 'app-identificacion-factores-causales',
  templateUrl: './identificacion-factores-causales.component.html',
  styleUrls: ['./identificacion-factores-causales.component.scss']
})
export class IdentificacionFactoresCausalesComponent implements OnInit {

  @Input()identificacionFc: Desempeno | null;

  constructor() { }

  ngOnInit() {
  }

  test(){
    console.log(this.identificacionFc);
    
    
  }

}

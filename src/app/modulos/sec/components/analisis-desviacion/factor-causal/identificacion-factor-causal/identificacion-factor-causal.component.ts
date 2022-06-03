import { Component, OnInit, Input } from '@angular/core';
import { Desempeno, IdentificacionFC } from 'app/modulos/sec/entities/factor-causal';

@Component({
  selector: 'app-identificacion-factor-causal',
  templateUrl: './identificacion-factor-causal.component.html',
  styleUrls: ['./identificacion-factor-causal.component.scss']
})
export class IdentificacionFactorCausalComponent implements OnInit {

  @Input()identificacionFc: Desempeno | null
  @Input()factor: IdentificacionFC | null

  selectedValues: string[] = [];
  value: boolean

  constructor() { }

  ngOnInit(): void {
  }

  ok(){
    console.log(this.identificacionFc);
    console.log(this.selectedValues);
    console.log(this.value);
    
    
  }

  test(){
    console.log(this.identificacionFc);
    console.log(this.factor);
    
    
  }
}

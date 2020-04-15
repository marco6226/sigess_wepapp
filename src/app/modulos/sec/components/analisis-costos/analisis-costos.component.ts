import { Component, OnInit, Input } from '@angular/core';
import { AnalisisCosto } from '../../entities/analisis-costo';

@Component({
  selector: 's-analisisCostos',
  templateUrl: './analisis-costos.component.html',
  styleUrls: ['./analisis-costos.component.scss']
})
export class AnalisisCostosComponent implements OnInit {

  @Input("analisisCosto") analisisCosto: AnalisisCosto;
  @Input("readOnly") readOnly: boolean;

  constructor() {
    
  }

  ngOnInit() {
    
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { MiembroEquipo } from '../../miembros-equipo/miembro-equipo';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent implements OnInit {
@Input() desviacionesList;
@Input() consultar;
@Input() observacion;
@Input() miembros;
@Input() selectedProducts;
@Input() diagramaFlujo;

  constructor() { }

  ngOnInit() {
  }
}

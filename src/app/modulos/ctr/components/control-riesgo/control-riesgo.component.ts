import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-riesgo',
  templateUrl: './control-riesgo.component.html',
  styleUrls: ['./control-riesgo.component.scss']
})
export class ControlRiesgoComponent implements OnInit {

  tareasList: string[] = [
    'Trabajo en alturas',
    'Trabajo en espacios confinados',
    'Trabajo con energías peligrosas',
    'Izaje de cargas',
    'Trabajos en caliente',
  ]
  selectedTareas: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}

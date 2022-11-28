import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-control-riesgo',
  templateUrl: './control-riesgo.component.html',
  styleUrls: ['./control-riesgo.component.scss']
})
export class ControlRiesgoComponent implements OnInit {

  @Output() data = new EventEmitter();
  @Input('dataIn')
  set dataIn(data){
    if (data) {
      this.selectedTareas = JSON.parse(data);
    }
  }
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

  updateSelectedTareas(){
    this.data.emit(this.selectedTareas);
  }

}

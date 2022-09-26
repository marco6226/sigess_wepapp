import { Empleado } from './../../../empresa/entities/empleado';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Reporte } from 'app/modulos/rai/entities/reporte';

@Component({
  selector: 'app-asignacion-colider',
  templateUrl: './asignacion-colider.component.html',
  styleUrls: ['./asignacion-colider.component.scss']
})
export class AsignacionColiderComponent implements OnInit {

  @Input('dataIn')
  set dataIn(data: string){
    if (data != null) {
      this.empleadoSelect = JSON.parse(data);
    }
  }
  @Output() coliderData = new EventEmitter<string>();

  empleadoSelect: Empleado;
  reporteSelect: Reporte;

  constructor() { }

  ngOnInit(): void {
  }

  onData(){
    this.coliderData.emit(JSON.stringify(this.empleadoSelect))
  }

  

}

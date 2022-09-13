import { Empleado } from './../../../empresa/entities/empleado';
import { Component, OnInit } from '@angular/core';
import { Reporte } from 'app/modulos/rai/entities/reporte';

@Component({
  selector: 'app-asignacion-colider',
  templateUrl: './asignacion-colider.component.html',
  styleUrls: ['./asignacion-colider.component.scss']
})
export class AsignacionColiderComponent implements OnInit {

  empleadoSelect: Empleado;
  reporteSelect: Reporte;

  constructor() { }

  ngOnInit(): void {
  }

}

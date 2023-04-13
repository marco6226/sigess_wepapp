import { Component, OnInit } from '@angular/core';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { SelectItem } from 'primeng/primeng';
import { jornada_trabajo } from '../../enumeraciones/reporte-enumeraciones';

@Component({
  selector: 'app-registro-reporte-ctr',
  templateUrl: './registro-reporte-ctr.component.html',
  styleUrls: ['./registro-reporte-ctr.component.scss']
})
export class RegistroReporteCtrComponent implements OnInit {
  
  consultar: boolean = false;
  modificar: boolean = false;
  reporteSelected: null | {

  } = {};
  nombreEmpresa: string | null = null;
  nitEmpresa: string | null = null;
  
  constructor(
    private sessionService: SesionService
  ) { 
    this.nombreEmpresa = sessionService.getEmpresa().razonSocial;
    this.nitEmpresa = sessionService.getEmpresa().nit;
  }

  ngOnInit() {
  }

}

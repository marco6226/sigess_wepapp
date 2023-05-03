import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { SelectItem } from 'primeng/primeng';
import { jornada_trabajo } from '../../enumeraciones/reporte-enumeraciones';

@Component({
  selector: 'app-registro-reporte-ctr',
  templateUrl: './registro-reporte-ctr.component.html',
  styleUrls: ['./registro-reporte-ctr.component.scss']
})
export class RegistroReporteCtrComponent implements OnInit, OnDestroy {
  
  consultar: boolean = false;
  modificar: boolean = false;
  nombreEmpresa: string | null = null;
  nitEmpresa: string | null = null;
  reporteId: number = null;
  esConsulta: boolean = false;
  
  constructor(
    private sessionService: SesionService,
    private router: Router,
    private activatedRoute: ActivatedRoute 
  ) { 
    this.nombreEmpresa = sessionService.getEmpresa().razonSocial;
    this.nitEmpresa = sessionService.getEmpresa().nit;
  }

  ngOnInit() {
    this.reporteId = this.activatedRoute.snapshot.params.id;
    this.esConsulta = sessionStorage.getItem('reporteCtr') ? true : false;
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('reporteCtr');
  }

  navToListaReportes(){
    this.router.navigate(['/app/rai/consultarReportesAliados']);
  }

}

import { Component, OnInit } from '@angular/core';
import { Reporte } from 'app/modulos/rai/entities/reporte'
import { ReporteService } from 'app/modulos/rai/services/reporte.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { ConsuModReporteService } from 'app/modulos/sec/services/consu-mod-reporte.service'
import { Criteria } from "../../../core/entities/filter";

import { SesionService } from 'app/modulos/core/services/sesion.service';
@Component({
  selector: 'app-consultar-reporte-temporal',
  templateUrl: './consultar-reporte-temporal.component.html',
  styleUrls: ['./consultar-reporte-temporal.component.scss']
})
export class ConsultarReporteTemporalComponent implements OnInit {


  idEmpresa: string;
  reporteSelect: Reporte;
  reportesList: Reporte[];
  loading: boolean;
  totalRecords: number;
  fields: string[] = [
    
    'fechaReporte',
    'fechaAccidente',
    'id',
    'primerNombreEmpleado',
    'primerApellidoEmpleado',
    'numeroIdentificacionEmpleado',
    'tipo',
    'numerofurat',
    'temporal'
  ];

  constructor(
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
    private ConsuModReporteService: ConsuModReporteService,
    private sesionService: SesionService,
  ) { }
sortedTable:string;
  async ngOnInit() {
    this.idEmpresa = await this.sesionService.getEmpresa().id;
    this.loading = true;
    this.sortedTable=(this.idEmpresa=='22')?"fechaAccidente":"fechaReporte";
    
  }

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true; 
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: "temporal", value1: "Temporaluno" });
    this.reporteService.findByFilter(filterQuery).then(
      resp => {
        console.log(resp)
        this.totalRecords = resp['count'];
        this.loading = false;
        this.reportesList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.reportesList.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }
  RegistratR:boolean=false;
  consultarDetalle() {
    this.paramNav.setAccion<string>('GET');
    this.paramNav.setParametro<Reporte>(this.reporteSelect);
    this.paramNav.redirect('app/rai/registroReporteTemporal');
    this.RegistratR=true;
    this.ConsuModReporteService.setflagR(true);
  }

  modificar() {
    this.paramNav.setAccion<string>('PUT');
    this.paramNav.setParametro<Reporte>(this.reporteSelect);
    this.paramNav.redirect('app/rai/registroReporteTemporal');
    this.ConsuModReporteService.setflagR(true);
  }

  navegar() {
    this.paramNav.redirect('app/rai/registroReporteTemporal');
  }

}

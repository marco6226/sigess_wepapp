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


  idEmpresa: string=this.sesionService.getEmpresa().id;
  reporteSelect: Reporte;
  reportesList: Reporte[];
  loading: boolean=true;
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
    'temporal',
    'empresa',
    'areaAccidente'
  ];
  sortedTable:string="fechaAccidente";
  constructor(
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
    private ConsuModReporteService: ConsuModReporteService,
    private sesionService: SesionService,
  ) { }

  async ngOnInit() {
    // this.idEmpresa = await this.sesionService.getEmpresa().id;
  }

  lazyLoad(event: any) {

    if(this.idEmpresa=='22')
    this.reporteService.getForEmpresa().then(resp => {
        console.log(resp)
        this.totalRecords = resp['count'];
        this.loading = false;
        this.reportesList = [];
        
        (<any[]>resp).forEach(dto => {
          let resp1={empresa:dto[0]
            ,fechaAccidente:dto[1]
            ,fechaReporte:dto[2]
            ,id:dto[3]
            ,numeroIdentificacionEmpleado:dto[4]
            ,numerofurat:dto[5]
            ,primerApellidoEmpleado:dto[6]
            ,primerNombreEmpleado:dto[7]
            ,temporal:dto[8]
            ,tipo:dto[9]
            ,areaAccidente:dto[10]
          }
          console.log(resp1)
          this.reportesList.push(FilterQuery.dtoToObject(resp1));
        });
      }
    );

    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true; 
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.IS_NOT_NULL, field: "temporal"});
    if(this.idEmpresa!='22')
    this.reporteService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.reportesList = [];
        (<any[]>resp['data']).forEach(dto => {
          console.log(dto)
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

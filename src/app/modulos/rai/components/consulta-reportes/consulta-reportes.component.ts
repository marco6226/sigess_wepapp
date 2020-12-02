import { Component, OnInit } from '@angular/core';

import { Reporte } from 'app/modulos/rai/entities/reporte'
import { ReporteService } from 'app/modulos/rai/services/reporte.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { FilterQuery } from 'app/modulos/core/entities/filter-query'

@Component({
  selector: 'app-consulta-reportes',
  templateUrl: './consulta-reportes.component.html',
  styleUrls: ['./consulta-reportes.component.scss']
})
export class ConsultaReportesComponent implements OnInit {

  reporteSelect: Reporte;
  reportesList: Reporte[];
  loading: boolean;
  totalRecords: number;
  fields: string[] = [
    'id',
    'fechaReporte',
    'primerNombreEmpleado',
    'primerApellidoEmpleado',
    'numeroIdentificacionEmpleado',
    'fechaAccidente',
    'tipo'
  ];

  constructor(
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
  ) { }

  ngOnInit() {
    this.loading = true;
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

    this.reporteService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.reportesList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.reportesList.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }

  consultarDetalle() {
    this.paramNav.setAccion<string>('GET');
    this.paramNav.setParametro<Reporte>(this.reporteSelect);
    this.paramNav.redirect('app/rai/registroReporte');
  }

  modificar() {
    this.paramNav.setAccion<string>('PUT');
    this.paramNav.setParametro<Reporte>(this.reporteSelect);
    this.paramNav.redirect('app/rai/registroReporte');
  }

  navegar() {
    this.paramNav.redirect('app/rai/registroReporte');
  }
}

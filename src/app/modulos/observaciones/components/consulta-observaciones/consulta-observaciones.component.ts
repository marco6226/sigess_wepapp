import { Component, OnInit } from '@angular/core';

import { Observacion } from 'app/modulos/observaciones/entities/observacion'
import { ObservacionService } from 'app/modulos/observaciones/services/observacion.service';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Router } from '@angular/router';

import { Message } from 'primeng/primeng'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

@Component({
  selector: 'app-consulta-observaciones',
  templateUrl: './consulta-observaciones.component.html',
  styleUrls: ['./consulta-observaciones.component.scss']
})
export class ConsultaObservacionesComponent implements OnInit {

  observacionesList: Observacion[];
  observacionSelect: Observacion;
  loading: boolean;
  totalRecords: number;
  fields: string[] = [
    'id',
    'fechaObservacion',
    'tipoObservacion',
    'descripcion',
    'nivelRiesgo_nombre',
    'aceptada'
  ];

  constructor(
    private observacionService: ObservacionService,
    private sesionService: SesionService,
    private router: Router,
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

    this.observacionService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.observacionesList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.observacionesList.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }

  navToConsultar() {
    this.paramNav.setAccion('GET');
    this.paramNav.setParametro<Observacion>(this.observacionSelect);
    this.router.navigate(['app/auc/gestionObservaciones'])
  }

  navToGestionar() {
    this.paramNav.setAccion('PUT');
    this.paramNav.setParametro<Observacion>(this.observacionSelect);
    this.router.navigate(['app/auc/gestionObservaciones'])
  }

  navegar() {
    this.paramNav.redirect('app/auc/observaciones');
  }

}

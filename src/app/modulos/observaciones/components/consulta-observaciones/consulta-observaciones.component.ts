import { Component, OnInit } from '@angular/core';

import { Observacion } from 'app/modulos/observaciones/entities/observacion'
import { ObservacionService } from 'app/modulos/observaciones/services/observacion.service';
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Area } from 'app/modulos/empresa/entities/area';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Filter, Criteria } from 'app/modulos/core/entities/filter';

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
  idEmpresa: string;
  observacion: Observacion;
  area: Area;
  fields: string[] = [
    'id',
    'fechaObservacion',
    'tipoObservacion',
    'descripcion',
    'nivelRiesgo_nombre',
    'personasobservadas',
    'personasabordadas',
    'aceptada',
    'area',
    'area_id',
    'area_nombre' 
  ];
  areasPermiso: string;

  constructor(
    private observacionService: ObservacionService,
    private sesionService: SesionService,
    private router: Router,
    private paramNav: ParametroNavegacionService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.idEmpresa = this.sesionService.getEmpresa().id;
    this.areasPermiso = this.sesionService.getPermisosMap()['AUC_GET_OBS'].areas;
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
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPermiso });

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

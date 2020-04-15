import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Evaluacion } from 'app/modulos/sg/entities/evaluacion'
import { Message } from 'primeng/primeng';

import { EvaluacionService } from 'app/modulos/sg/services/evaluacion.service'
import { SesionService } from 'app/modulos/core/services/sesion.service'

import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'

@Component({
  selector: 'app-consulta-evaluacion',
  templateUrl: './consulta-evaluacion.component.html',
  styleUrls: ['./consulta-evaluacion.component.scss'],
})
export class ConsultaEvaluacionComponent implements OnInit {

  evaluacionesList: Evaluacion[];
  evaluacionSelect: Evaluacion;
  msgs: Message[] = [];
  loading: boolean;
  totalRecords: number;
  fields: string[] = [
    'id',
    'sistemaGestion_nombre',
    'fechaInicio',
    'fechaFinalizacion',
    'nombreResponsable',
    'ciudad',
    'nombreEvaluador',
    //'respuestaList_count()',
    'sistemaGestion_numeroPreguntas'
  ];

  constructor(
    private evaluacionService: EvaluacionService,
    private sesionService: SesionService,
    private router: Router,
  ) {

  }

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

    this.evaluacionService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.evaluacionesList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.evaluacionesList.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }

  consultarEvaluacion() {
    this.redireccionar('GET');
  }

  modificarEvaluacion() {
    this.redireccionar('PUT');
  }
  redireccionar(action: string) {
    if (this.evaluacionSelect == null) {
      this.msgs.push({ severity: 'warn', detail: 'Seleccione una evaluacion para ' + (action == 'PUT' ? 'modificarla' : 'consultarla') });
    } else {
      this.router.navigate(
        ['/app/sg/evaluacion', { evaluacionId: this.evaluacionSelect.id, action: action }]
      );
    }
  }

  navegar() {
    this.router.navigate(['/app/sg/sistemasGestion']);
  }


}

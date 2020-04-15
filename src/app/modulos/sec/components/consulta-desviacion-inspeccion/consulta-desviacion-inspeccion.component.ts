import { Component, OnInit } from '@angular/core';

import { DesviacionService } from 'app/modulos/sec/services/desviacion.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { FileUtils } from '../../../comun/file-utils';
@Component({
  selector: 's-consultaDesviacionInspeccion',
  templateUrl: './consulta-desviacion-inspeccion.component.html',
  styleUrls: ['./consulta-desviacion-inspeccion.component.scss'],
  providers: [DesviacionService]
})
export class ConsultaDesviacionInspeccionComponent implements OnInit {


  loading: boolean;
  totalRecords: number;
  desvInpList: any[];
  numRows: number;
  cols: any[];
  selectedColumns: any[];
  lastFilterEvent: any;
  constructor(
    private desviacionService: DesviacionService,
  ) { }


  ngOnInit() {
    this.loading = true;
    this.cols = [
      { field: 'fechaRealizada', header: 'Fecha', type: 'date', width: '300px' },
      { field: 'nivelSuperior', header: 'Regional', type: 'text', width: '300px' },
      { field: 'dependenciaArea', header: 'Ciudad', type: 'text', width: '300px' },
      { field: 'areaInspeccion', header: 'Sede', type: 'text', width: '300px' },
      { field: 'nombreListaInspeccion', header: 'Lista inspección', type: 'text', width: '300px' },
      { field: 'versionListaInspeccion', header: 'Versión', type: 'number', width: '125px' },
      { field: 'tipoGrupo', header: 'Tipo de inspección', type: 'text', width: '300px' },
      { field: 'grupoElemento', header: 'Grupo clasificacion', type: 'text', width: '300px' },
      { field: 'elementoEvaluado', header: 'Descripcion item evaluado', type: 'text', width: '300px' },
      { field: 'recomendacion', header: 'Descripción hallazgo', type: 'text', width: '300px' },
      { field: 'tipoHallazgo', header: 'Grupo hallazgo', type: 'text', width: '300px' },
      { field: 'nombreCalificacion', header: 'Calificación', type: 'text', width: '300px' },
      { field: 'descripcionCalificacion', header: 'Desc. calificación', type: 'text', width: '300px' },
      { field: 'repeticionHallazgo', header: 'Repetición hallazgo', type: 'number', width: '300px' },
      { field: 'tarea', header: 'Acción a seguir', type: 'text', width: '300px' },
      { field: 'descripcionTarea', header: 'Desc. Tarea', type: 'text', width: '300px' },
      { field: 'areaResponsable', header: 'Responsable', type: 'text', width: '300px' },
      { field: 'fechaElaboracion', header: 'Fecha planeada', type: 'date', width: '300px' },
      { field: 'estadoTarea', header: 'Estado', type: 'text', width: '300px' },
      { field: 'fechaVerificacion', header: 'Fecha cierre', type: 'date', width: '300px' }
    ];
    this.numRows = 5;
    this.selectedColumns = this.cols;
  }

  lazyLoad(event: any) {
    this.lastFilterEvent = event;
    this.loading = true;
    let filterQuery = this.generarFiltro(event);
    this.desviacionService.findInpByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.desvInpList = [];
        (<any[]>resp['data']).forEach(dto => this.desvInpList.push(FilterQuery.dtoToObject(dto)));
        if (this.numRows == null) {
        }
      }
    );
  }

  generarFiltro(event: any) {
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    if (event.fieldList != null)
      filterQuery.fieldList = event.fieldList;
    return filterQuery;
  }

  actualizarNumRows(event) {
    this.lastFilterEvent.rows = event.target.value;
    this.lazyLoad(this.lastFilterEvent);
  }

  exportarCsv() {
    this.lastFilterEvent.offset = null;
    this.lastFilterEvent.rows = null;
    this.lastFilterEvent.count = null;
    this.lastFilterEvent.fieldList = [];
    this.selectedColumns.forEach(col => {
      this.lastFilterEvent.fieldList.push(col.field);
    });
    let filterQuery = this.generarFiltro(this.lastFilterEvent);
    this.desviacionService.findInpByFilter(filterQuery).then(
      resp => {
        FileUtils.exportToCsv((<any[]>resp['data']), this.selectedColumns, "Reporte hallazgos inspecciones_");
      }
    );
  }

}

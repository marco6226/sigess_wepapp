import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DesviacionService } from 'app/modulos/sec/services/desviacion.service';
import { Desviacion } from 'app/modulos/sec/entities/desviacion';
import { Message } from 'primeng/primeng';
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { SesionService } from '../../../core/services/sesion.service';
import { Criteria } from '../../../core/entities/filter';

@Component({
  selector: 'app-consulta-desviacion',
  templateUrl: './consulta-desviacion.component.html',
  styleUrls: ['./consulta-desviacion.component.scss']
})
export class ConsultaDesviacionComponent implements OnInit {

  desviacionesList: Desviacion[];
  desviacionesListSelect: Desviacion[];
  opcionesModulos = [
    { label: '', value: null },
    { label: 'Inspecciones', value: 'Inspecciones' },
    { label: 'Observaciones', value: 'Observaciones' },
    { label: 'Reporte A/I', value: 'Reporte A/I' },
  ];

  loading: boolean = true;
  totalRecords: number;
  fields: string[] = [
    'modulo',
    'hashId',
    'area_nombre',
    'concepto',
    'fechaReporte',
    'aspectoCausante',
    'analisisId'
  ];
  areasPermiso: string;


  visibleDlg: boolean;
  desde: Date;
  hasta: Date;
  downloading: boolean;

  constructor(
    private sesionService: SesionService,
    private desviacionService: DesviacionService,
    private paramNav: ParametroNavegacionService,
    private router: Router,
  ) { 
  }

  ngOnInit() {
    this.areasPermiso = this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
  }

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = 1;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
   
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });

    this.desviacionService.findByFilter(filterQuery).then(
      resp => {
        this.totalRecords = resp['count'];
        this.loading = false;
        console.log(resp);
        this.desviacionesList = resp['data'];
      }
    ).catch(err => this.loading = false);
  }

  analizarDesviacion() {
    this.paramNav.setParametro<Desviacion[]>(this.desviacionesListSelect);
    this.paramNav.setAccion<string>('POST');
    this.router.navigate(
      ['/app/sec/analisisDesviacion']
    );
  }

  // select(desv: Desviacion) {
  //   if (this.desviacionesListSelect == null)
  //     this.desviacionesListSelect = [];

  //   for (let i = 0; i < this.desviacionesListSelect.length; i++) {
  //     if (this.desviacionesListSelect[i].hashId === desv.hashId) {
  //       this.desviacionesListSelect.splice(i, 1);
  //       return;
  //     }
  //   }
  //   this.desviacionesListSelect.push(desv);
  // }

  consultarAnalisis(desviacion: Desviacion) {
    this.paramNav.setParametro<Desviacion>(desviacion);
    this.paramNav.setAccion<string>('GET');
    this.router.navigate(
      ['/app/sec/analisisDesviacion']
    );
  }

  modificarAnalisis(desviacion: Desviacion) {
    this.paramNav.setParametro<Desviacion>(desviacion);
    this.paramNav.setAccion<string>('PUT');
    this.router.navigate(
      ['/app/sec/analisisDesviacion']
    );
  }

  descargarInvs() {
    this.downloading = true;
    this.desviacionService.consultarConsolidado(this.desde, this.hasta)
      .then(resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp], { type: 'text/csv;charset=utf-8;' });
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", "Consolidado investigaciones_" + new Date().getTime() + ".csv");
          dwldLink.click();
          this.downloading = false;
        }
      })
      .catch(err => {
        this.downloading = false;
      });
  }
}

import { Component, OnInit } from '@angular/core';

import { InspeccionService } from 'app/modulos/inspecciones/services/inspeccion.service'
import { Inspeccion } from 'app/modulos/inspecciones/entities/inspeccion'
import { Programacion } from 'app/modulos/inspecciones/entities/programacion'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Message } from 'primeng/primeng'
import { SesionService } from '../../../core/services/sesion.service';


import { FilterQuery } from 'app/modulos/core/entities/filter-query'
import { Filter, Criteria } from 'app/modulos/core/entities/filter'
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-consulta-inspecciones',
    templateUrl: './consulta-inspecciones.component.html',
    styleUrls: ['./consulta-inspecciones.component.scss']
})
export class ConsultaInspeccionesComponent implements OnInit {

    msgs: Message[];
    inspeccionesList: any[];
    inspeccionSelect: Inspeccion;
    totalRecords: number;
    loading: boolean = true;
    fields: string[] = [
        'id',
        'programacion_fecha',
        'fechaRealizada',
        'usuarioRegistra_email',
        'programacion_listaInspeccion_nombre',
        'programacion_area_id',
        'programacion_area_nombre',
        'fechaModificacion',
        'usuarioModifica_email'
    ];
    areasPermiso: string;

    // No programadas
    inspeccionNoProgList: any[];
    inspeccionNoProgSelect: Inspeccion;
    totalRecordsNoProg: number;
    loadingNoProg: boolean = true;
    fieldsNoProg: string[] = [
        'id',
        'fechaRealizada',
        'usuarioRegistra_email',
        'listaInspeccion_nombre',
        'area_id',
        'area_nombre',
        'fechaModificacion',
        'usuarioModifica_email'
    ];

    constructor(
        private paramNav: ParametroNavegacionService,
        private inspeccionService: InspeccionService,
        private sesionService: SesionService,
    ) { }

    ngOnInit() {
        this.areasPermiso = this.sesionService.getPermisosMap()['INP_GET_INP'].areas;
        

    }

    lazyLoadNoProg(event: any) {
        this.loadingNoProg = true;
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;

        filterQuery.fieldList = this.fieldsNoProg;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: 'programacion' });
        filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPermiso });

        this.inspeccionService.findByFilter(filterQuery).then(
            resp => {
                this.totalRecordsNoProg = resp['count'];
                this.loadingNoProg = false;
                this.inspeccionNoProgList = [];
                (<any[]>resp['data']).forEach(dto => {
                    this.inspeccionNoProgList.push(FilterQuery.dtoToObject(dto));
                });
            }
        );
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
        //filterQuery.filterList.push({criteria:Criteria.IS_NOT_NULL, field:'programacion'});
        filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "programacion.area.id", value1: this.areasPermiso });

        this.inspeccionService.findByFilter(filterQuery).then(
            resp => {
                this.totalRecords = resp['count'];
                this.loading = false;
                this.inspeccionesList = [];
                
                (<any[]>resp['data']).forEach(dto => {
                    this.inspeccionesList.push(FilterQuery.dtoToObject(dto));
                });
            }
        );
    }



    redirect(consultar: boolean) {
        if (this.inspeccionSelect == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
        } else {
            this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
            this.paramNav.setParametro<Inspeccion>(this.inspeccionSelect);
            this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
        }
    }

    redirectNoProg(consultar: boolean) {
        if (this.inspeccionNoProgSelect == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
        } else {
            this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
            this.paramNav.setParametro<Inspeccion>(this.inspeccionNoProgSelect);
            this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
        }
    }

    navegar() {
        this.paramNav.redirect('/app/inspecciones/programacion');
    }

}

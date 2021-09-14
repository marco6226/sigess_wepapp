import { Component, OnInit } from '@angular/core';
import { TareaService } from 'app/modulos/sec/services/tarea.service'
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Tarea } from 'app/modulos/sec/entities/tarea'
import { Message } from 'primeng/primeng';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Filter, Criteria } from '../../../core/entities/filter';
import { Permiso } from '../../../empresa/entities/permiso';
import * as moment from "moment";
import { SeguimientosService } from '../../services/seguimientos.service';

@Component({
    selector: 'app-asignacion-tareas',
    templateUrl: './asignacion-tareas.component.html',
    styleUrls: ['./asignacion-tareas.component.scss']
})
export class AsignacionTareasComponent implements OnInit {

    tareasList: any;
    tareaSelect: Tarea;
    msgs: Message[] = [];
    observacionesRealizacion: string;

    constructor(
        private tareaService: TareaService,
        private sesionService: SesionService,
        private paramNav: ParametroNavegacionService,
        private seguimientoService: SeguimientosService,
    ) { }

    ngOnInit() {

        let statuses = {
            0: 'N/A',
            1: 'En seguimiento',
            2: 'Abierta',
            3: 'Cerrada en el tiempo',
            4: 'Cerrada fuera de tiempo',
            5: 'Vencida',
        }

        let areas: string = this.sesionService.getPermisosMap()['SEC_GET_TAR'].areas;
        let fq = new FilterQuery();
        fq.filterList = [{ field: 'areaResponsable.id', value1: areas, criteria: Criteria.CONTAINS }];
        this.tareaService.findByFilter(fq).then(
            async resp => {
                this.tareasList = resp['data']

                this.tareasList = await Promise.all(this.tareasList.map(async tarea => {
                    let status = await this.verifyStatus(tarea);
                    tarea.estado = statuses[status];
                    tarea.primerNombre = tarea.empResponsable.primerNombre;
                    tarea.fechaProyectada = new Date(tarea.fechaProyectada).toISOString();
                    return tarea;
                }));

            }

        );
        console.log(this.tareasList);
    }

    async verifyStatus(tarea) {

        let trackings = await this.seguimientoService.getSegByTareaID(tarea.id) as any;
        let isFollow = (trackings.length > 0) ? true : false;

        /* Vars */
        let now = moment({});
        let fecha_cierre = moment(tarea.fechaCierre);
        let fecha_proyectada = moment(tarea.fechaProyectada);

        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(now) && isFollow) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(now)) return 2;
        if (fecha_cierre.isValid() && fecha_proyectada.isAfter(now)) return 3;
        if (fecha_cierre.isValid() && fecha_proyectada.isBefore(now)) return 4;
        if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now)) return 5;

        return 0;
    }

    selectTarea(tarea: Tarea) {
        this.tareaSelect = tarea;
    }

    reportarCumplimiento() {
        if (this.tareaSelect != null) {
            let tareaReq = new Tarea();
            tareaReq.id = this.tareaSelect.id;
            tareaReq.observacionesRealizacion = this.tareaSelect.observacionesRealizacion;
            this.tareaService.reportarCumplimiento(tareaReq).then(
                data => {
                    this.tareaSelect = <Tarea>data;
                    for (let i = 0; i < this.tareasList.length; i++) {
                        if (this.tareasList[i].id === this.tareaSelect.id) {
                            this.tareasList[i] = this.tareaSelect;
                            break;
                        }
                    }
                    this.tareasList = this.tareasList.slice();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Reporte de tarea realizado', detail: 'Se ha reportado correctamente la realización de la tarea ' + this.tareaSelect.nombre });
                    this.tareaSelect = null;
                }
            );
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'No ha seleccionado una tarea', detail: 'Debe seleccionar una tarea para reportar' });
        }
    }

    reportarVerificacion(tarea: Tarea) {
        if (this.tareaSelect != null) {
            let tareaReq = new Tarea();
            tareaReq.id = this.tareaSelect.id;
            tareaReq.observacionesVerificacion = this.tareaSelect.observacionesVerificacion;
            this.tareaService.reportarVerificacion(tareaReq).then(
                data => {
                    this.tareaSelect = <Tarea>data;
                    for (let i = 0; i < this.tareasList.length; i++) {
                        if (this.tareasList[i].id === this.tareaSelect.id) {
                            this.tareasList[i] = this.tareaSelect;
                            break;
                        }
                    }
                    this.tareasList = this.tareasList.slice();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Verificación de tarea realizada', detail: 'Se ha reportado correctamente la verificación de la tarea ' + this.tareaSelect.nombre });
                    this.tareaSelect = null;
                }
            );
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'No ha seleccionado una tarea', detail: 'Debe seleccionar una tarea para reportar' });
        }
    }

    navegar() {
        this.paramNav.redirect('/app/sec/consultaAnalisisDesviaciones');
    }


    onClick() {

        this.paramNav.redirect('/app/sec/tarea/' + this.tareaSelect.id);

    }

}

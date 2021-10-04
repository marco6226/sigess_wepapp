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

        this.tareaService.findByDetails().then(
            async resp => {
                this.tareasList = resp;

                this.tareasList = await Promise.all(this.tareasList.map(async tarea => {
                    let status = await this.verifyStatus(tarea);
                    tarea.estado = statuses[status];
                    tarea.fecha_proyectada = new Date(tarea.fecha_proyectada).toISOString();
                    return tarea;
                }));
                console.log(this.tareasList);
            }

        );

    }

    async verifyStatus(tarea) {

        let trackings = tarea.trackings
        let isFollow = (trackings > 0) ? true : false;

        /* Vars */
        let now = moment({});
        let fecha_cierre = moment(tarea.fecha_cierre);
        let fecha_proyectada = moment(tarea.fecha_proyectada);

        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(now) && isFollow) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now)) return 2;
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

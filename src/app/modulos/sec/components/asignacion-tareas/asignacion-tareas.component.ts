import { element } from 'protractor';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TareaService } from 'app/modulos/sec/services/tarea.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Tarea } from 'app/modulos/sec/entities/tarea'
import { FilterUtils, Message } from 'primeng/primeng';
import * as moment from "moment";
import { SesionService } from 'app/modulos/core/services/sesion.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Filter, Criteria } from '../../../core/entities/filter';


import * as XLSX from 'xlsx'; 
import {DragDropModule} from 'primeng/dragdrop';

@Component({
    selector: 'app-asignacion-tareas',
    templateUrl: './asignacion-tareas.component.html',
    styleUrls: ['./asignacion-tareas.component.scss']
})
export class AsignacionTareasComponent implements OnInit {

    loading: boolean = false;
    yearRange;
    es: any;
    tareasList: any;
    tareaSelect: Tarea;
    msgs: Message[] = [];
    observacionesRealizacion: string;
    arrayIdsareas  = [];
    idEmpresa: string;
     
    modalExcel = false;
    fileName= 'ListadoSeguimiento.xlsx';

    constructor(
        private tareaService: TareaService,
        private paramNav: ParametroNavegacionService,
        private sesionService: SesionService,
    ) { }

    ngOnInit() {
        this.idEmpresa = this.sesionService.getEmpresa().id;

        let date = new Date().getFullYear().toString();

        this.yearRange = ((parseInt(date) - 20) + ':' + (parseInt(date) + 20)).toString();

        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero ", "Febrero ", "Marzo ", "Abril ", "Mayo ", "Junio ", "Julio ", "Agosto ", "Septiembre ", "Octubre ", "Noviembre ", "Diciembre "],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: 'Hoy',
            clear: 'Borrar'
        }

        this.loading = true;

        this.getTareas();

        FilterUtils['dateFilter'] = (value, filter):boolean => {
            if (filter === undefined || filter === null) return true;

            if (value === undefined || value === null) return false;

            let val = moment(value.split('T')[0]),
            filt = moment(filter);

            return filt.isSame(val);
        }

    }

    getTareas() {
        let statuses = {
            0: 'N/A',
            1: 'En seguimiento',
            2: 'Abierta',
            3: 'Cerrada en el tiempo',
            4: 'Cerrada fuera de tiempo',
            5: 'Vencida',
        }
       // this.arrayIdsareas = [54, 52];
        let areas: string = this.sesionService.getPermisosMap()['SEC_GET_TAR'].areas;
        areas = areas.replace('{', '');
        areas = areas.replace('}', '');     
        this.arrayIdsareas.push (areas.valueOf());
       
        this.tareaService.findByDetails(this.arrayIdsareas).then(
            async resp => { 
                this.tareasList = resp;
                this.tareasList = await Promise.all(this.tareasList.map(async tarea => {
                    let status = await this.verifyStatus(tarea);
                    tarea.estado = statuses[status];
                    tarea.fecha_proyectada = new Date(tarea.fecha_proyectada).toISOString();
                    return tarea;
                }));
                this.loading = false;
                console.log(this.tareasList);
            }

        );
    }

    async verifyStatus(tarea) {

        let trackings = tarea.trackings;
        let isFollow = (trackings > 0) ? true : false;

        /* Vars */
        let now = moment({});
        let fecha_cierre = moment(tarea.fecha_cierre);
        let fecha_proyectada = moment(tarea.fecha_proyectada);

        if (!fecha_cierre.isValid() &&  isFollow) return 1;        
        if (!fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now,'day') && !isFollow) return 2;
        if (fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(fecha_cierre,'day')) return 3;
        if (fecha_cierre.isValid() && fecha_proyectada.isBefore(fecha_cierre,'day')) return 4;        
        if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day') && !isFollow) return 5;
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


    exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }

    dragStart(event,car) {
        //this.draggedCar = car;
    }

    drop(event) {
        /*if(this.draggedCar) {
            let draggedCarIndex = this.findIndex(this.draggedCar);
            this.selectedCars = [...this.selectedCars, this.draggedCar];
            this.availableCars = this.availableCars.filter((val,i) => i!=draggedCarIndex);
            this.draggedCar = null;
        }*/
    }

    dragEnd(event) {
       // this.draggedCar = null;
    }

}

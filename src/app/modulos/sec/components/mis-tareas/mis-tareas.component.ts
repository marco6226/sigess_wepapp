import { LayoutComponent } from './../../../comun/components/layout/layout.component';
import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { TareaService } from 'app/modulos/sec/services/tarea.service'
import { SesionService } from 'app/modulos/core/services/sesion.service'
import { ParametroNavegacionService } from 'app/modulos/core/services/parametro-navegacion.service';
import { Tarea } from 'app/modulos/sec/entities/tarea'
import { FilterUtils, Message } from 'primeng/primeng';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Filter, Criteria } from '../../../core/entities/filter';
import { Permiso } from '../../../empresa/entities/permiso';
import * as moment from "moment";
import { SeguimientosService } from '../../services/seguimientos.service';


@Component({
    selector: 'app-mis-tareas',
    templateUrl: './mis-tareas.component.html',
    styleUrls: ['./mis-tareas.component.scss']
})
export class MisTareasComponent implements OnInit {

    tareasList: any;
    tareaSelect: Tarea;
    msgs: Message[] = [];
    observacionesRealizacion: string;
    loading: boolean = false;
    yearRange;
    es: any;


    constructor(
        private tareaService: TareaService,
        private sesionService: SesionService,
        private paramNav: ParametroNavegacionService,
        private seguimientoService: SeguimientosService,
    ) { }

    ngOnInit() {

        this.loading = true;

        let statuses = {
            0: 'N/A',
            1: 'En seguimiento',
            2: 'Abierta',
            3: 'Cerrada en el tiempo',
            4: 'Cerrada fuera de tiempo',
            5: 'Vencida',
        }

//        let areas: string = this.sesionService.getPermisosMap()['SEC_GET_TAR'].areas;
        let id = this.sesionService.getUsuario().id;
        let fq = new FilterQuery();
        fq.count = true;
        fq.filterList = [{ field: 'empResponsable.usuario.id', value1: id, criteria: Criteria.CONTAINS }];
        
        //console.log(fq.fieldList)        
        this.tareaService.findByDetailsByEmpleado(id).then(
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
                 let estados = this.tareasList.map(x => x.estado)
                console.log(estados);

        
            
                //this.devolverEstados ();
                //console.log(this.devolverEstados());
            }            
        );
        
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

        FilterUtils['dateFilter'] = (value, filter):boolean => {
            if (filter === undefined || filter === null) return true;

            if (value === undefined || value === null) return false;

            let val = moment(value.split('T')[0]),
            filt = moment(filter);

            return filt.isSame(val);
        }
    }
    

    devolverEstados (){
        let total =[];
        const estados = this.tareasList.map(x => x.estado)
        total = estados.reduce(( a , d ) => (a[d] ? a[d] += 1 : a[d] = 1 , a), { } );
        //console.log(total); 
        return total;      
        }        
        
        /*  0: 'N/A',
            1: 'En seguimiento',
            2: 'Abierta',
            3: 'Cerrada en el tiempo',
            4: 'Cerrada fuera de tiempo',
            5: 'Vencida',*/
    async verifyStatus(tarea) {

        let trackings = tarea.trackings
        let isFollow = (trackings > 0) ? true : false;
        console.log(isFollow);
        /* Vars */
        let now = moment({});
        let fecha_cierre = moment(tarea.fecha_cierre);
        let fecha_proyectada = moment(tarea.fecha_proyectada);


        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(now,'day') && isFollow) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day') && isFollow) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now,'day')) return 2;
        if (fecha_cierre.isValid() && fecha_proyectada.isAfter(now,'day')) return 3;
        if (fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day')) return 4;
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

}

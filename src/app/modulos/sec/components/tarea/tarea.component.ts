import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import {
    locale_es,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import * as moment from "moment";
import { SeguimientosService } from '../../services/seguimientos.service';
import { Message } from 'primeng/api';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Criteria } from 'app/modulos/core/entities/filter';

@Component({
    selector: 'app-tarea',
    templateUrl: './tarea.component.html',
    styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {

    /* Variables */
    estadoList = [];
    evidences = [];
    msgs: Message[] = [];
    tareaClose: boolean = false;
    tareaVerify: boolean = false;
    tareaId;
    cargando = false;
    tareaForm: FormGroup;
    routeSub;
    tarea: any;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    submitted = false;
    loading: boolean;
    fullName = '';
    empleado: Empleado;
    empleadosList: Empleado[];
    status = 0;
    statuses;

    constructor(
        fb: FormBuilder,
        private route: ActivatedRoute,
        private tareaService: TareaService,
        private empleadoService: EmpleadoService,
        private seguimientoService: SeguimientosService,
    ) {
        this.tareaForm = fb.group({
            id: ["", Validators.required],
            usuarioCierre: ["", Validators.required],
            fechaCierre: ["", Validators.required],
            descripcionCierre: ["", Validators.required],
            evidences: [[]],
        })
    }

    ngOnInit() {
        this.tareaId = this.route.snapshot.paramMap.get('id');
        this.getTarea();

        /* Preload data */
        this.estadoList = [
            { label: 'Abierto', value: 'abierto' },
            { label: 'Cerrado en el tiempo', value: 'ct' },
            { label: 'Cerrado fuera de tiempo', value: 'cft' },
            { label: 'Vencido', value: 'vencido' },
        ];

        this.statuses = {
            0: 'N/A',
            1: 'En seguimiento',
            2: 'Abierto',
            3: 'Cerrada en el tiempo',
            4: 'Cerrada fuera de tiempo',
            5: 'Vencido',
        }

        // console.log(this.statuses[this.status])
    }

    async getTarea(event?) {
        this.tareaForm.patchValue({ id: parseInt(this.tareaId) });
        this.tarea = await this.tareaService.findByDetailId(this.tareaId);

        if (this.tarea) {
            this.status = this.verifyStatus();
            let fecha_cierre = moment(this.tarea.fecha_cierre);
            let fecha_verificacion = moment(this.tarea.fecha_verificacion);

            this.tareaVerify = (fecha_cierre.isValid() && fecha_verificacion.isValid()) ? true : false;

            if (this.status === 3 || this.status === 4) {
                this.tareaClose = true;
                let fq = new FilterQuery();
                fq.filterList = [{ criteria: Criteria.EQUALS, field: 'id', value1: this.tarea.fk_usuario_cierre, value2: null }];
                this.empleadoService.findByFilter(fq).then(
                    resp => {
                        console.log(resp)
                        let empleado = resp['data'][0];
                        this.onSelection(empleado);
                        this.getEvidences(this.tarea.id);
                        this.tareaForm.patchValue(
                            {
                                usuarioCierre: this.tarea.fk_usuario_cierre,
                                fechaCierre: new Date(this.tarea.fecha_cierre),
                                descripcionCierre: this.tarea.descripcion_cierre
                            }
                        );
                    }
                );

            }
        }
    }

    verifyStatus(isFollowsExist = false) {
        
        /* Vars */
        let now = moment({});
        let fecha_cierre = moment(this.tarea.fecha_cierre);
        let fecha_proyectada = moment(this.tarea.fecha_proyectada);

        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(now) && isFollowsExist) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(now)) return 2;
        if (fecha_cierre.isValid() && fecha_proyectada.isAfter(now)) return 3;
        if (fecha_cierre.isValid() && fecha_proyectada.isBefore(now)) return 4;
        if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now)) return 5;
        
        return 0;
    }

    get f() {
        return this.tareaForm.controls;
    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }

    addImage(file) {
        let evidences = this.tareaForm.get('evidences').value;
        let obj = {
            ruta: file,

        }
        this.evidences.push(obj);
        evidences.push(obj);
        this.tareaForm.patchValue({ evidences: evidences });
        console.log(this.evidences);
    }

    removeImage(index) {
        let evidences = this.tareaForm.get('evidences').value;
        if (index > -1) evidences.splice(index, 1);
    }

    isFollows(data) {
        this.status = this.verifyStatus(data);
    }

    async onSubmit() {
        this.submitted = true;
        this.cargando = true;
        this.msgs = [];

        if (!this.tareaForm.valid) {
            console.log('Data: ', this.tareaForm.value);
            this.cargando = false;
            this.msgs.push({
                severity: "info",
                summary: "Mensaje del sistema",
                detail: "Debe completar todos los campos",
            });
            return;
        }

        try {
            let res = await this.seguimientoService.closeTarea(this.tareaForm.value);

            if (res) {
                this.tareaForm.reset();
                this.submitted = false;
                this.cargando = false;
                this.getTarea();
                this.msgs.push({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: "¡Se ha cerrado exitosamente esta tarea!",
                });
            }

        } catch (e) {
            console.log(e);
            this.cargando = false;
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un inconveniente al cerrar la tarea",
            });
        }

    }

    async getEvidences(id) {
        try {

            this.evidences = await this.seguimientoService.getEvidences(id, "fkTareaCierre") as any;

        } catch (e) {
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ha ocurrido un error al obtener las evidencias de esta tarea",
            });
            console.log(e);
        }
    }

    async onSelection(event) {
        console.log(event);
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = (this.empleado.primerNombre || '') + ' ' + (this.empleado.primerApellido || '');
        this.tareaForm.patchValue({ usuarioCierre: { 'id': this.empleado.id } });
    }

}

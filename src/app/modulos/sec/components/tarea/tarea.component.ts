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

@Component({
    selector: 'app-tarea',
    templateUrl: './tarea.component.html',
    styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {

    /* Variables */
    estadoList = [];
    msgs: Message[] = [];
    tareaClose: boolean = false;
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
        this.tareaForm.patchValue({ id: parseInt(this.tareaId) });
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
            1: 'Abierto',
            2: 'Cerrada en el tiempo',
            3: 'Cerrada fuera de tiempo',
            4: 'Vencido'
        }

        // console.log(this.statuses[this.status])
    }

    async getTarea(event?) {
        this.tarea = await this.tareaService.findByDetailId(this.tareaId);

        if (this.tarea) {
            this.status = this.verifyStatus();

            if (this.status === 2 || this.status === 3) {
                this.tareaClose = true;
                this.tareaForm.patchValue(
                    {
                        fechaCierre: this.tarea.fecha_cierre,
                        descripcionCierre: this.tarea.descripcion_cierre
                    }
                );
            }
        }
    }

    verifyStatus() {
        /* Vars */
        let now = moment({});
        let fecha_cierre = moment(this.tarea.fecha_cierre);
        let fecha_proyectada = moment(this.tarea.fecha_proyectada);

        console.log('¿Es la fecha proyectada anterior la fecha actual? ', fecha_proyectada.isBefore(now));

        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(now)) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now)) return 4;
        if (fecha_cierre.isValid() && fecha_proyectada.isAfter(now)) return 2;
        if (fecha_cierre.isValid() && fecha_proyectada.isBefore(now)) return 3;

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
        evidences.push(obj);
        this.tareaForm.patchValue({ evidences: evidences });
    }

    removeImage(index) {
        let evidences = this.tareaForm.get('evidences').value;
        if (index > -1) evidences.splice(index, 1);
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

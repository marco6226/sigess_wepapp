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

@Component({
    selector: 'app-tarea',
    templateUrl: './tarea.component.html',
    styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {

    /* Variables */
    estadoList = [];

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
    ) {
        this.tareaForm = fb.group({
            tareaId: ["", Validators.required],
            userId: ["", Validators.required],
            fechaCierre: ["", Validators.required],
            descripcion: ["", Validators.required],
            evidencias: [[]],
        })
    }

    async ngOnInit() {
        this.tareaId = this.route.snapshot.paramMap.get('id');

        this.tareaForm.patchValue({ tareaId: this.tareaId });

        this.tarea = await this.tareaService.findByDetailId(this.tareaId);

        if (this.tarea) {
            this.status = this.verifyStatus();
        }

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

    verifyStatus() {
        /* Vars */
        let fecha_cierre = moment(this.tarea.fecha_cierre);
        let fecha_proyectada = moment(this.tarea.fecha_proyectada);

        if (!fecha_cierre.isValid() && fecha_proyectada.isAfter(moment.now())) return 1;
        if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(moment.now())) return 4;
        if (fecha_cierre.isValid() && fecha_proyectada.isAfter(moment.now())) return 3;
        if (fecha_cierre.isValid() && fecha_proyectada.isBefore(moment.now())) return 2;

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
        let evidences = this.tareaForm.get('evidencias').value;
        let obj = {
            ruta: file,

        }
        evidences.push(obj);
        this.tareaForm.patchValue({ evidencias: evidences });
    }

    removeImage(index) {
        let evidences = this.tareaForm.get('evidencias').value;
        if (index > -1) evidences.splice(index, 1);
    }

    async onSubmit() {
        this.submitted = true;
        this.cargando = true;

        if (!this.tareaForm.valid) {
            console.log('Data: ', this.tareaForm.value);
            this.cargando = false;
            return;
        }

        console.log('Data: ', this.tareaForm.value);
    }

    async onSelection(event) {
        console.log(event);
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = (this.empleado.primerNombre || '') + ' ' + (this.empleado.primerApellido || '');
        this.tareaForm.patchValue({ userId: this.empleado.id });
    }

}

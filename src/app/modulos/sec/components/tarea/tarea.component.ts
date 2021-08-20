import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import {
    locale_es,
} from "app/modulos/rai/enumeraciones/reporte-enumeraciones";
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { Empleado } from 'app/modulos/empresa/entities/empleado';

@Component({
    selector: 'app-tarea',
    templateUrl: './tarea.component.html',
    styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {

    /* Variables */
    estadoList = [];

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


    constructor(
        fb: FormBuilder,
        private route: ActivatedRoute,
        private tareaService: TareaService,
        private empleadoService: EmpleadoService,
    ) {
        this.tareaForm = fb.group({
            userId: ["", Validators.required],
            fechaCierre: ["", Validators.required],
            descripcion: ["", Validators.required],
            evidencias: [[]],
        })
    }

    async ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.tarea = await this.tareaService.findByDetailId(id);

        /* Preload data */
        this.estadoList = [
            { label: 'Abierto', value: 'abierto' },
            { label: 'Cerrado en el tiempo', value: 'ct' },
            { label: 'Cerrado fuera de tiempo', value: 'cft' },
            { label: 'Vencido', value: 'vencido' },
        ];
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

    onSubmit() {
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
        // this.caseSelect = false;
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = this.empleado.primerNombre + ' ' + this.empleado.primerApellido;
        this.tareaForm.patchValue({userId: this.empleado.id});
    }

}

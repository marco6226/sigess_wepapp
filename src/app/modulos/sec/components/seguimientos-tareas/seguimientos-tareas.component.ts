import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { Message } from "primeng/api";
import { SeguimientosService } from '../../services/seguimientos.service';

@Component({
    selector: 'app-seguimientos-tareas',
    templateUrl: './seguimientos-tareas.component.html',
    styleUrls: ['./seguimientos-tareas.component.scss']
})
export class SeguimientosTareasComponent implements OnInit {

    /* Variables */
    @Input() status;
    @Input() tareaId;
    @Output() isFollowExist: EventEmitter<boolean> = new EventEmitter();

    msgs: Message[] = [];
    cargando = false;
    trackings;
    displayModal: boolean;
    displayEvidences: boolean;
    trackingForm: FormGroup;
    submitted = false;
    evidences;
    fullName = '';
    empleado: Empleado;
    empleadosList: Empleado[];

    constructor(
        fb: FormBuilder,
        private empleadoService: EmpleadoService,
        private route: ActivatedRoute,
        private seguimientoService: SeguimientosService,
    ) {
        this.trackingForm = fb.group({
            tareaId: ["", Validators.required],
            pkUser: ["", Validators.required],
            followDate: ["", Validators.required],
            description: ["", Validators.required],
            evidences: [[]],
        });
    }

    ngOnInit() {
        this.trackingForm.patchValue({ tareaId: this.tareaId })

        this.getSeg();
    }

    async getSeg() {
        try {
            this.trackings = await this.seguimientoService.getSegByTareaID(this.tareaId);

            if (this.trackings.length > 0) {
                console.log('Se ejecuta el emit')
                this.isFollowExist.emit(true);
            }
        } catch (e) {
            console.log(e);
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un inconveniente al obtener el listado de seguimientos",
            });
        }
    }

    get f() {
        return this.trackingForm.controls;
    }

    addImage(file) {
        let evidences = this.trackingForm.get('evidences').value;
        let obj = {
            ruta: file,

        }
        evidences.push(obj);
        this.trackingForm.patchValue({ evidences: evidences });
    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }

    async onSubmit() {
        this.submitted = true;
        this.cargando = true;
        this.msgs = [];

        if (!this.trackingForm.valid) {
            this.cargando = false;
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Por favor revise todos los campos",
            });
            console.log('Data: ', this.trackingForm.value);
            return;
        }

        try {
            let res = await this.seguimientoService.createSeg(this.trackingForm.value);

            if (res) {
                this.cargando = false;
                this.msgs.push({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: "¡Se ha creado exitosamente el seguimiento!",
                });
                this.closeCreate();
                this.getSeg();
            }
        } catch (e) {
            console.log(e);
            this.cargando = false;
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ha ocurrido un error al crear el seguimiento",
            });
        }

    }

    showModalDialog(type, data?) {
        switch (type) {
            case 'create':
                this.displayModal = true;
                break;
            case 'evidence':
                this.displayEvidences = true;
                this.getEvidences(data);
                break;
        }
    }

    async getEvidences(id) {
        try {

            this.evidences = await this.seguimientoService.getEvidences(id, "fkSegId");

        } catch (e) {
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ha ocurrido un error al obtener las evidencias de esta tarea",
            });
            console.log(e);
        }
    }

    closeEvidences() {
        this.evidences = [];
        this.displayEvidences = false;
    }

    closeCreate() {
        this.empleado = null;
        this.fullName = null;
        this.trackingForm.reset();
        this.displayModal = false;
    }

    async onSelection(event) {
        console.log(event);
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = (this.empleado.primerNombre || '') + ' ' + (this.empleado.primerApellido || '');
        this.trackingForm.patchValue({ pkUser: this.empleado.id });
    }

}

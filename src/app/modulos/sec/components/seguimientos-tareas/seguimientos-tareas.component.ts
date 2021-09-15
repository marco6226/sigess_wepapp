import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { Message } from "primeng/api";
import { SeguimientosService } from '../../services/seguimientos.service';

@Component({
    selector: 'app-seguimientos-tareas',
    templateUrl: './seguimientos-tareas.component.html',
    styleUrls: ['./seguimientos-tareas.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeguimientosTareasComponent implements OnInit {

    /* Variables */
    @Input() status;
    @Input() tarea;
    @Input() tareaClose: boolean = false;
    @Input() tareaId;
    @Output() isFollowExist: EventEmitter<boolean> = new EventEmitter();

    loading: boolean = false;
    differ: any;
    msgs: Message[] = [];
    cargando = false;
    clearEvidences: boolean = false;
    trackings;
    displayModal: boolean;
    displayEvidences: boolean;
    trackingForm: FormGroup;
    submitted = false;
    evidences;
    fullName = '';
    empleado: Empleado;
    empleadosList: Empleado[];
    fechaActual = new Date();
    localeES: any = locale_es;

    constructor(
        fb: FormBuilder,
        private empleadoService: EmpleadoService,
        private route: ActivatedRoute,
        private seguimientoService: SeguimientosService,
        private differs: KeyValueDiffers,
        private cd: ChangeDetectorRef
    ) {
        this.differ = differs.find({}).create();
        this.trackingForm = fb.group({
            tareaId: ["", Validators.required],
            email: [""],
            pkUser: ["", Validators.required],
            followDate: ["", Validators.required],
            description: ["", Validators.required],
            evidences: [[]],
        });
    }

    ngOnInit() {
        this.trackingForm.patchValue({ tareaId: this.tareaId })
    }

    ngDoCheck() {
        if (this.tarea !== undefined) {
            let changes = this.differ.diff(this.tarea);

            if (changes) {
                console.log('changes detected');
                this.getSeg();
                changes.forEachChangedItem(r => {
                    this.cd.markForCheck();
                });
                changes.forEachAddedItem((r) => {
                    this.cd.markForCheck();
                });
                changes.forEachRemovedItem(r => {
                    this.cd.markForCheck();
                });
            }
        }
    }

    async getSeg() {
        try {
            this.trackings = await this.seguimientoService.getSegByTareaID(this.tareaId);

            if (this.trackings.length > 0) {
                console.log('Se ejecuta el emit')
                this.cd.markForCheck();
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
        console.log('Form: ',  this.trackingForm.value)
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
            .then((data) => {

                (this.empleadosList = <Empleado[]>data)
                this.cd.markForCheck();
            });
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

            let follow = {
                tareaId: this.trackingForm.get('tareaId').value,
                pkUser: this.trackingForm.get('pkUser').value,
                followDate: this.trackingForm.get('followDate').value,
                description: this.trackingForm.get('description').value,
                evidences: this.trackingForm.get('evidences').value,
            }
            
            let res = await this.seguimientoService.createSeg(follow);

            if (res) {
                this.cargando = false;
                this.msgs.push({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: "¡Se ha creado exitosamente el seguimiento!",
                });
                this.submitted = false;
                this.closeCreate();
                this.getSeg();
                this.cd.markForCheck();
                setTimeout(() => {
                    this.msgs = [];
                    this.cd.markForCheck();
                }, 3500);
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

        this.loading = true;
        try {

            this.evidences = await this.seguimientoService.getEvidences(id, "fkSegId");
            if (this.evidences) {
                this.loading = false;
            }
            this.cd.markForCheck();

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
        this.displayModal = false;
        this.trackingForm.reset();
        this.trackingForm.patchValue({
            tareaId: this.tareaId,
            evidences: []
        });
        this.evidences = [];
        this.clearEvidences = true;
        this.cd.markForCheck();
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

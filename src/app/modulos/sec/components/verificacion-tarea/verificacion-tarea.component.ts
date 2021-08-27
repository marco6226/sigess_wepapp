import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { Message } from 'primeng/primeng';
import { SeguimientosService } from '../../services/seguimientos.service';

@Component({
    selector: 'app-verificacion-tarea',
    templateUrl: './verificacion-tarea.component.html',
    styleUrls: ['./verificacion-tarea.component.scss']
})
export class VerificacionTareaComponent implements OnInit {

    /* Variables */
    cargando = false;
    submitted = false;
    msgs: Message[] = [];
    verificationForm: FormGroup;
    empleado: Empleado;
    empleadosList: Empleado[];
    fullName = '';

    @Output () loadTareas: EventEmitter<boolean> = new EventEmitter();

    constructor(
        fb: FormBuilder,
        private empleadoService: EmpleadoService,
        private seguimientoService: SeguimientosService,
    ) {
        this.verificationForm = fb.group({
            id: ["", Validators.required],
            fkUsuarioVerificaId: ["", Validators.required],
            fechaVerificacion: ["", Validators.required],
            descripcionVerificacion: ["", Validators.required],
            evidencesV: [[]],
        })
    }

    ngOnInit() {
    }

    async onSubmit() {
        this.submitted = true;
        this.cargando = true;
        this.msgs = [];

        if (!this.verificationForm.valid) {
            console.log('Data: ', this.verificationForm.value);
            this.cargando = false;
            this.msgs.push({
                severity: "info",
                summary: "Mensaje del sistema",
                detail: "Debe completar todos los campos",
            });
            return;
        }

        try {
            let res = await this.seguimientoService.closeTarea(this.verificationForm.value);

            if (res) {
                this.verificationForm.reset();
                this.cargando = false;
                this.loadTareas.emit(true);
                this.msgs.push({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: "¡Se ha registrado la verificación de esta tarea exitosamente!",
                });
            }

        } catch (e) {
            console.log(e);
            this.cargando = false;
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un inconveniente al registrar la verificación de esta tarea",
            });
        }

    }

    buscarEmpleado(event) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }

    async onSelection(event) {
        console.log(event);
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = (this.empleado.primerNombre || '') + ' ' + (this.empleado.primerApellido || '');
        this.verificationForm.patchValue({ fkUsuarioVerificaId: { 'id': this.empleado.id } });
    }


}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Criteria } from 'app/modulos/core/entities/filter';
import { FilterQuery } from 'app/modulos/core/entities/filter-query';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
import { locale_es } from 'app/modulos/rai/enumeraciones/reporte-enumeraciones';
import { Message } from 'primeng/primeng';
import { SeguimientosService } from '../../services/seguimientos.service';

@Component({
    selector: 'app-verificacion-tarea',
    templateUrl: './verificacion-tarea.component.html',
    styleUrls: ['./verificacion-tarea.component.scss']
})
export class VerificacionTareaComponent implements OnInit {

    /* Variables */
    evidences;
    cargando = false;
    submitted = false;
    msgs: Message[] = [];
    verificationForm: FormGroup;
    empleado: Empleado;
    empleadosList: Empleado[];
    fullName = '';
    fechaActual = new Date();
    localeES: any = locale_es;

    @Input() tarea;
    @Input() tareaVerify;
    @Output() loadTareas: EventEmitter<boolean> = new EventEmitter();

    constructor(
        fb: FormBuilder,
        private empleadoService: EmpleadoService,
        private seguimientoService: SeguimientosService,
    ) {
        this.verificationForm = fb.group({
            id: ["", Validators.required],
            email: ["", null],
            usuarioVerifica: ["", Validators.required],
            fechaVerificacion: ["", Validators.required],
            observacionesVerificacion: ["", Validators.required],
            evidencesV: [[]],
        })
    }

    ngOnInit() {

        this.checkVerify();
    }

    checkVerify() {
        this.verificationForm.patchValue({ id: parseInt(this.tarea.id) });

        if (this.tareaVerify) {
            let fq = new FilterQuery();
            fq.filterList = [{ criteria: Criteria.EQUALS, field: 'id', value1: this.tarea.fk_usuario_verifica_id, value2: null }];
            this.empleadoService.findByFilter(fq).then(
                resp => {
                    console.log(resp)
                    let empleado = resp['data'][0];
                    this.onSelection(empleado);
                    this.getEvidences(this.tarea.id);
                    this.verificationForm.patchValue(
                        {
                            fkUsuarioVerificaId: this.tarea.fk_usuario_verifica_id,
                            fechaVerificacion: new Date(this.tarea.fecha_verificacion),
                            observacionesVerificacion: this.tarea.observaciones_verificacion
                        }
                    );
                }
            );
        }
    }

    get f() {
        return this.verificationForm.controls;
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
                this.msgs.push({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: "¡Se ha registrado la verificación de esta tarea exitosamente!",
                });
                this.loadTareas.emit(true);
                this.cargando = false;
                this.submitted = false;
                this.verificationForm.reset();
                setTimeout(() => {
                    this.checkVerify();
                }, 300);
            }

        } catch (e) {
            console.log(e);
            this.submitted = false;
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

    async getEvidences(id) {
        try {

            this.evidences = await this.seguimientoService.getEvidences(id, "fkVerify") as any;

        } catch (e) {
            this.msgs.push({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ha ocurrido un error al obtener las evidencias de verificación de esta tarea",
            });
            console.log(e);
        }
    }

    addImage(file) {
        let evidences = this.verificationForm.get('evidencesV').value;
        let obj = {
            ruta: file,

        }
        evidences.push(obj);
        this.verificationForm.patchValue({ evidencesV: evidences });
    }

    removeImage(index) {
        let evidences = this.verificationForm.get('evidencesV').value;
        if (index > -1) evidences.splice(index, 1);
    }

    async onSelection(event) {
        console.log(event);
        this.fullName = null;
        this.empleado = null;
        let emp = <Empleado>event;
        this.empleado = emp;
        this.fullName = (this.empleado.primerNombre || '') + ' ' + (this.empleado.primerApellido || '');
        this.verificationForm.patchValue({ usuarioVerifica: { 'id': this.empleado.id }, email: this.empleado.usuario.email });
    }

}
